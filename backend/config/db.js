// // In your database connection file (e.g., config/connection.js or db.js)

// // 1. Load environment variables at the very beginning of your app
// require('dotenv').config();

// // 2. Import Sequelize
// const { Sequelize } = require('sequelize');

// // 3. Access your environment variables
// const dbName = process.env.DB_NAME;
// const dbUser = process.env.POSTGRES_USER; // Maps to DB_USER in your code
// const dbPassword = process.env.DB_PASSWORD;
// const dbHost = process.env.DB_HOST;
// const dbPort = process.env.DB_PORT;
// // For SSL, we check the DB_SSL environment variable
// const sslRequired = process.env.DB_SSL === 'true'; // Note: env variables are strings

// console.log('Connecting to PostgreSQL with Sequelize using the following details:');
// console.log(`Database Name: ${dbName}`);
// console.log(`User: ${dbUser}`);
// console.log(`Host: ${dbHost}`);
// console.log(`Port: ${dbPort}`);
// console.log(`SSL Required: ${sslRequired}`);

// // 4. Configure the Sequelize connection
// const sequelize = new Sequelize(
//   dbName,
//   dbUser,
//   dbPassword,
//   {
//     host: dbHost,
//     port: dbPort, // Make sure to include the port if it's in your .env
//     dialect: 'postgres',
//     logging: false, // Set to true for debugging SQL queries
//     dialectOptions: {
//       ssl: sslRequired ? {
//         // For Render, you typically need to set rejectUnauthorized to false
//         // when connecting from a local machine, as you might not have
//         // the specific CA certificate. Be cautious with this in production
//         // if you require strict certificate validation.
//         rejectUnauthorized: false
//       } : false, // If DB_SSL is not 'true', then no SSL configuration
//     },
//   }
// );

// // 5. Test the connection (Optional, but highly recommended)
// async function testDbConnection() {
//   try {
//     await sequelize.authenticate();
//     console.log('Sequelize: Connection to the database has been established successfully.');
//   } catch (error) {
//     console.error('Sequelize: Unable to connect to the database:', error);
//     // It's good practice to exit if database connection fails at startup
//     process.exit(1);
//   }
// }

// // Call the test function when your application starts
// testDbConnection();

// // 6. Export the sequelize instance so other parts of your application can use it
// module.exports = sequelize;
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
    pool: {
      max: 20,        // Increase as needed for your traffic; default is 5
      acquire: 60000, // Increase how long it waits for a free connection before timing out
      idle: 30000     // How long a connection can sit idle before being released
    }
  }
);

sequelize.authenticate()
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.error('Database connection failed:', err));

module.exports = sequelize;
