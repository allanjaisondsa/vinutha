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
const { Catalogue } = require('./models/index');

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
app.get('/api/catalogue', async (_req, res) => {
  try {
    const items = await Catalogue.findAll({ order: [['order', 'ASC'], ['id', 'ASC']] });
    res.json(items);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

app.get('/api/catalogue/:id', async (req, res) => {
  try {
    const { Product } = require('./models/index');
    const item = await Catalogue.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    const products = await Product.findAll({ where: { category: item.category } });
    res.json({ ...item.toJSON(), products });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

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

sequelize.sync().then(() => {
  console.log('✅ MySQL tables synced');
  app.listen(PORT, () => {
    console.log(`🚀 Server running — app at / (port ${PORT})`);
  });
}).catch((err) => {
  console.error('❌ DB sync error:', err.message);
  process.exit(1);
});
