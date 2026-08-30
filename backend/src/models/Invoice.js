const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Invoice = sequelize.define('Invoice', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  companyId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  invoiceNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  type: {
    type: DataTypes.ENUM('sale', 'purchase'),
    allowNull: false
  },
  partyId: {
    type: DataTypes.UUID,
    allowNull: false
  },
  salesmanId: {
    type: DataTypes.UUID,
    allowNull: true
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  dueDate: {
    type: DataTypes.DATE
  },
  subtotal: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  gstAmount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  discount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  total: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  paidAmount: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  balanceDue: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled'),
    defaultValue: 'draft'
  },
  paymentMethod: {
    type: DataTypes.ENUM('cash', 'bank', 'bkash', 'nagad', 'card')
  },
  notes: {
    type: DataTypes.TEXT
  },
  items: {
    type: DataTypes.JSONB,
    allowNull: false
  }
}, {
  hooks: {
    beforeCreate: async (invoice) => {
      // Generate invoice number
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const count = await Invoice.count({
        where: {
          companyId: invoice.companyId,
          type: invoice.type
        }
      });
      invoice.invoiceNumber = `${invoice.type === 'sale' ? 'S' : 'P'}-${year}${month}-${String(count + 1).padStart(4, '0')}`;
      
      // Calculate balance due
      invoice.balanceDue = invoice.total - invoice.paidAmount;
    }
  }
});

module.exports = Invoice;
