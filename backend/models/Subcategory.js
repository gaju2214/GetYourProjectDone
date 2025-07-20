module.exports = (sequelize, DataTypes) => {
  const Subcategory = sequelize.define('Subcategory', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    slug: {
  type: DataTypes.STRING,
  unique: true
},

    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  Subcategory.associate = models => {
    // Each Subcategory belongs to a Category
    Subcategory.belongsTo(models.Category, {
      foreignKey: 'categoryId',
      as: 'category'
    });

    // Each Subcategory has many Projects
    Subcategory.hasMany(models.Project, {
      foreignKey: 'subcategoryId',
      as: 'projects'
    });
  };

  return Subcategory;
};
