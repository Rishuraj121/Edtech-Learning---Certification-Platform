import React from 'react';

const Toast = ({ toast }) => {
  if (!toast.visible) return null;

  return (
    <div className="toast-container" id="toastContainer" style={{ pointerEvents: 'none' }}>
      <div className={`toast toast-${toast.type} show`} style={{ pointerEvents: 'auto' }}>
        <i className={`fas fa-${toast.type === 'success' ? 'check-circle' : toast.type === 'error' ? 'exclamation-circle' : 'info-circle'}`}></i>
        <span>{toast.message}</span>
      </div>
    </div>
  );
};

export default Toast;
