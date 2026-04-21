// components/chat/MessageBubble.jsx
import React from 'react';

const MessageBubble = ({ message, characterAvatar }) => {
  const isUser = message.role === 'user';
  const isError = message.isError;

  return (
    <div className={`message-wrapper ${isUser ? 'user' : 'assistant'}`}>
      {!isUser && (
        <img
          src={characterAvatar}
          alt="Mirei"
          className="message-avatar"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      )}

      <div className={`message-bubble ${isUser ? 'user-bubble' : 'assistant-bubble'} ${isError ? 'error' : ''}`}>
        <div className="message-content">{message.content}</div>
        {message.timestamp && (
          <div className="message-time">
            {new Date(message.timestamp).toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        )}
      </div>

      {isUser && (
        <div className="user-avatar-placeholder">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
          </svg>
        </div>
      )}
    </div>
  );
};

export default MessageBubble;