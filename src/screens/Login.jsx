import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plane, LogIn } from 'lucide-react';
import { useToast } from '../components/ToastContext';

const Login = ({ onLogin }) => {
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/teachers/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Login successful! Welcome to the faculty portal.');
        onLogin(data.teacher);
      } else {
        const errorData = await response.json();
        toast.error(errorData.detail || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error('Network error. Unable to connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <motion.div 
        className="glass-card auth-card"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="auth-header">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 15, delay: 0.2 }}
            style={{ 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px', gap: '16px'
            }}
          >
            <img src="/assets/V-Wings_Logo_nobg.png" alt="VWings24x7 Logo" style={{ width: '90px', height: '90px', objectFit: 'contain' }} />
            <span style={{ color: 'var(--primary-yellow)', fontSize: '36px', fontWeight: '800', letterSpacing: '1px' }}>VWings24x7</span>
          </motion.div>
          <p>Faculty Portal Login</p>
        </div>

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <label>Email</label>
            <input 
              type="email" 
              placeholder="faculty@vwings.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <motion.button 
            type="submit" 
            className="btn-primary" 
            style={{ width: '100%', marginTop: '16px', padding: '16px', opacity: loading ? 0.7 : 1 }}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            disabled={loading}
          >
            <LogIn size={20} />
            {loading ? 'Signing In...' : 'Sign In to Academy'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
