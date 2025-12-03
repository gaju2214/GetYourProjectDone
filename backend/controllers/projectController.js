const { Project, Subcategory, Category, CartItem } = require("../models");
const slugify = require("slugify");
const { Op } = require("sequelize");

// ==================== CREATE PROJECT ====================
exports.createProject = async (req, res) => {
  const {
    title,
    description,
    price,
    subcategoryId,
    components,
    details,
    review,
    image, // Cloudinary URL
    block_diagram, // Cloudinary URL
    abstract_file, // Cloudinary URL
  } = req.body;

  try {
    // Validate required fields
    if (!title || !description || !subcategoryId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const subcategory = await Subcategory.findByPk(subcategoryId);
    if (!subcategory) {
      return res.status(404).json({ error: "Subcategory not found" });
    }

    // Generate unique slug
    let slug = slugify(title, { lower: true, strict: true });
    let counter = 1;
    let originalSlug = slug;
    while (true) {
      const existing = await Project.findOne({ where: { slug } });
      if (!existing) break;
      slug = `${originalSlug}-${counter}`;
      counter++;
    }

    // Parse components
    let parsedComponents = [];
    try {
      if (Array.isArray(components)) {
        parsedComponents = components; // already an array
      } else if (typeof components === "string") {
        parsedComponents = JSON.parse(components); // try parsing
      }
    } catch (err) {
      parsedComponents = [components]; // fallback: wrap string into array
    }

    // Create project
    const project = await Project.create({
      title,
      slug,
      description,
      price,
      image,
      subcategoryId,
      components: parsedComponents,
      block_diagram,
      abstract_file,
      details,
      review,
    });

    console.log("✅ Project created:", project.id);

    // ✅ Sync with Shiprocket Checkout
    try {
      const checkoutController = require('./shiprocketCheckoutController');
      await checkoutController.syncProductUpdate(project.id);
      console.log("✅ Project synced with Shiprocket Checkout");
    } catch (error) {
      console.error("⚠️ Failed to sync with Shiprocket:", error.message);
      // Don't fail the request, just log the error
    }

    res.status(201).json(project);
  } catch (err) {
    console.error("❌ Error creating project:", err);
    res.status(500).json({ error: "Failed to create project" });
  }
};

// ==================== GET ALL PROJECTS ====================
exports.getAllProjects = async (req, res) => {
  const { q, subcategoryId } = req.query;

  try {
    // Build where clause
    let whereClause = {};
    
    if (subcategoryId) {
      whereClause.subcategoryId = subcategoryId;
    }

    // If search query is provided
    if (q && q.trim() !== "") {
      // Search by title
      let projects = await Project.findAll({
        where: {
          ...whereClause,
          title: {
            [Op.iLike]: `%${q}%`, // Case-insensitive match on title
          },
        },
        include: { model: Subcategory, as: "subcategory" },
      });

      if (projects.length > 0) {
        return res.json(projects); // Found by title
      }

      // Try matching by subcategory name
      const subcategory = await Subcategory.findOne({
        where: {
          name: {
            [Op.iLike]: `%${q}%`,
          },
        },
      });

      if (subcategory) {
        projects = await Project.findAll({
          where: {
            subcategoryId: subcategory.id,
          },
          include: { model: Subcategory, as: "subcategory" },
        });

        if (projects.length > 0) {
          return res.json(projects); // Found by subcategory
        }
      }

      // No match found
      return res
        .status(404)
        .json({ error: "No projects found for your search query." });
    }

    // If no search query provided, return all projects
    const projects = await Project.findAll({
      where: whereClause,
      include: { model: Subcategory, as: "subcategory" },
      order: [['createdAt', 'DESC']]
    });

    return res.json(projects);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};

// ==================== SEARCH PROJECTS ====================
exports.searchProjects = async (req, res) => {
  const { q } = req.query;

  try {
    if (!q || q.trim() === "") {
      return res.status(400).json({ error: "Query parameter 'q' is required" });
    }

    const term = q.trim();

    // Step 1: Search by Category
    const category = await Category.findOne({
      where: { name: { [Op.iLike]: `%${term}%` } },
    });

    if (category) {
      const projects = await Project.findAll({
        include: [
          {
            model: Subcategory,
            as: "subcategory",
            where: { categoryId: category.id },
            include: [{ model: Category, as: "category" }],
          },
        ],
      });

      if (projects.length > 0) {
        return res.json(projects);
      }
    }

    // Step 2: Search by Subcategory
    const subcategory = await Subcategory.findOne({
      where: { name: { [Op.iLike]: `%${term}%` } },
    });

    if (subcategory) {
      const projects = await Project.findAll({
        where: { subcategoryId: subcategory.id },
        include: [
          {
            model: Subcategory,
            as: "subcategory",
            include: [{ model: Category, as: "category" }],
          },
        ],
      });

      if (projects.length > 0) {
        return res.json(projects);
      }
    }

    // Step 3: Search by Project title
    const projectsByTitle = await Project.findAll({
      where: {
        title: { [Op.iLike]: `%${term}%` },
      },
      include: [
        {
          model: Subcategory,
          as: "subcategory",
          include: [{ model: Category, as: "category" }],
        },
      ],
    });

    if (projectsByTitle.length > 0) {
      return res.json(projectsByTitle);
    }

    // Step 4: Nothing found
    return res.status(404).json({ error: `No projects found for "${term}"` });
  } catch (err) {
    console.error("Error searching projects:", err);
    return res.status(500).json({ error: "Failed to search projects" });
  }
};

// ==================== GET PROJECTS BY SUBCATEGORY ====================
exports.getProjectsBySubcategory = async (req, res) => {
  const { subcategoryId } = req.params;
  try {
    const projects = await Project.findAll({
      where: { subcategoryId },
      include: { model: Subcategory, as: "subcategory" },
    });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};

// ==================== GET PROJECT BY SLUG ====================
exports.getProjectBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const project = await Project.findOne({
      where: { slug },
      include: { model: Subcategory, as: "subcategory" },
    });

    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }

    res.json({ success: true, data: project });
  } catch (err) {
    console.error("Error fetching project:", err.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch project",
      error: err.message,
    });
  }
};

