import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { API } = useContext(AuthContext);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`${API}/api/courses/${id}`);
        const data = await res.json();
        if (data.success) {
          setCourse(data.course);
        }
      } catch (err) {
        console.error('Error fetching course:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id, API]);

  if (loading) {
    return <div className="loading-spinner"><i className="fas fa-spinner fa-spin fa-3x"></i><p>Loading details...</p></div>;
  }

  if (!course) {
    return <p className="text-center error">Failed to load course details.</p>;
  }

  const lessonCount = course.lessons ? course.lessons.length : 0;

  return (
    <div id="courseDetailsPage" className="page-wrapper">
      <div className="container">
        <button className="btn btn-ghost" onClick={() => navigate('/courses')} style={{ marginBottom: '2rem' }}>
          <i className="fas fa-arrow-left"></i> Back to Courses
        </button>
        <div className="details-header" style={{ marginBottom: '3rem' }}>
          <div className="details-thumb" style={{ background: 'linear-gradient(135deg,#6c5ce7,#a29bfe)' }}>
            <i className={`fas ${course.icon || 'fa-laptop-code'}`}></i>
          </div>
          <div className="details-info">
            <div className="section-tag">{course.category.replace('-', ' ')}</div>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{course.title}</h1>
            <div className="details-meta">
              <span><i className="fas fa-user-tie"></i> {course.instructor}</span>
              <span><i className="fas fa-clock"></i> {course.duration}</span>
              <span><i className="fas fa-book"></i> {lessonCount} Lessons</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '2rem' }}>{course.description}</p>
            <div className="details-footer" style={{ marginTop: 0, paddingTop: 0, borderTop: 'none' }}>
              <span className="course-price" style={{ fontSize: '2.5rem' }}>₹{course.price.toLocaleString()}</span>
              <button className="btn btn-primary btn-lg" onClick={() => navigate(`/enroll/${course._id}`)}>
                Enroll Now <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="course-content-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', marginTop: '2rem' }}>
          <div className="main-content">
            <div className="content-section" style={{ background: 'var(--bg-alt)', padding: '2rem', borderRadius: '16px', marginBottom: '2rem' }}>
              <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}><i className="fas fa-bullseye" style={{ color: 'var(--primary)', marginRight: '0.5rem' }}></i> What you'll learn</h2>
              <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', listStyle: 'none', padding: 0 }}>
                <li><i className="fas fa-check" style={{ color: 'var(--success)', marginRight: '0.5rem' }}></i> Master the core concepts of {course.title.split(' ')[0]}</li>
                <li><i className="fas fa-check" style={{ color: 'var(--success)', marginRight: '0.5rem' }}></i> Build real-world projects for your portfolio</li>
                <li><i className="fas fa-check" style={{ color: 'var(--success)', marginRight: '0.5rem' }}></i> Learn industry best practices and standards</li>
                <li><i className="fas fa-check" style={{ color: 'var(--success)', marginRight: '0.5rem' }}></i> Prepare for job interviews and certifications</li>
              </ul>
            </div>

            <div className="content-section" style={{ background: 'var(--bg-alt)', padding: '2rem', borderRadius: '16px', marginBottom: '2rem' }}>
              <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}><i className="fas fa-list-alt" style={{ color: 'var(--primary)', marginRight: '0.5rem' }}></i> Course Syllabus</h2>
              <div className="syllabus-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {course.lessons && course.lessons.length > 0 ? (
                  course.lessons.map((lesson, idx) => (
                    <div key={lesson._id || idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', fontWeight: 'bold' }}>{idx + 1}</div>
                        <span>{lesson.title}</span>
                      </div>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}><i className="fas fa-play-circle"></i> {Math.round(lesson.duration / 60)} mins</span>
                    </div>
                  ))
                ) : (
                  <p style={{ color: 'var(--text-muted)' }}>Syllabus is being updated.</p>
                )}
              </div>
            </div>
            
            <div className="content-section" style={{ background: 'var(--bg-alt)', padding: '2rem', borderRadius: '16px' }}>
              <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}><i className="fas fa-clipboard-list" style={{ color: 'var(--primary)', marginRight: '0.5rem' }}></i> Requirements</h2>
              <ul style={{ listStyle: 'disc', paddingLeft: '1.5rem', color: 'var(--text-muted)', lineHeight: '1.8' }}>
                <li>No prior experience is required. We will start from the basics.</li>
                <li>A computer with a stable internet connection.</li>
                <li>A strong desire to learn and practice.</li>
              </ul>
            </div>
          </div>

          <div className="sidebar-content">
            <div className="instructor-card" style={{ background: 'var(--bg-alt)', padding: '2rem', borderRadius: '16px', textAlign: 'center', position: 'sticky', top: '100px' }}>
              <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructor)}&background=6c5ce7&color=fff&size=100`} alt={course.instructor} style={{ width: '100px', height: '100px', borderRadius: '50%', marginBottom: '1rem' }} />
              <h3 style={{ marginBottom: '0.5rem' }}>{course.instructor}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>Senior Software Engineer & Educator</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>
                <span><i className="fas fa-star" style={{ color: '#fdcb6e' }}></i> 4.8</span>
                <span><i className="fas fa-user-graduate"></i> 10k+ Students</span>
              </div>
              <p style={{ fontSize: '0.9rem', color: '#ccc', lineHeight: '1.6' }}>
                Passionate about teaching and helping students achieve their career goals. With over 10 years of industry experience, {course.instructor} brings real-world knowledge to the classroom.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
