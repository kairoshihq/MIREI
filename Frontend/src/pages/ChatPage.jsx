// pages/ChatPage.jsx
import React, { useState } from 'react';
import useChat from '../hooks/useChat';
import ChatWindow from '../components/chat/ChatWindow';
import ChatInput from '../components/chat/ChatInput';

// Data Mirei (bisa pindah ke constants.js nanti)
const MIREI = {
  id: 'mirei_001',
  name: 'Mirei',
  avatar: '/assets/mirei-avatar.png',
  greeting: 'Halo! Aku Mirei, asisten virtualmu. Ada yang bisa aku bantu hari ini?'
};

const ChatPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const { messages, sendMessage, isLoading, clearChat } = useChat(MIREI);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <div className="chat-page">
      {/* Header */}
      <div className="chat-header">
        <div className="header-left">
          <div className="avatar-container">
            <span className="avatar-emoji">🌸</span>
          </div>
          <div className="header-info">
            <h2>{MIREI.name}</h2>
            <span className={`status ${isLoading ? 'typing' : ''}`}>
              {isLoading ? 'Mengetik...' : 'Online'}
            </span>
          </div>
        </div>
        <div className="header-actions">
          <button onClick={toggleTheme} className="theme-toggle" title="Ganti tema">
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button onClick={clearChat} className="clear-button" title="Hapus percakapan">
            🗑️
          </button>
        </div>
      </div>

      {/* Chat Window */}
      <ChatWindow 
        messages={messages} 
        isLoading={isLoading}
        character={MIREI}
      />

      {/* Chat Input */}
      <ChatInput 
        onSend={sendMessage} 
        disabled={isLoading}
        placeholder={`Ketik pesan untuk ${MIREI.name}...`}
      />
    </div>
  );
};

export default ChatPage;