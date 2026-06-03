import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, UserCheck, Calendar, Bell } from 'lucide-react';
import WelcomeModalNew from '../components/WelcomeModalNew';
import CarouselCard from '../components/CarouselCard';
import AdBanner from '../components/AdBanner';

const Dashboard = () => {
  const [isWelcomeModalOpen, setIsWelcomeModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Data states
  const [teacher, setTeacher] = useState(null);
  const [classrooms, setClassrooms] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcome');
    if (!hasSeenWelcome) {
      setIsWelcomeModalOpen(true);
      sessionStorage.setItem('hasSeenWelcome', 'true');
    }

    const fetchDashboardData = async () => {
      try {
        // Fetch mock logged in teacher (first one)
        const tchRes = await fetch('https://appbackend.vwings247.me/api/teachers/get-all');
        let currentTeacher = null;
        if (tchRes.ok) {
          const tchData = await tchRes.json();
          if (tchData.length > 0) {
            currentTeacher = tchData[0];
            setTeacher(currentTeacher);
          }
        }

        // Fetch classrooms
        const classRes = await fetch('https://appbackend.vwings247.me/api/classrooms/get-all');
        if (classRes.ok) {
          const classData = await classRes.json();
          // Filter classes where teacher is assigned, or just show all if no teacher
          const teacherClasses = currentTeacher ? classData.filter(c => c.teacher_ids && c.teacher_ids.includes(currentTeacher.teacher_id)) : classData;
          setClassrooms(teacherClasses);
        }

        // Fetch announcements
        const annRes = await fetch('https://appbackend.vwings247.me/announcements/get-all/role/teacher');
        if (annRes.ok) {
          const annData = await annRes.json();
          // Show active announcements targeted to teachers
          const activeAnn = annData.filter(a => a.active_status !== false);
          setAnnouncements(activeAnn.slice(0, 5)); // Show top 5
        }

        // Fetch featured courses
        const coursesRes = await fetch('https://appbackend.vwings247.me/api/courses/get-all');
        if (coursesRes.ok) {
          const coursesData = await coursesRes.json();
          setCourses(coursesData.slice(0, 4));
        }

      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { ease: [0.16, 1, 0.3, 1], duration: 0.5 } }
  };

  // Calculations
  const assignedCoursesCount = teacher?.courses_assigned?.length || 0;
  const courseNames = teacher?.courses_assigned?.map(c => c.course_name).join(', ') || 'None assigned yet';

  // Calculate total unique students in the teacher's classrooms
  const activeStudents = new Set();
  classrooms.forEach(c => {
    if (c.student_ids) {
      c.student_ids.forEach(id => activeStudents.add(id));
    }
  });

  if (loading) {
    return <div style={{ padding: '32px', color: 'var(--text-main)', textAlign: 'center' }}>Loading dashboard...</div>;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <WelcomeModalNew isOpen={isWelcomeModalOpen} onClose={() => setIsWelcomeModalOpen(false)} />
      <AdBanner />

      <div className="dashboard-grid">
        <motion.div className="glass-card stat-card" variants={itemVariants}>
          <div className="stat-header">
            <span>Assigned Courses</span>
            <BookOpen size={24} color="var(--primary)" />
          </div>
          <div className="stat-value text-gradient">{assignedCoursesCount}</div>
          <p style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{courseNames}</p>
        </motion.div>

        <motion.div className="glass-card stat-card" variants={itemVariants}>
          <div className="stat-header">
            <span>Active Students</span>
            <UserCheck size={24} color="var(--secondary)" />
          </div>
          <div className="stat-value text-gradient">{activeStudents.size}</div>
          <p>Across {classrooms.length} active classrooms.</p>
        </motion.div>

        <motion.div className="glass-card stat-card" variants={itemVariants}>
          <div className="stat-header">
            <span>Live Classrooms</span>
            <Calendar size={24} color="var(--warning)" />
          </div>
          <div className="stat-value text-gradient">{classrooms.length}</div>
          <p>Currently assigned to you.</p>
        </motion.div>
      </div>

      <motion.div className="glass-panel" style={{ padding: '24px' }} variants={itemVariants}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <Bell size={24} color="var(--primary)" />
          <h3>Recent Notifications</h3>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {announcements.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No recent notifications.</p>
          ) : (
            announcements.map((ann) => (
              <div key={ann.announcement_id} style={{ padding: '16px', background: 'var(--surface)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary-yellow)' }}></div>
                <div>
                  <h4 style={{ marginBottom: '4px' }}>{ann.headline}</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{ann.description}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} style={{ marginTop: '32px' }}>
        <h3 style={{ marginBottom: '16px' }}>Featured Programs</h3>
        <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '16px' }}>
          {courses.map(course => (
            <CarouselCard
              key={course.course_id}
              title={course.course_name}
              description={course.course_description || 'Learn the fundamentals of aviation.'}
            />
          ))}
          {courses.length === 0 && <p>No featured programs currently available.</p>}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
