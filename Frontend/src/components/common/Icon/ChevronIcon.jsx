import React from 'react';

const ChevronIcon = ({ size = 16, color = 'currentColor', className = '', direction = 'right' }) => {
  const rotations = {
    right: 0,
    down: 90,
    left: 180,
    up: 270,
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={{ transform: `rotate(${rotations[direction]}deg)` }}
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
};

export default ChevronIcon;
