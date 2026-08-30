const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Expense = sequelize.define('Expense', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  companyId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  salesmanId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  paymentMethod: {
    type: DataTypes.ENUM('cash', 'bank', 'bkash', 'nagad')
  },
  receipt: {
    type: DataTypes.STRING
  },
  date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  }
});

module.exports = Expense;
