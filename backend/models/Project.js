module.exports = (sequelize, DataTypes) => {
  const Project = sequelize.define(
    "Project",
    {
      // ... existing fields remain the same
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
      },
      components: {
        type: DataTypes.ARRAY(DataTypes.STRING),
        allowNull: true,
      },
      block_diagram: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      abstract_file: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      details: {
        type: DataTypes.TEXT,
      },
      review: {
        type: DataTypes.TEXT,
      },
      subcategoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
    },
    {
      tableName: "Projects",
      freezeTableName: true,
    }
  );

  Project.associate = (models) => {
    Project.belongsTo(models.Subcategory, {
      foreignKey: "subcategoryId",
      as: "subcategory",
    });

    Project.hasMany(models.OrderItem, {
      foreignKey: "projectId",
      as: "OrderItems"
    });

    // Add this association
    Project.hasMany(models.UserInfo, {
      foreignKey: "projectId",
      as: "downloads"
    });
  };

  return Project;
};
