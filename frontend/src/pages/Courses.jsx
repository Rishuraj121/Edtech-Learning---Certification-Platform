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
  const [searchQuery, setSearchQuery] = useState('');

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
    let result = courses;
    
    if (filter !== 'all') {
      result = result.filter(c => c.category === filter);
    }
    
    if (searchQuery.trim() !== '') {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(c => 
        c.title.toLowerCase().includes(lowerQuery) || 
        c.description.toLowerCase().includes(lowerQuery)
      );
    }
    
    setFilteredCourses(result);
  }, [filter, searchQuery, courses]);

  return (
    <div id="coursesPage" className="page-wrapper">
      <div className="page-hero">
        <div className="container">
          <span className="section-tag">All Programs</span>
          <h1>Explore Our <span className="gradient-text">Course Library</span></h1>
        </div>
      </div>
      <div className="container" style={{ padding: '3rem 1.5rem' }}>
        
        <div className="search-container" style={{ marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem auto', position: 'relative' }}>
          <i className="fas fa-search" style={{ position: 'absolute', left: '1.5rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', fontSize: '1.2rem' }}></i>
          <input 
            type="text" 
            placeholder="Search courses by title or keyword..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '1.2rem 1.5rem 1.2rem 3.5rem', 
              borderRadius: '30px', 
              border: '2px solid rgba(108, 92, 231, 0.3)', 
              background: 'var(--bg-lighter)', 
              color: 'var(--text-main)',
              fontSize: '1.1rem',
              outline: 'none',
              boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.2)',
              transition: 'all 0.3s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary-light)'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(108, 92, 231, 0.3)'}
          />
        </div>

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
