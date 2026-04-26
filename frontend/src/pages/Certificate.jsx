import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UIContext } from '../App';

const Certificate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, API } = useContext(AuthContext);
  const { showToast } = useContext(UIContext);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }

    const fetchCourse = async () => {
      try {
        const res = await fetch(`${API}/api/my-courses`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          const found = data.courses.find(c => c.courseId === id);
          if (found) {
            setCourse(found);
          } else {
            navigate('/dashboard');
          }
        }
      } catch (err) {
        console.error('Failed to load certificate data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [id, token, API, navigate]);

  const downloadCertificate = async () => {
    showToast('Generating certificate...', 'info');
    try {
      const res = await fetch(`${API}/api/certificate/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Certificate_${id}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        showToast('Certificate downloaded successfully', 'success');
      } else {
        const data = await res.json();
        showToast(data.message || 'Failed to download certificate', 'error');
      }
    } catch (err) {
      showToast('Download error', 'error');
    }
  };

  if (loading) {
    return <div className="loading-spinner" style={{ marginTop: '5rem' }}><i className="fas fa-spinner fa-spin fa-3x"></i></div>;
  }

  if (!course) return null;

  return (
    <div id="certificatePage" className="page-wrapper">
      <div className="container">
        <button className="btn btn-ghost" onClick={() => navigate('/dashboard')} style={{ marginBottom: '2rem' }}>
          <i className="fas fa-arrow-left"></i> Back to Dashboard
        </button>
        <div id="certificateContent">
          <div className="section-header">
            <h2>Course <span className="gradient-text">Certificate</span></h2>
            <p>{course.title}</p>
          </div>
          
          <div className={`cert-full-view ${!course.isCompleted ? 'locked' : ''}`}>
            <div className="cert-watermark">SKILLHUB</div>
            <div style={{ border: '2px solid rgba(255,255,255,0.1)', padding: '3rem', height: '100%' }}>
               <p style={{ color: 'var(--primary-light)', letterSpacing: '5px', fontWeight: 600, marginBottom: '2rem' }}>CERTIFICATE OF COMPLETION</p>
               <h3 style={{ fontSize: '1.5rem', color: 'var(--text-muted)', fontWeight: 400 }}>PROUDLY PRESENTED TO</h3>
               <h1 style={{ fontSize: '4rem', margin: '1.5rem 0', fontFamily: 'serif', color: '#fff' }}>{user.name}</h1>
               <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2rem' }}>
                 For successfully completing the comprehensive professional program in <strong>{course.title}</strong>
               </p>
               <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
                  <div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>DATE</p>
                    <p style={{ fontWeight: 700 }}>{course.isCompleted ? new Date(course.completedAt).toLocaleDateString() : '---'}</p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>INSTRUCTOR</p>
                    <p style={{ fontWeight: 700 }}>SkillHub Expert</p>
                  </div>
                  <div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>CERTIFICATE ID</p>
                    <p style={{ fontWeight: 700, fontFamily: 'monospace' }}>SKH-{course.enrollmentId.slice(-8).toUpperCase()}</p>
                  </div>
               </div>
            </div>
          </div>

          <div className="text-center" style={{ marginTop: '3rem' }}>
            {course.isCompleted 
              ? <button className="btn btn-primary btn-lg" onClick={downloadCertificate}>Download PDF Certificate <i className="fas fa-download"></i></button>
              : <div className="alert info" style={{ display: 'inline-block', padding: '1rem 2rem', background: 'rgba(108, 92, 231, 0.1)', borderRadius: '12px', border: '1px solid var(--primary)' }}>
                   <i className="fas fa-lock"></i> Certificate Locked. Complete 100% of the course to unlock.
                 </div>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
