import React, { useState, useEffect } from 'react';
import { useToast } from '../components/ToastContext';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download } from 'lucide-react';

const CourseDetails = () => {
  const toast = useToast();
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/courses/get-by/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch course details');
        }
        const data = await response.json();
        setCourse(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCourse();
  }, [id]);

  if (loading) {
    return <div style={{ color: 'white', padding: '32px' }}>Loading course details...</div>;
  }

  if (error) {
    return (
      <div style={{ color: 'white', padding: '32px' }}>
        <p style={{ color: 'var(--danger)', marginBottom: '16px' }}>Error: {error}</p>
        <button className="btn-secondary" onClick={() => navigate('/courses')}>Back to Courses</button>
      </div>
    );
  }

  if (!course) {
    return <div style={{ color: 'white', padding: '32px' }}>Course not found.</div>;
  }

  const photoUrl = course.course_photo ? `http://localhost:8000/${course.course_photo.replace(/\\/g, '/')}` : null;
  const fees = course?.general_data?.course_fees ? `₹${course.general_data.course_fees}` : 'Contact for Info';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel" 
      style={{ padding: '32px' }}
    >
      <button 
        onClick={() => navigate('/courses')} 
        style={{ 
          background: 'transparent', 
          border: 'none', 
          color: 'var(--primary-yellow)', 
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '24px',
          fontSize: '16px'
        }}
      >
        <ArrowLeft size={20} /> Back to Courses
      </button>

      <div className="course-header" style={{ marginBottom: '32px' }}>
        {photoUrl && (
          <img 
            src={photoUrl} 
            alt={course.course_name} 
            style={{ 
              width: '100%', 
              height: '300px', 
              objectFit: 'cover', 
              borderRadius: '12px', 
              marginBottom: '24px',
              border: '1px solid var(--glass-border)'
            }} 
          />
        )}
        <h1 style={{ color: 'var(--primary-yellow)', fontSize: '32px', marginBottom: '8px' }}>
          {course.course_name}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '18px' }}>Code: {course.course_code}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
        <div className="course-section">
          <h3 style={{ color: 'white', marginBottom: '16px', fontSize: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
            Description
          </h3>
          <p style={{ lineHeight: '1.6', fontSize: '16px' }}>{course.course_description || 'No description available.'}</p>
        </div>

        <div className="course-section">
          <h3 style={{ color: 'white', marginBottom: '16px', fontSize: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
            Requirements
          </h3>
          <ul style={{ listStyleType: 'disc', paddingLeft: '20px', lineHeight: '1.8' }}>
            {course.min_educational_qualification && <li><strong>Education:</strong> {course.min_educational_qualification}</li>}
            {course.age_criteria && <li><strong>Age:</strong> {course.age_criteria}</li>}
            {course.height_requirements && <li><strong>Height:</strong> {course.height_requirements}</li>}
            {course.weight_requirements && <li><strong>Weight:</strong> {course.weight_requirements}</li>}
            {course.vision_standards && <li><strong>Vision:</strong> {course.vision_standards}</li>}
            {course.medical_requirements && <li><strong>Medical:</strong> {course.medical_requirements}</li>}
          </ul>
        </div>
        
        <div className="course-section">
          <h3 style={{ color: 'white', marginBottom: '16px', fontSize: '20px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
            Additional Details
          </h3>
          <ul style={{ listStyleType: 'disc', paddingLeft: '20px', lineHeight: '1.8' }}>
            <li><strong>Fees:</strong> {fees}</li>
            <li><strong>Internship Included:</strong> {course.internship_included ? 'Yes' : 'No'}</li>
            <li><strong>Installment Available:</strong> {course.installment_available ? 'Yes' : 'No'}</li>
            {course.installment_policy && <li><strong>Installment Policy:</strong> {course.installment_policy}</li>}
            {course?.general_data?.placement_assistance && <li><strong>Placement Assistance:</strong> {course.general_data.placement_type}</li>}
            {course?.general_data?.placement_rate && <li><strong>Placement Rate:</strong> {course.general_data.placement_rate}%</li>}
            {course?.general_data?.job_roles_offered && <li><strong>Job Roles:</strong> {course.general_data.job_roles_offered}</li>}
          </ul>
        </div>
      </div>

      <div style={{ marginTop: '40px', display: 'flex', gap: '16px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '24px', flexWrap: 'wrap' }}>
        <button 
          className="btn-primary" 
          style={{ padding: '12px 32px', fontSize: '18px' }}
          onClick={() => navigate('/classrooms')}
        >
          View Classrooms
        </button>
        <button 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px', 
            background: 'white', 
            color: '#384252', 
            border: '2px solid #E2E8F0', 
            borderRadius: '12px', 
            padding: '12px 24px', 
            fontSize: '18px', 
            fontWeight: '600',
            cursor: 'pointer'
          }}
          onClick={() => toast.error('Downloading brochure...')}
        >
          <Download size={22} /> Download Brochure
        </button>
        <button className="btn-secondary" style={{ padding: '12px 32px', fontSize: '18px' }} onClick={() => navigate('/help')}>
          Ask a Question
        </button>
      </div>
    </motion.div>
  );
};

export default CourseDetails;

