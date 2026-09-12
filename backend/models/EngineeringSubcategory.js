module.exports = (sequelize, DataTypes) => {
  const EngineeringSubcategory = sequelize.define('EngineeringSubcategory', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING,
      unique: true
    }
  }, {
    tableName: 'EngineeringSubcategories',
    freezeTableName: true
  });

  EngineeringSubcategory.associate = models => {
    EngineeringSubcategory.hasMany(models.EngineeringKit, {
      foreignKey: 'engineeringSubcategoryId',
      as: 'engineeringKits'
    });
  };

  return EngineeringSubcategory;
};
