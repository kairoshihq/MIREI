// components/chat/ChatHistoryPanel.jsx
import React, { useState, useEffect } from 'react';
import { getChatSessions, deleteSession, deleteAllSessions } from '../../services/chat';
import './ChatHistoryPanel.css';

const ChatHistoryPanel = ({ isOpen, onClose, onSelectChat }) => {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const sidebar = document.querySelector('.app-shell > div:first-child');
      if (sidebar) setSidebarWidth(sidebar.getBoundingClientRect().width);
      setMounted(true);
      requestAnimationFrame(() => setVisible(true));
      fetchSessions();
    } else {
      setVisible(false);
      const timer = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Update waktu relatif setiap menit
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => setTick(t => t + 1), 60000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const fetchSessions = async () => {
    setLoading(true);
    const data = await getChatSessions();
    setSessions(data);
    setLoading(false);
  };

  const handleDelete = async (e, sessionId) => {
    e.stopPropagation();
    await deleteSession(sessionId);
    setSessions(prev => prev.filter(s => s.id !== sessionId));
  };

  const handleDeleteAll = async () => {
    await deleteAllSessions();
    setSessions([]);
  };

  const filtered = sessions.filter(s =>
    s.title?.toLowerCase().includes(search.toLowerCase()) ||
    s.preview?.toLowerCase().includes(search.toLowerCase())
  );

  const formatTime = (dateStr) => {
    if (!dateStr) return '';
    // Pastikan string diparsing sebagai UTC jika tidak ada timezone info
    const normalized = dateStr.includes('T') ? dateStr : dateStr.replace(' ', 'T') + 'Z';
    const date = new Date(normalized);
    if (isNaN(date)) return '';
    const diffMs = Date.now() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMs / 3600000);
    const diffDay = Math.floor(diffMs / 86400000);
    if (diffMin < 1) return 'Baru saja';
    if (diffMin < 60) return `${diffMin} menit lalu`;
    if (diffHour < 24) return `${diffHour} jam lalu`;
    if (diffDay === 1) return 'Kemarin';
    return `${diffDay} hari lalu`;
  };

  if (!mounted) return null;

  return (
    <>
      <div className={`chat-history-overlay ${visible ? 'chat-history-overlay-visible' : ''}`} onClick={onClose} />
      <div className={`chat-history-panel ${visible ? 'chat-history-panel-open' : ''}`} style={{ left: sidebarWidth }}>
        {/* Header */}
        <div className="chat-history-header">
          <div>
            <h3 className="chat-history-title">Riwayat Chat</h3>
            <p className="chat-history-subtitle">{sessions.length} percakapan</p>
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
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* List */}
        <div className="chat-history-list">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '32px', color: 'var(--t3)', fontSize: '13px' }}>
              Memuat riwayat...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px', color: 'var(--t3)', fontSize: '13px' }}>
              {search ? 'Tidak ada hasil' : 'Belum ada riwayat chat'}
            </div>
          ) : (
            filtered.map((chat, index) => (
              <button
                key={chat.id}
                className="chat-history-item"
                style={{ animationDelay: `${index * 0.04}s` }}
                onClick={() => { onSelectChat?.(chat); onClose?.(); }}
              >
                <div className="chat-history-item-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
                  </svg>
                </div>
                <div className="chat-history-item-content">
                  <div className="chat-history-item-header">
                    <span className="chat-history-item-title">{chat.title}</span>
                    <span className="chat-history-item-time">{formatTime(chat.updated_at)}</span>
                  </div>
                  <div className="chat-history-item-preview">{chat.preview || '—'}</div>
                  <div className="chat-history-item-meta">
                    <span className="chat-history-item-count">{chat.message_count} pesan</span>
                  </div>
                </div>
                {/* Tombol hapus per item */}
                <button
                  onClick={(e) => handleDelete(e, chat.id)}
                  title="Hapus"
                  style={{ marginLeft: '6px', background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--t3)', padding: '4px', borderRadius: '6px', flexShrink: 0,
                    transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--t3)'}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6l-1 14H6L5 6"/>
                  </svg>
                </button>
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        {sessions.length > 0 && (
          <div className="chat-history-footer">
            <button className="chat-history-footer-btn" onClick={handleDeleteAll}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14H6L5 6"/>
                <path d="M10 11v6M14 11v6"/>
                <path d="M9 6V4h6v2"/>
              </svg>
              Hapus Semua
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ChatHistoryPanel;
