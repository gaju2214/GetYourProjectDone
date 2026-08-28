const { Blog, Author, Comment, BlogLike, sequelize } = require("../models");
const { Op } = require("sequelize");

// GET /api/blogs
exports.getBlogs = async (req, res) => {
  try {
    const { category, tag, search, q, sort, page = 1, limit = 6 } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 6;
    const offset = (pageNum - 1) * limitNum;

    const where = { status: "published" };

    if (category) {
      where.category = category;
    }

    if (tag) {
      where.tags = {
        [Op.or]: [
          { [Op.like]: `%"${tag}"%` },
          { [Op.like]: `%${tag}%` }
        ]
      };
    }

    const searchQuery = search || q;
    if (searchQuery) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${searchQuery}%` } },
        { excerpt: { [Op.iLike]: `%${searchQuery}%` } },
        { category: { [Op.iLike]: `%${searchQuery}%` } },
        sequelize.where(
          sequelize.cast(sequelize.col("tags"), "text"),
          { [Op.iLike]: `%${searchQuery}%` }
        ),
        sequelize.where(
          sequelize.cast(sequelize.col("content"), "text"),
          { [Op.iLike]: `%${searchQuery}%` }
        )
      ];
    }

    let order = [["publishedAt", "DESC"]];
    if (sort === "oldest") {
      order = [["publishedAt", "ASC"]];
    } else if (sort === "popular") {
      order = [
        ["views", "DESC"],
        ["likesCount", "DESC"]
      ];
    }

    const { count, rows: blogs } = await Blog.findAndCountAll({
      where,
      attributes: { exclude: ["content", "tableOfContents", "keyTakeaways"] },
      include: [
        {
          model: Author,
          as: "Author",
          attributes: ["id", "name", "designation", "image"]
        }
      ],
      order,
      limit: limitNum,
      offset,
    });

    const totalPages = Math.ceil(count / limitNum);

    return res.status(200).json({
      success: true,
      blogs,
      totalPages,
      currentPage: pageNum,
      totalBlogs: count,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET /api/blogs/featured
exports.getFeaturedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      where: {
        status: "published",
        isFeatured: true,
      },
      attributes: { exclude: ["content", "tableOfContents", "keyTakeaways"] },
      include: [
        {
          model: Author,
          as: "Author",
          attributes: ["id", "name", "designation", "image"]
        }
      ],
      order: [["publishedAt", "DESC"]],
      limit: 3,
    });

    return res.status(200).json({
      success: true,
      blogs,
    });
  } catch (error) {
    console.error("Error fetching featured blogs:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET /api/blogs/:slug
exports.getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOne({
      where: { slug, status: "published" },
      include: [
        {
          model: Author,
          as: "Author",
          attributes: ["id", "name", "designation", "bio", "image", "socialLinks"]
        }
      ],
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // View count increment logic to prevent multiple hits from same session
    let viewedBlogs = [];
    if (req.cookies?.viewed_blogs) {
      try {
        viewedBlogs = JSON.parse(req.cookies.viewed_blogs);
      } catch (e) {
        viewedBlogs = [];
      }
    }
    if (!viewedBlogs.includes(blog.id)) {
      await blog.increment("views");
      viewedBlogs.push(blog.id);
      res.cookie("viewed_blogs", JSON.stringify(viewedBlogs), {
        maxAge: 2 * 60 * 60 * 1000, // 2 hours
        httpOnly: true,
        sameSite: "strict",
      });
      // Update local object to show correct views count in current response
      blog.views += 1;
    }

    // Get 3 related articles
    const relatedBlogs = await Blog.findAll({
      where: {
        status: "published",
        id: { [Op.ne]: blog.id },
        [Op.or]: [
          { category: blog.category },
          // Simple JSON tags intersection
          sequelize.where(
            sequelize.cast(sequelize.col("tags"), "text"),
            {
              [Op.or]: (Array.isArray(blog.tags) ? blog.tags : []).map(t => ({
                [Op.iLike]: `%${t}%`
              }))
            }
          )
        ]
      },
      attributes: { exclude: ["content", "tableOfContents", "keyTakeaways"] },
      include: [
        {
          model: Author,
          as: "Author",
          attributes: ["id", "name", "designation", "image"]
        }
      ],
      limit: 3,
      order: [["publishedAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      blog,
      relatedBlogs,
    });
  } catch (error) {
    console.error("Error fetching blog by slug:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET /api/blogs/:slug/related
exports.getRelatedBlogs = async (req, res) => {
  try {
    const { slug } = req.params;

    const currentBlog = await Blog.findOne({
      where: { slug, status: "published" },
      attributes: ["id", "category", "tags"]
    });

    if (!currentBlog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    const related = await Blog.findAll({
      where: {
        status: "published",
        id: { [Op.ne]: currentBlog.id },
        [Op.or]: [
          { category: currentBlog.category },
          sequelize.where(
            sequelize.cast(sequelize.col("tags"), "text"),
            {
              [Op.or]: (Array.isArray(currentBlog.tags) ? currentBlog.tags : []).map(t => ({
                [Op.iLike]: `%${t}%`
              }))
            }
          )
        ]
      },
      attributes: { exclude: ["content", "tableOfContents", "keyTakeaways"] },
      include: [
        {
          model: Author,
          as: "Author",
          attributes: ["id", "name", "designation", "image"]
        }
      ],
      limit: 3,
      order: [["publishedAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      blogs: related,
    });
  } catch (error) {
    console.error("Error fetching related blogs:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// POST /api/blogs/:id/like
exports.likeBlog = async (req, res) => {
  try {
    const blogId = parseInt(req.params.id);
    const userId = req.user.id; // from authenticateUser middleware

    const blog = await Blog.findByPk(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: "Blog not found",
      });
    }

    // Toggle user like
    const existingLike = await BlogLike.findOne({ where: { blogId, userId } });
    let liked = false;

    if (existingLike) {
      await existingLike.destroy();
      await blog.decrement("likesCount");
      liked = false;
    } else {
      await BlogLike.create({ blogId, userId });
      await blog.increment("likesCount");
      liked = true;
    }

    // Fetch updated count
    const updatedBlog = await Blog.findByPk(blogId, { attributes: ["likesCount"] });

    return res.status(200).json({
      success: true,
      likes: updatedBlog.likesCount,
      liked,
    });
  } catch (error) {
    console.error("Error liking blog:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// GET /api/blogs/:blogId/comments
exports.getComments = async (req, res) => {
  try {
    const blogId = parseInt(req.params.blogId);

    const comments = await Comment.findAll({
      where: { blogId, status: "approved" },
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      comments,
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// POST /api/blogs/:blogId/comments
exports.postComment = async (req, res) => {
  try {
    const blogId = parseInt(req.params.blogId);
    const { name, email, content } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: "Valid email is required" });
    }
    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, message: "Comment content is required" });
    }

    const blog = await Blog.findByPk(blogId);
    if (!blog) {
      return res.status(404).json({ success: false, message: "Blog not found" });
    }

    await Comment.create({
      blogId,
      name: name.trim(),
      email: email.trim(),
      content: content.trim(),
      status: "pending", // require moderation
    });

    return res.status(201).json({
      success: true,
      message: "Comment submitted successfully and is awaiting moderation.",
    });
  } catch (error) {
    console.error("Error posting comment:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
