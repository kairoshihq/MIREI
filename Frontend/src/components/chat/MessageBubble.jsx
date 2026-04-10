// components/chat/MessageBubble.jsx
import React from 'react';

const MessageBubble = ({ message, characterAvatar }) => {
  const isUser = message.role === 'user';
  const isError = message.isError;

  return (
    <div className={`message-wrapper ${isUser ? 'user' : 'assistant'}`}>
      {!isUser && (
        <img src={characterAvatar} alt="AI" className="message-avatar" />
      )}
      
      <div className={`message-bubble ${isUser ? 'user-bubble' : 'assistant-bubble'} ${isError ? 'error' : ''}`}>
        <div className="message-content">{message.content}</div>
        {message.timestamp && (
          <div className="message-time">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>
      
      {isUser && (
        <div className="message-avatar user-avatar-placeholder">👤</div>
      )}
    </div>
  );
};

export default MessageBubble;