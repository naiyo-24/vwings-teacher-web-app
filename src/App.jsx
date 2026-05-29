import React, { useState, useEffect, createContext, useContext } from 'react';
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, Home, CreditCard, Bell, HelpCircle, User, LogOut, Plane } from 'lucide-react';

import './App.css';

// Auth Context
export const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

// Lazy loading screens
import Dashboard from './screens/Dashboard';
import Login from './screens/Login';
import Courses from './screens/Courses';
import CourseDetails from './screens/CourseDetails';
import Classrooms from './screens/Classrooms';
import Salary from './screens/Salary';
import Profile from './screens/Profile';
import HelpCenter from './screens/HelpCenter';
import Footer from './components/Footer';
import BgParticlesComponent from './components/BgParticlesComponent';
import SplashScreen from './components/SplashScreen';

const Sidebar = ({ handleLogout }) => {
  const location = useLocation();
  const { user } = useAuth();

  const photoUrl = user?.profile_photo ? `http://localhost:8000/${user.profile_photo.replace(/\\/g, '/')}` : null;
  const getInitials = (name) => {
    if (!name) return 'T';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const links = [
    { name: 'Dashboard', path: '/', icon: <Home size={20} /> },
    { name: 'Courses', path: '/courses', icon: <BookOpen size={20} /> },
    { name: 'Classrooms', path: '/classrooms', icon: <User size={20} /> },
    { name: 'Salary & Files', path: '/salary', icon: <CreditCard size={20} /> },
    { name: 'Profile', path: '/profile', icon: <User size={20} /> },
    { name: 'Help Center', path: '/help', icon: <HelpCircle size={20} /> },
  ];

  return (
    <div className="sidebar">
      <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
        <img src="/assets/V-Wings_Logo_nobg.png" alt="VWings24x7 Logo" style={{ width: '64px', height: '64px', objectFit: 'contain' }} />
        <span style={{ color: 'var(--primary-yellow)', fontSize: '24px', fontWeight: '800', letterSpacing: '0.5px' }}>VWings24x7</span>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        {photoUrl ? (
          <img src={photoUrl} alt="Profile" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-yellow)' }} />
        ) : (
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-yellow)', color: 'var(--deep-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            {getInitials(user?.full_name)}
          </div>
        )}
        <div style={{ overflow: 'hidden' }}>
          <p style={{ margin: 0, fontWeight: 'bold', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.full_name || 'Teacher'}</p>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--secondary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.teacher_id || 'TCH001'}</p>
        </div>
      </div>
      
      <div className="nav-links">
        {links.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={`nav-item ${location.pathname === link.path ? 'active' : ''}`}
          >
            {link.icon}
            {link.name}
          </Link>
        ))}
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <button className="nav-item" onClick={handleLogout} style={{ background: 'transparent', border: 'none', width: '100%', cursor: 'pointer', textAlign: 'left' }}>
          <LogOut size={20} color="var(--danger)" />
          <span style={{ color: 'var(--danger)' }}>Logout</span>
        </button>
      </div>
    </div>
  );
};

