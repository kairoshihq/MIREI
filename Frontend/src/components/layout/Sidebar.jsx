// components/layout/Sidebar.jsx
import React, { useState } from 'react';
import { useApp } from '../../App';

// ─── SVG Icons ───────────────────────────────────────────────────
const Icons = {
  home: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  chat: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
    </svg>
  ),
  characters: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
      <circle cx="19" cy="7" r="2.5"/><path d="M21.5 13.5c1.5.7 2.5 2.1 2.5 3.5"/>
    </svg>
  ),
  profile: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  ),
  settings: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  ),
  sun: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="5"/>
      <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
      <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
    </svg>
  ),
  moon: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>
  ),
  chevronRight: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  spark: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2l2.4 7.2H22l-6.2 4.5 2.4 7.2L12 16.5 5.8 20.9l2.4-7.2L2 9.2h7.6z"/>
    </svg>
  ),
  riwayat: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
    </svg>
  ),
  plus: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  search: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  star: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  bolt: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  user: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  ),
};

// ─── Nav items ────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'home',       label: 'Home',       icon: 'home' },
  { id: 'chat',       label: 'Chat',       icon: 'chat' },
  { id: 'characters', label: 'Character',  icon: 'characters' },
  { id: 'profile',    label: 'Profile',    icon: 'profile' },
  { id: 'settings',   label: 'Settings',   icon: 'settings' },
];

// ─── Context panel content per page ──────────────────────────────
const ContextPanel = ({ activePage, navigateTo }) => {
  const [search, setSearch] = useState('');

  const panels = {
    home: <HomeContext />,
    chat: <ChatContext navigateTo={navigateTo} search={search} setSearch={setSearch} />,
    characters: <CharactersContext />,
    profile: <ProfileContext />,
    settings: <SettingsContext />,
  };

  return (
    <div style={contextPanelStyle}>
      {panels[activePage] || panels.home}
    </div>
  );
};

// Context: Home
const HomeContext = () => (
  <div style={ctxInner}>
    <div style={ctxHeader}>
      <span style={ctxTitle}>Menu</span>
    </div>
    <div style={ctxSection}>
      <div style={ctxSectionLabel}>Overview</div>
      <CtxItem icon="star"  label="Beranda"    active />
      <CtxItem icon="bolt"  label="Aktivitas"  badge="3" />
      <CtxItem icon="user"  label="Karakter"   />
    </div>
    <div style={ctxSection}>
      <div style={ctxSectionLabel}>Quick Access</div>
      <CtxItem icon="chat"  label="Chat Terakhir" />
      <CtxItem icon="star"  label="Favorit" />
    </div>
    <CtxUserFooter />
  </div>
);

