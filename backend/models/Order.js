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
      allowNull: true, // ✅ Changed to true for Shiprocket orders (guest checkout)
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
      allowNull: true, // For backward compatibility
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
    // ✅ Shiprocket Shipping API order ID (your existing integration)
    shiprocket_order_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    shiprocket_shipment_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // ✅ NEW: Shiprocket Checkout order ID
    shiprocket_checkout_order_id: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true, // Prevent duplicate orders from webhook
    },
    // ✅ NEW: Track order source
    order_source: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "manual", // "manual", "shiprocket_checkout"
    },
  });

  Order.associate = (models) => {
    Order.hasMany(models.OrderItem, {
      foreignKey: "orderId",
      sourceKey: "orderId",
      as: "OrderItems",
    });

    Order.belongsTo(models.User, {
      foreignKey: "user_id",
      targetKey: "id"
    });
  };

  return Order;
};
