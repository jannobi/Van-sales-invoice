const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Inventory = sequelize.define('Inventory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  companyId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  itemId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  salesmanId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  location: {
    type: DataTypes.ENUM('godown', 'van'),
    allowNull: false,
    defaultValue: 'godown'
  },
  lastUpdated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = Inventory;
