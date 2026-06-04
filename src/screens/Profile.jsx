import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Phone, MapPin, Briefcase, GraduationCap, CreditCard, Lock, Shield, Mail } from 'lucide-react';

const Profile = () => {
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [teacher, setTeacher] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirmPassword: '' });

  // Form fields
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_no: '',
    address: '',
    alternative_phone_no: '',
    qualification: '',
    experience: '',
    bank_account_no: '',
    bank_account_name: '',
    bank_branch_name: '',
    ifsc_code: '',
    upiid: ''
  });

  const fetchProfile = async () => {
    try {
      // In a real app, you would fetch by specific ID or get the logged-in user
      const response = await fetch('https://appbackend.vwings247.me/api/teachers/get-all');
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          const t = data[0];
          setTeacher(t);
          setFormData({
            full_name: t.full_name || '',
            email: t.email || '',
            phone_no: t.phone_no || '',
            address: t.address || '',
            alternative_phone_no: t.alternative_phone_no || '',
            qualification: t.qualification || '',
            experience: t.experience || '',
            bank_account_no: t.bank_account_no || '',
            bank_account_name: t.bank_account_name || '',
            bank_branch_name: t.bank_branch_name || '',
            ifsc_code: t.ifsc_code || '',
            upiid: t.upiid || ''
          });

          if (t.profile_photo) {
            setProfilePicPreview(`https://appbackend.vwings247.me/${t.profile_photo.replace(/\\/g, '/')}`);
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
      Object.keys(formData).forEach(key => {
        // Do not update email as it's typically readonly, but can be passed if backend allows
        if (key !== 'email') {
          updateData.append(key, formData[key]);
        }
      });

      if (selectedFile) {
        updateData.append('profile_photo', selectedFile);
      }

      const response = await fetch(`https://appbackend.vwings247.me/api/teachers/put-by/${teacher.teacher_id}`, {
        method: 'PUT',
        body: updateData
      });

      if (response.ok) {
        toast.success("Profile updated successfully!");
        setIsEditing(false);
        fetchProfile();
      } else {
        toast.error("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while saving.");
    }
  };

  const handlePasswordChange = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    try {
      const updateData = new FormData();
      updateData.append('password', passwordForm.newPassword);

      const response = await fetch(`https://appbackend.vwings247.me/api/teachers/put-by/${teacher.teacher_id}`, {
        method: 'PUT',
        body: updateData
      });

      if (response.ok) {
        toast.success("Password changed successfully!");
        setIsPasswordModalOpen(false);
        setPasswordForm({ newPassword: '', confirmPassword: '' });
      } else {
        toast.error("Failed to change password.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("An error occurred while changing password.");
    }
  };

  const getInitials = (name) => {
    if (!name) return "TCH";
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  if (loading) {
    return <div style={{ color: 'var(--text-main)', padding: '32px', textAlign: 'center' }}>Loading profile details...</div>;
  }

  if (!teacher) {
    return <div style={{ color: 'var(--text-main)', padding: '32px', textAlign: 'center' }}>No teacher profile found.</div>;
  }

  const inputStyle = {
    background: isEditing ? 'var(--surface)' : 'var(--background)',
    border: isEditing ? '1px solid var(--primary)' : '1px solid var(--border)',
    color: 'var(--text-main)',
    padding: '12px 16px',
    borderRadius: '12px',
    width: '100%',
    transition: 'all 0.3s'
  };

  const readOnlyStyle = {
    ...inputStyle,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    opacity: 0.8
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ maxWidth: '1000px', margin: '0 auto', paddingBottom: '40px' }}
    >
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '24px', gap: '16px' }}>
        <div>
          <h2 style={{ margin: 0, color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
            <User size={28} color="var(--primary)" /> My Profile
          </h2>
          <p style={{ margin: '4px 0 0', color: 'var(--text-muted)' }}>Manage your personal, professional, and financial details.</p>
        </div>
        <button className={isEditing ? "btn-primary" : "btn-secondary"} onClick={handleSave} style={{ minWidth: '150px' }}>
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>

        {/* Left Column - Basics & Contact */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          <div className="glass-panel" style={{ padding: '32px', textAlign: 'center' }}>
            <div style={{ width: '140px', height: '140px', borderRadius: '50%', background: 'var(--gradient-hero)', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3.5rem', color: 'var(--text-main)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)', position: 'relative', overflow: 'hidden' }}>
              {profilePicPreview ? (
                <img src={profilePicPreview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Profile" />
              ) : (
                getInitials(teacher.full_name)
              )}
              {isEditing && (
                <label style={{ position: 'absolute', bottom: 0, background: 'rgba(255,255,255,0.9)', color: 'var(--text-main)', width: '100%', textAlign: 'center', padding: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold', backdropFilter: 'blur(4px)' }}>
                  Upload New
                  <input type="file" style={{ display: 'none' }} accept="image/*" onChange={handleFileChange} />
                </label>
              )}
            </div>
            <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.5rem' }}>{teacher.full_name}</h3>
            <p style={{ margin: '4px 0 16px', color: 'var(--text-muted)', fontWeight: 'bold' }}>{teacher.teacher_id}</p>
            <div style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold' }}>
              Active Faculty
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <h4 style={{ margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <Phone size={18} color="var(--primary)" /> Contact Details
            </h4>

            <div className="input-group" style={{ marginBottom: '16px' }}>
              <label>Email ID</label>
              <input type="text" value={formData.email} disabled style={readOnlyStyle} />
            </div>
            <div className="input-group" style={{ marginBottom: '16px' }}>
              <label>Phone Number</label>
              <input type="text" name="phone_no" value={formData.phone_no} onChange={handleInputChange} disabled={!isEditing} style={inputStyle} />
            </div>
            <div className="input-group" style={{ marginBottom: '16px' }}>
              <label>Alternative Phone</label>
              <input type="text" name="alternative_phone_no" value={formData.alternative_phone_no} onChange={handleInputChange} disabled={!isEditing} style={inputStyle} />
            </div>
            <div className="input-group">
              <label>Residential Address</label>
              <textarea name="address" value={formData.address} onChange={handleInputChange} disabled={!isEditing} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} />
            </div>
          </div>
        </div>

        {/* Right Column - Pro & Financial */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <h4 style={{ margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <Briefcase size={18} color="var(--secondary)" /> Professional Details
            </h4>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div className="input-group">
                <label>Qualification</label>
                <input type="text" name="qualification" value={formData.qualification} onChange={handleInputChange} disabled={!isEditing} style={inputStyle} />
              </div>
              <div className="input-group">
                <label>Experience (Years)</label>
                <input type="text" name="experience" value={formData.experience} onChange={handleInputChange} disabled={!isEditing} style={inputStyle} />
              </div>
            </div>

            <div className="input-group">
              <label>Assigned Courses</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '12px', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                {teacher.courses_assigned && teacher.courses_assigned.length > 0 ? (
                  teacher.courses_assigned.map(c => (
                    <span key={c.course_id} style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem' }}>
                      {c.course_name}
                    </span>
                  ))
                ) : (
                  <span style={{ color: 'var(--text-muted)' }}>No courses assigned yet.</span>
                )}
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <h4 style={{ margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              <CreditCard size={18} color="var(--success)" /> Financial Details
            </h4>

            <div className="input-group" style={{ marginBottom: '16px' }}>
              <label>Bank Account Number</label>
              <input type="text" name="bank_account_no" value={formData.bank_account_no} onChange={handleInputChange} disabled={!isEditing} style={inputStyle} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div className="input-group">
                <label>Bank Name</label>
                <input type="text" name="bank_account_name" value={formData.bank_account_name} onChange={handleInputChange} disabled={!isEditing} style={inputStyle} />
              </div>
              <div className="input-group">
                <label>Branch Name</label>
                <input type="text" name="bank_branch_name" value={formData.bank_branch_name} onChange={handleInputChange} disabled={!isEditing} style={inputStyle} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px', marginBottom: '16px' }}>
              <div className="input-group">
                <label>IFSC Code</label>
                <input type="text" name="ifsc_code" value={formData.ifsc_code} onChange={handleInputChange} disabled={!isEditing} style={inputStyle} />
              </div>
              <div className="input-group">
                <label>UPI ID</label>
                <input type="text" name="upiid" value={formData.upiid} onChange={handleInputChange} disabled={!isEditing} style={inputStyle} />
              </div>
            </div>

            <div className="input-group" style={{ background: 'rgba(16, 185, 129, 0.05)', padding: '16px', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
              <label style={{ color: '#10b981' }}>Base Monthly Salary</label>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>
                ₹ {teacher.monthly_salary ? teacher.monthly_salary.toLocaleString() : '0'}
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>*Excludes commissions and bonuses</span>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px' }}>
            <h4 style={{ margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
              <Shield size={18} color="var(--warning)" /> Security
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>
              Ensure your account is using a long, random password to stay secure.
            </p>
            <button className="btn-secondary" style={{ width: '100%' }} onClick={() => setIsPasswordModalOpen(true)}>
              <Lock size={16} /> Change Password
            </button>
          </div>

        </div>
      </div>

      <AnimatePresence>
        {isPasswordModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', zIndex: 99999
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: '16px', padding: '32px', maxWidth: '400px', width: '100%',
                boxShadow: '0 24px 48px rgba(0,0,0,0.5)'
              }}
            >
              <h3 style={{ margin: '0 0 24px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Lock size={20} color="var(--primary)" /> Change Password
              </h3>

              <div className="input-group" style={{ marginBottom: '16px' }}>
                <label>New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  style={{ ...inputStyle, background: 'var(--surface)' }}
                  placeholder="Enter new password"
                />
              </div>
              <div className="input-group" style={{ marginBottom: '24px' }}>
                <label>Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  style={{ ...inputStyle, background: 'var(--surface)' }}
                  placeholder="Confirm new password"
                />
              </div>

              <div style={{ display: 'flex', gap: '16px', justifyContent: 'flex-end' }}>
                <button onClick={() => setIsPasswordModalOpen(false)} className="btn-secondary" style={{ padding: '10px 20px' }}>Cancel</button>
                <button onClick={handlePasswordChange} className="btn-primary" style={{ padding: '10px 20px' }}>Update Password</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Profile;
