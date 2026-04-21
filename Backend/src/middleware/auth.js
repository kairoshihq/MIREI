// middleware/auth.js
const jwt = require('jsonwebtoken');
const { getUserById } = require('../services/authService');

function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ success: false, error: 'Token tidak ditemukan' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = getUserById(decoded.userId);
    if (!user) {
      return res.status(401).json({ success: false, error: 'User tidak ditemukan' });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ success: false, error: 'Token tidak valid atau kadaluarsa' });
  }
}

module.exports = authMiddleware;
