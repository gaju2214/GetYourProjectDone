'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'otpCode', {
      type: Sequelize.STRING(6),
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'otpExpiryTime', {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn('users', 'otpVerified', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'otpCode');
    await queryInterface.removeColumn('users', 'otpExpiryTime');
    await queryInterface.removeColumn('users', 'otpVerified');
  },
};
