import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000';

const AdBanner = () => {
  const [ads, setAds] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/ads/get-all`);
        if (response.ok) {
          const data = await response.json();
          const activeAds = data.filter(a => a.active_status);
          setAds(activeAds);
        }
      } catch (err) {
        console.error("Failed to fetch ads", err);
      }
    };
    fetchAds();
  }, []);

  useEffect(() => {
    if (ads.length <= 1 || isHovered) return;
    
    // Progress bar logic
    const tick = 50; // update every 50ms
    const duration = 5000;
    let currentProgress = 0;
    
    const interval = setInterval(() => {
      currentProgress += (tick / duration) * 100;
      if (currentProgress >= 100) {
        currentProgress = 0;
        handleNext();
      }
      setProgress(currentProgress);
    }, tick);
    
    return () => clearInterval(interval);
  }, [ads.length, isHovered, currentIndex]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex(prev => (prev + 1) % ads.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex(prev => (prev - 1 + ads.length) % ads.length);
    setProgress(0);
  };

  if (ads.length === 0) return null;

  const currentAd = ads[currentIndex];

  const variants = {
    enter: (direction) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { zIndex: 1, x: 0, opacity: 1 },
    exit: (direction) => ({ zIndex: 0, x: direction < 0 ? '100%' : '-100%', opacity: 0 })
  };

  return (
    <div 
      className="glass-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        marginBottom: '28px', 
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.9) 0%, rgba(88, 28, 135, 0.8) 100%)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',
        borderRadius: '24px',
        height: '180px',
        display: 'flex',
        alignItems: 'center'
      }}
    >
      {/* Background glow effects */}
      <div style={{ position: 'absolute', top: '-50%', left: '-10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(245, 195, 0, 0.15) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-50%', right: '-10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0 }} />

      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
          style={{ 
            position: 'absolute', width: '100%', height: '100%', padding: '0 60px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxSizing: 'border-box', zIndex: 1
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flex: 1 }}>
            {currentAd.ad_image && (
              <motion.div
                initial={{ scale: 0.8, rotate: -5 }} animate={{ scale: 1, rotate: 0 }} transition={{ type: "spring", bounce: 0.5 }}
                style={{
                  width: '120px', height: '120px', borderRadius: '20px', overflow: 'hidden',
                  boxShadow: '0 12px 24px rgba(0,0,0,0.5)', flexShrink: 0,
                  border: '3px solid rgba(255,255,255,0.2)', background: 'white'
                }}
              >
                <img src={`${API_BASE_URL}/${currentAd.ad_image}`} alt="Ad" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none'; }} />
              </motion.div>
            )}
            <div style={{ flex: 1 }}>
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
                <span style={{ display: 'inline-block', padding: '4px 10px', background: 'rgba(245, 195, 0, 0.2)', color: 'var(--primary-yellow)', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
                  Sponsored
                </span>
                <h3 style={{ color: 'white', margin: '0 0 8px 0', fontSize: '1.6rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
                  {currentAd.headline}
                </h3>
                {currentAd.tagline && <p style={{ margin: 0, fontSize: '1rem', color: 'rgba(255,255,255,0.7)', maxWidth: '80%' }}>{currentAd.tagline}</p>}
              </motion.div>
            </div>
          </div>
          
          {currentAd.website_link && (
            <motion.a 
              href={currentAd.website_link.startsWith('http') ? currentAd.website_link : `https://${currentAd.website_link}`} 
              target="_blank" rel="noreferrer" 
              initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}
              style={{ textDecoration: 'none' }}
            >
              <motion.button 
                whileHover={{ scale: 1.05, background: 'var(--primary-yellow)', color: 'black' }} 
                whileTap={{ scale: 0.95 }}
                style={{ 
                  padding: '12px 24px', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px', 
                  fontWeight: 'bold', background: 'rgba(255,255,255,0.1)', color: 'white',
                  border: '1px solid rgba(255,255,255,0.2)', borderRadius: '14px', cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                Learn More <ArrowRight size={18} />
              </motion.button>
            </motion.a>
          )}
        </motion.div>
      </AnimatePresence>

      {ads.length > 1 && (
        <>
          <button 
            onClick={handlePrev}
            style={{ 
              position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 10,
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(4px)',
              width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', opacity: isHovered ? 1 : 0, transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={handleNext}
            style={{ 
              position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 10,
              background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(4px)',
              width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', opacity: isHovered ? 1 : 0, transition: 'all 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
          >
            <ChevronRight size={24} />
          </button>

          {/* Elegant Pill Indicators */}
          <div style={{ position: 'absolute', bottom: '16px', left: '0', width: '100%', display: 'flex', justifyContent: 'center', gap: '8px', zIndex: 10 }}>
            {ads.map((_, idx) => (
              <div 
                key={idx} 
                onClick={() => { setDirection(idx > currentIndex ? 1 : -1); setCurrentIndex(idx); setProgress(0); }}
                style={{ 
                  width: currentIndex === idx ? '24px' : '8px', 
                  height: '8px', 
                  borderRadius: '4px', 
                  background: currentIndex === idx ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: currentIndex === idx ? '0 0 8px rgba(255,255,255,0.5)' : 'none'
                }} 
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default AdBanner;
