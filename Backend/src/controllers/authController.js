// controllers/authController.js
const { register, verifyOTP, login, resendOTP } = require('../services/authService');

async function handleRegister(req, res) {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res.status(400).json({ success: false, error: 'Email, password, dan username wajib diisi' });
    }
    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password minimal 6 karakter' });
    }
    const result = await register(email, password, username);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
}

async function handleVerifyOTP(req, res) {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ success: false, error: 'Email dan kode OTP wajib diisi' });
    }
    const result = verifyOTP(email, code);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
}

async function handleLogin(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email dan password wajib diisi' });
    }
    const result = await login(email, password);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
}

async function handleResendOTP(req, res) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ success: false, error: 'Email wajib diisi' });
    const result = await resendOTP(email);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
}

// GET /api/auth/me — validasi token & return user info
function handleMe(req, res) {
  res.json({ success: true, user: req.user });
}
module.exports = { handleRegister, handleVerifyOTP, handleLogin, handleResendOTP, handleMe };
