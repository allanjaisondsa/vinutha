const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const Product = sequelize.define('Product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  // images stored as JSON array string: '["url1","url2"]'
  images: {
    type: DataTypes.TEXT,
    defaultValue: '[]',
    get() {
      const raw = this.getDataValue('images');
      try { return JSON.parse(raw); } catch { return []; }
    },
    set(val) {
      this.setDataValue('images', JSON.stringify(val));
    },
  },
  price: { type: DataTypes.FLOAT, defaultValue: 0 },
  category: { type: DataTypes.STRING, defaultValue: 'General' },
  inStock: { type: DataTypes.BOOLEAN, defaultValue: true },
});

module.exports = Product;
