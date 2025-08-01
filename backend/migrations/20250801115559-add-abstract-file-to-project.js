// In the `up` function:
await queryInterface.addColumn('Projects', 'abstract_file', {
  type: Sequelize.STRING,
  allowNull: true,
});

// In the `down` function:
await queryInterface.removeColumn('Projects', 'abstract_file');