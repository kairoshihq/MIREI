// components/chat/ChatHistoryPanel.jsx
import React from 'react';
import './ChatHistoryPanel.css';

const ChatHistoryPanel = ({ isOpen, onClose, onSelectChat }) => {
  // Mock data riwayat chat - nanti bisa diganti dengan data real dari backend
  const chatHistory = [
    {
      id: 1,
      title: 'Tentang tugas kuliah',
      preview: 'Makasih ya Mirei, aku jadi ngerti!',
      timestamp: '10 menit lalu',
      messageCount: 12,
    },
    {
      id: 2,
      title: 'Ngobrol santai',
      preview: 'wkwk iya lucu banget sih',
      timestamp: '2 jam lalu',
      messageCount: 24,
    },
    {
      id: 3,
      title: 'Curhat hari ini',
      preview: 'aku lagi capek banget nih...',
      timestamp: 'Kemarin',
      messageCount: 18,
    },
    {
      id: 4,
      title: 'Bantuan coding',
      preview: 'Gimana cara bikin function ini?',
      timestamp: 'Kemarin',
      messageCount: 31,
    },
    {
      id: 5,
      title: 'Rekomendasi film',
      preview: 'Ada film bagus gak buat weekend?',
      timestamp: '2 hari lalu',
      messageCount: 8,
    },
    {
      id: 6,
      title: 'Diskusi project',
      preview: 'Aku butuh saran untuk project ini',
      timestamp: '3 hari lalu',
      messageCount: 45,
    },
  ];

  const handleSelectChat = (chat) => {
    console.log('Selected chat:', chat);
    onSelectChat?.(chat);
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="chat-history-overlay" onClick={onClose} />
      
      {/* Panel */}
      <div className={`chat-history-panel ${isOpen ? 'chat-history-panel-open' : ''}`}>
        {/* Header */}
        <div className="chat-history-header">
          <div>
            <h3 className="chat-history-title">Riwayat Chat</h3>
            <p className="chat-history-subtitle">{chatHistory.length} percakapan</p>
          </div>
          <button className="chat-history-close" onClick={onClose} title="Tutup">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Search */}
        <div className="chat-history-search">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Cari percakapan..."
            className="chat-history-search-input"
          />
        </div>

        {/* List */}
        <div className="chat-history-list">
          {chatHistory.map((chat, index) => (
            <button
              key={chat.id}
              className="chat-history-item"
              style={{ animationDelay: `${index * 0.04}s` }}
              onClick={() => handleSelectChat(chat)}
            >
              <div className="chat-history-item-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                </svg>
              </div>
              <div className="chat-history-item-content">
                <div className="chat-history-item-header">
                  <span className="chat-history-item-title">{chat.title}</span>
                  <span className="chat-history-item-time">{chat.timestamp}</span>
                </div>
                <div className="chat-history-item-preview">{chat.preview}</div>
                <div className="chat-history-item-meta">
                  <span className="chat-history-item-count">
                    {chat.messageCount} pesan
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="chat-history-footer">
          <button className="chat-history-footer-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14H6L5 6"/>
              <path d="M10 11v6M14 11v6"/>
              <path d="M9 6V4h6v2"/>
            </svg>
            Hapus Semua
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatHistoryPanel;
