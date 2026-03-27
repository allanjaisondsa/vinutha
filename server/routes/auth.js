const express = require('express');
const jwt = require('jsonwebtoken');
const { User, Course, Product } = require('../models/index');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Cookie options — httpOnly prevents JS access, sameSite protects against CSRF
const cookieOptions = {
  httpOnly: true,
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
  secure: process.env.NODE_ENV === 'production', // HTTPS only in prod
};

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// POST /api/auth/register — set password using invite token
router.post('/register', async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password)
    return res.status(400).json({ message: 'Token and password are required' });

  try {
    const user = await User.findOne({ where: { inviteToken: token, isRegistered: false } });
    if (!user)
      return res.status(400).json({ message: 'Invalid or already used invite link' });

    user.password = password;
    user.isRegistered = true;
    user.inviteToken = null;
    await user.save();

    // Set JWT as HTTP-only cookie
    res.cookie('token', generateToken(user.id), cookieOptions);
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });

    // Set JWT as HTTP-only cookie
    res.cookie('token', generateToken(user.id), cookieOptions);
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/logout — clear the cookie
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
});

// GET /api/auth/me — returns current user based on cookie
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'inviteToken'] },
      include: [
        { model: Course, as: 'purchasedCourses', attributes: ['id', 'title', 'thumbnail', 'category', 'price'] },
        { model: Product, as: 'purchasedProducts', attributes: ['id', 'title', 'images', 'price'] },
      ],
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
