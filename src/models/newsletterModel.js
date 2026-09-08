const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const NewsletterSubscriber = sequelize.define('newsletterSubscriber', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'newsletter_subscribers',
  timestamps: true
});

module.exports = NewsletterSubscriber;
