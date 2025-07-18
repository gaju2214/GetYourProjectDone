// routes/subcategoryRoutes.js
const express = require('express');
const router = express.Router();
const { Subcategory } = require('../models');

// GET subcategories for a specific category
router.get('/by-category/:categoryId', async (req, res) => {
  const { categoryId } = req.params;

  try {
    const subcategories = await Subcategory.findAll({
      where: { categoryId }
    });

    res.status(200).json(subcategories);
  } catch (err) {
    console.error('Error fetching subcategories:', err);
    res.status(500).json({ error: 'Failed to fetch subcategories' });
  }
});

module.exports = router;
