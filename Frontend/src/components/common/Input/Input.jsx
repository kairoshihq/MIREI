// components/common/Input/Input.jsx
import React from 'react';
import './Input.css';

const Input = ({
  value,
  onChange,
  onKeyDown,
  placeholder = '',
  disabled = false,
  type = 'text',
  className = '',
  style = {},
  autoFocus = false,
  ...props
}) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    onKeyDown={onKeyDown}
    placeholder={placeholder}
    disabled={disabled}
    className={`common-input ${className}`}
    style={style}
    autoFocus={autoFocus}
    {...props}
  />
);

export default Input;
