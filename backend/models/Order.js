module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define("Orders", {
    orderId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // Make sure this matches your User table name
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
      allowNull: false,
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
    // shiprocket_order_id: {
    //   type: DataTypes.STRING,
    //   allowNull: true,
    // },
  });

  Order.associate = (models) => {
    Order.hasMany(models.OrderItem, {
      foreignKey: "orderId",
      as: "OrderItems",
    });

    Order.belongsTo(models.User, {
      foreignKey: "user_id",
      targetKey: "id" // Explicitly specify the target key
    });
  };

  return Order;
};