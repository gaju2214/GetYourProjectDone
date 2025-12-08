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

// Get Subcategories by category slug
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

// Get Category by Slug
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

// ✅ ADD THESE NEW METHODS:

// Update Category
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    // Validate input
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Category name is required' });
    }

    // Check if category exists
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Generate new slug from updated name
    const slug = generateSlug(name.trim());

    // Update the category
    const updatedCategory = await category.update({
      name: name.trim(),
      slug: slug
    });

    res.json(updatedCategory);
  } catch (err) {
    console.error('Error updating category:', err);
    res.status(500).json({ error: 'Failed to update category' });
  }
};

// Delete Category
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if category exists
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Optional: Check if category has subcategories and handle accordingly
    const subcategoriesCount = await Subcategory.count({
      where: { categoryId: id }
    });

    if (subcategoriesCount > 0) {
      // You can either:
      // 1. Prevent deletion if subcategories exist
      return res.status(400).json({ 
        error: 'Cannot delete category with existing subcategories. Please delete subcategories first.' 
      });
      
      // 2. Or delete all subcategories first (cascade delete)
      // await Subcategory.destroy({ where: { categoryId: id } });
    }

    // Delete the category
    await category.destroy();

    res.json({ message: 'Category deleted successfully', id: id });
  } catch (err) {
    console.error('Error deleting category:', err);
    res.status(500).json({ error: 'Failed to delete category' });
  }
};
// Update Subcategory
// Get All Subcategories with better error handling
exports.getAllSubcategories = async (req, res) => {
  try {
    console.log('Fetching all subcategories...');
    
    const subcategories = await Subcategory.findAll({
      include: [{ 
        model: Category, 
        as: 'category', // Use the alias defined in Subcategory.associate
        attributes: ['id', 'name', 'slug']
      }]
    });

    console.log(`Found ${subcategories.length} subcategories`);
    res.json(subcategories);
  } catch (err) {
    console.error('Error fetching subcategories:', err);
    console.error('Error details:', err.message);
    
    // If the include fails, try without it
    try {
      console.log('Retrying without category include...');
      const subcategories = await Subcategory.findAll();
      console.log(`Found ${subcategories.length} subcategories without category info`);
      res.json(subcategories);
    } catch (fallbackErr) {
      console.error('Fallback query also failed:', fallbackErr);
      res.status(500).json({ error: 'Failed to fetch subcategories' });
    }
  }
};

// Update Subcategory with better validation
exports.updateSubcategory = async (req, res) => {
  const { id } = req.params;
  const { name, categoryId } = req.body;

  try {
    console.log(`Updating subcategory ${id} with:`, { name, categoryId });

    // Validate input
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Subcategory name is required' });
    }

    if (!categoryId) {
      return res.status(400).json({ error: 'Category ID is required' });
    }

    // Check if subcategory exists
    const subcategory = await Subcategory.findByPk(id);
    if (!subcategory) {
      return res.status(404).json({ error: 'Subcategory not found' });
    }

    // Check if category exists
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(400).json({ error: 'Selected category does not exist' });
    }

    // Generate new slug from updated name
    const slug = generateSlug(name.trim());

    // Update the subcategory
    const updatedSubcategory = await subcategory.update({
      name: name.trim(),
      categoryId: parseInt(categoryId), // Ensure it's a number
      slug: slug
    });

    console.log('Successfully updated subcategory:', updatedSubcategory);
    res.json(updatedSubcategory);
  } catch (err) {
    console.error('Error updating subcategory:', err);
    console.error('Error details:', err.message);
    res.status(500).json({ error: 'Failed to update subcategory', details: err.message });
  }
};

// Delete Subcategory - Final version
// Delete Subcategory - Handle foreign key constraints
exports.deleteSubcategory = async (req, res) => {
  const { id } = req.params;

  try {
    console.log(`Attempting to delete subcategory with ID: ${id}`);
    
    // Check if subcategory exists
    const subcategory = await Subcategory.findByPk(id);
    if (!subcategory) {
      return res.status(404).json({ error: 'Subcategory not found' });
    }

    // Check if there are projects using this subcategory
    // Assuming you have a Project model with subcategoryId field
    const { Project } = require('../models'); // Add this if not already imported
    const projectsUsingSubcategory = await Project.count({
      where: { subcategoryId: id }
    });

    if (projectsUsingSubcategory > 0) {
      return res.status(400).json({ 
        error: `Cannot delete subcategory. It is being used by ${projectsUsingSubcategory} project(s). Please move or delete those projects first.` 
      });
    }

    // If no projects are using it, safe to delete
    const deletedCount = await Subcategory.destroy({
      where: { id: id }
    });

    if (deletedCount === 0) {
      return res.status(404).json({ error: 'Subcategory not found' });
    }

    console.log(`Successfully deleted subcategory with ID: ${id}`);
    res.json({ message: 'Subcategory deleted successfully', id: id });
  } catch (err) {
    console.error('Error deleting subcategory:', err);
    
    // Handle specific foreign key constraint errors
    if (err.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ 
        error: 'Cannot delete subcategory because it is referenced by other records. Please remove those references first.' 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to delete subcategory', 
      details: err.message 
    });
  }
};

