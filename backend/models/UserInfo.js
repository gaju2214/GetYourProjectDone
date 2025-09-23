module.exports = (sequelize, DataTypes) => {
  const UserInfo = sequelize.define(
    "UserInfo",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phoneNumber: {
        type: DataTypes.STRING(20),
        allowNull: true,
        unique: false,
        validate: {
          is: /^\+?[\d\s\-\(\)]{10,}$/,
        },
      },
      projectId: {
        type: DataTypes.INTEGER,
        allowNull: false, // This should match your requirement
        references: {
          model: 'Projects',
          key: 'id'
        }
      },
    },
    {
      tableName: "userinfos",
      timestamps: true,
    }
  );

  // Add association
  UserInfo.associate = (models) => {
    UserInfo.belongsTo(models.Project, {
      foreignKey: "projectId",
      as: "project",
    });
  };

  return UserInfo;
};
