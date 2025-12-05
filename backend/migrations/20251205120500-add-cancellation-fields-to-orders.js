'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Orders', 'cancellationReason', {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn('Orders', 'cancelledAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Orders', 'cancellationReason');
    await queryInterface.removeColumn('Orders', 'cancelledAt');
  }
};
