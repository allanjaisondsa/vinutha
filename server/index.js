const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const { sequelize } = require('./models/index');
const authRoutes = require('./routes/auth');
const courseRoutes = require('./routes/courses');
const productRoutes = require('./routes/products');
const adminRoutes = require('./routes/admin');
const uploadRoutes = require('./routes/upload');

const app = express();

// ── CORS ─────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// ── Uploaded files ────────────────────────────────────────────────────
app.use('/vinutha/uploads', express.static(path.join(__dirname, 'uploads')));

// ── API routes ────────────────────────────────────────────────────────
app.use('/vinutha/api/auth', authRoutes);
app.use('/vinutha/api/courses', courseRoutes);
app.use('/vinutha/api/products', productRoutes);
app.use('/vinutha/api/admin', adminRoutes);
app.use('/vinutha/api/upload', uploadRoutes);
app.get('/vinutha/api/health', (req, res) => res.json({ status: 'OK' }));

// ── Serve React build from server/public/ ─────────────────────────────
// On deploy: copy contents of client/dist/ into server/public/
const publicDir = path.join(__dirname, 'public');
app.use('/vinutha', express.static(publicDir));

// Serve index.html for /vinutha and /vinutha/ explicitly
app.get('/vinutha', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});
app.get('/vinutha/', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Catch-all for React client-side routes (Express 5: named wildcard)
app.get('/vinutha/*path', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Root → redirect to app
app.get('/', (req, res) => res.redirect('/vinutha/'));

// ── Start server ──────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }).then(() => {
  console.log('✅ MySQL tables synced');
  app.listen(PORT, () => {
    console.log(`🚀 Server running — app at /vinutha/ (port ${PORT})`);
  });
}).catch((err) => {
  console.error('❌ DB sync error:', err.message);
  process.exit(1);
});
