import React from 'react';
import { useNavigate } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();

  return (
    <div id="successPage" className="page-wrapper">
      <div className="container text-center">
        <div className="success-card">
          <div className="success-icon"><i className="fas fa-check-circle"></i></div>
          <h2>Enrollment Successful!</h2>
          <p>Congratulations! You're now enrolled. Head to your dashboard to start learning.</p>
          <div className="success-actions">
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>Go to Dashboard <i className="fas fa-tachometer-alt"></i></button>
            <button className="btn btn-outline" onClick={() => navigate('/')}>Back to Home</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Success;
