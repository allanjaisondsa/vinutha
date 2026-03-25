const jwt = require('jsonwebtoken');
const { User } = require('../models/index');

const protect = async (req, res, next) => {
  // Read JWT from HTTP-only cookie named 'token'
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: 'Not authorized, no token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password', 'inviteToken'] },
    });
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalid or expired' });
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next();
  res.status(403).json({ message: 'Admin access required' });
};

module.exports = { protect, adminOnly };
