const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const projectController = require('../controllers/projectController');

// Upload project with image
router.post(
  '/create-project',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'block_diagram', maxCount: 1 }
  ]),
  projectController.createProject
);

// Get all projects
router.get('/', projectController.getAllProjects);
// Get single project by slug
router.get('/by-slug/:slug', projectController.getProjectBySlug);
// Get single project
router.get('/:id', projectController.getProjectById);
router.get('/by-subcategory/:subcategoryId', projectController.getProjectsBySubcategory);
// Get projects by subcategory
module.exports = router;
