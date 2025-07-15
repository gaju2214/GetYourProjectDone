module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define('Project', {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    image: {
      type: DataTypes.STRING // Store filename or URL
    },
    subcategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
Project.associate = models => {
  Project.belongsTo(models.Subcategory, {
    foreignKey: 'subcategoryId',
    as: 'subcategory'
  });
};
  return Project;
};
