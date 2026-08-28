module.exports = (sequelize, DataTypes) => {
  const Author = sequelize.define(
    "Author",
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
      designation: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      socialLinks: {
        type: DataTypes.JSON,
        allowNull: true, // stores object: { linkedin: "...", twitter: "..." }
      },
    },
    {
      tableName: "blog_authors",
      timestamps: true,
    }
  );

  return Author;
};
