const express = require("express");
const router = express.Router();
const adminBlogController = require("../controllers/adminBlogController");

// -------------------- BLOGS CRUD --------------------
router.get("/", adminBlogController.getAllBlogs);
router.post("/", adminBlogController.createBlog);
router.put("/:id", adminBlogController.updateBlog);
router.delete("/:id", adminBlogController.deleteBlog);
router.patch("/:id/publish", adminBlogController.publishBlog);
router.patch("/:id/archive", adminBlogController.archiveBlog);
router.patch("/:id/featured", adminBlogController.toggleFeatured);

// -------------------- AUTHORS CRUD --------------------
router.get("/authors", adminBlogController.getAllAuthors);
router.post("/authors", adminBlogController.createAuthor);
router.put("/authors/:id", adminBlogController.updateAuthor);
router.delete("/authors/:id", adminBlogController.deleteAuthor);

// -------------------- COMMENTS CRUD --------------------
router.get("/comments", adminBlogController.getAllComments);
router.patch("/comments/:id/approve", adminBlogController.approveComment);
router.patch("/comments/:id/reject", adminBlogController.rejectComment);
router.delete("/comments/:id", adminBlogController.deleteComment);

module.exports = router;
