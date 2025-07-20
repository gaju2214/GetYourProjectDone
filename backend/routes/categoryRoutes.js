const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// CREATE
router.post('/create-category', categoryController.createCategory);
router.post('/create-subcategory', categoryController.createSubcategory);

// GET
router.get('/getallcategory', categoryController.getCategories); // ✅ This handles GET /api/categories
//router.get('/subcategories', categoryController.getSubcategories); // Only subcategories (with optional ?categoryId=)
router.get('/categoryall', categoryController.getAllCategories); // All categories + subs
router.get('/:slug', categoryController.getCategoryBySlug);
router.get('/subcategories/by-slug/:slug', categoryController.getSubcategoriesByCategorySlug);

module.exports = router;
