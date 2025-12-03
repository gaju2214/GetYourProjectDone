'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('users');

    if (!table.otpCode) {
      await queryInterface.addColumn('users', 'otpCode', {
        type: Sequelize.STRING(6),
        allowNull: true,
      });
    }

    if (!table.otpExpiryTime) {
      await queryInterface.addColumn('users', 'otpExpiryTime', {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }

    if (!table.otpVerified) {
      await queryInterface.addColumn('users', 'otpVerified', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const table = await queryInterface.describeTable('users');

    if (table.otpCode) {
      await queryInterface.removeColumn('users', 'otpCode');
    }

    if (table.otpExpiryTime) {
      await queryInterface.removeColumn('users', 'otpExpiryTime');
    }

    if (table.otpVerified) {
      await queryInterface.removeColumn('users', 'otpVerified');
    }
  },
};
