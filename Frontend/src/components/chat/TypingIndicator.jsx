// components/chat/TypingIndicator.jsx
import React from 'react';

const TypingIndicator = ({ characterName = 'Mirei' }) => {
  return (
    <div className="typing-wrapper">
      <div className="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <span className="typing-text">{characterName} sedang mengetik...</span>
    </div>
  );
};

export default TypingIndicator;