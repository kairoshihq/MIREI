// components/layout/Sidebar.jsx - Single Collapsible Sidebar
import React, { useState } from 'react';
import { useApp } from '../../App';
import '../../styles/sidebar.css';

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
  menu: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
  chevronLeft: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
};

// ─── Nav items ────────────────────────────────────────────────────
const NAV_ITEMS = [
  { id: 'home',       label: 'Beranda',    icon: 'home' },
  { id: 'chat',       label: 'Chat',       icon: 'chat' },
  { id: 'characters', label: 'Mirei',      icon: 'characters' },
  { id: 'profile',    label: 'Profile',    icon: 'profile' },
  { id: 'settings',   label: 'Settings',   icon: 'settings' },
];

// ─── Main Sidebar Component ───────────────────────────────────────
const Sidebar = () => {
  const { activePage, navigateTo, theme, toggleTheme, chatUnread } = useApp();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <div style={{
      ...sidebarStyle,
      width: isCollapsed ? '72px' : '260px',
    }}>
      {/* Header */}
      <div style={headerStyle}>
        {!isCollapsed && (
          <div style={logoSection}>
            <div style={logoIcon}>
              <span style={{ color:'#a78bfa', fontSize:'20px', filter:'drop-shadow(0 0 6px #7c3aed)' }}>✦</span>
            </div>
            <div>
              <div style={logoText}>Mirei</div>
              <div style={logoSubtext}>AI Assistant</div>
            </div>
          </div>
        )}
        
        {isCollapsed && (
          <div style={logoIconCollapsed}>
            <span style={{ color:'#a78bfa', fontSize:'20px', filter:'drop-shadow(0 0 6px #7c3aed)' }}>✦</span>
          </div>
        )}

        <button 
          onClick={toggleSidebar}
          style={toggleBtn}
          className="sidebar-toggle-btn"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? Icons.menu : Icons.chevronLeft}
        </button>
      </div>

      {/* Navigation */}
      <nav style={navSection} className="sidebar-nav-section">
        {NAV_ITEMS.map((item, i) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigateTo && navigateTo(item.id)}
              style={{
                ...navItem,
                ...(isActive ? navItemActive : {}),
                justifyContent: isCollapsed ? 'center' : 'flex-start',
                animationDelay: `${i * 0.05}s`,
              }}
              className={`sidebar-nav-item ${isActive ? 'sidebar-nav-item-active' : ''}`}
              title={isCollapsed ? item.label : ''}
            >
              <span style={{ 
                color: isActive ? '#a78bfa' : 'var(--t3)', 
                transition:'color 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}>
                {Icons[item.icon]}
                {item.id === 'chat' && chatUnread > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    minWidth: '16px',
                    height: '16px',
                    borderRadius: '99px',
                    background: 'linear-gradient(135deg, #8b5cf6, #ec4899)',
                    color: '#fff',
                    fontSize: '10px',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 4px',
                    boxShadow: '0 0 8px rgba(139,92,246,0.6)',
                    animation: 'badgePop 0.3s cubic-bezier(0.34,1.56,0.64,1) both',
                  }}>
                    {chatUnread > 99 ? '99+' : chatUnread}
                  </span>
                )}
              </span>
              {!isCollapsed && (
                <span style={{
                  fontSize: '14px',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? 'var(--t1)' : 'var(--t2)',
                  transition: 'color 0.2s',
                }}>
                  {item.label}
                </span>
              )}
              {isActive && <div style={activeIndicator} />}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={footerStyle}>
        {/* Theme Toggle */}
        {!isCollapsed ? (
          <div style={themeToggleWrap}>
            <button
              style={{ ...themeBtn, ...(theme === 'dark' ? themeBtnActive : {}) }}
              className={`sidebar-theme-btn ${theme === 'dark' ? 'sidebar-theme-btn-active' : ''}`}
              onClick={() => theme !== 'dark' && toggleTheme && toggleTheme()}
              title="Dark mode"
            >
              {Icons.moon}
              <span style={{ fontSize: '12px', marginLeft: '6px' }}>Dark</span>
            </button>
            <button
              style={{ ...themeBtn, ...(theme === 'light' ? themeBtnActive : {}) }}
              className={`sidebar-theme-btn ${theme === 'light' ? 'sidebar-theme-btn-active' : ''}`}
              onClick={() => theme !== 'light' && toggleTheme && toggleTheme()}
              title="Light mode"
            >
              {Icons.sun}
              <span style={{ fontSize: '12px', marginLeft: '6px' }}>Light</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => toggleTheme && toggleTheme()}
            style={themeIconBtn}
            className="sidebar-theme-icon-btn"
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? Icons.sun : Icons.moon}
          </button>
        )}

        {/* User Profile */}
        <div 
          style={{
            ...userProfile,
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            padding: isCollapsed ? '10px' : '12px',
          }}
          className="sidebar-user-profile"
        >
          <div style={userAvatar}>M</div>
          {!isCollapsed && (
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={userName}>Mirei User</div>
              <div style={userPlan}>Plan Gratis</div>
            </div>
          )}
          {!isCollapsed && (
            <span style={{ color:'var(--t3)', fontSize:'16px', letterSpacing:'2px', lineHeight:1 }}>···</span>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Styles ───────────────────────────────────────────────────────
const sidebarStyle = {
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  background: 'rgba(12,14,22,0.7)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderRight: '1px solid rgba(255,255,255,0.06)',
  boxShadow: '4px 0 24px rgba(0,0,0,0.3)',
  flexShrink: 0,
  transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  overflow: 'hidden',
  position: 'relative',
  zIndex: 10,
};

const headerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '20px 16px',
  borderBottom: '1px solid rgba(255,255,255,0.06)',
  flexShrink: 0,
};

const logoSection = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
};

