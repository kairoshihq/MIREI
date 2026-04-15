// components/common/Toast/ToastContainer.jsx
import React from 'react';
import Toast from './Toast';
import './Toast.css';

const ToastContainer = ({ toasts, onRemove }) => {
  if (!toasts || toasts.length === 0) return null;
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <Toast key={t.id} {...t} onRemove={onRemove} />
      ))}
    </div>
  );
};

export default ToastContainer;
