import React, { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { UIContext } from '../App';

const Modals = () => {
  const { API, login } = useContext(AuthContext);
  const { activeModal, openModal, closeModal, showToast } = useContext(UIContext);

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm)
      });
      const data = await res.json();
      if (data.success) {
        login(data.token, data.user);
        showToast('Logged in successfully', 'success');
        closeModal();
      } else {
        showToast(data.message || 'Login failed', 'error');
      }
    } catch (err) {
      showToast('An error occurred during login', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signupForm)
      });
      const data = await res.json();
      if (data.success) {
        login(data.token, data.user);
        showToast('Registered successfully', 'success');
        closeModal();
      } else {
        showToast(data.message || 'Signup failed', 'error');
      }
    } catch (err) {
      showToast('An error occurred during signup', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={`modal-overlay ${activeModal === 'login' ? 'active' : ''}`} id="loginModal">
        <div className="modal">
          <button className="modal-close" onClick={closeModal}>&times;</button>
          <h2><i className="fas fa-sign-in-alt"></i> Welcome Back</h2>
          <p>Login to access your dashboard and courses.</p>
          <form id="loginForm" onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label htmlFor="loginEmail">Email</label>
              <input type="email" id="loginEmail" required placeholder="your@email.com"
                value={loginForm.email} onChange={e => setLoginForm({ ...loginForm, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label htmlFor="loginPassword">Password</label>
              <input type="password" id="loginPassword" required placeholder="••••••••"
                value={loginForm.password} onChange={e => setLoginForm({ ...loginForm, password: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Processing...' : <>Login <i className="fas fa-arrow-right"></i></>}
            </button>
          </form>
          <p className="modal-switch">Don't have an account? <a href="#" onClick={(e) => { e.preventDefault(); openModal('signup'); }}>Sign Up</a></p>
        </div>
      </div>

      <div className={`modal-overlay ${activeModal === 'signup' ? 'active' : ''}`} id="signupModal">
        <div className="modal">
          <button className="modal-close" onClick={closeModal}>&times;</button>
          <h2><i className="fas fa-user-plus"></i> Create Account</h2>
          <p>Join SkillHub and start learning today.</p>
          <form id="signupForm" onSubmit={handleSignupSubmit}>
            <div className="form-group">
              <label htmlFor="signupName">Full Name</label>
              <input type="text" id="signupName" required placeholder="John Doe"
                value={signupForm.name} onChange={e => setSignupForm({ ...signupForm, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label htmlFor="signupEmail">Email</label>
              <input type="email" id="signupEmail" required placeholder="your@email.com"
                value={signupForm.email} onChange={e => setSignupForm({ ...signupForm, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label htmlFor="signupPassword">Password</label>
              <input type="password" id="signupPassword" required minLength="6" placeholder="Min 6 characters"
                value={signupForm.password} onChange={e => setSignupForm({ ...signupForm, password: e.target.value })} />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Processing...' : <>Create Account <i className="fas fa-arrow-right"></i></>}
            </button>
          </form>
          <p className="modal-switch">Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); openModal('login'); }}>Login</a></p>
        </div>
      </div>
    </>
  );
};

export default Modals;
