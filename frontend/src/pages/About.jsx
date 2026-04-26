import React from 'react';

const About = () => {
  return (
    <div id="aboutPage" className="page-wrapper">
      <div className="page-hero">
        <div className="container">
          <span className="section-tag">Our Story</span>
          <h1>About <span className="gradient-text">SkillHub</span></h1>
          <p>A modern EdTech platform built to democratize professional skill development.</p>
        </div>
      </div>
      <div className="container about-page-body">
        <div className="about-grid">
          <div className="about-visual">
            <div className="about-icon-grid">
              <div className="about-icon-card"><i className="fas fa-laptop-code"></i></div>
              <div className="about-icon-card"><i className="fas fa-chart-line"></i></div>
              <div className="about-icon-card"><i className="fas fa-brain"></i></div>
              <div className="about-icon-card"><i className="fas fa-award"></i></div>
            </div>
            <div className="about-stats-row">
              <div className="about-stat"><span>16+</span>Years Experience</div>
              <div className="about-stat"><span>50K+</span>Students Trained</div>
            </div>
          </div>
          <div className="about-text">
            <h2>Empowering Careers Through <span className="gradient-text">Quality Education</span></h2>
            <p>SkillHub is a modern e-learning platform established with a mission to make professional skill development accessible. We specialize in data analytics, programming, office productivity, and digital creation modules.</p>
            <p>Our programs are crafted not just to teach — but to ignite passion for continuous learning. With proven track records of helping learners land positions at top companies, we're committed to your success.</p>
          </div>
        </div>
        <div className="about-benefits">
          <h2 className="text-center" style={{ marginBottom: '2rem' }}>Student <span className="gradient-text">Benefits</span></h2>
          <div className="benefits-grid">
            <div className="benefit-card"><i className="fas fa-book-reader"></i><h4>Expert Reading</h4><p>Curated reading modules designed for focused, distraction-free learning.</p></div>
            <div className="benefit-card"><i className="fas fa-chart-bar"></i><h4>Progress Dashboard</h4><p>Track completion with visual progress bars and resume anytime.</p></div>
            <div className="benefit-card"><i className="fas fa-certificate"></i><h4>Instant Certificates</h4><p>Download a professional PDF certificate upon course completion.</p></div>
            <div className="benefit-card"><i className="fas fa-headset"></i><h4>Dedicated Support</h4><p>Expert support team available Monday to Saturday, 9AM–6PM.</p></div>
            <div className="benefit-card"><i className="fas fa-mobile-alt"></i><h4>Mobile Friendly</h4><p>Learn on any device — phone, tablet, or desktop — anytime.</p></div>
            <div className="benefit-card"><i className="fas fa-infinity"></i><h4>Lifetime Access</h4><p>Once enrolled, access course content forever — no expiry.</p></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
