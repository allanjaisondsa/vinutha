const sequelize = require('../db');
const { DataTypes } = require('sequelize');

// Course table
const Course = sequelize.define('Course', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  thumbnail: { type: DataTypes.STRING },
  price: { type: DataTypes.FLOAT, defaultValue: 0 },
  category: { type: DataTypes.STRING, defaultValue: 'General' },
  isPublished: { type: DataTypes.BOOLEAN, defaultValue: true },
});

// Lesson table (belongs to Course)
const Lesson = sequelize.define('Lesson', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  videoUrl: { type: DataTypes.STRING, allowNull: false },
  duration: { type: DataTypes.STRING },
  order: { type: DataTypes.INTEGER, defaultValue: 0 },
});

Course.hasMany(Lesson, { as: 'lessons', foreignKey: 'courseId', onDelete: 'CASCADE' });
Lesson.belongsTo(Course, { foreignKey: 'courseId' });

module.exports = { Course, Lesson };
