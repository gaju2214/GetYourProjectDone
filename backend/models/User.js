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
        allowNull: true, // Change this from false to true
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
        unique: false, // Allow multiple nulls but unique non-null values
        validate: {
          is: /^\+?[\d\s\-\(\)]{10,}$/,
        },
      },

      address: {
        type: DataTypes.STRING(200),
        allowNull: true,
        unique: false, // Allow multiple nulls but unique non-null values
      },
      city: {
        type: DataTypes.STRING(20),
        allowNull: true,
        unique: false, // Allow multiple nulls but unique non-null values
      },
      pincode: {
        type: DataTypes.STRING(20),
        allowNull: true,
        unique: false, // Allow multiple nulls but unique non-null values
        validate: {
          is: /^\+?[\d\s\-\(\)]{6,}$/,
        },
      },

      state: {
        type: DataTypes.STRING(20),
        allowNull: true,
        unique: false, // Allow multiple nulls but unique non-null values
      },
      country: {
        type: DataTypes.STRING(20),
        allowNull: true,
        unique: false, // Allow multiple nulls but unique non-null values
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      provider: {
        type: DataTypes.ENUM("google", "local"),
        defaultValue: "local",
      },
    },
<<<<<<< HEAD
    {
      tableName: "users",
      timestamps: true,
    }
  );
=======
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
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: false, // multiple nulls allowed, non-null should be validated
      validate: {
        is: /^\+?[\d\s\-\(\)]{10,}$/, // simple regex for phone numbers
      },
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    provider: {
      type: DataTypes.ENUM('google', 'local'),
      defaultValue: 'local',
    },

    // ✅ New fields
    dob: {
      type: DataTypes.DATEONLY, // only YYYY-MM-DD
      allowNull: true,
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other'),
      allowNull: true,
    },

  }, {
    tableName: 'users',
    timestamps: true,
  });
>>>>>>> 52ced836ae1abeb2257b7e3dd348edd6ac78f5e0

  return User;
};
