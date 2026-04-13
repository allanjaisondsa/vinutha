require('dotenv').config();
const { sequelize, User, Course, Lesson, Product } = require('./models/index');

async function seed() {
  await sequelize.sync();
  console.log('Tables synced');

  // Admin
  let admin = await User.findOne({ where: { email: 'admin@resartz.com' } });
  if (!admin) {
    admin = await User.create({
      name: 'Admin',
      email: 'admin@resartz.com',
      password: 'admin123',
      role: 'admin',
      isRegistered: true,
    });
    console.log('✅ Admin created: admin@resartz.com / admin123');
  } else {
    console.log('ℹ️  Admin already exists');
  }

  // Sample course
  const count = await Course.count();
  if (count === 0) {
    const course = await Course.create({
      title: 'Resin Art for Beginners',
      description: 'Learn everything you need to start your resin art journey. From basics to beautiful creations.',
      thumbnail: 'https://images.unsplash.com/photo-1607988795691-3d0147b43231?w=600',
      price: 1499,
      category: 'Resin Art',
      isPublished: true,
    });
    await Lesson.bulkCreate([
      { title: 'Introduction to Resin', description: 'What is resin? Types, safety, and tools.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '10:30', courseId: course.id, order: 0 },
      { title: 'Your First Pour', description: 'Step-by-step guide to your first resin pour.', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '18:45', courseId: course.id, order: 1 },
    ]);
    console.log('✅ Sample course + lessons created');
  }

  // Sample product
  const pcount = await Product.count();
  if (pcount === 0) {
    await Product.create({
      title: 'Resin Art Starter Kit',
      description: 'Everything you need to start your resin art journey. Includes molds, pigments, and resin.',
      images: ['https://images.unsplash.com/photo-1607988795691-3d0147b43231?w=600'],
      price: 2499,
      category: 'Kits',
      inStock: true,
    });
    console.log('✅ Sample product created');
  }

  console.log('\n🎉 Seed complete!');
  process.exit(0);
}

seed().catch((err) => { console.error(err); process.exit(1); });
