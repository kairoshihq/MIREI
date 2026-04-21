import React from 'react';

const FlowerIcon = ({ size = 16, color = 'currentColor', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2a3 3 0 013 3c0 1.5-1 2.5-3 2.5S9 6.5 9 5a3 3 0 013-3z" />
    <path d="M12 22a3 3 0 01-3-3c0-1.5 1-2.5 3-2.5s3 1 3 2.5a3 3 0 01-3 3z" />
    <path d="M2 12a3 3 0 013-3c1.5 0 2.5 1 2.5 3S6.5 15 5 15a3 3 0 01-3-3z" />
    <path d="M22 12a3 3 0 01-3 3c-1.5 0-2.5-1-2.5-3s1-3 2.5-3a3 3 0 013 3z" />
    <path d="M6.34 6.34a3 3 0 014.24 0c1.06 1.06.94 2.83 0 3.77-1.06 1.06-2.71 1.06-3.77 0a3 3 0 010-4.24z" />
    <path d="M17.66 17.66a3 3 0 01-4.24 0c-1.06-1.06-.94-2.83 0-3.77 1.06-1.06 2.71-1.06 3.77 0a3 3 0 010 4.24z" />
    <path d="M6.34 17.66a3 3 0 010-4.24c1.06-1.06 2.83-.94 3.77 0 1.06 1.06 1.06 2.71 0 3.77a3 3 0 01-4.24 0z" />
    <path d="M17.66 6.34a3 3 0 000 4.24c-1.06 1.06-2.83.94-3.77 0-1.06-1.06-1.06-2.71 0-3.77a3 3 0 014.24 0z" />
  </svg>
);

export default FlowerIcon;
