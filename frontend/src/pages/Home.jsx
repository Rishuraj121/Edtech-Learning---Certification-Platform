import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { API } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API}/api/courses`);
        const data = await res.json();
        if (data.success) {
          setCourses(data.courses.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      }
    };
    fetchCourses();
  }, [API]);

  return (
    <div id="homePage">
      <section className="hero" id="hero">
        <div className="hero-bg"><div className="orb orb1"></div><div className="orb orb2"></div><div className="orb orb3"></div></div>
        <div className="container hero-content">
          <div className="hero-badge"><i className="fas fa-bolt"></i> Next-Gen E-Learning</div>
          <h1>Master Skills That<br/>Accelerate Your <span className="gradient-text">Career</span></h1>
          <p className="hero-sub">Career-focused programs at accessible prices — sharpen expertise and unlock better opportunities.</p>
          <div className="hero-cta">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/courses')}>Explore Courses <i className="fas fa-arrow-right"></i></button>
          </div>
        </div>
      </section>

      <section className="section courses" id="courses-home">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-tag">Our Programs</span>
            <h2>Explore Our <span className="gradient-text">Top Courses</span></h2>
          </div>
          <div className="courses-grid" id="homeCoursesGrid">
            {courses.length === 0 ? (
              <div className="loading-spinner"><i className="fas fa-spinner fa-spin"></i> Loading courses...</div>
            ) : (
              courses.map(course => (
                <div className="course-card reveal" key={course._id}>
                  <div className="course-thumb" style={{ background: 'linear-gradient(135deg,#6c5ce7,#a29bfe)' }}>
                    <i className={`fas ${course.icon || 'fa-laptop-code'}`}></i>
                  </div>
                  <div className="course-body">
                    <h3>{course.title}</h3>
                    <p>{course.description}</p>
                    <div className="course-footer">
                      <span className="course-price">₹{(course.price || 0).toLocaleString()}</span>
                      <button className="btn btn-primary" onClick={() => navigate(`/courses/${course._id}`)}>Details</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
