import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Mail, MapPin, Phone, User, MessageSquare, Send, CheckCircle } from 'lucide-react';
import { useAuth } from '../AuthContext';

const HelpCenter = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({ name: '', phone_no: '', email: '', problem_description: '' });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.full_name || '',
        email: user.email || '',
        phone_no: user.phone || user.phone_number || ''
      }));
    }
  }, [user]);
  const [status, setStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitTicket = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      const response = await fetch('http://localhost:8000/api/helpcenter/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', phone_no: '', email: '', problem_description: '' });
        setTimeout(() => setStatus(null), 5000);
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ maxWidth: '800px', margin: '0 auto', paddingBottom: '40px' }}
    >
      {/* Top Card - Admin Support Center */}
      <div className="glass-card" style={{ padding: '40px', textAlign: 'center', marginBottom: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '20px',
          background: 'var(--surface)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '24px', boxShadow: 'var(--glass-shadow)'
        }}>
          <img src="/assets/V-Wings_Logo_nobg.png" alt="VWings Logo" style={{ width: '50px', objectFit: 'contain' }} />
        </div>

        <h2 style={{ color: 'var(--primary-yellow)', fontSize: '28px', marginBottom: '12px' }}>Admin Support Center</h2>
        <p style={{ color: 'var(--text-main)', fontSize: '15px', maxWidth: '500px', margin: '0 auto 32px' }}>
          Get in touch with the VWings24x7 administration team for any queries or support requests.
        </p>

        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button className="btn-secondary" style={{ padding: '10px 20px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
            <Globe size={16} /> Website
          </button>
          <button className="btn-secondary" style={{ padding: '10px 20px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
            <Mail size={16} /> Email
          </button>
          <button className="btn-secondary" style={{ padding: '10px 20px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
            <MapPin size={16} /> Location
          </button>
          <button className="btn-secondary" style={{ padding: '10px 20px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
            <Phone size={16} /> Call
          </button>
        </div>
      </div>

      {/* Bottom Card - Submit Query */}
      <div className="glass-card" style={{ padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Submit a Query to Admin</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            We are here to help. Send us your query and the admin team will resolve it promptly.
          </p>
        </div>

        <form onSubmit={handleSubmitTicket} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <AnimatePresence>
            {status === 'success' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--success, #10b981)', padding: '16px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '12px', marginBottom: '8px' }}>
                  <CheckCircle size={24} color="#10b981" />
                  <strong style={{ color: '#10b981' }}>Your support ticket has been submitted successfully!</strong>
                </div>
              </motion.div>
            )}
            {status === 'error' && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <div style={{ color: 'var(--danger, #ef4444)', padding: '16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', marginBottom: '8px' }}>
                  Failed to submit ticket. Please try again.
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <User size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Full name"
                style={{
                  width: '100%', padding: '16px 16px 16px 48px',
                  borderRadius: '12px', border: '1px solid var(--border)',
                  background: 'var(--surface)', color: 'var(--text-main)',
                  fontFamily: 'inherit'
                }}
              />
            </div>
            <div style={{ position: 'relative', flex: 1 }}>
              <Phone size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
              <input
                type="text"
                name="phone_no"
                value={formData.phone_no}
                onChange={handleInputChange}
                required
                placeholder="Phone number"
                style={{
                  width: '100%', padding: '16px 16px 16px 48px',
                  borderRadius: '12px', border: '1px solid var(--border)',
                  background: 'var(--surface)', color: 'var(--text-main)',
                  fontFamily: 'inherit'
                }}
              />
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <Mail size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="Email address"
              style={{
                width: '100%', padding: '16px 16px 16px 48px',
                borderRadius: '12px', border: '1px solid var(--border)',
                background: 'var(--surface)', color: 'var(--text-main)',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div style={{ position: 'relative' }}>
            <MessageSquare size={18} style={{ position: 'absolute', left: '16px', top: '16px', color: 'var(--text-muted)' }} />
            <textarea
              name="problem_description"
              value={formData.problem_description}
              onChange={handleInputChange}
              required
              placeholder="Please describe your issue in detail..."
              rows={6}
              style={{
                width: '100%', padding: '16px 16px 16px 48px',
                borderRadius: '12px', border: '1px solid var(--border)',
                background: 'var(--surface)', color: 'var(--text-main)',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="btn-primary"
            style={{ width: '100%', marginTop: '12px', padding: '16px', fontSize: '16px', fontWeight: '600' }}
          >
            {status === 'submitting' ? 'Submitting...' : (
              <>Submit Ticket <Send size={18} /></>
            )}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default HelpCenter;
