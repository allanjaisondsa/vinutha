const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { User, Course, Lesson, Product, UserCourse, UserProduct } = require('../models/index');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

router.use(protect, adminOnly);

// ─── USER MANAGEMENT ─────────────────────────────────────────────

// POST /api/admin/create-user
router.post('/create-user', async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ message: 'Name and email required' });
  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ message: 'User with this email already exists' });

    const inviteToken = uuidv4();
    const user = await User.create({ name, email, inviteToken });
    const inviteLink = `${process.env.CLIENT_URL}/vinutha/register?token=${inviteToken}`;
    res.json({ message: 'Invite created', user: { id: user.id, name: user.name, email: user.email }, inviteLink });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const users = await User.findAll({
      where: { role: 'user' },
      attributes: { exclude: ['password', 'inviteToken'] },
      include: [
        { model: Course, as: 'purchasedCourses', attributes: ['id', 'title'] },
        { model: Product, as: 'purchasedProducts', attributes: ['id', 'title'] },
      ],
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/admin/assign-course
router.post('/assign-course', async (req, res) => {
  const { userId, courseId } = req.body;
  try {
    const user = await User.findByPk(userId);
    const course = await Course.findByPk(courseId);
    if (!user || !course) return res.status(404).json({ message: 'User or course not found' });
    await user.addPurchasedCourse(course);
    res.json({ message: 'Course assigned successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/admin/remove-course
router.post('/remove-course', async (req, res) => {
  const { userId, courseId } = req.body;
  try {
    const user = await User.findByPk(userId);
    const course = await Course.findByPk(courseId);
    if (!user || !course) return res.status(404).json({ message: 'User or course not found' });
    await user.removePurchasedCourse(course);
    res.json({ message: 'Course removed successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', async (req, res) => {
  try {
    await User.destroy({ where: { id: req.params.id } });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── COURSE MANAGEMENT ────────────────────────────────────────────

// GET /api/admin/courses (all courses including unpublished)
router.get('/courses', async (req, res) => {
  try {
    const courses = await Course.findAll({
      include: [{ model: Lesson, as: 'lessons' }],
    });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/admin/courses
router.post('/courses', async (req, res) => {
  try {
    const { title, description, thumbnail, price, category, isPublished, lessons } = req.body;
    const course = await Course.create({ title, description, thumbnail, price, category, isPublished });

    if (lessons && lessons.length > 0) {
      const lessonData = lessons.map((l, i) => ({ ...l, courseId: course.id, order: i }));
      await Lesson.bulkCreate(lessonData);
    }

    const full = await Course.findByPk(course.id, { include: [{ model: Lesson, as: 'lessons' }] });
    res.status(201).json(full);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/courses/:id
router.put('/courses/:id', async (req, res) => {
  try {
    const { title, description, thumbnail, price, category, isPublished, lessons } = req.body;
    await Course.update({ title, description, thumbnail, price, category, isPublished }, { where: { id: req.params.id } });

    if (lessons) {
      await Lesson.destroy({ where: { courseId: req.params.id } });
      if (lessons.length > 0) {
        const lessonData = lessons.map((l, i) => ({ ...l, courseId: req.params.id, order: i }));
        await Lesson.bulkCreate(lessonData);
      }
    }

    const full = await Course.findByPk(req.params.id, { include: [{ model: Lesson, as: 'lessons' }] });
    res.json(full);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admin/courses/:id
router.delete('/courses/:id', async (req, res) => {
  try {
    await Course.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── PRODUCT MANAGEMENT ────────────────────────────────────────────

// GET /api/admin/products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/admin/products
router.post('/products', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/products/:id
router.put('/products/:id', async (req, res) => {
  try {
    await Product.update(req.body, { where: { id: req.params.id } });
    const product = await Product.findByPk(req.params.id);
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admin/products/:id
router.delete('/products/:id', async (req, res) => {
  try {
    await Product.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
