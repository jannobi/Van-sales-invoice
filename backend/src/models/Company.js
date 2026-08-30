const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Company = sequelize.define('Company', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  businessType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  gstNumber: {
    type: DataTypes.STRING
  },
  address: {
    type: DataTypes.TEXT
  },
  phone: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING,
    validate: {
      isEmail: true
    }
  },
  subscriptionTier: {
    type: DataTypes.ENUM('basic', 'premium', 'enterprise'),
    defaultValue: 'basic'
  },
  subscriptionStart: {
    type: DataTypes.DATE
  },
  subscriptionEnd: {
    type: DataTypes.DATE
  },
  isTrial: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  trialStart: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  trialEnd: {
    type: DataTypes.DATE
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  cashInHand: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  bankBalance: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  }
}, {
  hooks: {
    beforeCreate: (company) => {
      // Set trial end to 30 days from now
      const trialEnd = new Date();
      trialEnd.setDate(trialEnd.getDate() + 30);
      company.trialEnd = trialEnd;
    }
  }
});

module.exports = Company;
