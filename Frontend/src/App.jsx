// App.jsx
import React, { useState, createContext, useContext, useCallback } from 'react';
import Sidebar from './components/layout/Sidebar';
import ChatPage from './pages/Chat_Page/ChatPage';
import HomePage from './pages/Home_Page/HomePage';
import CharactersPage from './pages/Character_Page/CharactersPage';
import ProfilePage from './pages/Profile_Page/ProfilePage';
import SettingsPage from './pages/Settings_Page/SettingsPage';
import NotFoundPage from './pages/Not_Found_Page/NotFoundPage';
import AuthPage from './pages/Auth_Page/AuthPage';

// ─── Global App Context ──────────────────────────────────────────
export const AppContext = createContext(null);
export const useApp = () => useContext(AppContext);

// ─── Global Styles ───────────────────────────────────────────────
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    /* Base surfaces */
    --bg-void:        #080a0f;
    --bg-base:        #0c0e16;
    --bg-panel:       rgba(255,255,255,0.04);
    --bg-card:        rgba(255,255,255,0.06);
    --bg-card-hover:  rgba(255,255,255,0.09);
    --bg-active:      rgba(139,92,246,0.15);

    /* Glass */
    --glass-bg:       rgba(255,255,255,0.05);
    --glass-border:   rgba(255,255,255,0.10);
    --glass-shadow:   0 8px 32px rgba(0,0,0,0.4);

    /* Accent */
    --accent:         #8b5cf6;
    --accent-soft:    #a78bfa;
    --accent-dim:     rgba(139,92,246,0.25);
    --accent2:        #ec4899;
    --accent-green:   #10b981;

    /* Text */
    --t1:             #eeeef5;
    --t2:             #9899b8;
    --t3:             #4a4b65;

    /* Border */
    --border:         rgba(255,255,255,0.07);
    --border-accent:  rgba(139,92,246,0.4);

    /* Radius */
    --r-sm:   8px;
    --r-md:   14px;
    --r-lg:   20px;
    --r-xl:   28px;

    /* Sidebar */
    --sidebar-w:      72px;
    --context-w:      260px;

    /* Font */
    --font:    'Sora', sans-serif;
    --font-dm: 'DM Sans', sans-serif;

    /* Transitions */
    --ease:  cubic-bezier(0.4, 0, 0.2, 1);
    --t-fast: 0.15s;
    --t-med:  0.25s;
    --t-slow: 0.4s;
  }

  /* Light theme override */
  [data-theme="light"] {
    --bg-void:        #e8e9f0;
    --bg-base:        #f0f1f8;
    --bg-panel:       rgba(0,0,0,0.03);
    --bg-card:        rgba(0,0,0,0.05);
    --bg-card-hover:  rgba(0,0,0,0.08);
    --bg-active:      rgba(139,92,246,0.12);
    --glass-bg:       rgba(255,255,255,0.6);
    --glass-border:   rgba(0,0,0,0.08);
    --glass-shadow:   0 8px 32px rgba(0,0,0,0.12);
    --border:         rgba(0,0,0,0.08);
    --border-accent:  rgba(139,92,246,0.5);
    --t1:             #111122;
    --t2:             #5a5b7a;
    --t3:             #9899b8;
  }

  html, body, #root {
    height: 100%;
    width: 100%;
    overflow: hidden;
  }

  body {
    background: var(--bg-void);
    color: var(--t1);
    font-family: var(--font);
    font-size: 14px;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb {
    background: rgba(139,92,246,0.3);
    border-radius: 99px;
  }
  ::-webkit-scrollbar-thumb:hover { background: rgba(139,92,246,0.5); }

  /* ── App Shell ── */
  .app-shell {
    display: flex;
    height: 100vh;
    width: 100vw;
    overflow: hidden;
    background: var(--bg-void);
    position: relative;
  }

  /* ── Ambient bg orbs ── */
  .app-shell::before,
  .app-shell::after {
    content: '';
    position: fixed;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
    z-index: 0;
    opacity: 0.18;
  }
  .app-shell::before {
    width: 500px; height: 500px;
    background: radial-gradient(circle, #8b5cf6, transparent 70%);
    top: -100px; left: 60px;
  }
  .app-shell::after {
    width: 400px; height: 400px;
    background: radial-gradient(circle, #ec4899, transparent 70%);
    bottom: -80px; right: 200px;
  }

  [data-theme="light"] .app-shell::before { opacity: 0.08; }
  [data-theme="light"] .app-shell::after  { opacity: 0.06; }

  /* ── Main content area ── */
  .app-main {
    flex: 1;
    min-width: 0;
    min-height: 0;
    overflow: clip;
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
  }

  /* ── Utility classes shared across pages ── */
  .glass-card {
    background: var(--glass-bg);
    border: 1px solid var(--glass-border);
    border-radius: var(--r-lg);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }

  .page-enter {
    animation: pageEnter 0.25s var(--ease) both;
    overflow: visible;
  }

  @keyframes pageEnter {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 8px rgba(139,92,246,0.3); }
    50%       { box-shadow: 0 0 18px rgba(139,92,246,0.6); }
  }

  /* ── Chat page integration overrides ── */
  .chat-page-shell {
    display: flex;
    flex-direction: column;
    height: 100%;
    overflow: hidden;
  }
`;

// ─── Page Router ─────────────────────────────────────────────────
const renderPage = (page) => {
  switch (page) {
    case 'home':       return <HomePage />;
    case 'chat':       return <ChatPage />;
    case 'characters': return <CharactersPage />;
    case 'profile':    return <ProfilePage />;
    case 'settings':   return <SettingsPage />;
    default:           return <NotFoundPage />;
  }
};

// ─── App Root ────────────────────────────────────────────────────
function App() {
  const [activePage, setActivePage] = useState('home');
  const [theme, setTheme] = useState('dark');
  const [chatUnread, setChatUnread] = useState(0);

  // Auth state — cek localStorage dulu
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mirei_user')); } catch { return null; }
  });

  const handleAuthenticated = (userData) => setUser(userData);

  const handleLogout = () => {
    localStorage.removeItem('mirei_token');
    localStorage.removeItem('mirei_user');
    setUser(null);
  };

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const navigateTo = (page) => {
    setActivePage(page);
    if (page === 'chat') setChatUnread(0);
  };

  const notifyChatMessage = useCallback(() => {
    setActivePage(prev => {
      // only increment if not currently on chat page
      if (prev !== 'chat') setChatUnread(n => n + 1);
      return prev;
    });
  }, []);

  const contextValue = {
    activePage,
    navigateTo,
    theme,
    toggleTheme,
    chatUnread,
    notifyChatMessage,
    user,
    handleLogout,
  };

  // Tampilkan auth page kalau belum login
  if (!user) {
    return (
      <>
        <style>{GLOBAL_STYLES}</style>
        <div data-theme={theme} style={{ width: '100vw', height: '100vh' }}>
          <AuthPage onAuthenticated={handleAuthenticated} />
        </div>
      </>
    );
  }

  const PAGES = ['home', 'chat', 'characters', 'profile', 'settings'];

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      <AppContext.Provider value={contextValue}>
        <div className="app-shell" data-theme={theme}>
          <Sidebar />
          <main className="app-main">
            {PAGES.map(page => (
              <div
                key={page}
                className={activePage === page ? 'page-enter' : ''}
                style={{
                  flex: 1,
                  minHeight: 0,
                  display: activePage === page ? 'flex' : 'none',
                  flexDirection: 'column',
                }}
              >
                {page === 'home'       && <HomePage />}
                {page === 'chat'       && <ChatPage />}
                {page === 'characters' && <CharactersPage />}
                {page === 'profile'    && <ProfilePage />}
                {page === 'settings'   && <SettingsPage />}
              </div>
            ))}
            {/* fallback for unknown pages */}
            {!PAGES.includes(activePage) && (
              <div className="page-enter" style={{ height: '100%' }}>
                <NotFoundPage />
              </div>
            )}
          </main>
        </div>
      </AppContext.Provider>
    </>
  );
}

export default App;