// Context: Chat
const ChatContext = ({ navigateTo, search, setSearch }) => {
  const conversations = [
    { id: 'c1', title: 'Tentang tugas kuliah', preview: 'Makasih ya Mirei!', time: '10:24', active: true },
    { id: 'c2', title: 'Ngobrol santai',       preview: 'wkwk lucu banget', time: '09:11', active: false },
    { id: 'c3', title: 'Curhat hari ini',      preview: 'aku lagi capek...', time: 'Kemarin', active: false },
    { id: 'c4', title: 'Rencana weekend',      preview: 'Ide bagus tuh!',  time: 'Kemarin', active: false },
  ];
  const filtered = conversations.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={ctxInner}>
      <div style={ctxHeader}>
        <span style={ctxTitle}>Riwayat</span>
        <button
          style={ctxIconBtn}
          title="Obrolan baru"
          onClick={() => navigateTo && navigateTo('chat')}
        >
          {Icons.plus}
        </button>
      </div>

      <div style={searchWrap}>
        <span style={searchIcon}>{Icons.search}</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Cari percakapan..."
          style={searchInput}
        />
      </div>

      <div style={ctxSection}>
        <div style={ctxSectionLabel}>Hari ini</div>
        <div style={{ display:'flex', flexDirection:'column', gap:'2px' }}>
          {filtered.map(c => (
            <button key={c.id} style={{ ...convItem, ...(c.active ? convItemActive : {}) }}>
              <div style={convDot(c.active)} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={convTop}>
                  <span style={{ ...convTitle, ...(c.active ? { color:'#c4b5fd' } : {}) }}>
                    {c.title}
                  </span>
                  <span style={convTime}>{c.time}</span>
                </div>
                <span style={convPreview}>{c.preview}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
      <CtxUserFooter />
    </div>
  );
};

// Context: Characters
const CharactersContext = () => (
  <div style={ctxInner}>
    <div style={ctxHeader}>
      <span style={ctxTitle}>Karakter</span>
      <button style={ctxIconBtn}>{Icons.plus}</button>
    </div>
    <div style={ctxSection}>
      <div style={ctxSectionLabel}>Milikku</div>
      <CharCtxCard name="Mirei" tag="Asisten" active />
      <CharCtxCard name="Aria"  tag="Sage" />
    </div>
    <div style={ctxSection}>
      <div style={ctxSectionLabel}>Jelajahi</div>
      <CtxItem icon="star" label="Populer" />
      <CtxItem icon="bolt" label="Terbaru" badge="12" />
    </div>
    <CtxUserFooter />
  </div>
);

// Context: Profile
const ProfileContext = () => (
  <div style={ctxInner}>
    <div style={ctxHeader}>
      <span style={ctxTitle}>Akun</span>
    </div>
    <div style={{ padding:'12px 14px' }}>
      <div style={profileCard}>
        <div style={profileAvatar}>M</div>
        <div>
          <div style={{ fontSize:'14px', fontWeight:600, color:'var(--t1)' }}>Mirei User</div>
          <div style={{ fontSize:'11px', color:'#a78bfa', marginTop:'2px' }}>Plan Gratis</div>
        </div>
      </div>
    </div>
    <div style={ctxSection}>
      <CtxItem icon="user"  label="Edit Profil" />
      <CtxItem icon="star"  label="Favorit" />
      <CtxItem icon="bolt"  label="Aktivitas" />
    </div>
    <CtxUserFooter />
  </div>
);

// Context: Settings
const SettingsContext = () => (
  <div style={ctxInner}>
    <div style={ctxHeader}>
      <span style={ctxTitle}>Pengaturan</span>
    </div>
    <div style={ctxSection}>
      <div style={ctxSectionLabel}>Preferensi</div>
      <CtxItem icon="star"  label="Umum" active />
      <CtxItem icon="user"  label="Akun" />
      <CtxItem icon="bolt"  label="Notifikasi" />
    </div>
    <div style={ctxSection}>
      <div style={ctxSectionLabel}>Lanjutan</div>
      <CtxItem icon="search" label="Privasi" />
      <CtxItem icon="star"   label="Tentang" />
    </div>
    <CtxUserFooter />
  </div>
);

// ─── Reusable context sub-components ─────────────────────────────
const CtxItem = ({ icon, label, badge = null, active = false }) => (
  <button style={{ ...ctxItem, ...(active ? ctxItemActive : {}) }}>
    <span style={{ color: active ? '#a78bfa' : 'var(--t3)', flexShrink:0 }}>
      {Icons[icon] || Icons.star}
    </span>
    <span style={{ flex:1, textAlign:'left', fontSize:'13px', color: active ? 'var(--t1)' : 'var(--t2)' }}>
      {label}
    </span>
    {badge && (
      <span style={badgeStyle}>{badge}</span>
    )}
  </button>
);

const CharCtxCard = ({ name, tag, active = false }) => (
  <button style={{ ...ctxItem, ...(active ? ctxItemActive : {}), gap:'10px' }}>
    <div style={{
      width:'28px', height:'28px', borderRadius:'50%',
      background: active
        ? 'linear-gradient(135deg,#7c3aed,#ec4899)'
        : 'rgba(255,255,255,0.08)',
      display:'flex', alignItems:'center', justifyContent:'center',
      fontSize:'12px', fontWeight:600, color:'#fff', flexShrink:0,
    }}>
      {name[0]}
    </div>
    <div style={{ textAlign:'left' }}>
      <div style={{ fontSize:'13px', fontWeight:500, color: active ? 'var(--t1)' : 'var(--t2)' }}>{name}</div>
      <div style={{ fontSize:'10.5px', color:'var(--t3)', marginTop:'1px' }}>{tag}</div>
    </div>
  </button>
);

const CtxUserFooter = () => {
  const { theme, toggleTheme } = useApp();
  
  return (
    <div style={ctxFooter}>
      {/* Theme toggle */}
      <div style={themeToggleWrap}>
        <button
          style={{ ...themeBtn, ...(theme === 'dark' ? themeBtnActive : {}) }}
          onClick={() => theme !== 'dark' && toggleTheme && toggleTheme()}
          title="Dark mode"
        >
          {Icons.moon}
        </button>
        <button
          style={{ ...themeBtn, ...(theme === 'light' ? themeBtnActive : {}) }}
          onClick={() => theme !== 'light' && toggleTheme && toggleTheme()}
          title="Light mode"
        >
          {Icons.sun}
        </button>
      </div>
      {/* User row */}
      <div style={userRow}>
        <div style={userAvatar}>M</div>
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:'12.5px', fontWeight:500, color:'var(--t1)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
            Mirei User
          </div>
          <div style={{ fontSize:'10.5px', color:'var(--t3)' }}>Plan Gratis</div>
        </div>
        <span style={{ color:'var(--t3)', fontSize:'16px', letterSpacing:'2px', lineHeight:1 }}>···</span>
      </div>
    </div>
  );
};

// ─── Main Sidebar Component ───────────────────────────────────────
const Sidebar = () => {
  const { activePage, navigateTo, theme, toggleTheme } = useApp();

  return (
    <div style={shellStyle}>
      {/* Icon Rail */}
      <nav style={railStyle}>
        {/* Logo */}
        <div style={logoWrap}>
          <div style={logoInner}>
            <span style={{ color:'#a78bfa', fontSize:'18px', filter:'drop-shadow(0 0 6px #7c3aed)' }}>✦</span>
          </div>
          <div style={statusDot} title="Online" />
        </div>

        {/* Nav icons */}
        <div style={navGroup}>
          {NAV_ITEMS.map((item, i) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigateTo && navigateTo(item.id)}
                style={{
                  ...navBtn,
                  ...(isActive ? navBtnActive : {}),
                  animationDelay: `${i * 0.05}s`,
                }}
                title={item.label}
              >
                <span style={{ color: isActive ? '#a78bfa' : 'var(--t3)', transition:'color 0.2s' }}>
                  {Icons[item.icon]}
                </span>
                {isActive && <div style={activePill} />}
              </button>
            );
          })}
        </div>

        {/* Bottom: theme + avatar */}
        <div style={railBottom}>
          <button
            onClick={() => toggleTheme && toggleTheme()}
            style={themeRailBtn}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? Icons.sun : Icons.moon}
          </button>
          <div style={railAvatar} title="Profil saya">
            M
          </div>
        </div>
      </nav>

      {/* Context Panel */}
      <ContextPanel activePage={activePage} navigateTo={navigateTo} />
    </div>
  );
};

