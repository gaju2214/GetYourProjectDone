'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Remove old 'components' column
    await queryInterface.removeColumn('Projects', 'components');

    // 2. Add new 'components' column as array of strings
    await queryInterface.addColumn('Projects', 'components', {
      type: Sequelize.ARRAY(Sequelize.STRING),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert to previous state (string)
    await queryInterface.removeColumn('Projects', 'components');

    await queryInterface.addColumn('Projects', 'components', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
