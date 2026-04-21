const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const Catalogue = sequelize.define('Catalogue', {
  id:    { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  label: { type: DataTypes.STRING, allowNull: false },
  category: { type: DataTypes.STRING, allowNull: false },
  image: { type: DataTypes.STRING, allowNull: true },
  order: { type: DataTypes.INTEGER, defaultValue: 0 },
});

module.exports = Catalogue;