// ─── Styles (JS objects) - Hapus TypeScript annotations ─────────
const shellStyle = {
  display: 'flex',
  height: '100vh',
  flexShrink: 0,
  position: 'relative',
  zIndex: 10,
};

const railStyle = {
  width: '72px',
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '16px 0',
  background: 'rgba(12,14,22,0.7)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderRight: '1px solid rgba(255,255,255,0.06)',
  boxShadow: '4px 0 24px rgba(0,0,0,0.3)',
  flexShrink: 0,
  position: 'relative',
  zIndex: 2,
};

const logoWrap = {
  position: 'relative',
  marginBottom: '24px',
};

const logoInner = {
  width: '40px', 
  height: '40px',
  borderRadius: '12px',
  background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(236,72,153,0.2))',
  border: '1px solid rgba(139,92,246,0.4)',
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center',
  cursor: 'pointer',
};

const statusDot = {
  position: 'absolute',
  bottom: '-1px', 
  right: '-1px',
  width: '8px', 
  height: '8px',
  borderRadius: '50%',
  background: '#10b981',
  border: '2px solid rgba(12,14,22,0.8)',
  boxShadow: '0 0 6px rgba(16,185,129,0.6)',
};

const navGroup = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  flex: 1,
};

const navBtn = {
  width: '44px', 
  height: '44px',
  borderRadius: '12px',
  border: '1px solid transparent',
  background: 'transparent',
  cursor: 'pointer',
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center',
  position: 'relative',
  transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
  animation: 'fadeIn 0.4s ease both',
};

const navBtnActive = {
  background: 'rgba(139,92,246,0.15)',
  border: '1px solid rgba(139,92,246,0.3)',
  boxShadow: '0 0 14px rgba(139,92,246,0.2)',
};

const activePill = {
  position: 'absolute',
  left: '-12px',
  width: '3px', 
  height: '20px',
  borderRadius: '0 3px 3px 0',
  background: 'linear-gradient(180deg, #8b5cf6, #ec4899)',
  boxShadow: '2px 0 8px rgba(139,92,246,0.5)',
};

const railBottom = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '12px',
  marginTop: 'auto',
};

const themeRailBtn = {
  width: '36px', 
  height: '36px',
  borderRadius: '10px',
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'rgba(255,255,255,0.05)',
  color: 'var(--t2)',
  cursor: 'pointer',
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center',
  transition: 'all 0.2s ease',
};

const railAvatar = {
  width: '36px', 
  height: '36px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center',
  fontSize: '14px', 
  fontWeight: 600, 
  color: '#fff',
  cursor: 'pointer',
  boxShadow: '0 0 12px rgba(139,92,246,0.35)',
  border: '2px solid rgba(139,92,246,0.4)',
};

const contextPanelStyle = {
  width: '260px',
  height: '100vh',
  background: 'rgba(255,255,255,0.035)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderRight: '1px solid rgba(255,255,255,0.07)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  flexShrink: 0,
};

const ctxInner = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  overflow: 'hidden',
};

