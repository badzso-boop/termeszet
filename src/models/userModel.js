const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('user', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  pwd: {
    type: DataTypes.STRING,
    allowNull: false
  },
  rang: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  bornDate: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  allergies: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  mutetek: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  amalganFilling: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
  },
  drugs: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  complaints: {
    type: DataTypes.JSON,
    allowNull: true,
  },
  goal: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  courses: {
    type: DataTypes.JSON,
    allowNull: true,
  }
}, {
  timestamps: true
});

module.exports = User;
