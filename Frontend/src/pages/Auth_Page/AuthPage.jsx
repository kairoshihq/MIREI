// pages/Auth_Page/AuthPage.jsx
import React, { useState } from 'react';
import './auth.css';

const API = 'http://localhost:3000/api/auth';

// ── Step components ───────────────────────────────────────────────

const RegisterForm = ({ onSwitch, onOTPSent, onSuccess }) => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v })); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      // Dev mode: langsung dapat token tanpa OTP
      if (data.token) {
        onSuccess(data.token, data.user);
      } else {
        onOTPSent(form.email);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="auth-header">
        <span className="auth-logo">✦</span>
        <h1 className="auth-title">Buat Akun</h1>
        <p className="auth-sub">Bergabung dengan Mirei sekarang</p>
      </div>

      <div className="auth-fields">
        <div className="auth-field">
          <label>Username</label>
          <input
            type="text" placeholder="Nama kamu"
            value={form.username} onChange={e => set('username', e.target.value)}
            required
          />
        </div>
        <div className="auth-field">
          <label>Email</label>
          <input
            type="email" placeholder="email@contoh.com"
            value={form.email} onChange={e => set('email', e.target.value)}
            required
          />
        </div>
        <div className="auth-field">
          <label>Password</label>
          <input
            type="password" placeholder="Minimal 6 karakter"
            value={form.password} onChange={e => set('password', e.target.value)}
            required
          />
        </div>
      </div>

      {error && <div className="auth-error">{error}</div>}

      <button className="auth-btn" type="submit" disabled={loading}>
        {loading ? 'Mengirim OTP...' : 'Daftar'}
      </button>

      <p className="auth-switch">
        Sudah punya akun?{' '}
        <button type="button" onClick={onSwitch}>Masuk</button>
      </p>
    </form>
  );
};

const OTPForm = ({ email, onSuccess }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      onSuccess(data.token, data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    try {
      const res = await fetch(`${API}/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      setInfo('OTP baru telah dikirim!');
      setTimeout(() => setInfo(''), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="auth-header">
        <span className="auth-logo">✦</span>
        <h1 className="auth-title">Verifikasi Email</h1>
        <p className="auth-sub">Kode OTP dikirim ke<br /><strong>{email}</strong></p>
      </div>

      <div className="auth-fields">
        <div className="auth-field">
          <label>Kode OTP</label>
          <input
            type="text" placeholder="6 digit kode"
            value={code} onChange={e => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            maxLength={6} className="auth-otp-input"
            required
          />
        </div>
      </div>

      {error && <div className="auth-error">{error}</div>}
      {info && <div className="auth-info">{info}</div>}

      <button className="auth-btn" type="submit" disabled={loading || code.length < 6}>
        {loading ? 'Memverifikasi...' : 'Verifikasi'}
      </button>

      <p className="auth-switch">
        Tidak menerima kode?{' '}
        <button type="button" onClick={handleResend} disabled={resending}>
          {resending ? 'Mengirim...' : 'Kirim ulang'}
        </button>
      </p>
    </form>
  );
};

const LoginForm = ({ onSwitch, onSuccess }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      onSuccess(data.token, data.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="auth-header">
        <span className="auth-logo">✦</span>
        <h1 className="auth-title">Selamat Datang</h1>
        <p className="auth-sub">Masuk ke akun Mirei kamu</p>
      </div>

      <div className="auth-fields">
        <div className="auth-field">
          <label>Email</label>
          <input
            type="email" placeholder="email@contoh.com"
            value={form.email} onChange={e => set('email', e.target.value)}
            required
          />
        </div>
        <div className="auth-field">
          <label>Password</label>
          <input
            type="password" placeholder="Password kamu"
            value={form.password} onChange={e => set('password', e.target.value)}
            required
          />
        </div>
      </div>

      {error && <div className="auth-error">{error}</div>}

      <button className="auth-btn" type="submit" disabled={loading}>
        {loading ? 'Masuk...' : 'Masuk'}
      </button>

      <p className="auth-switch">
        Belum punya akun?{' '}
        <button type="button" onClick={onSwitch}>Daftar</button>
      </p>
    </form>
  );
};

// ── Main AuthPage ─────────────────────────────────────────────────
const AuthPage = ({ onAuthenticated }) => {
  const [mode, setMode] = useState('login'); // login | register | otp
  const [pendingEmail, setPendingEmail] = useState('');

  const handleOTPSent = (email) => {
    setPendingEmail(email);
    setMode('otp');
  };

  const handleSuccess = (token, user) => {
    localStorage.setItem('mirei_token', token);
    localStorage.setItem('mirei_user', JSON.stringify(user));
    onAuthenticated(user);
  };

  return (
    <div className="auth-page">
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />
      <div className="auth-card">
        {mode === 'login' && (
          <LoginForm onSwitch={() => setMode('register')} onSuccess={handleSuccess} />
        )}
        {mode === 'register' && (
          <RegisterForm onSwitch={() => setMode('login')} onOTPSent={handleOTPSent} onSuccess={handleSuccess} />
        )}
        {mode === 'otp' && (
          <OTPForm email={pendingEmail} onSuccess={handleSuccess} />
        )}
      </div>
    </div>
  );
};

export default AuthPage;
