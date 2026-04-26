import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="#" className="logo"><i className="fas fa-graduation-cap"></i> Skill<span>Hub</span></a>
            <p>Empowering careers through quality online education since 2016.</p>
          </div>
          <div className="footer-links"><h4>Platform</h4><a href="#">All Courses</a><a href="#">About</a></div>
        </div>
        <div className="footer-bottom"><p>&copy; 2026 SkillHub. All Rights Reserved.</p></div>
      </div>
    </footer>
  );
};

export default Footer;
