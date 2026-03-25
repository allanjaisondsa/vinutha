const sequelize = require('../db');
const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.ENUM('admin', 'user'), defaultValue: 'user' },
  inviteToken: { type: DataTypes.STRING },
  isRegistered: { type: DataTypes.BOOLEAN, defaultValue: false },
}, {
  hooks: {
    beforeSave: async (user) => {
      if (user.changed('password') && user.password) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    },
  },
});

User.prototype.matchPassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = User;
