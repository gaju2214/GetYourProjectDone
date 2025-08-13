const { Project, Subcategory, Category } = require("../models");
const slugify = require("slugify");
const { Op } = require("sequelize");

// Create a new project
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

    let slug = slugify(title);
    let counter = 1;
    let originalSlug = slug;
    while (true) {
      const existing = await Project.findOne({ where: { slug } });
      if (!existing) break;
      slug = `${originalSlug}-${counter}`;
      counter++;
    }

    const project = await Project.create({
      title,
      slug,
      description,
      price,
      image, // Cloudinary URL string
      subcategoryId,
      components: JSON.parse(components || "[]"), // Parse stringified array
      block_diagram, // Cloudinary URL
      abstract_file: abstract_file, // Cloudinary URL
      details,
      review,
    });

    res.status(201).json(project);
    console.log(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create project" });
  }
};

// exports.getAllProjects = async (req, res) => {
//   try {
//     const projects = await Project.findAll({
//       include: { model: Subcategory, as: "subcategory" },
//     });
//     res.json(projects);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch projects" });
//   }
// };

exports.getAllProjects = async (req, res) => {
  const { q } = req.query;

  try {
    // If search query is provided
    if (q && q.trim() !== "") {
      let projects = await Project.findAll({
        where: {
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

      //  No match found
      return res.status(404).json({ error: "No projects found for your search query." });
    }

    // If no search query provided, return all projects
    const projects = await Project.findAll({
      include: { model: Subcategory, as: "subcategory" },
    });

    return res.json(projects);
  } catch (err) {
    console.error("Error fetching projects:", err);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};

// Get single project by ID
// exports.getProjectById = async (req, res) => {
//   const { id } = req.params;
//   try {
//     const project = await Project.findByPk(id, {
//       include: { model: Subcategory, as: "subcategory" },
//     });

//     if (!project) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Project not found" });
//     }

//     res.json({ success: true, data: project });
//   } catch (err) {
//     console.error("Error fetching project:", err.message);
//     res.status(500).json({
//       success: false,
//       message: "Failed to fetch project",
//       error: err.message,
//     });
//   }
// };
// Get all projects (with optional subcategory filtering)
exports.getAllProjects = async (req, res) => {
  const { subcategoryId } = req.query;

  const whereClause = subcategoryId ? { subcategoryId } : {};

  try {
    const projects = await Project.findAll({
      where: whereClause,
      include: { model: Subcategory, as: "subcategory" },
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};

exports.getProjectsBySubcategory = async (req, res) => {
  const { subcategoryId } = req.params;
  try {
    const projects = await Project.findAll({
      where: { subcategoryId },
    });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};

// Add a new method to get project by slug
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



//from here

// Get single project by ID (edit)
exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await Project.findByPk(id); // Sequelize method
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


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




exports.getSubCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const subcategory = await Subcategory.findByPk(id); // ✅ Use Subcategory model
    if (!subcategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }

    res.json(subcategory);
  } catch (error) {
    console.error("Error fetching subcategory:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// exports.getProjectsBySubcategory = async (req, res) => {
//   try {
//     const { subcategoryId } = req.params;

//     const projects = await Project.findAll({
//       where: { subcategoryId: subcategoryId }
//     });

//     if (projects.length === 0) {
//       return res.status(404).json({ message: "No projects found for this subcategory" });
//     }

//     res.json(projects);
//   } catch (error) {
//     console.error("Error fetching projects by subcategory:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };




// update code from here
exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const project = await Project.findByPk(id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    await project.update(updatedData);

    res.json({ message: "Project updated successfully", project });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
      details: error.errors || null
    });
  }
};
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const category = await Category.findByPk(id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    await category.update(updatedData);

    res.json({ message: "Category updated successfully", category });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
      details: error.errors || null
    });
  }
};

exports.updateSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const subcategory = await Subcategory.findByPk(id);
    if (!subcategory) return res.status(404).json({ message: "Subcategory not found" });

    await subcategory.update(updatedData);

    res.json({ message: "Subcategory updated successfully", subcategory });
  } catch (error) {
    console.error("Error updating subcategory:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
      details: error.errors || null
    });
  }
};
