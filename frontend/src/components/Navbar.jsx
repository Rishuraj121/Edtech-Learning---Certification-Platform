import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { UIContext } from '../App';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { openModal } = useContext(UIContext);
  const navigate = useNavigate();

  return (
    <nav className="navbar" id="navbar">
      <div className="nav-inner">
        <Link to="/" className="logo">
          <i className="fas fa-graduation-cap"></i> Skill<span>Hub</span>
        </Link>
        <ul className="nav-links" id="navLinks">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/courses">Courses</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/dashboard">Dashboard</Link></li>
          {user?.role === 'admin' && <li><Link to="/admin" style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>Admin</Link></li>}
        </ul>
        <div className="nav-actions">
          {user ? (
            <div className="user-menu" id="userMenu">
              <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>
                <i className="fas fa-user-circle"></i> <span>{user.name}</span>
              </button>
              <button className="btn btn-outline" onClick={logout}>Logout</button>
            </div>
          ) : (
            <>
              <button className="btn btn-outline" onClick={() => openModal('login')}>Login</button>
              <button className="btn btn-primary" onClick={() => openModal('signup')}>Sign Up</button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
