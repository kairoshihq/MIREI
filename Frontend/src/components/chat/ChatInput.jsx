// components/chat/ChatInput.jsx
import React, { useState } from 'react';

const ChatInput = ({ onSend, disabled, placeholder = "Ketik pesan..." }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !disabled && onSend) {
      onSend(input.trim());
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className="chat-input-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="chat-input-field"
        autoFocus
      />
      <button 
        type="submit" 
        disabled={disabled || !input.trim()}
        className="send-button"
      >
        Kirim
      </button>
    </form>
  );
};

export default ChatInput;