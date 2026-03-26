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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── API routes ────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

// ── Serve React build from server/public/ ─────────────────────────────
// On deploy: copy contents of client/dist/ into server/public/
const publicDir = path.join(__dirname, 'public');
app.use('/', express.static(publicDir));

// Catch-all for React client-side routes (Express 5: named wildcard)
app.get('/*path', (req, res) => {
  res.sendFile(path.join(publicDir, 'index.html'));
});

// ── Start server ──────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true }).then(() => {
  console.log('✅ MySQL tables synced');
  app.listen(PORT, () => {
    console.log(`🚀 Server running — app at / (port ${PORT})`);
  });
}).catch((err) => {
  console.error('❌ DB sync error:', err.message);
  process.exit(1);
});
