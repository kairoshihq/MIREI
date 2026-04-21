// services/authService.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { dbRun, dbGet, dbInsert } = require('../config/database');

// ── Email transporter ─────────────────────────────────────────────
function getTransporter() {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    family: 4,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: { rejectUnauthorized: false },
  });
}

// ── Helpers ───────────────────────────────────────────────────────
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateToken(userId, email) {
  return jwt.sign(
    { userId, email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function logActivity(userId, action) {
  const now = new Date().toISOString();
  try {
    dbRun('INSERT INTO activity_log (user_id, action, created_at) VALUES (?, ?, ?)', [userId, action, now]);
    dbRun('UPDATE users SET last_activity_at = ? WHERE id = ?', [now, userId]);
  } catch (_) {}
}

async function sendOTPEmail(email, otp) {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: `"Mirei App" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Kode Verifikasi Mirei',
    html: `
      <div style="font-family:sans-serif;max-width:400px;margin:auto;padding:32px;background:#0c0e16;color:#eeeef5;border-radius:16px;">
        <h2 style="color:#a78bfa;margin-bottom:8px;">Mirei ✦</h2>
        <p style="color:#9899b8;">Kode verifikasi kamu:</p>
        <div style="font-size:36px;font-weight:700;letter-spacing:8px;color:#fff;margin:24px 0;text-align:center;background:#1a1b2e;padding:20px;border-radius:12px;border:1px solid rgba(139,92,246,0.3);">
          ${otp}
        </div>
        <p style="color:#9899b8;font-size:13px;">Berlaku selama <strong style="color:#a78bfa;">10 menit</strong>. Jangan bagikan kode ini ke siapapun.</p>
      </div>
    `,
  });
}

// ── Register ──────────────────────────────────────────────────────
async function register(email, password, username) {
  const existing = dbGet('SELECT id FROM users WHERE email = ?', [email]);
  if (existing) throw new Error('Email sudah terdaftar');

  const passwordHash = await bcrypt.hash(password, 10);

  // Simpan user belum verified, kirim OTP
  const id = dbInsert(
    'INSERT INTO users (email, username, password, verified) VALUES (?, ?, ?, 0)',
    [email, username, passwordHash]
  );

  const otp = generateOTP();
  const expiresAt = Date.now() + 10 * 60 * 1000;
  dbRun(
    'INSERT OR REPLACE INTO otp_codes (email, code, expires_at) VALUES (?, ?, ?)',
    [email, otp, expiresAt]
  );

  await sendOTPEmail(email, otp);
  return { message: 'OTP telah dikirim ke email kamu' };
}

// ── Verify OTP ────────────────────────────────────────────────────
function verifyOTP(email, code) {
  const stored = dbGet('SELECT * FROM otp_codes WHERE email = ?', [email]);
  if (!stored) throw new Error('OTP tidak ditemukan, daftar ulang');
  if (Date.now() > stored.expires_at) {
    dbRun('DELETE FROM otp_codes WHERE email = ?', [email]);
    throw new Error('OTP sudah kadaluarsa');
  }
  if (stored.code !== code) throw new Error('Kode OTP salah');

  dbRun('UPDATE users SET verified = 1 WHERE email = ?', [email]);
  dbRun('DELETE FROM otp_codes WHERE email = ?', [email]);

  const user = dbGet('SELECT id, email, username, created_at FROM users WHERE email = ?', [email]);
  const token = generateToken(user.id, user.email);
  return { token, user: { id: user.id, email: user.email, username: user.username, created_at: user.created_at } };
}

// ── Login ─────────────────────────────────────────────────────────
async function login(email, password) {
  const user = dbGet('SELECT * FROM users WHERE email = ?', [email]);
  if (!user) throw new Error('Email tidak terdaftar');
  if (!user.verified) throw new Error('Email belum diverifikasi, cek inbox kamu');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Password salah');

  const now = new Date().toISOString();
  dbRun('UPDATE users SET last_activity_at = ? WHERE id = ?', [now, user.id]);
  logActivity(user.id, 'Login berhasil');

  const token = generateToken(user.id, user.email);
  return { token, user: { id: user.id, email: user.email, username: user.username, created_at: user.created_at, email_verified: user.email_verified } };
}

// ── Resend OTP ────────────────────────────────────────────────────
async function resendOTP(email) {
  const user = dbGet('SELECT id FROM users WHERE email = ?', [email]);
  if (!user) throw new Error('Email tidak terdaftar');

  const otp = generateOTP();
  const expiresAt = Date.now() + 10 * 60 * 1000;
  dbRun(
    'INSERT OR REPLACE INTO otp_codes (email, code, expires_at) VALUES (?, ?, ?)',
    [email, otp, expiresAt]
  );

  await sendOTPEmail(email, otp);
  return { message: 'OTP baru telah dikirim' };
}

// ── Get user by ID (untuk middleware) ────────────────────────────
function getUserById(id) {
  return dbGet('SELECT id, email, username, email_verified, email_changed_at, last_activity_at FROM users WHERE id = ?', [id]);
}

// ── Send email verification magic link ───────────────────────────
async function sendVerificationLink(userId) {
  const user = dbGet('SELECT id, email, email_verified FROM users WHERE id = ?', [userId]);
  if (!user) throw new Error('User tidak ditemukan');
  if (user.email_verified) throw new Error('Email sudah terverifikasi');

  const crypto = require('crypto');
  const token  = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 30 * 60 * 1000; // 30 menit

  dbRun('DELETE FROM email_verify_tokens WHERE user_id = ?', [userId]);
  dbRun(
    'INSERT INTO email_verify_tokens (token, user_id, expires_at) VALUES (?, ?, ?)',
    [token, userId, expiresAt]
  );

  const API_URL  = process.env.API_URL  || 'http://localhost:3000';
  const verifyUrl = `${API_URL}/api/auth/verify-email?token=${token}`;

  const transporter = getTransporter();
  await transporter.sendMail({
    from: `"Mirei App" <${process.env.EMAIL_USER}>`,
    to: user.email,
    subject: 'Verifikasi Email Kamu — Mirei',
    html: `
      <div style="font-family:sans-serif;max-width:440px;margin:auto;padding:36px;background:#0c0e16;color:#eeeef5;border-radius:16px;">
        <h2 style="color:#a78bfa;margin-bottom:4px;">Mirei ✦</h2>
        <p style="color:#9899b8;margin-bottom:24px;">Halo! Klik tombol di bawah untuk memverifikasi email kamu.</p>
        <a href="${verifyUrl}"
           style="display:inline-block;padding:14px 28px;background:linear-gradient(135deg,#7c3aed,#a855f7);color:#fff;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px;letter-spacing:0.02em;">
          ✅ Verifikasi Email
        </a>
        <p style="color:#9899b8;font-size:12px;margin-top:24px;">
          Link berlaku selama <strong style="color:#a78bfa;">30 menit</strong>.<br>
          Jika kamu tidak meminta ini, abaikan email ini.
        </p>
        <p style="color:#555;font-size:11px;margin-top:8px;">Atau salin link ini:<br>
          <span style="color:#a78bfa;word-break:break-all;">${verifyUrl}</span>
        </p>
      </div>
    `,
  });

  return { message: 'Link verifikasi telah dikirim ke email kamu' };
}

// ── Verify magic link token ───────────────────────────────────────
function verifyEmailToken(token) {
  const record = dbGet('SELECT * FROM email_verify_tokens WHERE token = ?', [token]);
  if (!record) throw new Error('Link verifikasi tidak valid atau sudah digunakan');
  if (Date.now() > record.expires_at) {
    dbRun('DELETE FROM email_verify_tokens WHERE token = ?', [token]);
    throw new Error('Link verifikasi sudah kadaluarsa');
  }

  const now = new Date().toISOString();
  dbRun('UPDATE users SET email_verified = 1, last_activity_at = ? WHERE id = ?', [now, record.user_id]);
  dbRun('DELETE FROM email_verify_tokens WHERE token = ?', [token]);
  logActivity(record.user_id, 'Email berhasil diverifikasi');

  const user = dbGet('SELECT id, email, username, email_verified, created_at FROM users WHERE id = ?', [record.user_id]);
  return { message: 'Email berhasil diverifikasi!', user };
}

// ── Request email change — validasi password, kirim OTP ke email baru ──
async function requestEmailChange(userId, newEmail, password) {
  const user = dbGet('SELECT * FROM users WHERE id = ?', [userId]);
  if (!user) throw new Error('User tidak ditemukan');

  // Validasi format email
  const emailRegex = /^[^\s@]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,6}$/;
  if (!emailRegex.test(newEmail)) throw new Error('Format email tidak valid');

  // Cek email tidak sama dengan email saat ini
  if (user.email.toLowerCase() === newEmail.toLowerCase()) {
    throw new Error('Email baru tidak boleh sama dengan email saat ini');
  }

  // Cek email sudah dipakai akun lain — cast id ke integer untuk keamanan
  const emailTaken = dbGet('SELECT id FROM users WHERE LOWER(email) = LOWER(?) AND CAST(id AS INTEGER) != CAST(? AS INTEGER)', [newEmail, userId]);
  if (emailTaken) throw new Error('Email sudah digunakan akun lain');

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Password salah');

  const otp = generateOTP();
  const expiresAt = Date.now() + 10 * 60 * 1000;

  // Simpan OTP dengan key khusus ganti email: "change:{userId}:{newEmail}"
  const key = `change:${userId}:${newEmail}`;
  dbRun('INSERT OR REPLACE INTO otp_codes (email, code, expires_at) VALUES (?, ?, ?)', [key, otp, expiresAt]);

  const transporter = getTransporter();
  await transporter.sendMail({
    from: `"Mirei App" <${process.env.EMAIL_USER}>`,
    to: newEmail,
    subject: 'Konfirmasi Ganti Email — Mirei',
    html: `
      <div style="font-family:sans-serif;max-width:400px;margin:auto;padding:32px;background:#0c0e16;color:#eeeef5;border-radius:16px;">
        <h2 style="color:#a78bfa;margin-bottom:8px;">Mirei ✦</h2>
        <p style="color:#9899b8;">Kode konfirmasi untuk mengganti email kamu:</p>
        <div style="font-size:36px;font-weight:700;letter-spacing:8px;color:#fff;margin:24px 0;text-align:center;background:#1a1b2e;padding:20px;border-radius:12px;border:1px solid rgba(139,92,246,0.3);">
          ${otp}
        </div>
        <p style="color:#9899b8;font-size:13px;">Berlaku selama <strong style="color:#a78bfa;">10 menit</strong>. Jangan bagikan kode ini ke siapapun.</p>
      </div>
    `,
  });

  return { message: `Kode OTP telah dikirim ke ${newEmail}` };
}

// ── Confirm email change — verifikasi OTP, update email ──────────
async function confirmEmailChange(userId, newEmail, code) {
  const key    = `change:${userId}:${newEmail}`;
  const stored = dbGet('SELECT * FROM otp_codes WHERE email = ?', [key]);
  if (!stored) throw new Error('OTP tidak ditemukan atau sudah kadaluarsa');
  if (Date.now() > stored.expires_at) {
    dbRun('DELETE FROM otp_codes WHERE email = ?', [key]);
    throw new Error('OTP sudah kadaluarsa');
  }
  if (stored.code !== code) throw new Error('Kode OTP salah');

  const now = new Date().toISOString();
  // Reset email_verified karena email baru belum diverifikasi
  dbRun(
    'UPDATE users SET email = ?, email_verified = 0, email_changed_at = ?, last_activity_at = ? WHERE id = ?',
    [newEmail, now, now, userId]
  );
  dbRun('DELETE FROM otp_codes WHERE email = ?', [key]);
  logActivity(userId, `Email diubah ke ${newEmail}`);

  const user = dbGet('SELECT id, email, username, email_verified, email_changed_at, last_activity_at, created_at FROM users WHERE id = ?', [userId]);
  return { message: 'Email berhasil diperbarui', user };
}

module.exports = { register, verifyOTP, login, resendOTP, getUserById, sendVerificationLink, verifyEmailToken, requestEmailChange, confirmEmailChange };
