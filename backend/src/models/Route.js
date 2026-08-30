const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Route = sequelize.define('Route', {
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
  salesmanId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  waypoints: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  schedule: {
    type: DataTypes.JSONB
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  day: {
    type: DataTypes.ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')
  }
});

module.exports = Route;
