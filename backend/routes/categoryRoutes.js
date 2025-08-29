const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// CREATE
router.post('/create-category', categoryController.createCategory);
router.post('/create-subcategory', categoryController.createSubcategory);

// GET
router.get('/getallcategory', categoryController.getCategories);
router.get('/getallsubcategory', categoryController.getAllSubcategories); // ADD THIS
router.get('/categoryall', categoryController.getAllCategories);
router.get('/:slug', categoryController.getCategoryBySlug);
router.get('/subcategories/by-slug/:slug', categoryController.getSubcategoriesByCategorySlug);

// UPDATE & DELETE - ADD THESE ROUTES
router.put('/category/:id', categoryController.updateCategory);
router.delete('/category/:id', categoryController.deleteCategory);

// Subcategory Routes
router.put('/subcategory/:id', categoryController.updateSubcategory);
router.delete('/subcategory/:id', categoryController.deleteSubcategory);



module.exports = router;
