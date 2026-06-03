import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

const Salary = () => {
  const [salaries, setSalaries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [teacherInfo, setTeacherInfo] = useState(null);

  const fetchData = async () => {
    try {
      // Fetch salaries
      const salResponse = await fetch('https://appbackend.vwings247.me/api/salaries/get-all');
      let salData = [];
      if (salResponse.ok) {
        salData = await salResponse.json();
        setSalaries(salData);
      }

      // Fetch teacher info (using first salary's teacher_id as mock for logged in user)
      if (salData.length > 0) {
        const teacherId = salData[0].teacher_id;
        const tchResponse = await fetch(`https://appbackend.vwings247.me/api/teachers/get-by/${teacherId}`);
        if (tchResponse.ok) {
          const tchData = await tchResponse.json();
          setTeacherInfo(tchData);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // Calculations
  const currentYear = new Date().getFullYear();
  const ytdSalaries = salaries.filter(s => s.year === currentYear);
  const monthlySalary = teacherInfo?.monthly_salary || 0;

  const ytdEarnings = ytdSalaries.reduce((acc, curr) => acc + (curr.total_salary || 0), 0);
  const lastPaycheck = salaries.length > 0 ? (salaries[salaries.length - 1].total_salary || 0) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel"
      style={{ padding: '32px' }}
    >
      <h2 style={{ marginBottom: '24px' }}>Salary Slips</h2>

      <div className="dashboard-grid">
        <div className="glass-card stat-card" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
          <p>YTD Earnings ({currentYear})</p>
          <div className="stat-value text-gradient">₹{ytdEarnings.toLocaleString()}</div>
        </div>
        <div className="glass-card stat-card" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
          <p>Last Paycheck</p>
          <div className="stat-value text-gradient">₹{lastPaycheck.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
        </div>
        <div className="glass-card stat-card" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
          <p>Upcoming Pay</p>
          <div className="stat-value" style={{ color: 'var(--warning)' }}>₹{monthlySalary.toLocaleString()}</div>
        </div>
      </div>

      <div style={{ marginTop: '32px' }}>
        <h3 style={{ marginBottom: '16px' }}>Your Salary Slips</h3>
        {loading ? (
          <p>Loading salaries...</p>
        ) : salaries.length === 0 ? (
          <p>No salary slips available.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '12px' }}>Teacher ID</th>
                  <th style={{ padding: '12px' }}>Month/Year</th>
                  <th style={{ padding: '12px' }}>Amount</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {salaries.map((s, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px' }}>{s.teacher_id}</td>
                    <td style={{ padding: '12px' }}>{monthNames[s.month - 1]} {s.year}</td>
                    <td style={{ padding: '12px', color: 'var(--text-main)', fontWeight: 'bold' }}>₹{(s.total_salary || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                    <td style={{ padding: '12px', color: '#10b981', fontWeight: 'bold' }}>{s.status || 'Paid'}</td>
                    <td style={{ padding: '12px' }}>
                      <button
                        className="btn-secondary"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px' }}
                        onClick={() => window.open(`https://appbackend.vwings247.me/${s.file_path.replace(/\\\\/g, '/')}`, '_blank')}
                      >
                        <Download size={16} /> Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Salary;
