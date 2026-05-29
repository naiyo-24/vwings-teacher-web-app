import React from 'react';
import { motion } from 'framer-motion';

const WelcomeModalNew = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card" 
        style={{ padding: '40px', maxWidth: '500px', width: '100%', textAlign: 'center' }}
      >
        <h2>Welcome to VWings24x7</h2>
        <p style={{ margin: '20px 0' }}>Get ready for your next flight lesson!</p>
        <button className="btn-primary" onClick={onClose}>Let's Go</button>
      </motion.div>
    </div>
  );
};

export default WelcomeModalNew;
