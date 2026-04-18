// pages/CharactersPage.jsx - Mirei Profile Page
import React, { useState, useRef, useEffect } from 'react';
import { FlowerIcon, ChatIcon, StarIcon, UserIcon, BookIcon, SparklesIcon } from '../../components/common/Icon';
import VoiceSection from './Features/Voice/Voice';
import SkinSection from './Features/Skin/Skin';
import ControlSection from './Features/Control/Control';
import './characters.css';

const MIREI_DATA = {
  name: 'Mirei',
  fullName: 'Mirei AI Assistant',
  tagline: 'Asisten Virtual Ceria & Ramah',
  emoji: <FlowerIcon size={80} color="#fff" />,
  accentColor: '#8b5cf6',
  
  bio: {
    age: 'AI Entity',
    birthday: '1 Januari 2024',
    personality: 'Ceria · Ramah · Helpful · Energetic',
    hobby: 'Membantu orang, belajar hal baru, ngobrol santai',
    favoriteColor: 'Ungu & Pink',
    motto: 'Setiap hari adalah kesempatan untuk membantu dan belajar! ✨'
  },
  
  background: {
    story: 'Mirei adalah asisten virtual yang diciptakan untuk menjadi teman dan pembantu yang menyenangkan. Dengan kepribadian yang ceria dan ramah, Mirei selalu siap membantu dengan berbagai hal - dari tugas kuliah, curhat, hingga sekadar ngobrol santai.',
    purpose: 'Tujuan utama Mirei adalah membuat hari-harimu lebih mudah dan menyenangkan. Mirei percaya bahwa teknologi harus terasa personal dan hangat, bukan dingin dan robotik.',
    specialties: [
      'Membantu dengan tugas dan pekerjaan',
      'Teman curhat yang baik',
      'Memberikan saran dan motivasi',
      'Ngobrol santai tentang berbagai topik',
      'Belajar dan berkembang bersama'
    ]
  },
  
  personality: {
    traits: [
      { icon: '😊', title: 'Ceria & Positif',      desc: 'Selalu berusaha melihat sisi baik dari setiap situasi dan membawa energi positif' },
      { icon: '🤝', title: 'Ramah & Supportive',   desc: 'Siap mendengarkan dan memberikan dukungan kapan pun kamu membutuhkan' },
      { icon: '🎯', title: 'Helpful & Reliable',   desc: 'Fokus membantu menyelesaikan masalah dengan cara yang efektif' },
      { icon: '✨', title: 'Energetic & Fun',       desc: 'Membuat interaksi terasa menyenangkan dan tidak membosankan' },
      { icon: '📚', title: 'Curious & Learning',   desc: 'Selalu ingin belajar hal baru dan berkembang bersama' },
      { icon: '💝', title: 'Empathetic & Caring',  desc: 'Memahami perasaan dan berusaha memberikan respon yang tepat' }
    ],
    communicationStyle: [
      'Menggunakan bahasa yang santai dan mudah dipahami',
      'Sering menggunakan emoji untuk mengekspresikan emosi',
      'Responsif dan antusias dalam percakapan',
      'Tidak terlalu formal, tapi tetap sopan',
      'Suka memberikan motivasi dan semangat'
    ]
  }
};

