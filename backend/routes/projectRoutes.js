const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const projectController = require('../controllers/projectController');

// Upload project with image
router.post('/create-project', upload.single('image'), projectController.createProject);


// Get all projects
router.get('/', projectController.getAllProjects);

// Get single project
router.get('/:id', projectController.getProjectById);
router.get('/by-subcategory/:subcategoryId', projectController.getProjectsBySubcategory);
// Get projects by subcategory
module.exports = router;
