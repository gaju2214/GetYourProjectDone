const express = require("express");
const router = express.Router();
const projectController = require("../controllers/projectController");

// Create a new project (no multer needed)
router.post("/create-project", projectController.createProject);
router.get("/search", projectController.searchProjects);
// Get all projects
router.get("/", projectController.getAllProjects);

// Get single project by slug
router.get("/by-slug/:slug", projectController.getProjectBySlug);

// Get projects by subcategory
router.get(
  "/by-subcategory/:subcategoryId",
  projectController.getProjectsBySubcategory
);

//from here
// Get single project by ID
router.get("/:id", projectController.getProjectById);

router.put("/:id", projectController.updateProject);

router.put("/:id", projectController.updateProject)
router.delete("/:id", projectController.deleteProject);


// // // Projects
// router.get("/project/:id", projectController.getProjectById);

// Categories
router.get("/category/:id", projectController.getCategoryById);
router.put("/category/:id", projectController.updateCategory);
router.delete("/category/:id", projectController.deleteCategory);  
// router.get("/category", projectController.getAllCategories);

// Subcategories
// router.get("/subcategory/:subcategoryId", projectController.getProjectsBySubcategory);
router.get("/subcategory/:id", projectController.getSubCategoryById);
router.put("/subcategory/:id", projectController.updateSubcategory);
 router.delete("/subcategory/:id", projectController.deleteSubcategory);

module.exports = router;
