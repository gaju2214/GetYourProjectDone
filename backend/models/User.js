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
  const User = sequelize.define(
    "User",
    {
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
      password: {
        type: DataTypes.STRING,
        allowNull: true, // allow for Google auth users
        validate: {
          len: [6, 100],
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastname: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "",
      },
      
      phoneNumber: {
        type: DataTypes.STRING(20),
        allowNull: true,
        unique: false, // multiple nulls allowed
        validate: {
          is: /^\+?[\d\s\-\(\)]{10,}$/, // regex for phone numbers
        },
      },
      address: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      city: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      pincode: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
          is: /^[0-9]{6}$/, // ✅ better regex for Indian pincode (6 digits)
        },
      },
      state: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      country: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      provider: {
        type: DataTypes.ENUM("google", "local", "otp"),
        defaultValue: "local",
      },

      // ✅ New fields
      dob: {
        type: DataTypes.DATEONLY, // only YYYY-MM-DD
        allowNull: true,
      },
      gender: {
        type: DataTypes.ENUM("male", "female", "other"),
        allowNull: true,
      },

      // OTP verification fields
      otpCode: {
        type: DataTypes.STRING(6),
        allowNull: true,
      },
      otpExpiryTime: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      otpVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: "users",
      timestamps: true,
    }
  );

  return User;
};