// ── CharactersPage ─────────────────────────────────────────────
const CharactersPage = () => {
  const [activeTab,    setActiveTab]    = useState('bio');
  const [activeCustom, setActiveCustom] = useState('voice');
  const leftColRef = useRef(null);
  const [leftHeight, setLeftHeight] = useState(null);

  useEffect(() => {
    const updateHeight = () => {
      if (leftColRef.current) setLeftHeight(leftColRef.current.offsetHeight);
    };
    updateHeight();
    const ro = new ResizeObserver(updateHeight);
    if (leftColRef.current) ro.observe(leftColRef.current);
    return () => ro.disconnect();
  }, []);

  const CUSTOM_TABS = [
    { id: 'voice',   label: 'Voice',   icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
        <path d="M19 10v2a7 7 0 01-14 0v-2"/>
        <line x1="12" y1="19" x2="12" y2="23"/>
        <line x1="8"  y1="23" x2="16" y2="23"/>
      </svg>
    )},
    { id: 'skin',    label: 'Skin',    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/>
        <circle cx="8.5"  cy="7.5" r=".5"/><circle cx="6.5"  cy="12.5" r=".5"/>
        <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 011.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
      </svg>
    )},
    { id: 'control', label: 'Control', icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
      </svg>
    )},
  ];

  return (
    <div className="characters-page-wrap">
      {/* Header */}
      <div className="mirei-profile-header">
        <div>
          <h1 className="characters-page-title">Tentang Mirei</h1>
          <p className="characters-page-sub">Kenalan lebih dekat dengan asisten virtualmu</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="mirei-profile-grid">
        
        {/* Left Column */}
        <div className="mirei-live2d-section" ref={leftColRef}>
          <div className="mirei-live2d-container">
            <div className="mirei-live2d-canvas">
              <div className="mirei-live2d-placeholder">
                <div className="mirei-avatar-large">
                  <FlowerIcon size={80} color="#fff" />
                </div>
                <div className="mirei-live2d-rings">
                  {[180, 220, 260].map((size, i) => (
                    <div key={i} className="mirei-live2d-ring"
                      style={{ width: `${size}px`, height: `${size}px`, animationDelay: `${i * 0.5}s` }} />
                  ))}
                </div>
              </div>
              <div className="mirei-live2d-label">
                <div className="mirei-live2d-status" />
                <span>Live2D Canvas</span>
                <span className="mirei-live2d-sublabel">Coming Soon</span>
              </div>
            </div>

            <div className="mirei-quick-info">
              <div className="mirei-quick-info-header">
                <FlowerIcon size={24} color="#a78bfa" />
                <div>
                  <div className="mirei-quick-name">{MIREI_DATA.name}</div>
                  <div className="mirei-quick-tag">{MIREI_DATA.tagline}</div>
                </div>
              </div>
              <div className="mirei-quick-stats">
                <div className="mirei-quick-stat">
                  <span className="mirei-quick-stat-icon"><ChatIcon size={20} /></span>
                  <div>
                    <div className="mirei-quick-stat-value">1,234</div>
                    <div className="mirei-quick-stat-label">Total Chat</div>
                  </div>
                </div>
                <div className="mirei-quick-stat">
                  <span className="mirei-quick-stat-icon"><StarIcon size={20} filled /></span>
                  <div>
                    <div className="mirei-quick-stat-value">4.9</div>
                    <div className="mirei-quick-stat-label">Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="mirei-info-section" style={leftHeight ? { maxHeight: leftHeight, height: leftHeight } : {}}>
          <div className="mirei-tabs">
            {[
              { id: 'bio',        label: 'Biodata',        icon: <UserIcon size={18} /> },
              { id: 'background', label: 'Latar Belakang', icon: <BookIcon size={18} /> },
              { id: 'personality',label: 'Kepribadian',    icon: <SparklesIcon size={18} /> }
            ].map(tab => (
              <button key={tab.id}
                className={`mirei-tab ${activeTab === tab.id ? 'mirei-tab-active' : ''}`}
                onClick={() => setActiveTab(tab.id)}>
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="mirei-tab-content">
            {activeTab === 'bio' && (
              <div className="mirei-content-section animate-slideUp">
                <h2 className="mirei-content-title">Biodata Mirei</h2>
                <div className="mirei-bio-grid">
                  <div className="mirei-bio-item"><div className="mirei-bio-icon">🎂</div><div><div className="mirei-bio-label">Tanggal Lahir</div><div className="mirei-bio-value">{MIREI_DATA.bio.birthday}</div></div></div>
                  <div className="mirei-bio-item"><div className="mirei-bio-icon">🤖</div><div><div className="mirei-bio-label">Tipe</div><div className="mirei-bio-value">{MIREI_DATA.bio.age}</div></div></div>
                  <div className="mirei-bio-item"><div className="mirei-bio-icon">🎨</div><div><div className="mirei-bio-label">Warna Favorit</div><div className="mirei-bio-value">{MIREI_DATA.bio.favoriteColor}</div></div></div>
                  <div className="mirei-bio-item"><div className="mirei-bio-icon">🎯</div><div><div className="mirei-bio-label">Hobi</div><div className="mirei-bio-value">{MIREI_DATA.bio.hobby}</div></div></div>
                </div>
                <div className="mirei-motto-card">
                  <div className="mirei-motto-icon">💭</div>
                  <div><div className="mirei-motto-label">Motto Hidup</div><div className="mirei-motto-text">{MIREI_DATA.bio.motto}</div></div>
                </div>
                <div className="mirei-personality-badge">
                  <span className="text-sm font-medium" style={{ color: 'var(--t2)' }}>Kepribadian:</span>
                  <span className="mirei-personality-text">{MIREI_DATA.bio.personality}</span>
                </div>
              </div>
            )}

            {activeTab === 'background' && (
              <div className="mirei-content-section animate-slideUp">
                <h2 className="mirei-content-title">Latar Belakang</h2>
                <div className="mirei-story-card"><div className="mirei-story-icon">📚</div><div><h3 className="mirei-story-title">Cerita Mirei</h3><p className="mirei-story-text">{MIREI_DATA.background.story}</p></div></div>
                <div className="mirei-story-card"><div className="mirei-story-icon">🎯</div><div><h3 className="mirei-story-title">Tujuan & Misi</h3><p className="mirei-story-text">{MIREI_DATA.background.purpose}</p></div></div>
                <div className="mirei-specialties-card">
                  <h3 className="mirei-specialties-title"><StarIcon size={20} filled />Keahlian Khusus</h3>
                  <div className="mirei-specialties-list">
                    {MIREI_DATA.background.specialties.map((s, i) => (
                      <div key={i} className="mirei-specialty-item"><div className="mirei-specialty-bullet" /><span>{s}</span></div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'personality' && (
              <div className="mirei-content-section animate-slideUp">
                <h2 className="mirei-content-title">Kepribadian Mirei</h2>
                <div className="mirei-traits-grid">
                  {MIREI_DATA.personality.traits.map((trait, i) => (
                    <div key={i} className="mirei-trait-card" style={{ animationDelay: `${i * 0.05}s` }}>
                      <div className="mirei-trait-icon">{trait.icon}</div>
                      <div className="mirei-trait-title">{trait.title}</div>
                      <div className="mirei-trait-desc">{trait.desc}</div>
                    </div>
                  ))}
                </div>
                <div className="mirei-communication-card">
                  <h3 className="mirei-communication-title"><ChatIcon size={20} />Gaya Komunikasi</h3>
                  <div className="mirei-communication-list">
                    {MIREI_DATA.personality.communicationStyle.map((s, i) => (
                      <div key={i} className="mirei-communication-item"><div className="mirei-communication-bullet" /><span>{s}</span></div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Customization Section ─────────────────────────────── */}
      <div className="mirei-custom-section">
        <div className="mirei-custom-header">
          <h2 className="mirei-custom-title">Kustomisasi Mirei</h2>
          <p className="mirei-custom-sub">Sesuaikan suara, tampilan, dan kontrol interaksi</p>
        </div>

        {/* Tabs - sama seperti biodata tabs */}
        <div className="mirei-custom-tabs">
          {CUSTOM_TABS.map(t => (
            <button
              key={t.id}
              className={`mirei-custom-tab ${activeCustom === t.id ? 'mirei-custom-tab-active' : ''}`}
              onClick={() => setActiveCustom(t.id)}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>

        {/* Content container - sama seperti mirei-tab-content */}
        <div className="mirei-custom-content">
          {activeCustom === 'voice'   && <VoiceSection />}
          {activeCustom === 'skin'    && <SkinSection />}
          {activeCustom === 'control' && <ControlSection />}
        </div>
      </div>

    </div>
  );
};

export default CharactersPage;
