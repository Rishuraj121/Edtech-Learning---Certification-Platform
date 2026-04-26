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
        <div className="details-header">
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
      </div>
    </div>
  );
};

export default CourseDetails;
