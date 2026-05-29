import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [teacher, setTeacher] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  
  // Form fields
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_no: '',
    address: '',
    alternative_phone_no: ''
  });

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/teachers/get-all');
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          const t = data[0]; // Mocking logged-in teacher as the first teacher
          setTeacher(t);
          setFormData({
            full_name: t.full_name || '',
            email: t.email || '',
            phone_no: t.phone_no || '',
            address: t.address || '',
            alternative_phone_no: t.alternative_phone_no || ''
          });
          
          if (t.profile_photo) {
            setProfilePicPreview(`http://localhost:8000/${t.profile_photo.replace(/\\/g, '/')}`);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setProfilePicPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSave = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    if (!teacher) return;
    
    try {
      const updateData = new FormData();
      updateData.append('full_name', formData.full_name);
      updateData.append('phone_no', formData.phone_no);
      updateData.append('address', formData.address);
      updateData.append('alternative_phone_no', formData.alternative_phone_no);
      if (selectedFile) {
        updateData.append('profile_photo', selectedFile);
      }

      const response = await fetch(`http://localhost:8000/api/teachers/put-by/${teacher.teacher_id}`, {
        method: 'PUT',
        body: updateData
      });

      if (response.ok) {
        alert("Profile updated successfully!");
        setIsEditing(false);
        fetchProfile();
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while saving.");
    }
  };

  const getInitials = (name) => {
    if (!name) return "TCH";
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  if (loading) {
    return <div style={{ color: 'white', padding: '32px', textAlign: 'center' }}>Loading profile...</div>;
  }

  if (!teacher) {
    return <div style={{ color: 'white', padding: '32px', textAlign: 'center' }}>No teacher profile found.</div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel" 
      style={{ padding: '32px', maxWidth: '800px', margin: '0 auto' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h2>Account Profile</h2>
        <button className="btn-secondary" onClick={handleSave}>
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '250px' }}>
          <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'var(--gradient-hero)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', color: 'white', marginBottom: '24px', boxShadow: 'var(--glass-shadow)', position: 'relative', overflow: 'hidden' }}>
            {profilePicPreview ? (
              <img src={profilePicPreview} style={{width: '100%', height: '100%', objectFit: 'cover'}} alt="Profile" />
            ) : (
              getInitials(teacher.full_name)
            )}
            {isEditing && (
              <label style={{position: 'absolute', bottom: 0, background: 'rgba(0,0,0,0.5)', width: '100%', textAlign: 'center', padding: '4px', cursor: 'pointer', fontSize: '0.8rem'}}>
                Upload
                <input type="file" style={{display: 'none'}} accept="image/*" onChange={handleFileChange}/>
              </label>
            )}
          </div>
          <div className="input-group">
            <label>Full Name</label>
            <input 
              type="text" 
              name="full_name"
              value={formData.full_name} 
              onChange={handleInputChange}
              disabled={!isEditing} 
              style={{ background: isEditing ? 'var(--surface)' : 'rgba(255,255,255,0.05)' }}
            />
          </div>
          <div className="input-group">
            <label>Email ID (Read-only)</label>
            <input type="text" value={formData.email} disabled style={{ background: 'rgba(255,255,255,0.02)' }} />
          </div>
        </div>
        
        <div style={{ flex: '2', minWidth: '300px' }}>
          <div className="input-group">
            <label>Phone Number</label>
            <input 
              type="text" 
              name="phone_no"
              value={formData.phone_no} 
              onChange={handleInputChange}
              disabled={!isEditing} 
              style={{ background: isEditing ? 'var(--surface)' : 'rgba(255,255,255,0.05)' }}
            />
          </div>
          <div className="input-group">
            <label>Address</label>
            <input 
              type="text" 
              name="address"
              value={formData.address} 
              onChange={handleInputChange}
              disabled={!isEditing} 
              style={{ background: isEditing ? 'var(--surface)' : 'rgba(255,255,255,0.05)' }}
            />
          </div>
          <div className="input-group">
            <label>Emergency/Alternative Contact</label>
            <input 
              type="text" 
              name="alternative_phone_no"
              value={formData.alternative_phone_no} 
              onChange={handleInputChange}
              disabled={!isEditing} 
              style={{ background: isEditing ? 'var(--surface)' : 'rgba(255,255,255,0.05)' }}
            />
          </div>
          
          <h3 style={{ marginTop: '32px', marginBottom: '16px' }}>Security</h3>
          <button className="btn-secondary">Change Password</button>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
