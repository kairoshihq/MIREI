// pages/HomePage.jsx
import React, { useState, useEffect } from 'react';
import { useApp } from '../../App';
import { ChatIcon, TheaterIcon, SettingsIcon } from '../../components/common/Icon';
import './home.css';

const API = 'http://localhost:3000/api';

function getAuthHeaders() {
  const token = localStorage.getItem('mirei_token');
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

function formatTime(dateStr) {
  if (!dateStr) return '';
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
}

const HomePage = () => {
  const { navigateTo, user } = useApp();
  const [stats, setStats] = useState(null);
  const [recents, setRecents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API}/user/stats`, { headers: getAuthHeaders() });
        const data = await res.json();
        if (data.success) {
          setStats(data.stats);
          setRecents(data.recents || []);
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const STATS_CONFIG = [
    {
      label: 'Total Chat',
      value: loading ? '—' : String(stats?.totalSessions ?? 0),
      sub: loading ? '' : `+${stats?.todaySessions ?? 0} hari ini`,
      accent: '#8b5cf6',
    },
    {
      label: 'Karakter',
      value: '1',
      sub: 'Aktif',
      accent: '#ec4899',
    },
    {
      label: 'Pesan Terkirim',
      value: loading ? '—' : String(stats?.totalMessages ?? 0),
      sub: `${loading ? '—' : stats?.weekMessages ?? 0} minggu ini`,
      accent: '#10b981',
    },
    {
      label: 'Sesi Hari Ini',
      value: loading ? '—' : String(stats?.todaySessions ?? 0),
      sub: 'Percakapan',
      accent: '#f59e0b',
    },
  ];

  const firstName = user?.username?.split(' ')[0] || 'User';

  return (
    <div className="home-page-wrap">
      {/* Hero greeting */}
      <div className="home-hero-section">
        <div className="home-hero-text">
          <div className="home-greeting">Selamat datang kembali</div>
          <h1 className="home-hero-title">
            Halo, <span className="home-hero-title-accent">{firstName}</span>
          </h1>
          <p className="home-hero-sub">Ada yang bisa Mirei bantu hari ini?</p>
        </div>
        <div className="home-hero-orb" />
      </div>

      {/* Stats grid */}
      <div className="home-stats-grid">
        {STATS_CONFIG.map((s, i) => (
          <div key={i} className="home-stat-card" style={{ animationDelay: `${i * 0.06}s` }}>
            <div className="home-stat-accent-bar" style={{ background: s.accent }} />
            <div className="home-stat-value">{s.value}</div>
            <div className="home-stat-label">{s.label}</div>
            <div className="home-stat-sub" style={{ color: s.accent }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Recent activity */}
      <div className="home-section-wrap">
        <div className="home-section-header">
          <span className="home-section-title">Percakapan Terakhir</span>
          <button className="home-section-link" onClick={() => navigateTo('chat')}>Lihat semua →</button>
        </div>
        <div className="flex flex-col gap-2">
          {loading ? (
            <div style={{ color: 'var(--t3)', fontSize: '13px', padding: '12px 0' }}>Memuat...</div>
          ) : recents.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: '14px', padding: '28px 0',
            }}>
              <div style={{ fontSize: '13px', color: 'var(--t3)' }}>
                Belum ada riwayat percakapan
              </div>
              <button
                onClick={() => navigateTo('chat')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '8px',
                  padding: '10px 22px', borderRadius: '99px', border: 'none',
                  background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
                  color: '#fff', fontSize: '13px', fontWeight: 600,
                  cursor: 'pointer', fontFamily: 'var(--font)',
                  boxShadow: '0 4px 16px rgba(124,58,237,0.35)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 24px rgba(124,58,237,0.5)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(124,58,237,0.35)';
                }}
              >
                <ChatIcon size={14} />
                Mulai Chat Sekarang
              </button>
            </div>
          ) : (
            recents.map((r, i) => (
              <button
                key={r.id}
                className="home-recent-card"
                style={{ animationDelay: `${i * 0.07}s` }}
                onClick={() => navigateTo('chat')}
              >
                <div className="home-recent-avatar">M</div>
                <div className="flex-1 text-left min-w-0">
                  <div className="home-recent-title">{r.title}</div>
                  <div className="home-recent-preview">{r.preview || '—'}</div>
                </div>
                <div className="home-recent-time">{formatTime(r.updated_at)}</div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Quick actions */}
      <div className="home-section-wrap">
        <div className="home-section-header">
          <span className="home-section-title">Aksi Cepat</span>
        </div>
        <div className="home-quick-grid">
          {[
            { icon: <ChatIcon size={20} />, label: 'Chat Baru',         desc: 'Mulai obrolan',    page: 'chat',       accent: '#8b5cf6' },
            { icon: <TheaterIcon size={20} />, label: 'Jelajahi Karakter',  desc: 'Temukan karakter', page: 'characters', accent: '#ec4899' },
            { icon: <SettingsIcon size={20} />, label: 'Pengaturan',         desc: 'Kelola akun',      page: 'settings',   accent: '#10b981' },
          ].map((q, i) => (
            <button
              key={i}
              className="home-quick-card"
              style={{ animationDelay: `${i * 0.07}s` }}
              onClick={() => navigateTo(q.page)}
            >
              <div className="home-quick-icon">{q.icon}</div>
              <div className="home-quick-label">{q.label}</div>
              <div className="home-quick-desc">{q.desc}</div>
              <div className="home-quick-accent" style={{ background: q.accent }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