const logoIcon = {
  width: '40px',
  height: '40px',
  borderRadius: '12px',
  background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(236,72,153,0.2))',
  border: '1px solid rgba(139,92,246,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  className: 'sidebar-logo-icon',
};

const logoIconCollapsed = {
  width: '40px',
  height: '40px',
  borderRadius: '12px',
  background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(236,72,153,0.2))',
  border: '1px solid rgba(139,92,246,0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto',
};

const logoText = {
  fontSize: '18px',
  fontWeight: 700,
  color: 'var(--t1)',
  lineHeight: 1,
};

const logoSubtext = {
  fontSize: '11px',
  color: 'var(--t3)',
  marginTop: '2px',
};

const toggleBtn = {
  width: '32px',
  height: '32px',
  borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'rgba(255,255,255,0.05)',
  color: 'var(--t2)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.2s ease',
  flexShrink: 0,
};

const navSection = {
  flex: 1,
  padding: '16px 12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
  overflowY: 'auto',
  overflowX: 'hidden',
};

const navItem = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  width: '100%',
  padding: '12px 14px',
  borderRadius: '12px',
  border: '1px solid transparent',
  background: 'transparent',
  cursor: 'pointer',
  transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
  fontFamily: "'Sora', sans-serif",
  position: 'relative',
  animation: 'fadeIn 0.4s ease both',
};

const navItemActive = {
  background: 'rgba(139,92,246,0.15)',
  border: '1px solid rgba(139,92,246,0.3)',
  boxShadow: '0 0 14px rgba(139,92,246,0.2)',
};

const activeIndicator = {
  position: 'absolute',
  left: '-12px',
  width: '3px',
  height: '24px',
  borderRadius: '0 3px 3px 0',
  background: 'linear-gradient(180deg, #8b5cf6, #ec4899)',
  boxShadow: '2px 0 8px rgba(139,92,246,0.5)',
};

const footerStyle = {
  borderTop: '1px solid rgba(255,255,255,0.06)',
  padding: '16px 12px',
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  flexShrink: 0,
};

const themeToggleWrap = {
  display: 'flex',
  gap: '6px',
  background: 'rgba(255,255,255,0.05)',
  borderRadius: '10px',
  padding: '4px',
  border: '1px solid rgba(255,255,255,0.06)',
};

const themeBtn = {
  flex: 1,
  padding: '8px 12px',
  borderRadius: '8px',
  border: 'none',
  background: 'transparent',
  color: 'var(--t3)',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'all 0.15s ease',
  fontSize: '12px',
  fontFamily: "'Sora', sans-serif",
};

const themeBtnActive = {
  background: 'rgba(139,92,246,0.25)',
  color: '#a78bfa',
};

const themeIconBtn = {
  width: '100%',
  padding: '10px',
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

const userProfile = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '12px',
  borderRadius: '12px',
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid rgba(255,255,255,0.06)',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
};

const userAvatar = {
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '14px',
  fontWeight: 700,
  color: '#fff',
  flexShrink: 0,
  boxShadow: '0 0 12px rgba(139,92,246,0.35)',
  border: '2px solid rgba(139,92,246,0.4)',
};

const userName = {
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--t1)',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const userPlan = {
  fontSize: '11px',
  color: 'var(--t3)',
  marginTop: '1px',
};

export default Sidebar;
