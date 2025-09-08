'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Discounts', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      label: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'OFF'
      },
      discountType: {
        type: Sequelize.ENUM('percentage', 'fixed'),
        defaultValue: 'percentage'
      },
      discountValue: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      backgroundColor: {
        type: Sequelize.STRING,
        defaultValue: '#ef4444'
      },
      textColor: {
        type: Sequelize.STRING,
        defaultValue: '#ffffff'
      },
      applyToAll: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      productIds: {
        type: Sequelize.JSON,
        allowNull: true
      },
      priority: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Discounts');
  }
};
