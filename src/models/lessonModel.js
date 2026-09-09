const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

// Egy `minikurzus` (Course) több leckéből is állhat -- ez teszi lehetővé, hogy egy
// kurzushoz ne csak egyetlen videó + egyetlen szövegblokk tartozzon, hanem tetszőleges
// számú, sorrendezett lecke, saját videóval és/vagy szöveggel.
const Lesson = sequelize.define('lesson', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  courseId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  cim: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sorrend: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  szoveg: {
    type: DataTypes.TEXT
  },
  video: {
    type: DataTypes.STRING
  }
}, {
  timestamps: true
});

module.exports = Lesson;
