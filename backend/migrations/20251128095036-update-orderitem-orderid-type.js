'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Step 1: Drop the existing foreign key constraint
    await queryInterface.removeConstraint('OrderItems', 'OrderItems_orderId_fkey');
    console.log('✅ Dropped old foreign key constraint');

    // Step 2: Change orderId column type to STRING
    await queryInterface.changeColumn('OrderItems', 'orderId', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    console.log('✅ Changed orderId to STRING type');

    // Step 3: Add new foreign key constraint referencing Orders.orderId (STRING)
    await queryInterface.addConstraint('OrderItems', {
      fields: ['orderId'],
      type: 'foreign key',
      name: 'OrderItems_orderId_fkey',
      references: {
        table: 'Orders',
        field: 'orderId'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
    console.log('✅ Added new foreign key constraint');
  },

  down: async (queryInterface, Sequelize) => {
    // Step 1: Drop the foreign key constraint
    await queryInterface.removeConstraint('OrderItems', 'OrderItems_orderId_fkey');

    // Step 2: Change orderId back to INTEGER
    await queryInterface.changeColumn('OrderItems', 'orderId', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    // Step 3: Restore original foreign key (if needed)
    await queryInterface.addConstraint('OrderItems', {
      fields: ['orderId'],
      type: 'foreign key',
      name: 'OrderItems_orderId_fkey',
      references: {
        table: 'Orders',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  }
};
