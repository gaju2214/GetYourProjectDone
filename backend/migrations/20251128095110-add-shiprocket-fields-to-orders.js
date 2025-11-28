'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Check if shiprocket_order_id exists, add if not
    const tableDescription = await queryInterface.describeTable('Orders');
    
    if (!tableDescription.shiprocket_order_id) {
      await queryInterface.addColumn('Orders', 'shiprocket_order_id', {
        type: Sequelize.STRING,
        allowNull: true,
      });
      console.log('✅ Added shiprocket_order_id to Orders table');
    } else {
      console.log('⏭️  shiprocket_order_id already exists, skipping');
    }

    if (!tableDescription.shiprocket_shipment_id) {
      await queryInterface.addColumn('Orders', 'shiprocket_shipment_id', {
        type: Sequelize.STRING,
        allowNull: true,
      });
      console.log('✅ Added shiprocket_shipment_id to Orders table');
    } else {
      console.log('⏭️  shiprocket_shipment_id already exists, skipping');
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDescription = await queryInterface.describeTable('Orders');
    
    if (tableDescription.shiprocket_order_id) {
      await queryInterface.removeColumn('Orders', 'shiprocket_order_id');
      console.log('✅ Removed shiprocket_order_id from Orders table');
    }

    if (tableDescription.shiprocket_shipment_id) {
      await queryInterface.removeColumn('Orders', 'shiprocket_shipment_id');
      console.log('✅ Removed shiprocket_shipment_id from Orders table');
    }
  }
};
