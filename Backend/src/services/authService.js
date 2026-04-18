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

  const token = generateToken(user.id, user.email);
  return { token, user: { id: user.id, email: user.email, username: user.username, created_at: user.created_at } };
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
  return dbGet('SELECT id, email, username FROM users WHERE id = ?', [id]);
}

module.exports = { register, verifyOTP, login, resendOTP, getUserById };
