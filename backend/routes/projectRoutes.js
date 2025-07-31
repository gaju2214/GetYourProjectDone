const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");

// Create a new project (no multer needed)
router.post("/create-project", projectController.createProject);

// Get all projects
router.get("/", projectController.getAllProjects);

// Get single project by slug
router.get("/by-slug/:slug", projectController.getProjectBySlug);

// Get projects by subcategory
router.get(
  "/by-subcategory/:subcategoryId",
  projectController.getProjectsBySubcategory
);

// Get single project by ID
router.get("/:id", projectController.getProjectById);

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const upload = require("../middleware/upload");
// const projectController = require("../controllers/projectController");

// // Upload project with image
// router.post(
//   "/create-project",
//   router.post("/create-project", projectController.createProject),
//   projectController.createProject
// );

// // Get all projects
// router.get("/", projectController.getAllProjects);
// // Get single project by slug
// router.get("/by-slug/:slug", projectController.getProjectBySlug);
// // Get single project
// router.get("/:id", projectController.getProjectById);
// router.get(
//   "/by-subcategory/:subcategoryId",
//   projectController.getProjectsBySubcategory
// );
// // Get projects by subcategory
// module.exports = router;
