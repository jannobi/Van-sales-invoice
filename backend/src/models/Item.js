const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Item = sequelize.define('Item', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  companyId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: false
  },
  purchasePrice: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  sellingPrice: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  mrp: {
    type: DataTypes.DECIMAL(15, 2)
  },
  gstRate: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0
  },
  hsnCode: {
    type: DataTypes.STRING
  },
  minStock: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = Item;
