const { sequelize, Admin } = require("../models");
const bcrypt = require("bcrypt");

const run = async () => {
  try {
    await sequelize.authenticate();
    const admins = await Admin.findAll();
    console.log("👥 Existing Admins count:", admins.length);
    admins.forEach(a => {
      console.log(`- ID: ${a.id}, Email: ${a.email}`);
    });

    // If no admin exists, create a default one
    if (admins.length === 0) {
      const email = "admin@example.com";
      const password = "admin123";
      const hashedPassword = await bcrypt.hash(password, 10);
      const newAdmin = await Admin.create({
        email,
        password: hashedPassword,
        name: "Admin User"
      });
      console.log(`✅ Default admin created! Email: ${email}, Password: ${password}`);
    } else {
      // Re-hash password of the first admin to make sure we know it
      const email = admins[0].email;
      const password = "admin123";
      const hashedPassword = await bcrypt.hash(password, 10);
      await admins[0].update({ password: hashedPassword });
      console.log(`🔄 Reset password of ${email} to ${password}`);
    }
    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
};

run();
