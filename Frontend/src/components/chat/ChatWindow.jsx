// components/chat/ChatWindow.jsx
import React, { useRef, useEffect, useState } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

const NEW_CHAT_TEXT = 'Start New Chat';

const NewChatEmptyState = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // small delay so animation triggers after mount
    const t = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', gap: '0.04em' }}>
        {NEW_CHAT_TEXT.split('').map((char, i) => (
          <span
            key={i}
            style={{
              display: 'inline-block',
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 700,
              letterSpacing: '-0.01em',
              color: 'transparent',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              backgroundImage: 'linear-gradient(135deg, #a78bfa, #ec4899)',
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(24px)',
              transition: `opacity 0.4s ease ${i * 0.04}s, transform 0.4s ease ${i * 0.04}s`,
              whiteSpace: 'pre',
            }}
          >
            {char}
          </span>
        ))}
      </div>
    </div>
  );
};

const ChatWindow = ({ messages, isLoading, character }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!messages || messages.length === 0) {
    return (
      <div className="chat-window empty" style={{ display: 'flex', flexDirection: 'column' }}>
        <NewChatEmptyState />
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