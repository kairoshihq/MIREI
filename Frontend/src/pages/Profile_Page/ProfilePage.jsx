// pages/ProfilePage.jsx
import React, { useState, useRef, useEffect } from 'react';
import { ToastContainer, useToast } from '../../components/common/Toast';
import { useApp } from '../../App';
import {
  FlowerIcon, ChatIcon, CalendarIcon, ChartIcon, TheaterIcon,
  LockIcon, EmailIcon, BellIcon, LogoutIcon, StarIcon,
  EditIcon, CheckIcon, ChevronIcon
} from '../../components/common/Icon';
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

// ── Change Password Modal ─────────────────────────────────────────
const ChangePasswordModal = ({ onClose, onSuccess }) => {
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.next !== form.confirm) return setError('Password baru tidak cocok');
    if (form.next.length < 6) return setError('Password baru minimal 6 karakter');
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/password`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ currentPassword: form.current, newPassword: form.next }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      onSuccess();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={onClose}>
      <div style={{
        background: '#13141f', border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '20px', padding: '28px', width: '100%', maxWidth: '380px',
        boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
      }} onClick={e => e.stopPropagation()}>
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: 'var(--t1)', fontSize: '16px', fontWeight: 700, marginBottom: '4px' }}>Ubah Password</h3>
          <p style={{ color: 'var(--t3)', fontSize: '12px' }}>Masukkan password lama dan password baru kamu</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { key: 'current', label: 'Password Lama',     placeholder: 'Password saat ini' },
            { key: 'next',    label: 'Password Baru',     placeholder: 'Minimal 6 karakter' },
            { key: 'confirm', label: 'Konfirmasi Password', placeholder: 'Ulangi password baru' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label style={{ fontSize: '11px', color: 'var(--t3)', fontWeight: 600,
                textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>
                {label}
              </label>
              <input
                type="password"
                placeholder={placeholder}
                value={form[key]}
                onChange={e => set(key, e.target.value)}
                required
                style={{
                  width: '100%', background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px',
                  padding: '10px 14px', color: 'var(--t1)', fontSize: '13px',
                  fontFamily: 'var(--font)', outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>
          ))}

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: '8px', padding: '10px 12px', color: '#f87171', fontSize: '12px' }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
            <button type="button" onClick={onClose} style={{
              flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)',
              background: 'transparent', color: 'var(--t2)', fontSize: '13px', cursor: 'pointer',
              fontFamily: 'var(--font)',
            }}>Batal</button>
            <button type="submit" disabled={loading} style={{
              flex: 1, padding: '10px', borderRadius: '10px', border: 'none',
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              color: '#fff', fontSize: '13px', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font)', opacity: loading ? 0.7 : 1,
            }}>
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProfilePage = () => {
  const { toasts, removeToast, toast } = useToast();
  const { handleLogout, user } = useApp();
  const scrollRef = useRef(null);

  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState('Pengguna setia Mirei ✨');
  const [editing, setEditing] = useState(false);
  const [stats, setStats] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

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

  // Badges dinamis
  const BADGES = [
    { icon: <FlowerIcon size={13} />, label: 'Early Adopter', color: '#8b5cf6', show: true },
    { icon: <ChatIcon size={13} />, label: '100+ Chat', color: '#ec4899', show: (stats?.totalMessages || 0) >= 100 },
    { icon: <StarIcon size={13} filled />, label: 'Favorit', color: '#f59e0b', show: (stats?.totalSessions || 0) >= 5 },
  ].filter(b => b.show);

  const ACTIVITY = [
    { label: 'Total Pesan',      value: stats ? String(stats.totalMessages) : '—', icon: <ChatIcon size={18} /> },
    { label: 'Total Sesi Chat',  value: stats ? String(stats.totalSessions) : '—', icon: <CalendarIcon size={18} /> },
    { label: 'Karakter Dipakai', value: '1',                                        icon: <TheaterIcon size={18} /> },
    { label: 'Pesan Minggu Ini', value: stats ? String(stats.weekMessages) : '—',  icon: <ChartIcon size={18} /> },
  ];

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
                      <CheckIcon size={18} />
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
                      <EditIcon size={15} />
                    </button>
                  </div>
                )}
                <div className="text-[12px] text-[#a78bfa] mt-[2px]">
                  Plan Gratis · Bergabung {formatJoinDate(user?.created_at)}
                </div>
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

      {/* Settings shortcuts */}
      <div>
        <div className="profile-section-title">Pengaturan Akun</div>
        <div className="flex flex-col gap-2">
          {[
            { icon: <LockIcon size={16} />, label: 'Ubah Password', sub: 'Ganti password akun', password: true },
            { icon: <EmailIcon size={16} />, label: 'Email',          sub: user?.email || '—' },
            { icon: <BellIcon size={16} />, label: 'Notifikasi',     sub: 'Semua aktif' },
            { icon: <LogoutIcon size={16} />, label: 'Keluar',         sub: 'Logout dari akun ini', logout: true, danger: true },
          ].map((row, i) => (
            <button
              key={i}
              className={`profile-setting-row ${row.danger ? 'profile-setting-row-danger' : ''}`}
              onClick={() => {
                if (row.logout) handleLogout();
                if (row.password) setShowPasswordModal(true);
              }}
            >
              <span className="profile-setting-icon">{row.icon}</span>
              <div className="flex-1 text-left">
                <div className={`profile-setting-label ${row.danger ? 'profile-setting-label-danger' : ''}`}>
                  {row.label}
                </div>
                <div className="profile-setting-sub">{row.sub}</div>
              </div>
              <ChevronIcon size={14} />
            </button>
          ))}
        </div>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {showPasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowPasswordModal(false)}
          onSuccess={() => {
            setShowPasswordModal(false);
            toast.success('Password berhasil diubah');
          }}
        />
      )}
    </div>
  );
};

export default ProfilePage;
