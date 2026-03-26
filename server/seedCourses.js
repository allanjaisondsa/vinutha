const sequelize = require('./db');
const { Course, Lesson } = require('./models/Course');

const newCourses = [
  {
    title: 'Resin Art Basic Course',
    description: 'Perfect for beginners. Learn Theory & Safety, Science of Mixing, Color Chemistry, and Vendors. Hands-on projects include Wall Art, Letter Keychain, and Name Plate.',
    price: 4500,
    category: 'Basic',
    thumbnail: '',
    lessons: [
      { title: 'Theory & Safety', description: 'Introduction to resin safety and handling.', videoUrl: 'pending', duration: '15:00' },
      { title: 'The Science of Mixing', description: 'Proper ratios and mixing techniques.', videoUrl: 'pending', duration: '20:00' },
      { title: 'Color Chemistry', description: 'Working with pigments and dyes.', videoUrl: 'pending', duration: '18:00' },
      { title: 'Hands-on: Wall Art', description: 'Create your first piece of wall art.', videoUrl: 'pending', duration: '45:00' },
      { title: 'Hands-on: Letter Keychain', description: 'Making functional keychains.', videoUrl: 'pending', duration: '30:00' },
      { title: 'Hands-on: Name Plate', description: 'Designing a custom name plate.', videoUrl: 'pending', duration: '40:00' },
      { title: 'Product Purchase Vendors', description: 'Where to buy your supplies.', videoUrl: 'pending', duration: '10:00' }
    ]
  },
  {
    title: 'Resin Art Advance Course',
    description: 'Take your skills to the next level. Includes everything from Basic, plus Layering & Depth, Blow torch techniques, Geode Art, Gold leaf, and Beach Art Clock.',
    price: 7500,
    category: 'Advance',
    thumbnail: '',
    lessons: [
      { title: 'Theory & Safety', description: 'Safety review.', videoUrl: 'pending', duration: '10:00' },
      { title: 'The Science of Mixing & Color Chemistry', description: 'Advanced mixing techniques.', videoUrl: 'pending', duration: '25:00' },
      { title: 'Layering & Depth', description: 'Creating 3D effects.', videoUrl: 'pending', duration: '35:00' },
      { title: 'Blow Torch Techniques', description: 'Removing bubbles and creating cells.', videoUrl: 'pending', duration: '15:00' },
      { title: 'Geode Art', description: 'Simulating natural stone.', videoUrl: 'pending', duration: '50:00' },
      { title: 'Gold Leaf Technique', description: 'Adding metallic accents.', videoUrl: 'pending', duration: '20:00' },
      { title: 'Hands-on: Beach Art Clock', description: 'Creating realistic waves.', videoUrl: 'pending', duration: '60:00' },
      { title: 'Hands-on: Jewellery Making using Bezel', description: 'Fine resin jewelry.', videoUrl: 'pending', duration: '45:00' },
      { title: 'Tips & Tricks', description: 'Professional finishing.', videoUrl: 'pending', duration: '15:00' }
    ]
  },
  {
    title: 'Resin Business Course',
    description: 'Everything from Advance, plus Flower Preservation, Floral Jewellery, Tissue Holder, Finishing School, Pricing for Profit, Catalogue Creation, and Instagram Advertising.',
    price: 16000,
    category: 'Business',
    thumbnail: '',
    lessons: [
      { title: 'Theory & Safety', description: 'Review of safety basics.', videoUrl: 'pending', duration: '10:00' },
      { title: 'Hands-on: Flower Preservation', description: 'Drying and casting flowers.', videoUrl: 'pending', duration: '60:00' },
      { title: 'Hands-on: Floral Jewellery Making', description: 'Small-scale botanical casting.', videoUrl: 'pending', duration: '45:00' },
      { title: 'Hands-on: Tissue Holder', description: 'Casting functional home decor.', videoUrl: 'pending', duration: '55:00' },
      { title: 'Shaping Technique & Finishing School', description: 'Sanding, polishing, and perfect edges.', videoUrl: 'pending', duration: '40:00' },
      { title: 'Pricing for Profit', description: 'Calculating costs and retail value.', videoUrl: 'pending', duration: '30:00' },
      { title: 'Catalogue Creation', description: 'Photographing and presenting your work.', videoUrl: 'pending', duration: '35:00' },
      { title: 'Instagram Advertising', description: 'Marketing your resin business online.', videoUrl: 'pending', duration: '45:00' },
      { title: 'Product Purchase Vendors', description: 'Comprehensive vendor list.', videoUrl: 'pending', duration: '15:00' }
    ]
  },
  {
    title: 'Flower Preservation Masterclass',
    description: 'A specialized course focused entirely on the delicate art of drying, preparing, and casting botanical elements in resin without burning or color loss.',
    price: 5500,
    category: 'Flower Preservation',
    thumbnail: '',
    lessons: [
      { title: 'Flower Drying Techniques', description: 'Silica gel vs pressing.', videoUrl: 'pending', duration: '30:00' },
      { title: 'Preparation & Layout', description: 'Designing the floral arrangement.', videoUrl: 'pending', duration: '40:00' },
      { title: 'Deep Pouring Resin', description: 'Understanding deep pour vs coating resin.', videoUrl: 'pending', duration: '45:00' },
      { title: 'Layering & Bubble Control', description: 'Keeping flowers pristine.', videoUrl: 'pending', duration: '35:00' },
      { title: 'Finishing & Polishing', description: 'Achieving a glass-like finish.', videoUrl: 'pending', duration: '50:00' }
    ]
  }
];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Connected to MySQL DB');

    // Only needed if you want to wipe old courses
    // await Course.destroy({ where: {} });

    for (const data of newCourses) {
      const course = await Course.create({
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
        thumbnail: data.thumbnail
      });

      console.log(`Created course: ${course.title} (ID: ${course.id})`);

      for (let i = 0; i < data.lessons.length; i++) {
        const l = data.lessons[i];
        await Lesson.create({
          courseId: course.id,
          title: l.title,
          description: l.description,
          videoUrl: l.videoUrl,
          duration: l.duration,
          order: i
        });
      }
      console.log(`  Added ${data.lessons.length} lessons`);
    }

    console.log('Seed complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
