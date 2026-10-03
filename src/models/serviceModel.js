const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Service = sequelize.define('services', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  iconUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  iconType: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: 'hands', // preset identifier or 'custom'
  },
  price: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  duration: {
    type: DataTypes.STRING(100),
    allowNull: true,
  },
  isStarred: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  }
}, {
  tableName: 'services',
  timestamps: true,
});

module.exports = Service;
