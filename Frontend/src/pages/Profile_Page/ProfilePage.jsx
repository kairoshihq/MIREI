// pages/ProfilePage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { ConfirmModal } from '../../components/common/Modal';
import { ToastContainer, useToast } from '../../components/common/Toast';
import './profile.css';

const ProfilePage = () => {
  const [editing, setEditing] = useState(false);
  const [username, setUsername] = useState('Mirei User');
  const [bio, setBio] = useState('Pengguna setia Mirei sejak 2024 ✨');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { toasts, removeToast, toast } = useToast();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  }, []);

  const BADGES = [
    { icon:'🌸', label:'Early Adopter', color:'#8b5cf6' },
    { icon:'💬', label:'100+ Chat',     color:'#ec4899' },
    { icon:'⭐', label:'Favorit',       color:'#f59e0b' },
  ];

  const ACTIVITY = [
    { label:'Total Pesan',       value:'138', icon:'💬' },
    { label:'Hari Aktif',        value:'21',  icon:'📅' },
    { label:'Karakter Dipakai',  value:'2',   icon:'🎭' },
    { label:'Rata-rata/Hari',    value:'6.6', icon:'📊' },
  ];

  const handleSaveProfile = () => {
    setEditing(false);
    console.log('Profile saved:', { username, bio });
    toast.success('Profil berhasil disimpan');
  };

  return (
    <div className="profile-page-wrap" ref={scrollRef}>
      {/* Profile hero */}
      <div style={{ position: 'relative' }}>
        <div className="profile-hero-card">
          <div className="profile-hero-bg" />
          <div className="relative z-[1] flex items-center gap-6 w-full">
            <div className="profile-avatar-wrap flex-shrink-0">
              <div className="profile-big-avatar">
                {username.charAt(0).toUpperCase()}
              </div>
              <div className="profile-avatar-status" />
            </div>
            <div className="flex-1">
              <div>
                {editing ? (
                  <div className="flex items-center gap-2">
                    <input
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      className="profile-edit-input"
                      autoFocus
                    />
                    <button
                      onClick={handleSaveProfile}
                      style={{ color: '#a78bfa', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                      title="Simpan"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="profile-name">{username}</h2>
                    <button
                      onClick={() => setEditing(true)}
                      style={{ color: 'var(--t3)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', transition: 'color 0.2s' }}
                      title="Edit Profil"
                      onMouseEnter={e => e.currentTarget.style.color = '#a78bfa'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--t3)'}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                  </div>
                )}
                <div className="text-[12px] text-[#a78bfa] mt-[2px]">Plan Gratis · Bergabung April 2024</div>
                <div className="text-[13px] mt-[10px] max-w-[400px] leading-relaxed" style={{ color: 'var(--t2)' }}>
                  {editing ? (
                    <input
                      value={bio}
                      onChange={e => setBio(e.target.value)}
                      className="profile-edit-input-bio"
                    />
                  ) : bio}
                </div>
              </div>
              {/* Badges */}
              <div className="flex gap-2 mt-[14px] flex-wrap">
                {BADGES.map((b, i) => (
                  <div key={i} className="profile-badge" style={{ borderColor:`${b.color}40`, background:`${b.color}15`, color:b.color }}>
                    {b.icon} {b.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Activity stats */}
      <div>
        <div className="profile-section-title">Statistik Aktivitas</div>
        <div className="profile-activity-grid">
          {ACTIVITY.map((a, i) => (
            <div key={i} className="profile-act-card" style={{ animationDelay: `${i*0.06}s` }}>
              <div className="profile-act-icon">{a.icon}</div>
              <div className="profile-act-value">{a.value}</div>
              <div className="profile-act-label">{a.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Settings shortcuts */}
      <div>
        <div className="profile-section-title">Pengaturan Akun</div>
        <div className="flex flex-col gap-2">
          {[
            { icon:'🔒', label:'Ubah Password',    sub:'Terakhir diubah 30 hari lalu' },
            { icon:'📧', label:'Email',             sub:'user@mirei.app' },
            { icon:'🔔', label:'Notifikasi',        sub:'Semua aktif' },
            { icon:'🗑️', label:'Hapus Akun',        sub:'Tindakan ini tidak dapat dibatalkan', danger:true },
          ].map((row, i) => (
            <button
              key={i}
              className={`profile-setting-row ${row.danger ? 'profile-setting-row-danger' : ''}`}
              onClick={() => {
                if (row.danger) {
                  setConfirmOpen(true);
                } else {
                  console.log(`Navigate to ${row.label}`);
                }
              }}
            >
              <span className="profile-setting-icon">{row.icon}</span>
              <div className="flex-1 text-left">
                <div className={`profile-setting-label ${row.danger ? 'profile-setting-label-danger' : ''}`}>
                  {row.label}
                </div>
                <div className="profile-setting-sub">{row.sub}</div>
              </div>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" style={{ color:'var(--t3)' }}>
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Confirm delete account */}
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => { console.log('Delete account'); toast.info('Akun telah dihapus'); }}
        title="Hapus Akun"
        message="Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Ya, Hapus Akun"
        danger
      />

      {/* Toast */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
};

export default ProfilePage;
