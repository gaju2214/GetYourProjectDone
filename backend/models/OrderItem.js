module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define("OrderItem", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  });

  // Make sure the model names match exactly what's in your models folder
  OrderItem.associate = (models) => {
  OrderItem.belongsTo(models.Order, {
    foreignKey: "orderId",
    as: "order",
    onDelete: "CASCADE",
  });

    // Check if this should be models.Projects or models.Project
    OrderItem.belongsTo(models.Project, {
    foreignKey: "projectId",
    as: "Project"
  });
};

  return OrderItem;
};
