module.exports = (sequelize, DataTypes) => {
  const EngineeringKit = sequelize.define('EngineeringKit', {
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
    technologies: {
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
    difficulty: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    engineeringSubcategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  }, {
    tableName: 'EngineeringKits',
    freezeTableName: true,
  });

  EngineeringKit.associate = (models) => {
    EngineeringKit.belongsTo(models.EngineeringSubcategory, {
      foreignKey: 'engineeringSubcategoryId',
      as: 'subcategory',
    });

    EngineeringKit.hasMany(models.OrderItem, {
      foreignKey: 'engineeringKitId',
      as: 'OrderItems',
    });
  };

  return EngineeringKit;
};
