const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Homework = sequelize.define('homeworks', {
  cim: {
      type: DataTypes.STRING,
      allowNull: false,
  },
  felhasznaloId: {
      type: DataTypes.INTEGER,
      allowNull: false,
  },
  leiras: {
      type: DataTypes.STRING,
      allowNull: true,
  },
  hataridoDatum: {
      type: DataTypes.DATE,
      allowNull: false,
  },
  letrehozasDatum: {
      type: DataTypes.DATE,
      allowNull: true,
  },
  megoldas: {
      type: DataTypes.STRING,
      allowNull: true,
  },
  ready: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
  },
}, {
  timestamps: true,
});

module.exports = Homework;