const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: console.log,
  }
);

async function fixDatabase() {
  try {
    console.log('🔧 Starting database cleanup...');

    // Step 1: Drop the bad migration from SequelizeMeta
    await sequelize.query(`
      DELETE FROM "SequelizeMeta" 
      WHERE name = '20251128095036-update-orderitem-orderid-type.js'
    `);
    console.log('✅ Removed bad migration from SequelizeMeta');

    // Step 2: Check if OrderItems table exists and drop it if needed
    const tableExists = await sequelize.query(`
      SELECT EXISTS(
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'OrderItems'
      )
    `);

    if (tableExists[0][0].exists) {
      // Drop all constraints first
      await sequelize.query(`
        ALTER TABLE "OrderItems" DROP CONSTRAINT IF EXISTS "OrderItems_projectId_fkey" CASCADE;
      `);
      console.log('✅ Dropped projectId constraint');

      await sequelize.query(`
        ALTER TABLE "OrderItems" DROP CONSTRAINT IF EXISTS "OrderItems_orderId_fkey" CASCADE;
      `);
      console.log('✅ Dropped orderId constraint');

      await sequelize.query(`
        ALTER TABLE "OrderItems" DROP CONSTRAINT IF EXISTS "OrderItems_orderId_fkey1" CASCADE;
      `);
      console.log('✅ Dropped any alternate orderId constraints');

      // Now drop the table
      await sequelize.query(`DROP TABLE IF EXISTS "OrderItems" CASCADE;`);
      console.log('✅ Dropped OrderItems table');
    }

    console.log('✅ Database cleanup completed successfully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during cleanup:', err.message);
    process.exit(1);
  }
}

fixDatabase();
