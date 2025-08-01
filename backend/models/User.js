// module.exports = (sequelize, DataTypes) => {
//   const User = sequelize.define('User', {
//     email: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//       validate: { isEmail: true }
//     },
//     password: {
//       type: DataTypes.STRING,
//       allowNull: false
//     }
//   });

//   return User;
// };



module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    googleId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
   
phoneNumber: {
  type: DataTypes.STRING(20),
  allowNull: true,
  unique: false, // Allow multiple nulls but unique non-null values
  validate: {
    is: /^\+?[\d\s\-\(\)]{10,}$/
  }
},
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    provider: {
      type: DataTypes.ENUM('google', 'local'),
      defaultValue: 'local',
    },
  }, {
    tableName: 'users',
    timestamps: true,
  });

  return User;
};