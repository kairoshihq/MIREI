import React, { useState, useEffect } from 'react';
import Modal    from '../../../../components/common/Modal/Modal';
import Button   from '../../../../components/common/Button/Button';
import Input    from '../../../../components/common/Input/Input';
import Toggle   from '../../../../components/common/Input/Toggle';
import {
  EmailIcon, CheckIcon, AlertIcon,
  ClockIcon, BellIcon, LockIcon,
  SparklesIcon, GlobeIcon,
} from '../../../../components/common/Icon';
import { useApp }    from '../../../../App';
import { useToast }  from '../../../../components/common/Toast';
import './email.css';

const API = 'http://localhost:3000/api';

function getAuthHeaders() {
  const token = localStorage.getItem('mirei_token');
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

const EmailModal = ({ user: userProp, onClose }) => {
  const { user: ctxUser, updateUser } = useApp();
  const { toast } = useToast();
  const user = ctxUser || userProp;

  /* ── notif toggles ── */
  const [notif, setNotif] = useState({ updates: true, accountChanges: true, featureInfo: false });

  /* ── verify state ── */
  const isVerified = user?.email_verified === 1 || user?.email_verified === true;
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyMsg, setVerifyMsgRaw]      = useState({ text: '', type: 'info' });
  const setVerifyMsg = (text, type = 'info') => setVerifyMsgRaw({ text, type });

  const handleSendVerification = async () => {
    setVerifyLoading(true); setVerifyMsg('', 'info');
    try {
      const res  = await fetch(`${API}/auth/send-verification`, { method: 'POST', headers: getAuthHeaders() });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Gagal mengirim email verifikasi');
      setVerifyMsg('Link verifikasi telah dikirim ke inbox kamu. Klik tombol di email untuk verifikasi.', 'info');
    } catch (err) {
      setVerifyMsg(err.message, 'error');
    } finally {
      setVerifyLoading(false);
    }
  };

  /* ── ganti email — step 1: kirim OTP ── */
  const [newEmail, setNewEmail]   = useState('');
  const [password, setPassword]   = useState('');
  const [changeLoading, setChangeLoading] = useState(false);
  const [changeError, setChangeError]     = useState('');
  const [otpStep, setOtpStep]             = useState(false); // false = form, true = input OTP

  const handleRequestChange = async (e) => {
    e.preventDefault();
    setChangeError('');

    // Validasi format email dengan regex
    const emailRegex = /^[^\s@]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(newEmail)) {
      return setChangeError('Format email tidak valid');
    }

    // Validasi client-side
    if (newEmail.toLowerCase() === user?.email?.toLowerCase()) {
      return setChangeError('Email baru tidak boleh sama dengan email saat ini');
    }

    setChangeLoading(true);
    try {
      const res  = await fetch(`${API}/auth/request-email-change`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ newEmail, password }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setOtpStep(true); // beralih ke input OTP
    } catch (err) {
      setChangeError(err.message);
    } finally {
      setChangeLoading(false);
    }
  };

  /* ── ganti email — step 2: verifikasi OTP ── */
  const [otp, setOtp]             = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError]     = useState('');

  const handleConfirmChange = async (e) => {
    e.preventDefault();
    setOtpError('');
    setOtpLoading(true);
    try {
      const res  = await fetch(`${API}/auth/confirm-email-change`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ newEmail, code: otp }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);

      // Update user di context + localStorage
      updateUser(data.user);
      toast.success('Email berhasil diperbarui');

      // Reset form
      setOtpStep(false); setNewEmail(''); setPassword(''); setOtp('');
    } catch (err) {
      setOtpError(err.message);
    } finally {
      setOtpLoading(false);
    }
  };

  /* ── security info ── */
  const [activityLogs, setActivityLogs] = useState([]);

  useEffect(() => {
    fetch(`${API}/user/activity`, { headers: getAuthHeaders() })
      .then(r => r.json())
      .then(data => { if (data.success) setActivityLogs(data.logs); })
      .catch(() => {});
  }, [user?.email]); // re-fetch kalau email berubah

  const lastChanged  = user?.email_changed_at
    ? new Date(user.email_changed_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : 'Belum pernah diubah';
  const lastActivity = user?.last_activity_at
    ? new Date(user.last_activity_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'Tidak tersedia';

  return (
    <Modal isOpen onClose={onClose} size="large">

      {/* ── Header ── */}
      <div className="em-modal-header">
        <div className="em-header-icon"><EmailIcon size={18} color="#a78bfa" /></div>
        <div>
          <h3 className="em-title">Pengaturan Email</h3>
          <p className="em-subtitle">Kelola email, notifikasi, dan keamanan akun kamu</p>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="em-body">

        {/* Section 1 — Info Email */}
        <div className="em-section">
          <div className="em-section-title"><EmailIcon size={14} color="#a78bfa" /> Info Email</div>
          <div className="em-info-box">
            <div className="em-label">Email Saat Ini</div>
            <div className="em-value">{user?.email || '—'}</div>
          </div>
          {!isVerified && (
            <div className="em-verify-wrap">
              <Button variant="primary" size="medium" icon={<SparklesIcon size={14} />} loading={verifyLoading} onClick={handleSendVerification}>
                Kirim Link Verifikasi
              </Button>
              {verifyMsg.text && (
                <div className={`em-verify-msg em-verify-msg--${verifyMsg.type}`}>
                  {verifyMsg.type === 'error'   && <AlertIcon size={13} />}
                  {verifyMsg.type === 'success'  && <CheckIcon size={13} />}
                  {verifyMsg.text}
                </div>
              )}
            </div>
          )}
          <div className={`em-status-box ${isVerified ? 'em-status-box--ok' : 'em-status-box--warn'}`}>
            <span className="em-status-icon">
              {isVerified ? <CheckIcon size={20} color="#10b981" /> : <AlertIcon size={20} color="#f59e0b" />}
            </span>
            <div>
              <div className={`em-status-title ${isVerified ? 'em-status-title--ok' : 'em-status-title--warn'}`}>
                {isVerified ? 'Email Terverifikasi' : 'Belum Diverifikasi'}
              </div>
              <div className="em-status-desc">
                {isVerified ? 'Akun kamu sudah aman dan terverifikasi' : 'Kirim link verifikasi dan klik tombol di email kamu'}
              </div>
            </div>
          </div>
        </div>

        <div className="em-divider" />

        {/* Section 2 — Ganti Email */}
        <div className="em-section">
          <div className="em-section-title"><LockIcon size={14} color="#a78bfa" /> Ganti Email</div>

          {!otpStep ? (
            /* Step 1 — form email baru + password */
            <form onSubmit={handleRequestChange} className="em-form">
              <div className="em-field">
                <label className="em-field-label">Email Saat Ini</label>
                <Input type="email" value={user?.email || ''} readOnly disabled className="em-input-readonly" />
              </div>
              <div className="em-field">
                <label className="em-field-label">Email Baru</label>
                <Input type="email" placeholder="contoh@email.com" value={newEmail} onChange={e => setNewEmail(e.target.value)} required />
              </div>
              <div className="em-field">
                <label className="em-field-label">Password Saat Ini</label>
                <Input type="password" placeholder="Konfirmasi dengan password kamu" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              {changeError && <div className="em-alert em-alert--error"><AlertIcon size={13} /> {changeError}</div>}
              <Button type="submit" variant="primary" size="medium" loading={changeLoading}>
                Kirim Kode OTP
              </Button>
            </form>
          ) : (
            /* Step 2 — input OTP */
            <form onSubmit={handleConfirmChange} className="em-form">
              <div className="em-otp-info">
                <CheckIcon size={14} color="#a78bfa" />
                Kode OTP telah dikirim ke <strong>{newEmail}</strong>
              </div>
              <div className="em-field">
                <label className="em-field-label">Kode OTP</label>
                <Input
                  type="text"
                  placeholder="Masukkan 6 digit kode"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  style={{ letterSpacing: '0.2em', fontSize: '18px', textAlign: 'center' }}
                />
              </div>
              {otpError && <div className="em-alert em-alert--error"><AlertIcon size={13} /> {otpError}</div>}
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button type="button" variant="secondary" size="medium" onClick={() => { setOtpStep(false); setOtp(''); setOtpError(''); }}>
                  Kembali
                </Button>
                <Button type="submit" variant="primary" size="medium" loading={otpLoading} style={{ flex: 1 }}>
                  Konfirmasi
                </Button>
              </div>
            </form>
          )}
        </div>

        <div className="em-divider" />

        {/* Section 3 — Notifikasi */}
        <div className="em-section">
          <div className="em-section-title"><BellIcon size={14} color="#a78bfa" /> Notifikasi Email</div>
          <div className="em-notif-list">
            {[
              { key: 'updates',        label: 'Update Aplikasi',  desc: 'Info versi dan pembaruan terbaru' },
              { key: 'accountChanges', label: 'Perubahan Akun',   desc: 'Password, email, dan aktivitas login' },
              { key: 'featureInfo',    label: 'Info Fitur Baru',  desc: 'Pengumuman fitur dan konten eksklusif' },
            ].map(({ key, label, desc }) => (
              <div key={key} className="em-notif-row">
                <div>
                  <div className="em-notif-label">{label}</div>
                  <div className="em-notif-desc">{desc}</div>
                </div>
                <Toggle value={notif[key]} onChange={val => setNotif(s => ({ ...s, [key]: val }))} />
              </div>
            ))}
          </div>
        </div>

        <div className="em-divider" />

        {/* Section 4 — Keamanan */}
        <div className="em-section">
          <div className="em-section-title"><LockIcon size={14} color="#a78bfa" /> Keamanan</div>

          {/* Terakhir email diubah */}
          <div className="em-security-card">
            <span className="em-security-icon"><ClockIcon size={20} color="#a78bfa" /></span>
            <div>
              <div className="em-label">Terakhir Email Diubah</div>
              <div className="em-value">{lastChanged}</div>
            </div>
          </div>

          {/* Log aktivitas */}
          <div className="em-activity-wrap">
            <div className="em-label" style={{ marginBottom: '8px' }}>Aktivitas Terakhir</div>
            {activityLogs.length === 0 ? (
              <div className="em-activity-empty">
                <GlobeIcon size={14} color="var(--t3)" /> Belum ada aktivitas tercatat
              </div>
            ) : (
              <div className="em-activity-list">
                {activityLogs.map((log, i) => (
                  <div key={i} className="em-activity-row">
                    <span className="em-activity-dot" />
                    <div className="em-activity-action">{log.action}</div>
                    <div className="em-activity-time">
                      {new Date(log.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit',
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="em-tip">
            <AlertIcon size={13} color="#a78bfa" />
            Jika kamu melihat aktivitas yang mencurigakan, segera ubah password dan email kamu.
          </div>
        </div>

      </div>

      {/* ── Footer ── */}
      <div className="em-modal-footer">
        <Button variant="secondary" size="medium" onClick={onClose} style={{ width: '100%' }}>Tutup</Button>
      </div>

    </Modal>
  );
};

export default EmailModal;
