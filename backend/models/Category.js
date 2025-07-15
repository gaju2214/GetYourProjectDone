module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  });

  Category.associate = models => {
    Category.hasMany(models.Subcategory, { foreignKey: 'categoryId', as: 'subcategories' });
  };

  return Category;
};
