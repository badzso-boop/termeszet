const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CourseRegister = sequelize.define('courseregister', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  enabled: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  }
}, {
  timestamps: true
});

module.exports = CourseRegister;
