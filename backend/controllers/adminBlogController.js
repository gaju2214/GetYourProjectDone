const { Blog, Author, Comment, sequelize } = require("../models");
const slugify = require("slugify");
const { Op } = require("sequelize");

// Helper to generate unique slug
const generateUniqueSlug = async (title, id = null) => {
  let baseSlug = slugify(title, { lower: true, strict: true });
  let slug = baseSlug;
  let count = 1;

  const where = { slug };
  if (id) {
    where.id = { [Op.ne]: id };
  }

  let existing = await Blog.findOne({ where });
  while (existing) {
    slug = `${baseSlug}-${count}`;
    where.slug = slug;
    existing = await Blog.findOne({ where });
    count++;
  }
  return slug;
};

// -------------------- BLOGS CRUD --------------------

// GET /api/admin/blogs
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      include: [
        {
          model: Author,
          as: "Author",
          attributes: ["id", "name", "designation", "image"]
        }
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    console.error("Admin fetch blogs error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// POST /api/admin/blogs
exports.createBlog = async (req, res) => {
  try {
    const {
      title,
      category,
      excerpt,
      content,
      featuredImage,
      authorId,
      readTime,
      tags,
      status = "draft",
      isFeatured = false,
      tableOfContents = [],
      keyTakeaways = [],
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }
    if (!category || !category.trim()) {
      return res.status(400).json({ success: false, message: "Category is required" });
    }
    if (!excerpt || !excerpt.trim()) {
      return res.status(400).json({ success: false, message: "Excerpt is required" });
    }
    if (!content) {
      return res.status(400).json({ success: false, message: "Content structured blocks are required" });
    }

    const slug = await generateUniqueSlug(title);
    const publishedAt = status === "published" ? new Date() : null;

    const blog = await Blog.create({
      title: title.trim(),
      slug,
      category: category.trim(),
      excerpt: excerpt.trim(),
      content,
      featuredImage,
      authorId: authorId ? parseInt(authorId) : null,
      publishedAt,
      readTime: readTime || "5 min read",
      tags: Array.isArray(tags) ? tags : [],
      status,
      isFeatured,
      tableOfContents: Array.isArray(tableOfContents) ? tableOfContents : [],
      keyTakeaways: Array.isArray(keyTakeaways) ? keyTakeaways : [],
    });

    return res.status(201).json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error("Admin create blog error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// PUT /api/admin/blogs/:id
exports.updateBlog = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const {
      title,
      category,
      excerpt,
      content,
      featuredImage,
      authorId,
      readTime,
      tags,
      status,
      isFeatured,
      tableOfContents,
      keyTakeaways,
    } = req.body;

    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    const updates = {};
    if (title && title.trim() !== blog.title) {
      updates.title = title.trim();
      updates.slug = await generateUniqueSlug(title, id);
    }
    if (category) updates.category = category.trim();
    if (excerpt) updates.excerpt = excerpt.trim();
    if (content) updates.content = content;
    if (featuredImage !== undefined) updates.featuredImage = featuredImage;
    if (authorId !== undefined) updates.authorId = authorId ? parseInt(authorId) : null;
    if (readTime) updates.readTime = readTime;
    if (tags) updates.tags = Array.isArray(tags) ? tags : [];
    if (status) {
      updates.status = status;
      if (status === "published" && !blog.publishedAt) {
        updates.publishedAt = new Date();
      }
    }
    if (isFeatured !== undefined) updates.isFeatured = isFeatured;
    if (tableOfContents) updates.tableOfContents = Array.isArray(tableOfContents) ? tableOfContents : [];
    if (keyTakeaways) updates.keyTakeaways = Array.isArray(keyTakeaways) ? keyTakeaways : [];

    await blog.update(updates);

    return res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error("Admin update blog error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// DELETE /api/admin/blogs/:id
exports.deleteBlog = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const blog = await Blog.findByPk(id);

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    await blog.destroy();

    return res.status(200).json({
      success: true,
      message: "Blog deleted successfully",
    });
  } catch (error) {
    console.error("Admin delete blog error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// PATCH /api/admin/blogs/:id/publish
exports.publishBlog = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const blog = await Blog.findByPk(id);

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    await blog.update({
      status: "published",
      publishedAt: blog.publishedAt || new Date(),
    });

    return res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error("Admin publish blog error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// PATCH /api/admin/blogs/:id/archive
exports.archiveBlog = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const blog = await Blog.findByPk(id);

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    await blog.update({
      status: "archived",
    });

    return res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error("Admin archive blog error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// PATCH /api/admin/blogs/:id/featured
exports.toggleFeatured = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const blog = await Blog.findByPk(id);

    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    await blog.update({
      isFeatured: !blog.isFeatured,
    });

    return res.status(200).json({
      success: true,
      blog,
    });
  } catch (error) {
    console.error("Admin toggle featured error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// -------------------- AUTHORS CRUD --------------------

// GET /api/admin/authors
exports.getAllAuthors = async (req, res) => {
  try {
    const authors = await Author.findAll({
      order: [["name", "ASC"]],
    });
    return res.status(200).json({ success: true, authors });
  } catch (error) {
    console.error("Admin fetch authors error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// POST /api/admin/authors
exports.createAuthor = async (req, res) => {
  try {
    const { name, designation, bio, image, socialLinks } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Author name is required" });
    }

    const author = await Author.create({
      name: name.trim(),
      designation: designation?.trim(),
      bio: bio?.trim(),
      image,
      socialLinks: socialLinks || {},
    });

    return res.status(201).json({ success: true, author });
  } catch (error) {
    console.error("Admin create author error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// PUT /api/admin/authors/:id
exports.updateAuthor = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name, designation, bio, image, socialLinks } = req.body;

    const author = await Author.findByPk(id);
    if (!author) {
      return res.status(404).json({ success: false, message: "Author not found" });
    }

    const updates = {};
    if (name) updates.name = name.trim();
    if (designation !== undefined) updates.designation = designation?.trim();
    if (bio !== undefined) updates.bio = bio?.trim();
    if (image !== undefined) updates.image = image;
    if (socialLinks) updates.socialLinks = socialLinks;

    await author.update(updates);

    return res.status(200).json({ success: true, author });
  } catch (error) {
    console.error("Admin update author error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// DELETE /api/admin/authors/:id
exports.deleteAuthor = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const author = await Author.findByPk(id);
    if (!author) {
      return res.status(404).json({ success: false, message: "Author not found" });
    }

    await author.destroy();
    return res.status(200).json({ success: true, message: "Author deleted successfully" });
  } catch (error) {
    console.error("Admin delete author error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// -------------------- COMMENTS CRUD --------------------

// GET /api/admin/comments
exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      include: [
        {
          model: Blog,
          as: "Blog",
          attributes: ["id", "title", "slug"]
        }
      ],
      order: [["createdAt", "DESC"]],
    });
    return res.status(200).json({ success: true, comments });
  } catch (error) {
    console.error("Admin fetch comments error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// PATCH /api/admin/comments/:id/approve
exports.approveComment = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    await comment.update({ status: "approved" });
    return res.status(200).json({ success: true, comment });
  } catch (error) {
    console.error("Admin approve comment error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// PATCH /api/admin/comments/:id/reject
exports.rejectComment = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    await comment.update({ status: "rejected" });
    return res.status(200).json({ success: true, comment });
  } catch (error) {
    console.error("Admin reject comment error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// DELETE /api/admin/comments/:id
exports.deleteComment = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const comment = await Comment.findByPk(id);

    if (!comment) {
      return res.status(404).json({ success: false, message: "Comment not found" });
    }

    await comment.destroy();
    return res.status(200).json({ success: true, message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Admin delete comment error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
