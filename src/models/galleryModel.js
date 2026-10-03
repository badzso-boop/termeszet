const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Gallery = sequelize.define('galeria', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  filename: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  originalUrl: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  thumbnailUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
  },
  isStarred: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'galeria',
  timestamps: true,
});

module.exports = Gallery;
