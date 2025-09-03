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
  });
  // Add this association
  Order.associate = function(models) {
    Order.hasMany(models.OrderItem, {
      foreignKey: 'orderId',
      as: 'OrderItems'
    });
  };
  return Order;
};