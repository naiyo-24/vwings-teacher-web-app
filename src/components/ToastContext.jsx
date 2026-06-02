import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const ToastContext = createContext(null);

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const [confirmDialog, setConfirmDialog] = useState(null);

  const addToast = useCallback((message, type = 'success') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const confirm = useCallback((message) => {
    return new Promise((resolve) => {
      setConfirmDialog({
        message,
        onConfirm: () => {
          setConfirmDialog(null);
          resolve(true);
        },
        onCancel: () => {
          setConfirmDialog(null);
          resolve(false);
        }
      });
    });
  }, []);

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error'),
    confirm: confirm
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      
      <AnimatePresence>
        {confirmDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', 
              backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', 
              justifyContent: 'center', pointerEvents: 'auto', zIndex: 999999
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              style={{
                background: 'rgba(15, 15, 25, 0.95)', border: '1px solid var(--border)',
                borderRadius: '16px', padding: '32px', maxWidth: '400px', width: '100%',
                boxShadow: '0 24px 48px rgba(0,0,0,0.5)', textAlign: 'center'
              }}
            >
              <AlertCircle color="#f87171" size={48} style={{ margin: '0 auto 16px' }} />
              <h3 style={{ margin: '0 0 16px 0', color: 'white', fontSize: '1.25rem' }}>Confirmation Required</h3>
              <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '32px', lineHeight: '1.5' }}>{confirmDialog.message}</p>
              <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                <button onClick={confirmDialog.onCancel} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
                <button onClick={confirmDialog.onConfirm} className="btn-primary" style={{ flex: 1, background: '#f87171', color: 'white', border: 'none' }}>Yes, Continue</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ position: 'fixed', top: '24px', right: '24px', zIndex: 99999, display: 'flex', flexDirection: 'column', gap: '12px', pointerEvents: 'none' }}>
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              style={{
                background: 'rgba(15, 15, 25, 0.95)',
                backdropFilter: 'blur(12px)',
                border: `1px solid ${t.type === 'success' ? 'rgba(74, 222, 128, 0.3)' : 'rgba(248, 113, 113, 0.3)'}`,
                boxShadow: `0 8px 32px ${t.type === 'success' ? 'rgba(74, 222, 128, 0.15)' : 'rgba(248, 113, 113, 0.15)'}`,
                color: 'white',
                padding: '16px 20px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                minWidth: '320px',
                maxWidth: '420px',
                pointerEvents: 'auto'
              }}
            >
              {t.type === 'success' ? (
                <CheckCircle color="#4ade80" size={24} style={{ flexShrink: 0 }} />
              ) : (
                <AlertCircle color="#f87171" size={24} style={{ flexShrink: 0 }} />
              )}
              <div style={{ flex: 1, fontWeight: '500', fontSize: '0.95rem', lineHeight: '1.4' }}>{t.message}</div>
              <button 
                onClick={() => removeToast(t.id)} 
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: '4px', display: 'flex', flexShrink: 0 }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
              >
                <X size={18} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
