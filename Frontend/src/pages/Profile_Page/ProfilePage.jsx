// pages/ProfilePage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { ToastContainer, useToast } from '../../components/common/Toast';
import { useApp } from '../../App';
import {
  FlowerIcon, ChatIcon, CalendarIcon, ChartIcon, TheaterIcon,
  LockIcon, EmailIcon, BellIcon, LogoutIcon, StarIcon,
  EditIcon, CheckIcon, ChevronIcon
} from '../../components/common/Icon';
import EmailModal    from './Features/Email/Email';
import PasswordModal from './Features/Password/Password';
import './profile.css';

const API = 'http://localhost:3000/api';

function getAuthHeaders() {
  const token = localStorage.getItem('mirei_token');
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

function formatJoinDate(dateStr) {
  if (!dateStr) return 'Baru saja';
  const date = new Date(dateStr);
  if (isNaN(date)) return 'Baru saja';
  return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
}

const ProfilePage = () => {
  const { toasts, removeToast, toast } = useToast();
  const { handleLogout, user } = useApp();
  const scrollRef = useRef(null);

  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState('Pengguna setia Mirei ✨');
  const [editing, setEditing] = useState(false);
  const [stats, setStats] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, []);

  useEffect(() => {
    setUsername(user?.username || '');
  }, [user]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${API}/user/stats`, { headers: getAuthHeaders() });
        const data = await res.json();
        if (data.success) setStats(data.stats);
      } catch {}
    };
    fetchStats();
  }, []);

  const handleSaveProfile = () => {
    setEditing(false);
    toast.success('Profil berhasil disimpan');
  };

  const BADGES = [
    { icon: <FlowerIcon size={13} />, label: 'Early Adopter', color: '#8b5cf6', show: true },
    { icon: <ChatIcon size={13} />,   label: '100+ Chat',     color: '#ec4899', show: (stats?.totalMessages || 0) >= 100 },
    { icon: <StarIcon size={13} filled />, label: 'Favorit',  color: '#f59e0b', show: (stats?.totalSessions || 0) >= 5 },
  ].filter(b => b.show);

  const ACTIVITY = [
    { label: 'Total Pesan',      value: stats ? String(stats.totalMessages) : '—', icon: <ChatIcon size={18} /> },
    { label: 'Total Sesi Chat',  value: stats ? String(stats.totalSessions) : '—', icon: <CalendarIcon size={18} /> },
    { label: 'Karakter Dipakai', value: '1',                                        icon: <TheaterIcon size={18} /> },
    { label: 'Pesan Minggu Ini', value: stats ? String(stats.weekMessages)  : '—', icon: <ChartIcon size={18} /> },
  ];

  const SETTINGS = [
    { icon: <LockIcon size={16} />,   label: 'Ubah Password', sub: 'Ganti password akun',    onPress: () => setShowPasswordModal(true) },
    { icon: <EmailIcon size={16} />,  label: 'Email',          sub: user?.email || '—',       onPress: () => setShowEmailModal(true) },
    { icon: <BellIcon size={16} />,   label: 'Notifikasi',     sub: 'Semua aktif',            onPress: () => {} },
    { icon: <LogoutIcon size={16} />, label: 'Keluar',         sub: 'Logout dari akun ini',   onPress: handleLogout, danger: true },
  ];

  return (
    <div className="profile-page-wrap" ref={scrollRef}>

      {/* Hero */}
      <div style={{ position: 'relative' }}>
        <div className="profile-hero-card">
          <div className="profile-hero-bg" />
          <div className="relative z-[1] flex items-center gap-6 w-full">
            <div className="profile-avatar-wrap flex-shrink-0">
              <div className="profile-big-avatar">{username.charAt(0).toUpperCase()}</div>
              <div className="profile-avatar-status" />
            </div>
            <div className="flex-1">
              {editing ? (
                <div className="flex items-center gap-2">
                  <input value={username} onChange={e => setUsername(e.target.value)} className="profile-edit-input" autoFocus />
                  <button onClick={handleSaveProfile} style={{ color: '#a78bfa', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }} title="Simpan">
                    <CheckIcon size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="profile-name">{username}</h2>
                  <button onClick={() => setEditing(true)}
                    style={{ color: 'var(--t3)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', transition: 'color 0.2s' }}
                    title="Edit Profil"
                    onMouseEnter={e => e.currentTarget.style.color = '#a78bfa'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--t3)'}
                  >
                    <EditIcon size={15} />
                  </button>
                </div>
              )}
              <div className="text-[12px] text-[#a78bfa] mt-[2px]">
                Plan Gratis · Bergabung {formatJoinDate(user?.created_at)}
              </div>
              <div className="text-[13px] mt-[10px] max-w-[400px] leading-relaxed" style={{ color: 'var(--t2)' }}>
                {editing
                  ? <input value={bio} onChange={e => setBio(e.target.value)} className="profile-edit-input-bio" />
                  : bio}
              </div>
              {BADGES.length > 0 && (
                <div className="flex gap-2 mt-[14px] flex-wrap">
                  {BADGES.map((b, i) => (
                    <div key={i} className="profile-badge" style={{ borderColor: `${b.color}40`, background: `${b.color}15`, color: b.color }}>
                      {b.icon} {b.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Activity stats */}
      <div>
        <div className="profile-section-title">Statistik Aktivitas</div>
        <div className="profile-activity-grid">
          {ACTIVITY.map((a, i) => (
            <div key={i} className="profile-act-card" style={{ animationDelay: `${i * 0.06}s` }}>
              <div className="profile-act-icon">{a.icon}</div>
              <div className="profile-act-value">{a.value}</div>
              <div className="profile-act-label">{a.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div>
        <div className="profile-section-title">Pengaturan Akun</div>
        <div className="flex flex-col gap-2">
          {SETTINGS.map((row, i) => (
            <button key={i} className={`profile-setting-row ${row.danger ? 'profile-setting-row-danger' : ''}`} onClick={row.onPress}>
              <span className="profile-setting-icon">{row.icon}</span>
              <div className="flex-1 text-left">
                <div className={`profile-setting-label ${row.danger ? 'profile-setting-label-danger' : ''}`}>{row.label}</div>
                <div className="profile-setting-sub">{row.sub}</div>
              </div>
              <ChevronIcon size={14} />
            </button>
          ))}
        </div>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {showPasswordModal && (
        <PasswordModal
          onClose={() => setShowPasswordModal(false)}
          onSuccess={() => { setShowPasswordModal(false); toast.success('Password berhasil diubah'); }}
        />
      )}

      {showEmailModal && (
        <EmailModal
          user={user}
          onClose={() => setShowEmailModal(false)}
        />
      )}
    </div>
  );
};

export default ProfilePage;
