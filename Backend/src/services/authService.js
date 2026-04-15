// services/authService.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// ── In-memory stores ──────────────────────────────────────────────
const users = new Map();
const otpStore = new Map();

// ── Transporter (lazy init agar dotenv sudah terbaca) ─────────────
function getTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
}

// ── Helpers ───────────────────────────────────────────────────────
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateToken(email) {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

// ── Send OTP email ────────────────────────────────────────────────
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
  if (users.has(email)) {
    throw new Error('Email sudah terdaftar');
  }

  const passwordHash = await bcrypt.hash(password, 10);
  users.set(email, { email, passwordHash, username, isVerified: false });

  const otp = generateOTP();
  otpStore.set(email, { code: otp, expiresAt: Date.now() + 10 * 60 * 1000 });

  await sendOTPEmail(email, otp);
  return { message: 'OTP telah dikirim ke email kamu' };
}

// ── Verify OTP ────────────────────────────────────────────────────
function verifyOTP(email, code) {
  const stored = otpStore.get(email);
  if (!stored) throw new Error('OTP tidak ditemukan, daftar ulang');
  if (Date.now() > stored.expiresAt) throw new Error('OTP sudah kadaluarsa');
  if (stored.code !== code) throw new Error('Kode OTP salah');

  const user = users.get(email);
  user.isVerified = true;
  otpStore.delete(email);

  const token = generateToken(email);
  return { token, user: { email: user.email, username: user.username } };
}

// ── Login ─────────────────────────────────────────────────────────
async function login(email, password) {
  const user = users.get(email);
  if (!user) throw new Error('Email tidak terdaftar');
  if (!user.isVerified) throw new Error('Email belum diverifikasi');

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) throw new Error('Password salah');

  const token = generateToken(email);
  return { token, user: { email: user.email, username: user.username } };
}

// ── Resend OTP ────────────────────────────────────────────────────
async function resendOTP(email) {
  if (!users.has(email)) throw new Error('Email tidak terdaftar');

  const otp = generateOTP();
  otpStore.set(email, { code: otp, expiresAt: Date.now() + 10 * 60 * 1000 });
  await sendOTPEmail(email, otp);
  return { message: 'OTP baru telah dikirim' };
}

module.exports = { register, verifyOTP, login, resendOTP };
