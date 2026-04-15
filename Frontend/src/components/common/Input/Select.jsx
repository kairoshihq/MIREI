// components/common/Input/Select.jsx
// Dipakai di SettingsPage
import React from 'react';
import './Input.css';

const Select = ({ value, onChange, options = [], className = '', style = {} }) => (
  <select
    value={value}
    onChange={onChange}
    className={`settings-select ${className}`}
    style={style}
  >
    {options.map(opt => (
      <option key={opt.value} value={opt.value}>{opt.label}</option>
    ))}
  </select>
);

export default Select;
