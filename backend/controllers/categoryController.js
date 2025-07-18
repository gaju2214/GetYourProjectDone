const { Category, Subcategory } = require('../models');

// Create Category
exports.createCategory = async (req, res) => {
  if (!req.body || !req.body.name) {
    return res.status(400).json({ message: 'Missing category name in request body' });
  }
  const { name } = req.body;
  try {
    const category = await Category.create({ name });
    res.status(201).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create category' });
  }
};

// Create Subcategory
exports.createSubcategory = async (req, res) => {
  const { name, categoryId } = req.body;
  try {
    const subcategory = await Subcategory.create({ name, categoryId });
    res.status(201).json(subcategory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create subcategory' });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// ✅ Get only subcategories (with optional category filtering)
exports.getSubcategories = async (req, res) => {
  const { categoryId } = req.query; // Optional filter by categoryId
  try {
    const whereClause = categoryId ? { categoryId } : {};
    const subcategories = await Subcategory.findAll({ where: whereClause });
    res.json(subcategories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch subcategories' });
  }
};

// Get all categories with subcategories (for dashboard view)
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [{ model: Subcategory, as: 'subcategories' }]
    });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories with subcategories' });
  }
};
