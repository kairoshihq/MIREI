// components/chat/ChatWindow.jsx
import React, { useRef, useEffect } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

const ChatWindow = ({ messages, isLoading, character }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!messages || messages.length === 0) {
    return (
      <div className="chat-window empty">
        <div className="welcome-message">
          <img src={character.avatar} alt={character.name} className="welcome-avatar" />
          <h3>{character.name}</h3>
          <p>{character.greeting}</p>
        </div>
        <div ref={bottomRef} />
      </div>
    );
  }

  return (
    <div className="chat-window">
      {messages.map((message) => (
        <MessageBubble 
          key={message.id} 
          message={message}
          characterAvatar={character.avatar}
        />
      ))}
      {isLoading && <TypingIndicator characterName={character.name} />}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatWindow;