import React, { useState, useEffect, createContext, useContext } from 'react';
import { Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
import { BookOpen, Home, CreditCard, HelpCircle, User, LogOut, Plane, Info, Menu, X } from 'lucide-react';

import './App.css';
import { AnimatePresence } from 'framer-motion';

// Lazy loading screens
import Dashboard from './screens/Dashboard';
import Login from './screens/Login';
import Courses from './screens/Courses';
import CourseDetails from './screens/CourseDetails';
import Classrooms from './screens/Classrooms';
import Salary from './screens/Salary';
import Profile from './screens/Profile';
import AboutUs from './screens/AboutUs';
import HelpCenter from './screens/HelpCenter';
import Footer from './components/Footer';
import BgParticlesComponent from './components/BgParticlesComponent';
import SplashScreen from './components/SplashScreen';
import NotificationBell from './components/NotificationBell';
import GlobalSearch from './components/GlobalSearch';
import { AuthContext, useAuth } from './AuthContext';


const Sidebar = ({ handleLogout, isOpen, onClose }) => {
  const location = useLocation();
  const { user } = useAuth();

  const photoUrl = user?.profile_photo ? `https://appbackend.vwings247.me/${user.profile_photo.replace(/\\/g, '/')}` : null;
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
    { name: 'About Us', path: '/about', icon: <Info size={20} /> },
    { name: 'Help Center', path: '/help', icon: <HelpCircle size={20} /> },
  ];

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="brand" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src="/assets/V-Wings_Logo_nobg.png" alt="VWings24x7 Logo" style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
          <span style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: '800', letterSpacing: '0.5px' }}>VWings24x7</span>
        </div>
        <button className="close-sidebar-btn" onClick={onClose} aria-label="Close menu">
          <X size={24} />
        </button>
      </div>

      <div style={{ background: 'var(--surface)', padding: '16px', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        {photoUrl ? (
          <img src={photoUrl} alt="Profile" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary)' }} />
        ) : (
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            {getInitials(user?.full_name)}
          </div>
        )}
        <div style={{ overflow: 'hidden' }}>
          <p style={{ margin: 0, fontWeight: 'bold', color: 'var(--text-main)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.full_name || 'Teacher'}</p>
          <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{user?.teacher_id || 'TCH001'}</p>
        </div>
      </div>

      <div className="nav-links">
        {links.map((link) => (
          <Link
            key={link.name}
            to={link.path}
            className={`nav-item ${location.pathname === link.path ? 'active' : ''}`}
            onClick={onClose}
          >
            {link.icon}
            {link.name}
          </Link>
        ))}
      </div>

      <div className="sidebar-footer">
        <button className="nav-item logout-button" onClick={() => { handleLogout(); onClose(); }}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

const Topbar = ({ onMenuToggle }) => {
  const { user } = useAuth();

  const getInitials = (name) => {
    if (!name) return 'ST';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const photoUrl = user?.profile_photo ? `https://appbackend.vwings247.me/${user.profile_photo.replace(/\\/g, '/')}` : null;

  return (
    <div className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0, overflow: 'hidden' }}>
        <button className="hamburger-btn" onClick={onMenuToggle}>
          <Menu size={22} />
        </button>
        <div style={{ minWidth: 0, overflow: 'hidden' }}>
          <h2 style={{ margin: 0, fontSize: '1.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Welcome back, {user?.full_name?.split(' ')[0] || 'Faculty'}! ✈️</h2>
          <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)' }}>Ready for your next teaching session?</p>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
        <GlobalSearch />
        <NotificationBell role="teacher" userId={user?.teacher_id || "teacher"} />

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Auto-close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="app-container">
      <BgParticlesComponent />
      <div className={`sidebar-overlay ${sidebarOpen ? 'active' : ''}`} onClick={() => setSidebarOpen(false)} />
      <Sidebar handleLogout={handleLogout} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-content">
        {!isOnline && (
          <div style={{ background: 'var(--danger)', color: 'var(--text-main)', padding: '8px', textAlign: 'center', fontWeight: 'bold' }}>
            You are currently offline. Check your internet connection.
          </div>
        )}
        <Topbar onMenuToggle={() => setSidebarOpen(prev => !prev)} />
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
          path="/about"
          element={
            isAuthenticated ? (
              <AppLayout handleLogout={handleLogout} isOnline={isOnline}>
                <AboutUs />
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
