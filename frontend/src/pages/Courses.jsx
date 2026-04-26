import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Courses = () => {
  const navigate = useNavigate();
  const { API } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API}/api/courses`);
        const data = await res.json();
        if (data.success) {
          setCourses(data.courses);
          setFilteredCourses(data.courses);
        }
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [API]);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredCourses(courses);
    } else {
      setFilteredCourses(courses.filter(c => c.category === filter));
    }
  }, [filter, courses]);

  return (
    <div id="coursesPage" className="page-wrapper">
      <div className="page-hero">
        <div className="container">
          <span className="section-tag">All Programs</span>
          <h1>Explore Our <span className="gradient-text">Course Library</span></h1>
        </div>
      </div>
      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        <div className="courses-filter">
          <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
          <button className={`filter-btn ${filter === 'data-analytics' ? 'active' : ''}`} onClick={() => setFilter('data-analytics')}>Data Analytics</button>
          <button className={`filter-btn ${filter === 'programming' ? 'active' : ''}`} onClick={() => setFilter('programming')}>Programming</button>
          <button className={`filter-btn ${filter === 'design' ? 'active' : ''}`} onClick={() => setFilter('design')}>Design</button>
          <button className={`filter-btn ${filter === 'business' ? 'active' : ''}`} onClick={() => setFilter('business')}>Business</button>
        </div>
        <div className="courses-grid">
          {loading ? (
            <div className="loading-spinner"><i className="fas fa-spinner fa-spin"></i> Loading courses...</div>
          ) : filteredCourses.length === 0 ? (
            <p className="text-center" style={{ gridColumn: '1/-1' }}>No courses found in this category.</p>
          ) : (
            filteredCourses.map(course => (
              <div className="course-card reveal visible" key={course._id}>
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
    </div>
  );
};

export default Courses;
