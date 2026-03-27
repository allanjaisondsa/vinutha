const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegStatic = require('ffmpeg-static');
const { protect, adminOnly } = require('../middleware/authMiddleware');

ffmpeg.setFfmpegPath(ffmpegStatic);
const router = express.Router();

// Shared storage: saves all uploads to server/uploads/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
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

    const rawPath = req.file.path;
    const baseName = req.file.filename.split('.')[0];
    const hlsDir = path.join(__dirname, '../uploads/hls', baseName);
    
    // Create directory for HLS segments
    if (!fs.existsSync(hlsDir)) {
      fs.mkdirSync(hlsDir, { recursive: true });
    }

    const m3u8Path = path.join(hlsDir, 'index.m3u8');

    // Convert to HLS using codec copy for blazing speed (requires H.264 MP4 input)
    ffmpeg(rawPath)
      .outputOptions([
        '-c:v copy',
        '-c:a copy',
        '-f hls',
        '-hls_time 10',          // 10 second segments
        '-hls_list_size 0',      // keep all segments in the playlist
      ])
      .output(m3u8Path)
      .on('end', () => {
        // Delete original raw mp4
        fs.unlink(rawPath, () => {});
        res.json({ 
          url: `/uploads/hls/${baseName}/index.m3u8`, 
          filename: req.file.originalname 
        });
      })
      .on('error', (ffmpegErr) => {
        console.error('FFmpeg HLS Error:', ffmpegErr);
        res.status(500).json({ message: 'Error processing video into HLS' });
      })
      .run();
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
