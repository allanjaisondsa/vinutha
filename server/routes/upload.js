const express = require('express');
const multer = require('multer');
const path = require('path');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

// Shared storage: saves all uploads to server/uploads/
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e6);
    const ext = path.extname(file.originalname);
    cb(null, `${req.uploadPrefix || 'file'}-${unique}${ext}`);
  },
});

// Video upload (2 GB max, video formats only)
const videoUpload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = /mp4|mov|avi|mkv|webm/.test(path.extname(file.originalname).toLowerCase());
    ok ? cb(null, true) : cb(new Error('Only video files are allowed (mp4, mov, avi, mkv, webm)'));
  },
});

// Image upload (10 MB max, image formats only)
const imageUpload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = /jpg|jpeg|png|gif|webp|avif/.test(path.extname(file.originalname).toLowerCase());
    ok ? cb(null, true) : cb(new Error('Only image files are allowed (jpg, png, gif, webp)'));
  },
});

// POST /api/upload/video — admin only
router.post('/video', protect, adminOnly, (req, res) => {
  req.uploadPrefix = 'video';
  videoUpload.single('video')(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    res.json({ url: `/uploads/${req.file.filename}`, filename: req.file.filename });
  });
});

// POST /api/upload/image — admin only
router.post('/image', protect, adminOnly, (req, res) => {
  req.uploadPrefix = 'img';
  imageUpload.single('image')(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message });
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    res.json({ url: `/uploads/${req.file.filename}`, filename: req.file.filename });
  });
});

module.exports = router;
