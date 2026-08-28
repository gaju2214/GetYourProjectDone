module.exports = (sequelize, DataTypes) => {
  const Blog = sequelize.define(
    "Blog",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      excerpt: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      content: {
        type: DataTypes.JSON,
        allowNull: false, // stores structured section block array: [{type: 'heading', text: '...'}, ...]
      },
      featuredImage: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      authorId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "blog_authors",
          key: "id",
        },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      publishedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      readTime: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "5 min read",
      },
      tags: {
        type: DataTypes.JSON,
        allowNull: true, // stores array of tag strings
        defaultValue: [],
      },
      status: {
        type: DataTypes.ENUM("draft", "published", "archived"),
        defaultValue: "draft",
        allowNull: false,
      },
      isFeatured: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      views: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      likesCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
      },
      tableOfContents: {
        type: DataTypes.JSON,
        allowNull: true, // stores TOC array: [{ id: "intro", text: "Introduction" }, ...]
        defaultValue: [],
      },
      keyTakeaways: {
        type: DataTypes.JSON,
        allowNull: true, // stores bullet points array: ["point 1", "point 2"]
        defaultValue: [],
      },
    },
    {
      tableName: "blogs",
      timestamps: true,
      indexes: [
        {
          unique: true,
          fields: ["slug"],
        },
        {
          fields: ["status"],
        },
        {
          fields: ["category"],
        },
        {
          fields: ["isFeatured"],
        },
      ],
    }
  );

  return Blog;
};
