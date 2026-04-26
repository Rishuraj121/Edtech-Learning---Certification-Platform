import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UIContext } from '../App';

const Home = () => {
  const navigate = useNavigate();
  const { API, user } = useContext(AuthContext);
  const { openModal } = useContext(UIContext);
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
      {/* 1. Hero Section */}
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

      {/* 2. Trusted By Section (Social Proof) */}
      <section className="trusted-by" style={{ padding: '3rem 0', borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', background: 'rgba(0,0,0,0.2)' }}>
        <div className="container">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '1.5rem' }}>Our Alumni Work At</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap', opacity: 0.6, fontSize: '1.5rem', fontWeight: 'bold' }}>
            <span><i className="fab fa-google"></i> Google</span>
            <span><i className="fab fa-microsoft"></i> Microsoft</span>
            <span><i className="fab fa-amazon"></i> Amazon</span>
            <span><i className="fab fa-meta"></i> Meta</span>
            <span><i className="fab fa-apple"></i> Apple</span>
          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section className="section features" style={{ padding: '5rem 0' }}>
        <div className="container">
          <div className="section-header reveal">
            <span className="section-tag">Why Choose Us</span>
            <h2>Learn Faster, <span className="gradient-text">Smarter</span></h2>
          </div>
          <div className="benefits-grid" style={{ marginTop: '3rem' }}>
            <div className="benefit-card reveal">
              <i className="fas fa-clock" style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '1rem' }}></i>
              <h4>Self-Paced Learning</h4>
              <p>No deadlines. Learn completely at your own pace with lifetime access to all course materials.</p>
            </div>
            <div className="benefit-card reveal">
              <i className="fas fa-chalkboard-teacher" style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '1rem' }}></i>
              <h4>Expert Instructors</h4>
              <p>Learn directly from industry professionals with years of real-world experience.</p>
            </div>
            <div className="benefit-card reveal">
              <i className="fas fa-certificate" style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '1rem' }}></i>
              <h4>Verifiable Certificates</h4>
              <p>Earn a unique, verifiable PDF certificate upon completing every course.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Top Courses Section */}
      <section className="section courses" id="courses-home" style={{ background: 'var(--bg-alt)' }}>
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
          <div className="text-center" style={{ marginTop: '3rem' }}>
             <button className="btn btn-outline btn-lg" onClick={() => navigate('/courses')}>View All Courses <i className="fas fa-arrow-right"></i></button>
          </div>
        </div>
      </section>

      {/* 5. Statistics Section */}
      <section className="stats-section" style={{ padding: '4rem 0', background: 'linear-gradient(135deg, var(--bg-alt), var(--bg-main))', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '2rem', textAlign: 'center' }}>
            <div className="stat-box reveal">
              <h2 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>50K+</h2>
              <p style={{ color: 'var(--text-muted)' }}>Active Learners</p>
            </div>
            <div className="stat-box reveal">
              <h2 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>98%</h2>
              <p style={{ color: 'var(--text-muted)' }}>Completion Rate</p>
            </div>
            <div className="stat-box reveal">
              <h2 className="gradient-text" style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>4.9/5</h2>
              <p style={{ color: 'var(--text-muted)' }}>Average Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials Section */}
      <section className="section testimonials" style={{ padding: '5rem 0' }}>
        <div className="container">
          <div className="section-header reveal">
            <span className="section-tag">Success Stories</span>
            <h2>What Our <span className="gradient-text">Students Say</span></h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '3rem' }}>
            <div className="review-card reveal" style={{ background: 'var(--bg-alt)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', color: '#f1c40f', marginBottom: '1rem' }}><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i></div>
              <p style={{ fontStyle: 'italic', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>"The Data Analytics course completely changed my career trajectory. Within 3 months of completing it, I landed a job at a top tech company."</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF9A9E, #FECFEF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#000' }}>SJ</div>
                <div><h5 style={{ margin: 0 }}>Sarah Jenkins</h5><p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--primary-light)' }}>Data Analyst</p></div>
              </div>
            </div>
            <div className="review-card reveal" style={{ background: 'var(--bg-alt)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', color: '#f1c40f', marginBottom: '1rem' }}><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i></div>
              <p style={{ fontStyle: 'italic', marginBottom: '1.5rem', color: 'var(--text-muted)' }}>"I tried learning Python on my own but kept getting stuck. The structured reading modules here made complex concepts incredibly easy to grasp."</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'linear-gradient(135deg, #a18cd1, #fbc2eb)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#000' }}>MR</div>
                <div><h5 style={{ margin: 0 }}>Michael Rodriguez</h5><p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--primary-light)' }}>Backend Developer</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Final Call to Action */}
      <section className="cta-section" style={{ padding: '6rem 0', textAlign: 'center', background: 'linear-gradient(135deg, rgba(108, 92, 231, 0.2), rgba(162, 155, 254, 0.1))', position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Ready to <span className="gradient-text">accelerate</span> your career?</h2>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2rem' }}>Join over 50,000 learners and start building the skills that top employers are looking for today.</p>
          {!user ? (
            <button className="btn btn-primary btn-lg" style={{ transform: 'scale(1.1)' }} onClick={() => openModal('signup')}>
              Join For Free Today <i className="fas fa-rocket"></i>
            </button>
          ) : (
            <button className="btn btn-primary btn-lg" style={{ transform: 'scale(1.1)' }} onClick={() => navigate('/courses')}>
              Browse All Courses <i className="fas fa-search"></i>
            </button>
          )}
        </div>
      </section>

    </div>
  );
};

export default Home;
