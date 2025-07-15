module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Cart', {
    projects: {
      type: DataTypes.JSONB,
      defaultValue: []
    }
  });
};
