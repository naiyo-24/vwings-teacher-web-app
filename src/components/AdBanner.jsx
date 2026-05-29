import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const AdBanner = () => {
  const [ad, setAd] = useState(null);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/ads/get-all');
        if (response.ok) {
          const data = await response.json();
          const activeAds = data.filter(a => a.active_status);
          if (activeAds.length > 0) {
            // Pick a random ad
            const randomAd = activeAds[Math.floor(Math.random() * activeAds.length)];
            setAd(randomAd);
          }
        }
      } catch (err) {
        console.error("Failed to fetch ads", err);
      }
    };
    fetchAds();
  }, []);

  if (!ad) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card" 
        style={{ 
          padding: '16px', 
          marginBottom: '24px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          background: 'linear-gradient(90deg, rgba(55, 14, 98, 0.4) 0%, rgba(182, 0, 125, 0.2) 100%)',
          border: '1px solid rgba(245, 195, 0, 0.3)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {ad.ad_image && (
            <img 
              src={`http://localhost:8000/${ad.ad_image}`} 
              alt="Ad" 
              style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} 
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          )}
          <div>
            <h4 style={{ color: 'var(--primary-yellow)', marginBottom: '4px' }}>{ad.headline}</h4>
            {ad.tagline && <p style={{ fontSize: '0.9rem' }}>{ad.tagline}</p>}
          </div>
        </div>
        
        {ad.website_link && (
          <a 
            href={ad.website_link.startsWith('http') ? ad.website_link : `https://${ad.website_link}`} 
            target="_blank" 
            rel="noreferrer" 
            style={{ textDecoration: 'none' }}
          >
            <motion.button 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="btn-primary" 
              style={{ padding: '8px 16px', fontSize: '0.9rem' }}
            >
              Learn More
            </motion.button>
          </a>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default AdBanner;
