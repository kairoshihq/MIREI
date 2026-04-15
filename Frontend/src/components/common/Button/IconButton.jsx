// components/common/Button/IconButton.jsx
// Tombol icon kecil yang dipakai di topbar chat, sidebar, dll
import React from 'react';
import './Button.css';

const IconButton = ({ icon, onClick, title, size = 'medium', variant = 'icon-only', className = '', style = {}, disabled = false }) => {
  const cls = ['btn', `btn-${variant}`, `btn-${size}`, disabled && 'btn-disabled', className]
    .filter(Boolean).join(' ');

  return (
    <button
      type="button"
      className={cls}
      onClick={onClick}
      title={title}
      disabled={disabled}
      style={style}
    >
      {icon}
    </button>
  );
};

export default IconButton;
