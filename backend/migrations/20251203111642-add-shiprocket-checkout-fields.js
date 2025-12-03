'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('Orders');

    // Add shiprocket_checkout_order_id
    if (!table.shiprocket_checkout_order_id) {
      await queryInterface.addColumn('Orders', 'shiprocket_checkout_order_id', {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      });
    }

    // Add order_source
    if (!table.order_source) {
      await queryInterface.addColumn('Orders', 'order_source', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: 'manual',
      });
    }

    // Change user_id allowNull = true (only if not already true)
    if (table.user_id && table.user_id.allowNull === false) {
      await queryInterface.changeColumn('Orders', 'user_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        }
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('Orders');

    if (table.shiprocket_checkout_order_id) {
      await queryInterface.removeColumn('Orders', 'shiprocket_checkout_order_id');
    }

    if (table.order_source) {
      await queryInterface.removeColumn('Orders', 'order_source');
    }

    // revert user_id = NOT NULL
    if (table.user_id && table.user_id.allowNull === true) {
      await queryInterface.changeColumn('Orders', 'user_id', {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      });
    }
  }
};
