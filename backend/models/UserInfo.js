module.exports = (sequelize, DataTypes) => {
  const UserInfo = sequelize.define(
    "UserInfo",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: DataTypes.STRING,
      phoneNumber: {
        type: DataTypes.STRING(20),
        validate: { is: /^\+?[\d\s\-\(\)]{10,}$/ },
      },
      projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Projects', key: 'id' }
      },

      // 🔥 Add these for OTP
      otp: { type: DataTypes.STRING, allowNull: true },
      otpExpiresAt: { type: DataTypes.DATE, allowNull: true },
      isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      tableName: "userinfos",
      timestamps: true,
    }
  );

  UserInfo.associate = (models) => {
    UserInfo.belongsTo(models.Project, {
      foreignKey: "projectId",
      as: "project",
    });
  };

  return UserInfo;
};