// ==================== GET PROJECT BY ID ====================
exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findByPk(id, {
      include: { model: Subcategory, as: "subcategory" }
    });
    
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ==================== GET CATEGORY BY ID ====================
exports.getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ==================== GET SUBCATEGORY BY ID ====================
exports.getSubCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const subcategory = await Subcategory.findByPk(id);
    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    res.json(subcategory);
  } catch (error) {
    console.error("Error fetching subcategory:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ==================== UPDATE PROJECT ====================
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // ✅ If title is being updated, regenerate the slug
    if (updatedData.title && updatedData.title !== project.title) {
      let slug = slugify(updatedData.title, { lower: true, strict: true });
      let counter = 1;
      let originalSlug = slug;

      // Check for duplicate slugs (excluding current project)
      while (true) {
        const existing = await Project.findOne({
          where: {
            slug,
            id: { [Op.ne]: id }, // Exclude current project
          },
        });
        if (!existing) break;
        slug = `${originalSlug}-${counter}`;
        counter++;
      }

      updatedData.slug = slug;
      console.log(`Title changed: "${project.title}" → "${updatedData.title}"`);
      console.log(`Slug updated: "${project.slug}" → "${slug}"`);
    }

    // ✅ Handle components if they're being updated
    if (updatedData.components) {
      let parsedComponents = [];
      try {
        if (Array.isArray(updatedData.components)) {
          parsedComponents = updatedData.components;
        } else if (typeof updatedData.components === "string") {
          parsedComponents = JSON.parse(updatedData.components);
        }
      } catch (err) {
        parsedComponents = [updatedData.components];
      }
      updatedData.components = parsedComponents;
    }

    // Update project
    await project.update(updatedData);

    console.log("✅ Project updated:", project.id);

    // ✅ Sync with Shiprocket Checkout
    try {
      const checkoutController = require('./shiprocketCheckoutController');
      await checkoutController.syncProductUpdate(project.id);
      console.log("✅ Project update synced with Shiprocket Checkout");
    } catch (error) {
      console.error("⚠️ Failed to sync with Shiprocket:", error.message);
      // Don't fail the request, just log the error
    }

    res.json({ message: "Project updated successfully", project });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
      details: error.errors || null,
    });
  }
};

// ==================== UPDATE CATEGORY ====================
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await category.update(updatedData);

    res.json({ message: "Category updated successfully", category });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
      details: error.errors || null,
    });
  }
};

// ==================== UPDATE SUBCATEGORY ====================
exports.updateSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const subcategory = await Subcategory.findByPk(id);
    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    await subcategory.update(updatedData);

    res.json({ message: "Subcategory updated successfully", subcategory });
  } catch (error) {
    console.error("Error updating subcategory:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
      details: error.errors || null,
    });
  }
};

// ==================== DELETE PROJECT ====================
exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Delete related cart items first
    await CartItem.destroy({
      where: {
        projectId: id,
      },
    });

    await project.destroy();
    
    console.log("✅ Project deleted:", id);
    
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// ==================== DELETE CATEGORY ====================
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await Category.destroy({ where: { id } });

    if (result === 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ==================== DELETE SUBCATEGORY ====================
exports.deleteSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await Subcategory.destroy({ where: { id } });
    
    if (result === 0) {
      return res.status(404).json({ message: "Subcategory not found" });
    }
    
    res.json({ message: "Subcategory deleted successfully" });
  } catch (error) {
    console.error("Error deleting subcategory:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = exports;
