import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { UIContext } from '../App';

const Contact = () => {
  const { API } = useContext(AuthContext);
  const { showToast } = useContext(UIContext);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (data.success) {
        showToast(data.message || 'Message sent successfully!', 'success');
        setFormData({ name: '', email: '', message: '' });
      } else {
        showToast(data.message || 'Failed to send message', 'error');
      }
    } catch (err) {
      console.error('Contact error:', err);
      showToast('An error occurred while sending your message', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="contactPage" className="page-wrapper">
      <div className="container" style={{ padding: '4rem 1rem' }}>
        <div className="section-header text-center">
          <span className="section-tag">Get In Touch</span>
          <h2>Contact <span className="gradient-text">Us</span></h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '1rem', maxWidth: '600px', margin: '1rem auto 3rem' }}>
            Have a question about our courses, pricing, or your account? Fill out the form below and our support team will get back to you within 24 hours.
          </p>
        </div>

        <div style={{ maxWidth: '600px', margin: '0 auto', background: 'var(--bg-alt)', padding: '3rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Full Name</label>
              <input 
                type="text" 
                name="name" 
                className="form-control" 
                placeholder="John Doe" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                style={{ width: '100%', padding: '1rem', background: 'var(--bg-main)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
              />
            </div>
            
            <div className="form-group" style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email Address</label>
              <input 
                type="email" 
                name="email" 
                className="form-control" 
                placeholder="john@example.com" 
                value={formData.email} 
                onChange={handleChange} 
                required 
                style={{ width: '100%', padding: '1rem', background: 'var(--bg-main)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>How can we help you?</label>
              <textarea 
                name="message" 
                className="form-control" 
                placeholder="Describe your issue or question here..." 
                rows="5" 
                value={formData.message} 
                onChange={handleChange} 
                required 
                style={{ width: '100%', padding: '1rem', background: 'var(--bg-main)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff', resize: 'vertical' }}
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }} disabled={loading}>
              {loading ? <><i className="fas fa-spinner fa-spin"></i> Sending...</> : <><i className="fas fa-paper-plane"></i> Send Message</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
