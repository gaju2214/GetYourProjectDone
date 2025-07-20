const { Category, Subcategory } = require('../models');

// Utility to generate slug from name
const generateSlug = (name) => {
  return name
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // Replace spaces with -
    .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
    .replace(/\-\-+/g, '-');     // Replace multiple - with single -
};

// Create Category
exports.createCategory = async (req, res) => {
  if (!req.body || !req.body.name) {
    return res.status(400).json({ message: 'Missing category name in request body' });
  }
  const { name } = req.body;
  const slug = generateSlug(name);

  try {
    const category = await Category.create({ name, slug });
    res.status(201).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create category' });
  }
};

// Create Subcategory
exports.createSubcategory = async (req, res) => {
  const { name, categoryId } = req.body;
  const slug = generateSlug(name);

  try {
    const subcategory = await Subcategory.create({ name, categoryId, slug });
    res.status(201).json(subcategory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create subcategory' });
  }
};

// Get All Categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

// Get Subcategories (optionally filtered by categoryId)
// ✅ Get subcategories by category slug
exports.getSubcategoriesByCategorySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const category = await Category.findOne({ where: { slug } });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    const subcategories = await Subcategory.findAll({
      where: { categoryId: category.id },
    });

    res.json(subcategories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch subcategories by category slug' });
  }
};


// Get All Categories With Subcategories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      // include: [{ model: Subcategory, as: 'subcategories' }]
    });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch categories with subcategories' });
  }
};

// ✅ Get Category by Slug
exports.getCategoryBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const category = await Category.findOne({
      where: { slug }
    });

    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(category);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch category by slug' });
  }
};
