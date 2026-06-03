import React from 'react';
import { motion } from 'framer-motion';
import { Flag, Eye, Globe, Phone, Mail, MapPin, Award, Users, BookOpen, Target, Sparkles, Heart } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
};

const AboutUs = () => {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      style={{ width: '100%', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '60px' }}
    >
      {/* Hero Section */}
      <motion.div variants={itemVariants} style={{ position: 'relative', overflow: 'hidden', borderRadius: '32px', padding: '60px 40px', background: 'var(--gradient-hero)', border: '1px solid var(--border)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(245, 195, 0, 0.2) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0 }} />
        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, transparent 70%)', filter: 'blur(40px)', zIndex: 0 }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2, type: 'spring' }} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'var(--surface)', backdropFilter: 'blur(10px)', borderRadius: '20px', color: 'var(--text-main)', fontWeight: 'bold', marginBottom: '24px' }}>
            <Sparkles size={16} /> Welcome to VWings24x7
          </motion.div>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '800', margin: '0 0 16px 0', letterSpacing: '-1px', background: 'linear-gradient(to right, #fff, #cbd5e1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Empowering Educators,<br/>Enriching Minds
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'rgba(255, 255, 255, 0.9)', maxWidth: '600px', margin: '0 auto' }}>
            We are dedicated to providing world-class resources, training, and support to transform the future of education.
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
        {[
          { icon: Users, label: 'Active Partners', value: '24+', color: '#3b82f6' },
          { icon: Award, label: 'Years Experience', value: '10+', color: '#10b981' },
          { icon: Target, label: 'Placement Rate', value: '92%', color: '#f59e0b' },
          { icon: BookOpen, label: 'Premium Courses', value: '48+', color: '#ec4899' }
        ].map((stat, idx) => (
          <motion.div key={idx} whileHover={{ y: -5, scale: 1.02 }} className="glass-card" style={{ padding: '24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', borderTop: `2px solid ${stat.color}40` }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: `${stat.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <stat.icon size={28} color={stat.color} />
            </div>
            <div>
              <h2 style={{ fontSize: '2rem', margin: '0 0 4px 0', color: 'var(--text-main)', fontWeight: 'bold' }}>{stat.value}</h2>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Mission & Vision Split */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
        <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="glass-card" style={{ padding: '40px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)', zIndex: 0 }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <Flag color="#3b82f6" size={24} />
            </div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '16px', color: 'var(--text-main)' }}>Our Mission</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1.05rem' }}>
              To provide unparalleled quality in teacher training and educational resources. We strive to create an ecosystem where educators can thrive, innovate, and make a lasting impact on students worldwide.
            </p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ scale: 1.02 }} className="glass-card" style={{ padding: '40px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, right: 0, width: '150px', height: '150px', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)', zIndex: 0 }} />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
              <Eye color="#10b981" size={24} />
            </div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '16px', color: 'var(--text-main)' }}>Our Vision</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '1.05rem' }}>
              To be the globally recognized, leading platform for teacher excellence. We envision a world where every educator is empowered with the tools they need to unlock the full potential of every learner.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Leadership Quote */}
      <motion.div variants={itemVariants} className="glass-card" style={{ padding: '40px', display: 'flex', alignItems: 'center', gap: '32px', background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)' }}>
        <motion.div whileHover={{ scale: 1.1, rotate: 5 }} style={{ padding: '4px', background: 'linear-gradient(135deg, var(--primary) 0%, #ec4899 100%)', borderRadius: '50%' }}>
          <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Director" style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '4px solid #1e1b4b' }} />
        </motion.div>
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: '16px' }}>
            <Heart size={24} color="#ec4899" style={{ opacity: 0.5, marginBottom: '8px' }} />
            <p style={{ fontSize: '1.25rem', color: 'var(--text-main)', fontStyle: 'italic', lineHeight: '1.6', margin: 0 }}>
              "Our ultimate commitment is to uplift educators through highly practical training, unwavering continuous support, and a community built on shared excellence."
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '32px', height: '2px', background: 'var(--primary)' }} />
            <div>
              <h4 style={{ margin: 0, color: 'var(--primary)', fontSize: '1.1rem' }}>Dr. A. Director</h4>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Founder & CEO</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contact Section */}
      <motion.div variants={itemVariants} className="glass-card" style={{ padding: '40px' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '32px', color: 'var(--text-main)', textAlign: 'center' }}>Get In Touch</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
          {[
            { icon: Globe, title: 'Website', text: "vwings24x7.com" },
            { icon: Phone, title: 'Phone', text: "+1-555-0100" },
            { icon: Mail, title: 'Email', text: "contact@vwings24x7.com" },
            { icon: MapPin, title: 'Location', text: "123 Education Lane" }
          ].map((item, index) => (
            <motion.div 
              key={index} 
              className="glass-card"
              whileHover={{ y: -5, background: 'var(--surface)' }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '24px', borderTop: '3px solid #3b82f6', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s' }}
            >
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(123, 7, 113, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <item.icon size={20} color="var(--primary)" />
              </div>
              <div>
                <h4 style={{ margin: '0 0 4px 0', color: 'var(--text-main)' }}>{item.title}</h4>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{item.text}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

    </motion.div>
  );
};

export default AboutUs;
