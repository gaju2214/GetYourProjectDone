const express = require("express");
const router = express.Router();
const blogController = require("../controllers/blogController");
const authenticateUser = require("../middleware/auth");

// GET /api/blogs/featured (Featured blogs)
router.get("/featured", blogController.getFeaturedBlogs);

// GET /api/blogs (List of published blogs with filtering/search/sorting/pagination)
router.get("/", blogController.getBlogs);

// GET /api/blogs/:slug (Details of a single blog by slug)
router.get("/:slug", blogController.getBlogBySlug);

// GET /api/blogs/:slug/related (Related blogs by slug)
router.get("/:slug/related", blogController.getRelatedBlogs);

// GET /api/blogs/:blogId/comments (Approved comments list)
router.get("/:blogId/comments", blogController.getComments);

// POST /api/blogs/:blogId/comments (Post new comment for moderation)
router.post("/:blogId/comments", blogController.postComment);

// POST /api/blogs/:id/like (Like/unlike blog post; requires user authentication)
router.post("/:id/like", authenticateUser, blogController.likeBlog);

module.exports = router;
