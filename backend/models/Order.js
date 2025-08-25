module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define("Orders", {
    orderId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true, // make it unique but not PK
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
  });

  return Order;
};

// models/Order.js
// module.exports = (sequelize, DataTypes) => {
//   const Order = sequelize.define("Order", {
//     orderId: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//     },
//     userId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     mobile: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     customerName: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     productId: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     shippingAddress: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//     },
//     paymentMethod: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     totalAmount: {
//       type: DataTypes.FLOAT,
//       allowNull: false,
//     },
//     status: {
//       type: DataTypes.STRING,
//       defaultValue: "pending",
//     },
//     paymentStatus: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//   });

//   return Order;
// };

// module.exports = (sequelize, DataTypes) => {
//   const Order = sequelize.define('Order', {
//     userId: {
//       type: DataTypes.INTEGER,
//       allowNull: false
//     },
//     totalAmount: {
//       type: DataTypes.FLOAT,
//       allowNull: false
//     },
//     status: {
//       type: DataTypes.STRING,
//       defaultValue: 'Pending' // or 'Success', 'Failed'
//     }
//   });

//   Order.associate = models => {
//     Order.belongsTo(models.User, { foreignKey: 'userId' });
//     Order.hasMany(models.OrderItem, { foreignKey: 'orderId' });
//   };

//   return Order;
// };
