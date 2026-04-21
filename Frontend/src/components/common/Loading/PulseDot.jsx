// components/common/Loading/PulseDot.jsx
// Status dot yang beranimasi — dipakai di ChatPage topbar, Sidebar, dll
import React from 'react';

const PulseDot = ({ color = '#10b981', animate = false, size = 5, style = {} }) => (
  <div
    style={{
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      background: color,
      animation: animate ? 'livePulseDot 1s infinite' : 'none',
      flexShrink: 0,
      ...style,
    }}
  />
);

export default PulseDot;
