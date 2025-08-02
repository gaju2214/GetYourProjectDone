const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const db = {};

// Initialize models
db.Project = require('./Project')(sequelize, Sequelize);
db.Cart = require('./Cart')(sequelize, Sequelize);
db.User = require('./User')(sequelize, Sequelize);
db.Category = require('./Category')(sequelize, Sequelize);
db.Subcategory = require('./Subcategory')(sequelize, Sequelize);
db.CartItem = require('./CartItem')(sequelize, Sequelize); // ✅
db.CartItem = require('./CartItem')(sequelize, Sequelize);
db.Admin= require('./Admin')(sequelize, Sequelize);
// Add Order and OrderItem models
db.Order = require('./Order')(sequelize, Sequelize);
db.OrderItem = require('./OrderItem')(sequelize, Sequelize);

// Call all associate methods
// Call all associate methods
if (db.Category.associate) db.Category.associate(db);
if (db.Subcategory.associate) db.Subcategory.associate(db);
if (db.Project.associate) db.Project.associate(db);
if (db.CartItem.associate) db.CartItem.associate(db);
if (db.Order.associate) db.Order.associate(db);         // <-- Added
if (db.OrderItem.associate) db.OrderItem.associate(db); // <-- Added
if (db.Admin.associate) db.Admin.associate(db)
// Optional: cart-user relation
db.User.hasOne(db.Cart);
db.Cart.belongsTo(db.User);

// Export
module.exports = {
  sequelize,
  Category: db.Category,
  Subcategory: db.Subcategory,
  Project: db.Project,
  Cart: db.Cart,
  User: db.User,  
  CartItem: db.CartItem,
  Order: db.Order,           // <-- Added
  OrderItem: db.OrderItem,
  Admin: db.Admin   // <-- Added
};
