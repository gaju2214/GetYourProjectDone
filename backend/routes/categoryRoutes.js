const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Add category
router.post('/add-category', categoryController.createCategory);

// Add subcategory
router.post('/add-subcategory', categoryController.createSubcategory);

// Get all categories with subcategories
router.get('/', categoryController.getAllCategories);

module.exports = router;
