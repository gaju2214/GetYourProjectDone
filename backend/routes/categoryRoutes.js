const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

router.post('/create-category', categoryController.createCategory);

router.post('/create-subcategory', categoryController.createSubcategory);

// GET
router.get('/categories', categoryController.getCategories); // Only categories
router.get('/subcategories', categoryController.getSubcategories); // Only subcategories (with optional ?categoryId=)
router.get('/categoryall', categoryController.getAllCategories); // All categories + subs

module.exports = router;
