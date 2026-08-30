const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Salesman = sequelize.define('Salesman', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  companyId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  employeeId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  address: {
    type: DataTypes.TEXT
  },
  assignedRoute: {
    type: DataTypes.STRING
  },
  vanNumber: {
    type: DataTypes.STRING
  },
  dailyTarget: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  monthlySales: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  monthlyCollections: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  currentMonth: {
    type: DataTypes.STRING,
    defaultValue: () => {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }
  },
  lastActive: {
    type: DataTypes.DATE
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = Salesman;
