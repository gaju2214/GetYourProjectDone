require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || null,
    database: process.env.DB_NAME || 'ecom_db_koey',
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'postgres'
  }
};
