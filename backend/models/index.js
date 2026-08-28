const Sequelize = require('sequelize');
const sequelize = require('../config/db');

const db = {};

// Initialize models
db.Project = require('./Project')(sequelize, Sequelize);
db.Cart = require('./Cart')(sequelize, Sequelize);
db.User = require('./User')(sequelize, Sequelize);
db.Category = require('./Category')(sequelize, Sequelize);
db.Subcategory = require('./Subcategory')(sequelize, Sequelize);
db.CartItem = require('./CartItem')(sequelize, Sequelize); 
db.Admin = require('./Admin')(sequelize, Sequelize);
db.Order = require("./Order")(sequelize, Sequelize);
db.OrderItem = require('./OrderItem')(sequelize, Sequelize);
db.UserInfo = require('./UserInfo')(sequelize, Sequelize);
db.Discount = require('./Discount')(sequelize, Sequelize);  
db.Author = require('./Author')(sequelize, Sequelize);
db.Blog = require('./Blog')(sequelize, Sequelize);
db.Comment = require('./Comment')(sequelize, Sequelize);
db.BlogLike = require('./BlogLike')(sequelize, Sequelize);

// Call associate methods
if (db.Category.associate) db.Category.associate(db);
if (db.Subcategory.associate) db.Subcategory.associate(db);
if (db.Project.associate) db.Project.associate(db);
if (db.CartItem.associate) db.CartItem.associate(db);
if (db.Order.associate) db.Order.associate(db);
if (db.OrderItem.associate) db.OrderItem.associate(db);
if (db.Admin.associate) db.Admin.associate(db);
if (db.UserInfo.associate) db.UserInfo.associate(db);
if (db.Discount.associate) db.Discount.associate(db);

// Define user-cart relationship
db.User.hasOne(db.Cart);
db.Cart.belongsTo(db.User);

// Define blog relationships
db.Blog.belongsTo(db.Author, { foreignKey: 'authorId', as: 'Author' });
db.Author.hasMany(db.Blog, { foreignKey: 'authorId', as: 'Blogs' });

db.Blog.hasMany(db.Comment, { foreignKey: 'blogId', as: 'Comments' });
db.Comment.belongsTo(db.Blog, { foreignKey: 'blogId', as: 'Blog' });

db.Blog.hasMany(db.BlogLike, { foreignKey: 'blogId', as: 'Likes' });
db.BlogLike.belongsTo(db.Blog, { foreignKey: 'blogId' });

db.User.hasMany(db.BlogLike, { foreignKey: 'userId', as: 'BlogLikes' });
db.BlogLike.belongsTo(db.User, { foreignKey: 'userId' });

// Export models and sequelize instance
module.exports = {
  sequelize,
  Category: db.Category,
  Subcategory: db.Subcategory,
  Project: db.Project,
  Cart: db.Cart,
  User: db.User,
  CartItem: db.CartItem,
  Order: db.Order,
  OrderItem: db.OrderItem,
  Admin: db.Admin,
  UserInfo: db.UserInfo,
  Discount: db.Discount,
  Author: db.Author,
  Blog: db.Blog,
  Comment: db.Comment,
  BlogLike: db.BlogLike
};
