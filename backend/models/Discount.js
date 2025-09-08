// models/Discount.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Discount = sequelize.define('Discount', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'OFF'
    },
    discountType: {
      type: DataTypes.ENUM('percentage', 'fixed'),
      defaultValue: 'percentage'
    },
    discountValue: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    backgroundColor: {
      type: DataTypes.STRING,
      defaultValue: '#ef4444'
    },
    textColor: {
      type: DataTypes.STRING,
      defaultValue: '#ffffff'
    },
    // New field to distinguish global vs specific discounts
    applyToAll: {
      type: DataTypes.BOOLEAN,
      defaultValue: true  // Default to global application
    },
    productIds: {
      type: DataTypes.JSON,
      allowNull: true
    },
    priority: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true
    }
  });

  return Discount;
};
