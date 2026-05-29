import React from 'react';
import { motion } from 'framer-motion';

const CourseDetailsModal = ({ course, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card" 
        style={{ padding: '40px', maxWidth: '600px', width: '100%', position: 'relative' }}
      >
        <button 
          onClick={onClose} 
          style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer' }}
        >
          &times;
        </button>
        <h2 style={{ color: 'var(--primary-yellow)', marginBottom: '16px' }}>{course?.title || 'Course Details'}</h2>
        <p>{course?.fullDescription || 'Detailed information about the course.'}</p>
        <div style={{ marginTop: '24px', display: 'flex', gap: '16px' }}>
          <button className="btn-primary">Enroll Now</button>
        </div>
      </motion.div>
    </div>
  );
};

export default CourseDetailsModal;
