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

  OrderItem.associate = (models) => {
    OrderItem.belongsTo(models.Order, {
      foreignKey: "orderId",
      onDelete: "CASCADE",
    });

    // ✅ Linking to Project instead of Product
    OrderItem.belongsTo(models.Project, {
      foreignKey: "projectId",
    });
  };

  return OrderItem;
};

// module.exports = (sequelize, DataTypes) => {
//   const OrderItem = sequelize.define('OrderItem', {
//     orderId: {
//       type: DataTypes.INTEGER,
//       allowNull: false
//     },
//     projectId: {
//       type: DataTypes.INTEGER,
//       allowNull: false
//     },
//     quantity: {
//       type: DataTypes.INTEGER,
//       defaultValue: 1
//     },
//     price: {
//       type: DataTypes.FLOAT,
//       allowNull: false
//     }
//   });

//   OrderItem.associate = models => {
//     OrderItem.belongsTo(models.Order, { foreignKey: 'orderId' });
//     OrderItem.belongsTo(models.Project, { foreignKey: 'projectId' });
//   };

//   return OrderItem;
// };
