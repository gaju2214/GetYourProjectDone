const { Project, Subcategory } = require('../models');

// Create a new project
exports.createProject = async (req, res) => {
  const { title, description, price, subcategoryId } = req.body;
  const image = req.file ? req.file.filename : null;

  try {
    const subcategory = await Subcategory.findByPk(subcategoryId);
    if (!subcategory) {
      return res.status(404).json({ error: 'Subcategory not found' });
    }

    const project = await Project.create({
      title,
      description,
      price,
      image,
      subcategoryId
    });

    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create project' });
  }
};

// Get all projects (with optional subcategory filtering)
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: { model: Subcategory, as: 'subcategory' }
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

// Get single project by ID

// Get single project by ID
exports.getProjectById = async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Project.findByPk(id, {
      include: { model: Subcategory, as: 'subcategory' }
    });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({ success: true, data: project });
  } catch (err) {
    console.error('Error fetching project:', err.message);
    res.status(500).json({ success: false, message: 'Failed to fetch project', error: err.message });
  }
};
// Get all projects (with optional subcategory filtering)
exports.getAllProjects = async (req, res) => {
  const { subcategoryId } = req.query;

  const whereClause = subcategoryId ? { subcategoryId } : {};

  try {
    const projects = await Project.findAll({
      where: whereClause,
      include: { model: Subcategory, as: 'subcategory' }
    });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch projects' });
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
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

