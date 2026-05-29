import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import CourseCard from '../components/CourseCard';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
};

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/courses/get-all');
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        const data = await response.json();
        setCourses(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '64px' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} style={{ width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.2)', borderTopColor: 'var(--primary-yellow)', borderRadius: '50%' }} />
      </div>
    );
  }

  if (error) {
    return <div style={{ color: 'red', padding: '32px', textAlign: 'center' }}>Error: {error}</div>;
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="glass-panel" 
      style={{ padding: '32px' }}
    >
      <h2 style={{ marginBottom: '24px' }}>Available Courses</h2>
      {courses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        <motion.div variants={containerVariants} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {courses.map((course) => (
            <motion.div key={course.course_id} variants={itemVariants} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <CourseCard 
                course={course} 
                onClick={() => navigate(`/courses/${course.course_id}`)} 
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default Courses;
