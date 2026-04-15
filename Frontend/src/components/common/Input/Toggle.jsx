// components/common/Input/Toggle.jsx
// Dipakai di SettingsPage
import React from 'react';
import './Input.css';

const Toggle = ({ value, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!value)}
    className={`settings-toggle ${value ? 'settings-toggle-active' : 'settings-toggle-inactive'}`}
  >
    <div className={`settings-toggle-knob ${value ? 'settings-toggle-knob-active' : 'settings-toggle-knob-inactive'}`} />
  </button>
);

export default Toggle;
