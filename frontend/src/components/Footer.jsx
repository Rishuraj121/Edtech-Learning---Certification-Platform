import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="logo">
              <i className="fas fa-graduation-cap"></i> Skill<span>Hub</span>
            </Link>
            <p>Empowering careers through quality online education since 2016. Build your future with world-class instruction.</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
              <a href="#" style={{ color: 'var(--text-muted)', fontSize: '1.2rem', transition: '0.3s' }} onMouseOver={(e) => e.target.style.color = '#1DA1F2'} onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}><i className="fab fa-twitter"></i></a>
              <a href="#" style={{ color: 'var(--text-muted)', fontSize: '1.2rem', transition: '0.3s' }} onMouseOver={(e) => e.target.style.color = '#0A66C2'} onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}><i className="fab fa-linkedin"></i></a>
              <a href="#" style={{ color: 'var(--text-muted)', fontSize: '1.2rem', transition: '0.3s' }} onMouseOver={(e) => e.target.style.color = '#E1306C'} onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}><i className="fab fa-instagram"></i></a>
              <a href="#" style={{ color: 'var(--text-muted)', fontSize: '1.2rem', transition: '0.3s' }} onMouseOver={(e) => e.target.style.color = '#FF0000'} onMouseOut={(e) => e.target.style.color = 'var(--text-muted)'}><i className="fab fa-youtube"></i></a>
            </div>
          </div>
          
          <div className="footer-links">
            <h4>Platform</h4>
            <Link to="/courses">Browse Courses</Link>
            <Link to="/dashboard">Student Dashboard</Link>
            <Link to="/certificate">Verify Certificate</Link>
          </div>

          <div className="footer-links">
            <h4>Company</h4>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact Support</Link>
            <a href="#">Careers</a>
          </div>

          <div className="footer-links">
            <h4>Legal</h4>
            <a href="#">Terms of Service</a>
            <a href="#">Privacy Policy</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} SkillHub Education. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
