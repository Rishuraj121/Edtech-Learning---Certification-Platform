import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, token, API } = useContext(AuthContext);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      // alert('Please login first');
      // navigate('/');
      // return;
    }

    const fetchDashboard = async () => {
      try {
        const res = await fetch(`${API}/api/my-courses`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setEnrolledCourses(data.courses);
        }
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchDashboard();
    } else {
      setLoading(false);
    }
  }, [user, token, API, navigate]);

  if (!user && !loading) {
    return (
      <div id="dashboardPage" className="page-wrapper">
        <div className="container dashboard-page">
          <h2>Please login to view your dashboard</h2>
        </div>
      </div>
    );
  }

  return (
    <div id="dashboardPage" className="page-wrapper">
      <div className="container dashboard-page">
        <div className="dash-header">
          <div>
            <h1>User <span className="gradient-text">Dashboard</span></h1>
            <p id="dashWelcome">Welcome back, {user?.name || 'Student'}!</p>
          </div>
          <button className="btn btn-outline" onClick={() => navigate('/courses')}>
            <i className="fas fa-plus"></i> Browse Courses
          </button>
        </div>
        
        <div className="dash-sections">
          <div className="dash-section">
            <div className="section-title-wrap">
              <h2 className="dash-section-title"><i className="fas fa-book-reader"></i> My Courses</h2>
              <div className="title-line"></div>
            </div>
            <div id="dashboardContent" className="dash-grid">
              {loading ? (
                <div className="loading-spinner"><i className="fas fa-spinner fa-spin fa-2x"></i></div>
              ) : enrolledCourses.length === 0 ? (
                <div className="empty-dash">
                  <i className="fas fa-book-open"></i>
                  <h3>No Courses Enrolled</h3>
                  <p style={{ color: 'var(--text-muted)', margin: '1rem 0 2rem' }}>Explore our catalog to start your learning journey.</p>
                  <button className="btn btn-primary" onClick={() => navigate('/courses')}>Browse Courses</button>
                </div>
              ) : (
                enrolledCourses.map(c => (
                  <div className="dash-card" key={c.courseId}>
                    <div className="dash-card-header">
                      <div className="dash-card-icon" style={{ background: 'linear-gradient(135deg,#6c5ce7,#a29bfe)' }}>
                        <i className={`fas ${c.icon || 'fa-laptop-code'}`}></i>
                      </div>
                      <div className="dash-card-title">
                        <h4>{c.title}</h4>
                        <span>{c.totalLessons} Lessons</span>
                      </div>
                    </div>
                    <div className="dash-progress-wrap">
                      <div className="dash-progress-meta">
                        <span>Progress</span>
                        <span style={{ color: c.isCompleted ? 'var(--success)' : 'var(--text-main)' }}>{c.progress}%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${c.progress}%`, background: c.isCompleted ? 'var(--success)' : '' }}></div>
                      </div>
                    </div>
                    <div className="dash-actions" style={{ flexDirection: 'column', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', width: '100%' }}>
                        <button className={`btn ${c.progress > 0 ? 'btn-primary' : 'btn-outline'}`} style={{ flex: 1 }} onClick={() => navigate(`/learn/${c.courseId}`)}>
                          {c.progress === 0 ? 'Start Course' : c.isCompleted ? 'Review Course' : 'Resume Course'} <i className={`fas ${c.isCompleted ? 'fa-redo' : 'fa-play'}`}></i>
                        </button>
                        {c.isCompleted && (
                          <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => navigate(`/certificate/${c.courseId}`)}>
                            Certificate <i className="fas fa-certificate"></i>
                          </button>
                        )}
                      </div>
                      <button 
                        className="btn btn-ghost" 
                        style={{ width: '100%', border: '1px solid var(--border)', fontSize: '0.9rem' }} 
                        onClick={() => {
                          const content = `SkillHub Study Notes\nCourse: ${c.title}\n\nThis document contains curated notes for your enrolled course.\n\nKeep learning and growing with SkillHub!`;
                          const blob = new Blob([content], { type: 'text/plain' });
                          const url = URL.createObjectURL(blob);
                          const link = document.createElement('a');
                          link.href = url;
                          link.download = `${c.title.replace(/\s+/g, '_')}_Notes.txt`;
                          link.click();
                        }}
                      >
                        <i className="fas fa-download"></i> Download Notes
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
