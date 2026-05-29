import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane } from 'lucide-react';

const WindStreak = ({ top, delay, duration, width }) => (
  <motion.div
    initial={{ x: '100px', opacity: 0 }}
    animate={{ x: '-150px', opacity: [0, 1, 1, 0] }}
    transition={{ repeat: Infinity, duration: duration, delay: delay, ease: "linear" }}
    style={{
      position: 'absolute',
      top: top,
      width: width,
      height: '3px',
      background: 'rgba(255, 255, 255, 0.5)',
      borderRadius: '2px',
      right: '50%'
    }}
  />
);

const SplashScreen = ({ onComplete }) => {
  const [phase, setPhase] = useState('airplane'); // 'airplane' -> 'logo'

  useEffect(() => {
    // Phase 1: Airplane flying with streaks (2.5 seconds)
    const timer1 = setTimeout(() => {
      setPhase('logo');
    }, 2500);

    // Phase 2: Show Logo and Tagline, then exit (5 seconds total)
    const timer2 = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--background)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        flexDirection: 'column',
        overflow: 'hidden'
      }}
    >
      <AnimatePresence mode="wait">
        {phase === 'airplane' && (
          <motion.div
            key="airplane"
            exit={{ opacity: 0, x: '50vw' }}
            transition={{ duration: 0.8, ease: "easeIn" }}
            style={{ position: 'relative', width: '200px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {/* Wind Streaks */}
            <WindStreak top="20px" delay={0} duration={0.8} width="40px" />
            <WindStreak top="45px" delay={0.3} duration={1.0} width="60px" />
            <WindStreak top="75px" delay={0.1} duration={0.7} width="35px" />
            <WindStreak top="85px" delay={0.5} duration={0.9} width="50px" />
            <WindStreak top="30px" delay={0.6} duration={1.1} width="25px" />
            
            {/* Bobbing Airplane */}
            <motion.div
              animate={{ y: [-3, 3, -3] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              style={{ zIndex: 10 }}
            >
              <img src="/assets/loader_plane.png" alt="Loading Airplane" style={{ width: '140px', objectFit: 'contain' }} />
            </motion.div>
          </motion.div>
        )}
        
        {phase === 'logo' && (
          <motion.div
            key="logo"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <img 
              src="/assets/V-Wings_Logo_nobg.png" 
              alt="VWings24x7 Logo" 
              style={{ width: '120px', height: '120px', objectFit: 'contain' }} 
            />
            <h1 style={{ color: 'var(--primary-yellow)', fontSize: '48px', fontWeight: '800', marginTop: '16px', letterSpacing: '2px' }}>
              VWings24x7
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '20px', marginTop: '12px', letterSpacing: '1px' }}>
              Your Wings to the Future ✈️
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SplashScreen;
