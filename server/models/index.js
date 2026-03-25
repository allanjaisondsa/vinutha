// Central models file - sets up all associations and the UserCourse join table
const sequelize = require('../db');
const User = require('./User');
const { Course, Lesson } = require('./Course');
const Product = require('./Product');
const { DataTypes } = require('sequelize');

// Join table: which courses a user has purchased
const UserCourse = sequelize.define('UserCourse', {}, { timestamps: false });
User.belongsToMany(Course, { through: UserCourse, as: 'purchasedCourses' });
Course.belongsToMany(User, { through: UserCourse, as: 'buyers' });

// Join table: which products a user has purchased
const UserProduct = sequelize.define('UserProduct', {}, { timestamps: false });
User.belongsToMany(Product, { through: UserProduct, as: 'purchasedProducts' });
Product.belongsToMany(User, { through: UserProduct, as: 'buyers' });

module.exports = { sequelize, User, Course, Lesson, Product, UserCourse, UserProduct };
