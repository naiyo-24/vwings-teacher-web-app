import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader, X, BookOpen, User, Briefcase, HeartHandshake } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE_URL = 'http://localhost:8000';

const GlobalSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults(null);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_BASE_URL}/search/?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success) {
          setResults(data.data);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleResultClick = (item, type) => {
    setIsOpen(false);
    setQuery('');
    if (type === 'courses') {
      navigate(`/courses/${item.id}`);
    }
    // No specific pages for other user types in Teacher app currently
  };

  const hasResults = results && (
    results.courses.length > 0 ||
    results.students.length > 0 ||
    results.teachers.length > 0 ||
    results.counsellors.length > 0
  );

  const renderSection = (title, items, icon, type) => {
    if (!items || items.length === 0) return null;
    return (
      <div style={{ marginBottom: '12px' }}>
        <h4 style={{ margin: '0 0 8px 12px', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          {icon} {title}
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {items.map(item => (
            <div
              key={item.id}
              onClick={() => handleResultClick(item, type)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '10px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'background 0.2s',
                color: 'var(--text-main)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              {item.photo ? (
                <img src={`${API_BASE_URL}/${item.photo.replace(/\\/g, '/')}`} alt={item.name} style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {icon}
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontWeight: '600', fontSize: '0.9rem', color: '#1A2134', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {item.name || 'Unknown User'}
                </span>
                <span style={{ fontSize: '0.75rem', color: '#373F52', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {item.code || item.email || item.phone_no || 'No Details'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div ref={searchRef} style={{ position: 'relative', width: '280px' }} className="global-search-container">
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <Search size={18} style={{ position: 'absolute', left: '12px', color: 'var(--text-muted)' }} />
        <input
          type="text"
          placeholder="Search courses, users..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          style={{
            width: '100%',
            background: 'rgba(0, 0, 0, 0.02)',
            border: '1px solid var(--border)',
            padding: '10px 12px 10px 38px',
            borderRadius: '12px',
            color: 'var(--text-main)',
            fontSize: '0.9rem',
            outline: 'none',
            transition: 'border-color 0.2s, background 0.2s',
          }}
          onMouseEnter={(e) => {
            if (document.activeElement !== e.target) {
              e.target.style.background = 'rgba(0, 0, 0, 0.04)';
            }
          }}
          onMouseLeave={(e) => {
            if (document.activeElement !== e.target) {
              e.target.style.background = 'rgba(0, 0, 0, 0.02)';
            }
          }}
          onFocusCapture={(e) => {
            e.target.style.background = 'rgba(0, 0, 0, 0.04)';
            e.target.style.borderColor = 'var(--primary)';
          }}
          onBlurCapture={(e) => {
            e.target.style.background = 'rgba(0, 0, 0, 0.02)';
            e.target.style.borderColor = 'var(--border)';
          }}
        />
        {isLoading && (
          <Loader size={16} className="animate-spin" style={{ position: 'absolute', right: '12px', color: 'var(--text-muted)' }} />
        )}
        {query && !isLoading && (
          <X 
            size={16} 
            style={{ position: 'absolute', right: '12px', color: 'var(--text-muted)', cursor: 'pointer' }} 
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }} 
          />
        )}
      </div>

      <AnimatePresence>
        {isOpen && query.trim() && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              background: '#FFFFFF',
              border: '1px solid var(--border)',
              borderRadius: '16px',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
              zIndex: 9999,
              maxHeight: '400px',
              overflowY: 'auto',
              padding: '12px'
            }}
            className="global-search-dropdown"
          >
            {results ? (
              hasResults ? (
                <>
                  {renderSection('Courses', results.courses, <BookOpen size={14} />, 'courses')}
                  {renderSection('Students', results.students, <User size={14} />, 'students')}
                  {renderSection('Teachers', results.teachers, <Briefcase size={14} />, 'teachers')}
                  {renderSection('Counsellors', results.counsellors, <HeartHandshake size={14} />, 'counsellors')}
                </>
              ) : (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  No results found for "{query}"
                </div>
              )
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GlobalSearch;
