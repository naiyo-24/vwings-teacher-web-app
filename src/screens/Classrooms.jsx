import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, ArrowLeft, Video, Users, X, Check, Plus, Upload, Trash2 } from 'lucide-react';
import { useAuth } from '../App';

const Classrooms = () => {
  const [activeClass, setActiveClass] = useState(null);
  const [message, setMessage] = useState('');
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chatHistory, setChatHistory] = useState([]);
  const wsRef = useRef(null);
  
  // Get teacher credentials from AuthContext
  const { user } = useAuth();
  const teacherId = user?.teacher_id || 'TCH001';
  const role = 'teacher';

  // Manage Students State
  const [isManageModalOpen, setIsManageModalOpen] = useState(false);
  const [managingClass, setManagingClass] = useState(null);
  const [allStudents, setAllStudents] = useState([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [savingStudents, setSavingStudents] = useState(false);

  // Create Classroom State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newClassName, setNewClassName] = useState('');
  const [newClassDesc, setNewClassDesc] = useState('');
  const [newClassPhoto, setNewClassPhoto] = useState(null);
  const [creatingClass, setCreatingClass] = useState(false);

  const fetchClassrooms = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/classrooms/get-all');
      if (response.ok) {
        const data = await response.json();
        setClassrooms(data);
      }
    } catch (error) {
      console.error("Error fetching classrooms:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const openManageModal = async (cls) => {
    setManagingClass(cls);
    setSelectedStudentIds(cls.student_ids || []);
    setIsManageModalOpen(true);
    
    try {
      const res = await fetch('http://localhost:8000/api/students/get-all');
      if (res.ok) {
        const data = await res.json();
        setAllStudents(data);
      }
    } catch (error) {
      console.error("Failed to fetch students", error);
    }
  };

  const toggleStudentSelection = (studentId) => {
    if (selectedStudentIds.includes(studentId)) {
      setSelectedStudentIds(selectedStudentIds.filter(id => id !== studentId));
    } else {
      setSelectedStudentIds([...selectedStudentIds, studentId]);
    }
  };

  const saveStudentAssignments = async () => {
    setSavingStudents(true);
    try {
      const clsTeacherId = managingClass.teacher_ids?.[0] || teacherId; 
      
      const formData = new FormData();
      formData.append('student_ids', JSON.stringify(selectedStudentIds));

      const response = await fetch(`http://localhost:8000/api/classrooms/update-by/teacher/${clsTeacherId}/${managingClass.class_id}`, {
        method: 'PUT',
        body: formData
      });

      if (response.ok) {
        alert('Students updated successfully!');
        setIsManageModalOpen(false);
        fetchClassrooms(); 
      } else {
        const errorData = await response.json();
        alert(errorData.detail || 'Failed to update students.');
      }
    } catch (error) {
      console.error("Error updating students:", error);
      alert('Network error while updating students.');
    } finally {
      setSavingStudents(false);
    }
  };

  const createClassroom = async (e) => {
    e.preventDefault();
    if (!newClassName.trim()) {
      alert("Classroom Name is required.");
      return;
    }

    setCreatingClass(true);
    try {
      // Use logged in teacher ID
      let currentTeacherId = teacherId;
      try {
        const tchRes = await fetch('http://localhost:8000/api/teachers/get-all');
        if (tchRes.ok) {
          const tchData = await tchRes.json();
          if (tchData.length > 0 && !user?.teacher_id) currentTeacherId = tchData[0].teacher_id;
        }
      } catch (err) { console.error("Could not fetch current teacher", err); }

      const formData = new FormData();
      formData.append('class_name', newClassName);
      formData.append('class_description', newClassDesc);
      formData.append('teacher_ids', JSON.stringify([currentTeacherId]));
      if (newClassPhoto) {
        formData.append('photo', newClassPhoto);
      }

      const response = await fetch('http://localhost:8000/api/classrooms/create', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        alert("Classroom created successfully!");
        setIsCreateModalOpen(false);
        setNewClassName('');
        setNewClassDesc('');
        setNewClassPhoto(null);
        fetchClassrooms();
      } else {
        const errData = await response.json();
        alert(errData.detail || "Failed to create classroom.");
      }
    } catch (error) {
      console.error("Error creating classroom:", error);
      alert("Network error.");
    } finally {
      setCreatingClass(false);
    }
  };

  const deleteClassroom = async (classId) => {
    if (!window.confirm("Are you sure you want to delete this classroom? This action cannot be undone.")) return;
    
    try {
      const response = await fetch(`http://localhost:8000/api/classrooms/delete/${classId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert("Classroom deleted successfully!");
        fetchClassrooms();
      } else {
        const errorData = await response.json();
        alert(errorData.detail || 'Failed to delete classroom.');
      }
    } catch (error) {
      console.error("Error deleting classroom:", error);
      alert("Network error while deleting classroom.");
    }
  };

  useEffect(() => {
    if (!activeClass) {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      return;
    }

    const loadMessagesAndConnect = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/classrooms/get-by/${activeClass.class_id}/messages`);
        if (res.ok) {
          const data = await res.json();
          const formattedHistory = data.map(msg => ({
            sender: msg.sender_id === teacherId ? 'You' : msg.sender_name || msg.sender_role,
            text: msg.content,
            time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            message_id: msg.message_id
          }));
          setChatHistory(formattedHistory);
        }
      } catch (err) {
        console.error("Failed to load old messages", err);
      }

      const wsUrl = `ws://localhost:8000/api/classrooms/ws/${activeClass.class_id}/chat?user_id=${teacherId}&role=${role}`;
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => console.log("WebSocket Connected");
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.error) {
            console.error("WS Error:", data.error);
            return;
          }
          if (data.deleted_message_id) {
            setChatHistory(prev => prev.filter(m => m.message_id !== data.deleted_message_id));
            return;
          }
          // handle new message
          if (data.message_id) {
            const newMsg = {
              sender: data.sender_id === teacherId ? 'You' : data.sender_name || data.sender_role,
              text: data.content,
              time: new Date(data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              message_id: data.message_id
            };
            setChatHistory(prev => {
              if (prev.find(m => m.message_id === newMsg.message_id)) return prev;
              return [...prev, newMsg];
            });
          }
        } catch (e) {
          console.error("Error parsing WS message", e);
        }
      };
      ws.onclose = () => console.log("WebSocket Disconnected");
      wsRef.current = ws;
    };

    loadMessagesAndConnect();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [activeClass]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim() || !wsRef.current) return;
    
    if (wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        content: message,
        sender_id: teacherId,
        sender_role: role
      }));
      setMessage('');
    } else {
      alert("Chat not connected.");
    }
  };

  if (activeClass) {
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="glass-panel" style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={() => setActiveClass(null)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'white' }}><ArrowLeft /></button>
            <div>
              <h3 style={{ margin: 0 }}>{activeClass.class_name}</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--secondary)' }}>Live Session • {activeClass.class_id}</p>
            </div>
          </div>
          <button className="btn-primary" style={{ padding: '8px 16px', gap: '8px' }}><Video size={16} /> Join Video</button>
        </div>
        
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {chatHistory.map((msg, i) => (
            <div key={i} style={{ alignSelf: msg.sender === 'You' ? 'flex-end' : 'flex-start', background: msg.sender === 'You' ? 'var(--primary-yellow)' : 'var(--surface)', padding: '12px 16px', borderRadius: '12px', maxWidth: '70%', color: msg.sender === 'You' ? 'var(--deep-navy)' : 'white' }}>
              <p style={{ margin: '0 0 4px 0', fontSize: '0.8rem', fontWeight: 'bold', color: msg.sender === 'You' ? 'var(--deep-navy)' : 'var(--primary-yellow)' }}>{msg.sender}</p>
              <p style={{ margin: 0 }}>{msg.text}</p>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.7rem', opacity: 0.7, textAlign: 'right' }}>{msg.time}</p>
            </div>
          ))}
        </div>

        <form onSubmit={handleSendMessage} style={{ padding: '20px', borderTop: '1px solid var(--border)', display: 'flex', gap: '12px' }}>
          <input 
            type="text" 
            placeholder="Type a message..." 
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ flex: 1, background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '24px', padding: '12px 20px', color: 'white' }}
          />
          <button type="submit" className="btn-primary" style={{ borderRadius: '50%', width: '48px', height: '48px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Send size={20} />
          </button>
        </form>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel" 
        style={{ padding: '32px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ margin: 0 }}>My Classrooms</h2>
          <button className="btn-primary" onClick={() => setIsCreateModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={20} /> Create Classroom
          </button>
        </div>
        
        {loading ? (
          <p>Loading classrooms...</p>
        ) : classrooms.length === 0 ? (
          <p>No classrooms assigned to you currently.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {classrooms.map((cls) => {
              const photoUrl = cls.class_photo ? `http://localhost:8000/${cls.class_photo.replace(/\\/g, '/')}` : null;
              return (
                <div key={cls.class_id} className="glass-card" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {photoUrl && (
                      <img 
                        src={photoUrl} 
                        alt={cls.class_name} 
                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} 
                      />
                    )}
                    <div>
                      <h3 style={{ marginBottom: '4px' }}>{cls.class_name}</h3>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{cls.class_description || 'No description provided'}</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--primary-yellow)', marginTop: '4px' }}>{cls.student_details?.length || 0} Students Enrolled</p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn-secondary" onClick={() => openManageModal(cls)} style={{ padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Users size={16} /> Manage Students
                    </button>
                    <button className="btn-secondary" onClick={() => deleteClassroom(cls.class_id)} style={{ padding: '8px 16px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', borderColor: '#ef4444' }}>
                      <Trash2 size={16} /> Delete
                    </button>
                    <button className="btn-primary" onClick={() => setActiveClass(cls)} style={{ padding: '8px 16px', borderRadius: '8px' }}>Enter Classroom</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Create Classroom Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel"
              style={{ background: 'var(--deep-navy)', width: '100%', maxWidth: '500px', padding: '24px' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3>Create New Classroom</h3>
                <button onClick={() => setIsCreateModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><X /></button>
              </div>

              <form onSubmit={createClassroom} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Classroom Name</label>
                  <input 
                    type="text" 
                    required
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'white' }}
                    placeholder="e.g. Advanced Aerodynamics"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Description</label>
                  <textarea 
                    value={newClassDesc}
                    onChange={(e) => setNewClassDesc(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'white', minHeight: '80px', fontFamily: 'inherit' }}
                    placeholder="Short description of the class..."
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>Classroom Photo (Optional)</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', borderRadius: '8px', border: '1px dashed var(--border)', background: 'rgba(255,255,255,0.05)', cursor: 'pointer', color: 'var(--text-muted)' }}>
                    <Upload size={18} />
                    {newClassPhoto ? newClassPhoto.name : 'Upload an image (.jpg, .png)'}
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setNewClassPhoto(e.target.files[0])}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setIsCreateModalOpen(false)} style={{ padding: '10px 20px' }}>Cancel</button>
                  <button type="submit" className="btn-primary" disabled={creatingClass} style={{ padding: '10px 20px', opacity: creatingClass ? 0.7 : 1 }}>
                    {creatingClass ? 'Creating...' : 'Create Classroom'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Manage Students Modal */}
      <AnimatePresence>
        {isManageModalOpen && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-panel"
              style={{ background: 'var(--deep-navy)', width: '100%', maxWidth: '600px', padding: '24px', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3>Assign Students to {managingClass?.class_name}</h3>
                <button onClick={() => setIsManageModalOpen(false)} style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}><X /></button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px' }}>
                {allStudents.length === 0 ? (
                  <p style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>Loading students or no students found.</p>
                ) : (
                  allStudents.map(student => {
                    const isSelected = selectedStudentIds.includes(student.student_id);
                    return (
                      <div 
                        key={student.student_id} 
                        onClick={() => toggleStudentSelection(student.student_id)}
                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', background: isSelected ? 'rgba(251, 191, 36, 0.1)' : 'transparent' }}
                      >
                        <div>
                          <p style={{ margin: 0, fontWeight: 'bold' }}>{student.full_name}</p>
                          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{student.email}</p>
                        </div>
                        <div style={{ width: '24px', height: '24px', borderRadius: '4px', border: '2px solid var(--primary-yellow)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isSelected ? 'var(--primary-yellow)' : 'transparent' }}>
                          {isSelected && <Check size={16} color="var(--deep-navy)" />}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button className="btn-secondary" onClick={() => setIsManageModalOpen(false)} style={{ padding: '10px 20px' }}>Cancel</button>
                <button className="btn-primary" onClick={saveStudentAssignments} disabled={savingStudents} style={{ padding: '10px 20px', opacity: savingStudents ? 0.7 : 1 }}>
                  {savingStudents ? 'Saving...' : `Save ${selectedStudentIds.length} Students`}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Classrooms;
