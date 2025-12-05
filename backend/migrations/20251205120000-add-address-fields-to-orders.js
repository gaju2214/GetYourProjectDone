'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('Orders');

    if (!table.address) {
      await queryInterface.addColumn('Orders', 'address', {
        type: Sequelize.STRING,
        allowNull: true,
      });
      console.log('✅ Added address to Orders');
    } else {
      console.log('⏭️ address already exists in Orders');
    }

    if (!table.city) {
      await queryInterface.addColumn('Orders', 'city', {
        type: Sequelize.STRING,
        allowNull: true,
      });
      console.log('✅ Added city to Orders');
    } else {
      console.log('⏭️ city already exists in Orders');
    }

    if (!table.pincode) {
      await queryInterface.addColumn('Orders', 'pincode', {
        type: Sequelize.STRING,
        allowNull: true,
      });
      console.log('✅ Added pincode to Orders');
    } else {
      console.log('⏭️ pincode already exists in Orders');
    }

    if (!table.state) {
      await queryInterface.addColumn('Orders', 'state', {
        type: Sequelize.STRING,
        allowNull: true,
      });
      console.log('✅ Added state to Orders');
    } else {
      console.log('⏭️ state already exists in Orders');
    }

    if (!table.country) {
      await queryInterface.addColumn('Orders', 'country', {
        type: Sequelize.STRING,
        allowNull: true,
      });
      console.log('✅ Added country to Orders');
    } else {
      console.log('⏭️ country already exists in Orders');
    }
  },

  down: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('Orders');

    if (table.address) {
      await queryInterface.removeColumn('Orders', 'address');
      console.log('✅ Removed address from Orders');
    }
    if (table.city) {
      await queryInterface.removeColumn('Orders', 'city');
      console.log('✅ Removed city from Orders');
    }
    if (table.pincode) {
      await queryInterface.removeColumn('Orders', 'pincode');
      console.log('✅ Removed pincode from Orders');
    }
    if (table.state) {
      await queryInterface.removeColumn('Orders', 'state');
      console.log('✅ Removed state from Orders');
    }
    if (table.country) {
      await queryInterface.removeColumn('Orders', 'country');
      console.log('✅ Removed country from Orders');
    }
  }
};
