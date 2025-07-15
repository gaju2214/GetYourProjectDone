module.exports = (sequelize, DataTypes) => {
  const CartItem = sequelize.define('CartItem', {
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });

  CartItem.associate = models => {
    CartItem.belongsTo(models.User, { foreignKey: 'userId' });
    CartItem.belongsTo(models.Project, { foreignKey: 'projectId' });
  };

  return CartItem;
};
