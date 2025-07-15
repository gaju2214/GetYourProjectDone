const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const projectController = require('../controllers/projectController');

// Upload project with image
router.post('/add', upload.single('image'), projectController.createProject);


// Get all projects
router.get('/', projectController.getAllProjects);

// Get single project
router.get('/:id', projectController.getProjectById);

module.exports = router;
