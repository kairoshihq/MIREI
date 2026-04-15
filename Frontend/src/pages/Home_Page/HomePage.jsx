// pages/HomePage.jsx
import React from 'react';
import { useApp } from '../../App';
import './home.css';

const STATS = [
  { label: 'Total Chat',   value: '24',   sub: '+3 hari ini',    accent: '#8b5cf6' },
  { label: 'Karakter',     value: '2',    sub: 'Aktif',          accent: '#ec4899' },
  { label: 'Pesan Terkirim', value: '138', sub: 'Minggu ini',    accent: '#10b981' },
  { label: 'Waktu Online', value: '6j',   sub: 'Rata-rata/hari', accent: '#f59e0b' },
];

const RECENTS = [
  { title: 'Tentang tugas kuliah', preview: 'Makasih ya Mirei, aku jadi ngerti!', time: '10 menit lalu', char: 'Mirei' },
  { title: 'Ngobrol santai',       preview: 'wkwk iya lucu banget sih',           time: '2 jam lalu',    char: 'Mirei' },
  { title: 'Curhat hari ini',      preview: 'aku lagi capek banget nih...',        time: 'Kemarin',       char: 'Mirei' },
];

const HomePage = () => {
  const { navigateTo } = useApp();

  // Handler dengan error handling
  const handleNavigate = (page) => {
    if (navigateTo && typeof navigateTo === 'function') {
      navigateTo(page);
    } else {
      console.warn('navigateTo function not available');
    }
  };

  return (
    <div className="home-page-wrap">
      {/* Hero greeting */}
      <div className="home-hero-section">
        <div className="home-hero-text">
          <div className="home-greeting">Selamat datang kembali 👋</div>
          <h1 className="home-hero-title">Halo, <span className="home-hero-title-accent">Mirei User</span></h1>
          <p className="home-hero-sub">Ada yang bisa Mirei bantu hari ini?</p>
          <button className="home-hero-cta" onClick={() => handleNavigate('chat')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
            Mulai Chat
          </button>
        </div>
        <div className="home-hero-orb" />
      </div>

      {/* Stats grid */}
      <div className="home-stats-grid">
        {STATS.map((s, i) => (
          <div key={i} className="home-stat-card" style={{ animationDelay: `${i*0.06}s` }}>
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
          <button className="home-section-link" onClick={() => handleNavigate('chat')}>Lihat semua →</button>
        </div>
        <div className="flex flex-col gap-2">
          {RECENTS.map((r, i) => (
            <button
              key={i}
              className="home-recent-card"
              style={{ animationDelay: `${i*0.07}s` }}
              onClick={() => handleNavigate('chat')}
            >
              <div className="home-recent-avatar">
                {r.char.charAt(0)}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="home-recent-title">{r.title}</div>
                <div className="home-recent-preview">
                  {r.preview}
                </div>
              </div>
              <div className="home-recent-time">{r.time}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="home-section-wrap">
        <div className="home-section-header">
          <span className="home-section-title">Aksi Cepat</span>
        </div>
        <div className="home-quick-grid">
          {[
            { icon:'💬', label:'Chat Baru',      desc:'Mulai obrolan',    page:'chat',       accent:'#8b5cf6' },
            { icon:'🎭', label:'Jelajahi Karakter', desc:'Temukan karakter', page:'characters', accent:'#ec4899' },
            { icon:'⚙️', label:'Pengaturan',     desc:'Kelola akun',      page:'settings',   accent:'#10b981' },
          ].map((q, i) => (
            <button 
              key={i} 
              className="home-quick-card"
              style={{ animationDelay: `${i*0.07}s` }} 
              onClick={() => handleNavigate(q.page)}
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