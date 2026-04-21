// components/common/Button/Button.jsx
import React from 'react';
import './Button.css';

export { default as IconButton } from './IconButton';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = '',
  style = {},
  title,
  ...props
}) => {
  const buttonClass = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    disabled && 'btn-disabled',
    loading && 'btn-loading',
    icon && 'btn-with-icon',
    className
  ].filter(Boolean).join(' ');

  const handleClick = (e) => {
    if (!disabled && !loading && onClick) {
      onClick(e);
    }
  };

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={handleClick}
      disabled={disabled || loading}
      title={title}
      style={style}
      {...props}
    >
      {loading && (
        <div className="btn-spinner">
          <div className="spinner-dot" />
          <div className="spinner-dot" />
          <div className="spinner-dot" />
        </div>
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <span className="btn-icon btn-icon-left">{icon}</span>
      )}
      
      {!loading && children && (
        <span className="btn-content">{children}</span>
      )}
      
      {!loading && icon && iconPosition === 'right' && (
        <span className="btn-icon btn-icon-right">{icon}</span>
      )}
    </button>
  );
};

export default Button;