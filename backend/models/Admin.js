module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define('Admin', {
    
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [6, 100] // Optional: enforce strong password length
      }
    },
   
  }, {
    tableName: 'Admins',
    timestamps: true,
  });

  return Admin;
};
