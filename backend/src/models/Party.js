const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Party = sequelize.define('Party', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  companyId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('customer', 'supplier'),
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true
    }
  },
  address: {
    type: DataTypes.TEXT
  },
  gstNumber: {
    type: DataTypes.STRING
  },
  openingBalance: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  currentBalance: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  creditLimit: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  totalPurchases: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  totalPayments: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  }
}, {
  hooks: {
    beforeCreate: (party) => {
      party.currentBalance = party.openingBalance;
    }
  }
});

module.exports = Party;
