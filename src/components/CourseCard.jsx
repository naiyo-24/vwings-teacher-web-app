import React from 'react';

const CourseCard = ({ course, onClick }) => {
  const fees = course?.general_data?.course_fees ? `₹${course.general_data.course_fees}` : 'Contact for Info';
  const photoUrl = course.course_photo ? `https://appbackend.vwings247.me/${course.course_photo.replace(/\\/g, '/')}` : null;

  return (
    <div className="glass-card" style={{ padding: '24px', cursor: 'pointer', display: 'flex', flexDirection: 'column' }} onClick={onClick}>
      {photoUrl && (
        <img
          src={photoUrl}
          alt={course.course_name}
          style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px' }}
        />
      )}
      <h3 style={{ color: 'var(--primary-yellow)' }}>{course?.course_name || 'Course Title'}</h3>
      <p style={{ margin: '12px 0', flexGrow: 1 }}>{course?.course_description?.substring(0, 100) || 'Course description goes here.'}...</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
        <span style={{ color: 'var(--text-muted)' }}>{fees}</span>
        <button className="btn-secondary" style={{ padding: '8px 16px' }}>Details</button>
      </div>
    </div>
  );
};

export default CourseCard;
