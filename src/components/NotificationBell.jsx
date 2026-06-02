import React, { useState, useEffect, useRef } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from './ToastContext';

const API_BASE_URL = 'http://localhost:8000';
const WS_BASE_URL = 'ws://localhost:8000';

const NotificationBell = ({ role, userId }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isWiggling, setIsWiggling] = useState(false);
  const notifRef = useRef(null);
  const ws = useRef(null);
  const toast = useToast();

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    if (!role || !userId) return;

    // Fetch existing notifications
    fetch(`${API_BASE_URL}/api/notifications/get/${role}/${userId}`)
      .then(res => res.json())
      .then(data => {
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.is_read).length);
      })
      .catch(console.error);

    // Connect WebSocket
    const connectWs = () => {
      ws.current = new WebSocket(`${WS_BASE_URL}/ws/${role}/${userId}`);
      ws.current.onmessage = (event) => {
        try {
          const newNotif = JSON.parse(event.data);
          setNotifications(prev => [newNotif, ...prev]);
          setUnreadCount(prev => prev + 1);
          setIsWiggling(true);
          setTimeout(() => setIsWiggling(false), 1000);
          toast.success(`New Notification: ${newNotif.title}`);
        } catch (err) {}
      };
      ws.current.onclose = () => {
        setTimeout(connectWs, 5000);
      };
    };
    connectWs();

    return () => {
      if (ws.current) {
        ws.current.onclose = null;
        ws.current.close();
      }
    };
  }, [role, userId]);

  const markAllRead = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/notifications/mark-all-read/${role}/${userId}`, { method: 'PUT' });
      setNotifications(n => n.map(notif => ({ ...notif, is_read: true })));
      setUnreadCount(0);
    } catch (err) {}
  };

  const markRead = async (id, isRead) => {
    if (isRead) return;
    try {
      await fetch(`${API_BASE_URL}/api/notifications/mark-read/${id}`, { method: 'PUT' });
      setNotifications(n => n.map(notif => notif.notification_id === id ? { ...notif, is_read: true } : notif));
      setUnreadCount(c => Math.max(0, c - 1));
    } catch (err) {}
  };

  const dropdownStyle = {
    position: 'absolute',
    top: 'calc(100% + 12px)',
    right: 0,
    background: 'rgba(5, 5, 15, 0.98)',
    border: '1px solid var(--border, rgba(255,255,255,0.1))',
    borderRadius: '16px',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
    zIndex: 9999,
    overflow: 'hidden',
    width: '340px'
  };

  return (
    <div style={{ position: 'relative' }} ref={notifRef}>
      <motion.button
        onClick={() => setShowNotifications(!showNotifications)}
        animate={isWiggling ? { rotate: [0, -10, 10, -10, 10, 0] } : {}}
        transition={{ duration: 0.5 }}
        style={{ 
          background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border, rgba(255,255,255,0.1))', 
          color: 'var(--text-main, white)', cursor: 'pointer', padding: '10px', 
          borderRadius: '12px', position: 'relative', display: 'flex', alignItems: 'center' 
        }}
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <motion.span 
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            style={{
              position: 'absolute', top: '-4px', right: '-4px',
              background: '#ef4444', color: 'white', borderRadius: '50%',
              width: '18px', height: '18px', fontSize: '10px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700'
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {showNotifications && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={dropdownStyle}
          >
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '600', fontSize: '0.95rem', color: 'var(--text-main, white)' }}>Notifications</span>
              {unreadCount > 0 && (
                <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: 'var(--primary-yellow, #F5C300)', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCheck size={14} /> Mark all read
                </button>
              )}
            </div>
            <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
              {notifications.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted, rgba(255,255,255,0.5))', fontSize: '0.9rem' }}>
                  No new notifications
                </div>
              ) : notifications.map(notif => (
                <div
                  key={notif.notification_id}
                  onClick={() => markRead(notif.notification_id, notif.is_read)}
                  style={{
                    padding: '14px 20px',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    cursor: 'pointer',
                    background: notif.is_read ? 'transparent' : 'rgba(245,195,0,0.05)',
                    transition: 'background 0.2s',
                    color: 'var(--text-main, white)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <div>
                      <div style={{ fontWeight: notif.is_read ? '400' : '600', fontSize: '0.88rem', marginBottom: '4px', color: 'var(--text-main, white)' }}>
                        {!notif.is_read && <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--primary-yellow, #F5C300)', display: 'inline-block', marginRight: '8px' }} />}
                        {notif.title}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted, rgba(255,255,255,0.7))' }}>{notif.message}</div>
                    </div>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted, rgba(255,255,255,0.5))', whiteSpace: 'nowrap', flexShrink: 0 }}>
                      {new Date(notif.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
