// In a new migration file
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('userinfos', 'projectId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1, // Set a default project ID for existing records
      references: {
        model: 'Projects',
        key: 'id'
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('userinfos', 'projectId');
  }
};

