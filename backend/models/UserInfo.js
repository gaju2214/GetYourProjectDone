module.exports = (sequelize, DataTypes) => {
  const UserInfo = sequelize.define(
    "UserInfo",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // usually you want this
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING(20),
        allowNull: true,
        unique: false, // Allow multiple nulls but non-null values are not forced unique
        validate: {
          is: /^\+?[\d\s\-\(\)]{10,}$/, // regex validation
        },
      },
    },
    {
      tableName: "userinfos", // 👈 table name
      timestamps: true,       // createdAt & updatedAt
    }
  );

  return UserInfo;
};
