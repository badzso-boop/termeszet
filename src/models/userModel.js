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
    type: DataTypes.STRING
  },
  description: {
    type: DataTypes.TEXT
  },
  bornDate: {
    type: DataTypes.DATE
  },
  allergies: {
    type: DataTypes.JSON
  },
  mutetek: {
    type: DataTypes.JSON
  },
  amalganFilling: {
    type: DataTypes.BOOLEAN
  },
  drugs: {
    type: DataTypes.JSON
  },
  complaints: {
    type: DataTypes.JSON
  },
  goal: {
    type: DataTypes.STRING
  },
  courses: {
    type: DataTypes.JSON
  }
}, {
  timestamps: true
});

module.exports = User;