const ctxHeader = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '20px 16px 10px',
};

const ctxTitle = {
  fontSize: '16px',
  fontWeight: 600,
  color: 'var(--t1)',
  letterSpacing: '0.01em',
};

const ctxIconBtn = {
  width: '28px', 
  height: '28px',
  borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'rgba(255,255,255,0.05)',
  color: 'var(--t2)',
  cursor: 'pointer',
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center',
  transition: 'all 0.15s ease',
};

const ctxSection = {
  padding: '4px 10px',
  flex: '0 0 auto',
  overflowY: 'auto',
};

const ctxSectionLabel = {
  fontSize: '10px',
  fontWeight: 600,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'var(--t3)',
  padding: '8px 6px 6px',
};

const ctxItem = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  width: '100%',
  padding: '9px 10px',
  borderRadius: '10px',
  border: '1px solid transparent',
  background: 'transparent',
  cursor: 'pointer',
  transition: 'all 0.15s ease',
  fontFamily: "'Sora', sans-serif",
};

const ctxItemActive = {
  background: 'rgba(139,92,246,0.12)',
  border: '1px solid rgba(139,92,246,0.25)',
};

const badgeStyle = {
  fontSize: '10px',
  fontWeight: 600,
  padding: '2px 6px',
  borderRadius: '99px',
  background: '#10b981',
  color: '#fff',
};

const convItem = {
  display: 'flex',
  alignItems: 'flex-start',
  gap: '8px',
  width: '100%',
  padding: '9px 10px',
  borderRadius: '10px',
  border: '1px solid transparent',
  background: 'transparent',
  cursor: 'pointer',
  textAlign: 'left',
  transition: 'all 0.15s ease',
  fontFamily: "'Sora', sans-serif",
};

const convItemActive = {
  background: 'rgba(139,92,246,0.12)',
  border: '1px solid rgba(139,92,246,0.25)',
};

const convDot = (active) => ({
  width: '6px', 
  height: '6px',
  borderRadius: '50%',
  background: active ? '#a78bfa' : 'rgba(255,255,255,0.15)',
  boxShadow: active ? '0 0 6px #7c3aed' : 'none',
  marginTop: '5px',
  flexShrink: 0,
  transition: 'all 0.15s ease',
});

const convTop = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '2px',
};

const convTitle = {
  fontSize: '12.5px',
  fontWeight: 500,
  color: 'var(--t1)',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '120px',
};

const convTime = {
  fontSize: '10px',
  color: 'var(--t3)',
  flexShrink: 0,
};

const convPreview = {
  fontSize: '11px',
  color: 'var(--t3)',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: 'block',
};

const searchWrap = {
  position: 'relative',
  margin: '0 14px 10px',
};

const searchIcon = {
  position: 'absolute',
  left: '10px', 
  top: '50%',
  transform: 'translateY(-50%)',
  color: 'var(--t3)',
  pointerEvents: 'none',
  display: 'flex',
};

const searchInput = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '8px',
  padding: '7px 10px 7px 30px',
  fontSize: '12px',
  fontFamily: "'Sora', sans-serif",
  color: 'var(--t2)',
  outline: 'none',
  transition: 'border-color 0.15s ease',
};

const themeToggleWrap = {
  display: 'flex',
  gap: '4px',
  background: 'rgba(255,255,255,0.05)',
  borderRadius: '10px',
  padding: '3px',
  border: '1px solid rgba(255,255,255,0.06)',
};

const themeBtn = {
  flex: 1,
  padding: '6px',
  borderRadius: '7px',
  border: 'none',
  background: 'transparent',
  color: 'var(--t3)',
  cursor: 'pointer',
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center',
  transition: 'all 0.15s ease',
};

const themeBtnActive = {
  background: 'rgba(139,92,246,0.25)',
  color: '#a78bfa',
};

const profileCard = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 14px',
  borderRadius: '12px',
  background: 'rgba(139,92,246,0.1)',
  border: '1px solid rgba(139,92,246,0.2)',
};

const profileAvatar = {
  width: '40px', 
  height: '40px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center',
  fontSize: '16px', 
  fontWeight: 700, 
  color: '#fff',
  flexShrink: 0,
};

const ctxFooter = {
  marginTop: 'auto',
  borderTop: '1px solid rgba(255,255,255,0.06)',
  padding: '12px 14px',
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};

const userRow = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '8px 10px',
  borderRadius: '10px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.06)',
  cursor: 'pointer',
};

const userAvatar = {
  width: '32px', 
  height: '32px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
  display: 'flex', 
  alignItems: 'center', 
  justifyContent: 'center',
  fontSize: '13px', 
  fontWeight: 700, 
  color: '#fff',
  flexShrink: 0,
};

export default Sidebar;