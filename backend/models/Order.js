module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define("Orders", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    mobile: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    customerName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    productId: {
      type: DataTypes.STRING,
      allowNull: true, // Changed to true since we use OrderItems now
    },
    shippingAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: "pending",
    },
    paymentStatus: {
      type: DataTypes.STRING,
      defaultValue: "initiated",
    },
    quantity: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shiprocket_order_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shiprocket_shipment_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  Order.associate = (models) => {
    Order.hasMany(models.OrderItem, {
      foreignKey: "orderId",
      sourceKey: "orderId", // ✅ Use orderId STRING as the source
      as: "OrderItems",
    });

    Order.belongsTo(models.User, {
      foreignKey: "user_id",
      targetKey: "id"
    });
  };

  return Order;
};
