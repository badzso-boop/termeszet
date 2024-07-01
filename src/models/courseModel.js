const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Course = sequelize.define('minikurzus', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  cim: {
    type: DataTypes.STRING,
    allowNull: false
  },
  helyszin: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  idopont: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  ar: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  temakor: {
    type: DataTypes.STRING
  },
  leiras: {
    type: DataTypes.TEXT
  },
  fajlok: {
    type: DataTypes.STRING
  },
  felhasznalok: {
    type: DataTypes.JSON
  },
  megkotesek: {
    type: DataTypes.JSON
  },
  video: {
    type: DataTypes.STRING
  }
}, {
  timestamps: true
});

module.exports = Course;