const Topbar = () => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const getInitials = (name) => {
    if (!name) return 'ST';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };
  
  const photoUrl = user?.profile_photo ? `http://localhost:8000/${user.profile_photo.replace(/\\/g, '/')}` : null;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`http://localhost:8000/announcements/get-all/role/teacher`);
        if (res.ok) {
          const data = await res.json();
          const active = data.filter(a => a.active_status);
          setNotifications(active.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)));
          setUnreadCount(active.length);
        }
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
    };
    fetchNotifications();
  }, []);

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    setUnreadCount(0);
  };

  return (
    <div className="topbar">
      <div>
        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Welcome back, {user?.full_name?.split(' ')[0] || 'Faculty'}! ✈️</h2>
        <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)' }}>Ready for your next teaching session?</p>
      </div>
      <div className="user-profile" style={{ position: 'relative' }}>
        <button className="btn-secondary" onClick={handleNotificationClick} style={{ padding: '10px', borderRadius: '50%', position: 'relative' }}>
          <Bell size={20} />
          {unreadCount > 0 && (
            <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: 'var(--danger)', color: 'white', fontSize: '10px', width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {unreadCount}
            </span>
          )}
        </button>

        <AnimatePresence>
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="glass-panel"
              style={{ position: 'absolute', top: '50px', right: '50px', width: '320px', maxHeight: '400px', overflowY: 'auto', zIndex: 100, padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', background: 'rgba(15, 23, 42, 0.95)' }}
            >
              <h3 style={{ borderBottom: '1px solid var(--border)', paddingBottom: '8px', marginBottom: '4px', fontSize: '1.1rem' }}>Notifications</h3>
              {notifications.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '16px 0' }}>No new notifications.</p>
              ) : (
                notifications.map(note => (
                  <div key={note.announcement_id} style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', borderLeft: '3px solid var(--primary-yellow)' }}>
                    <h4 style={{ fontSize: '0.95rem', marginBottom: '4px', color: 'var(--primary-yellow)' }}>{note.headline}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>{note.description}</p>
                    <small style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', marginTop: '6px', display: 'block' }}>
                      {new Date(note.created_at).toLocaleDateString()}
                    </small>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <Link to="/profile" style={{ textDecoration: 'none' }}>
          {photoUrl ? (
            <img src={photoUrl} alt="Profile" className="avatar" style={{ objectFit: 'cover', cursor: 'pointer', width: '40px', height: '40px', borderRadius: '50%' }} />
          ) : (
            <div className="avatar" style={{ cursor: 'pointer' }}>{getInitials(user?.full_name)}</div>
          )}
        </Link>
      </div>
    </div>
  );
};

const AppLayout = ({ children, handleLogout, isOnline }) => {
  return (
    <div className="app-container">
      <BgParticlesComponent />
      <Sidebar handleLogout={handleLogout} />
      <div className="main-content">
        {!isOnline && (
          <div style={{ background: 'var(--danger)', color: 'white', padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>
            You are currently offline. Check your internet connection.
          </div>
        )}
        <Topbar />
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
        <Footer />
      </div>
    </div>
  );
};

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const storedTeacher = (() => {
    try { return JSON.parse(localStorage.getItem('vwings_teacher')); } catch { return null; }
  })();
  const [user, setUser] = useState(storedTeacher);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const isAuthenticated = !!user;

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleLogin = (teacherData) => {
    sessionStorage.removeItem('hasSeenWelcome');
    setUser(teacherData);
    localStorage.setItem('vwings_teacher', JSON.stringify(teacherData));
  };
  const handleLogout = () => {
    sessionStorage.removeItem('hasSeenWelcome');
    setUser(null);
    localStorage.removeItem('vwings_teacher');
  };

  if (showSplash) {
    return <AnimatePresence><SplashScreen onComplete={() => setShowSplash(false)} /></AnimatePresence>;
  }

  return (
    <AuthContext.Provider value={{ user }}>
      <Routes>
        <Route 
          path="/login" 
        element={
          isAuthenticated ? <Navigate to="/" /> : <Login onLogin={handleLogin} />
        } 
      />
      
      {/* Protected Routes */}
      <Route 
        path="/" 
        element={
          isAuthenticated ? (
            <AppLayout handleLogout={handleLogout} isOnline={isOnline}>
              <Dashboard />
            </AppLayout>
          ) : <Navigate to="/login" />
        } 
      />
      <Route 
        path="/courses" 
        element={
          isAuthenticated ? (
            <AppLayout handleLogout={handleLogout} isOnline={isOnline}>
              <Courses />
            </AppLayout>
          ) : <Navigate to="/login" />
        } 
      />
      <Route 
        path="/courses/:id" 
        element={
          isAuthenticated ? (
            <AppLayout handleLogout={handleLogout} isOnline={isOnline}>
              <CourseDetails />
            </AppLayout>
          ) : <Navigate to="/login" />
        } 
      />
      <Route 
        path="/classrooms" 
        element={
          isAuthenticated ? (
            <AppLayout handleLogout={handleLogout} isOnline={isOnline}>
              <Classrooms />
            </AppLayout>
          ) : <Navigate to="/login" />
        } 
      />
      <Route 
        path="/salary" 
        element={
          isAuthenticated ? (
            <AppLayout handleLogout={handleLogout} isOnline={isOnline}>
              <Salary />
            </AppLayout>
          ) : <Navigate to="/login" />
        } 
      />
      <Route 
        path="/profile" 
        element={
          isAuthenticated ? (
            <AppLayout handleLogout={handleLogout} isOnline={isOnline}>
              <Profile />
            </AppLayout>
          ) : <Navigate to="/login" />
        } 
      />
      <Route 
        path="/help" 
        element={
          isAuthenticated ? (
            <AppLayout handleLogout={handleLogout} isOnline={isOnline}>
              <HelpCenter />
            </AppLayout>
          ) : <Navigate to="/login" />
        } 
      />
    </Routes>
    </AuthContext.Provider>
  );
}

export default App;
