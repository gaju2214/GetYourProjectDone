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
    itemType: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'project' // 'project' | 'engineering_kit'
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    engineeringKitId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'CartItems', // Ensure correct table name
    freezeTableName: true
  });

  CartItem.associate = models => {
    // Make sure this references the correct table name
    CartItem.belongsTo(models.User, {
      foreignKey: 'userId',
      targetKey: 'id' // Explicitly specify the target key
    });
    CartItem.belongsTo(models.Project, {
      foreignKey: 'projectId',
      targetKey: 'id'
    });
    CartItem.belongsTo(models.EngineeringKit, {
      foreignKey: 'engineeringKitId',
      targetKey: 'id'
    });
  };

  return CartItem;
};
