const express = require('express');
const { Course, Lesson } = require('../models/index');
const { protect } = require('../middleware/authMiddleware');
const { User } = require('../models/index');
const router = express.Router();

// GET /api/courses — public, all published courses (no lessons)
router.get('/', async (req, res) => {
  try {
    const courses = await Course.findAll({
      where: { isPublished: true },
      attributes: ['id', 'title', 'description', 'thumbnail', 'price', 'category', 'createdAt'],
    });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/courses/:id/info — PUBLIC preview (lesson titles/durations only, no video URLs)
router.get('/:id/info', async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      attributes: ['id', 'title', 'description', 'thumbnail', 'price', 'category', 'createdAt'],
      include: [{
        model: Lesson,
        as: 'lessons',
        attributes: ['id', 'title', 'description', 'duration', 'order'],  // no videoUrl
      }],
    });
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// GET /api/courses/:id — protected, full course with lessons
router.get('/:id', protect, async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id, {
      include: [{ model: Lesson, as: 'lessons', order: [['order', 'ASC']] }],
    });
    if (!course) return res.status(404).json({ message: 'Course not found' });

    if (req.user.role !== 'admin') {
      const user = await User.findByPk(req.user.id, {
        include: [{ model: Course, as: 'purchasedCourses', attributes: ['id'] }],
      });
      const hasPurchased = user.purchasedCourses.some((c) => c.id === parseInt(req.params.id));
      if (!hasPurchased)
        return res.status(403).json({ message: 'You have not purchased this course' });
    }

    res.json(course);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
