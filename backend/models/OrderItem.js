module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define("OrderItem", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.STRING, // ✅ Changed from INTEGER to STRING
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

  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Order, {
      foreignKey: "orderId",
      targetKey: "orderId", // ✅ Reference the orderId STRING field
      as: "Order",
      onDelete: "CASCADE",
    });

    OrderItem.belongsTo(models.Project, {
      foreignKey: "projectId",
      as: "Project"
    });
  };

  return OrderItem;
};
