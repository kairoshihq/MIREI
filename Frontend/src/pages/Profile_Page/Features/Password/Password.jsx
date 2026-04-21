import React, { useState } from 'react';
import './password.css';

const API = 'http://localhost:3000/api';

function getAuthHeaders() {
  const token = localStorage.getItem('mirei_token');
  return { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

const PasswordModal = ({ onClose, onSuccess }) => {
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
    <div className="pw-overlay" onClick={onClose}>
      <div className="pw-modal" onClick={e => e.stopPropagation()}>
        <div className="pw-header">
          <h3 className="pw-title">Ubah Password</h3>
          <p className="pw-subtitle">Masukkan password lama dan password baru kamu</p>
        </div>

        <form onSubmit={handleSubmit} className="pw-form">
          {[
            { key: 'current', label: 'Password Lama',       placeholder: 'Password saat ini' },
            { key: 'next',    label: 'Password Baru',       placeholder: 'Minimal 6 karakter' },
            { key: 'confirm', label: 'Konfirmasi Password', placeholder: 'Ulangi password baru' },
          ].map(({ key, label, placeholder }) => (
            <div key={key} className="pw-field">
              <label className="pw-field-label">{label}</label>
              <input
                type="password"
                placeholder={placeholder}
                value={form[key]}
                onChange={e => set(key, e.target.value)}
                required
                className="pw-input"
              />
            </div>
          ))}

          {error && <div className="pw-alert">{error}</div>}

          <div className="pw-actions">
            <button type="button" onClick={onClose} className="pw-btn-cancel">Batal</button>
            <button type="submit" disabled={loading} className="pw-btn-submit">
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordModal;
