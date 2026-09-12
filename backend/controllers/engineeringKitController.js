const { EngineeringKit, EngineeringSubcategory } = require("../models");
const slugify = require("slugify");
const { Op } = require("sequelize");

const generateSlug = (name) =>
  name.toString().toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]+/g, "").replace(/-+/g, "-");

const parseArrayField = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed;
    } catch (err) {
      // not JSON, fall through to comma-split
    }
    return value.split(",").map((v) => v.trim()).filter(Boolean);
  }
  return [];
};

// ==================== SUBCATEGORIES ====================
exports.createEngineeringSubcategory = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Missing subcategory name" });

  try {
    const slug = generateSlug(name);
    const subcategory = await EngineeringSubcategory.create({ name, slug });
    res.status(201).json(subcategory);
  } catch (err) {
    console.error("Error creating engineering subcategory:", err);
    res.status(500).json({ error: "Failed to create engineering subcategory" });
  }
};

exports.getAllEngineeringSubcategories = async (req, res) => {
  try {
    const subcategories = await EngineeringSubcategory.findAll({ order: [["name", "ASC"]] });
    res.json(subcategories);
  } catch (err) {
    console.error("Error fetching engineering subcategories:", err);
    res.status(500).json({ error: "Failed to fetch engineering subcategories" });
  }
};

exports.updateEngineeringSubcategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const subcategory = await EngineeringSubcategory.findByPk(id);
    if (!subcategory) return res.status(404).json({ error: "Subcategory not found" });

    const updates = { name };
    if (name) updates.slug = generateSlug(name);
    await subcategory.update(updates);
    res.json(subcategory);
  } catch (err) {
    console.error("Error updating engineering subcategory:", err);
    res.status(500).json({ error: "Failed to update engineering subcategory" });
  }
};

exports.deleteEngineeringSubcategory = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await EngineeringSubcategory.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: "Subcategory not found" });
    res.json({ message: "Engineering subcategory deleted" });
  } catch (err) {
    console.error("Error deleting engineering subcategory:", err);
    res.status(500).json({ error: "Failed to delete engineering subcategory" });
  }
};

// ==================== ENGINEERING KITS ====================
exports.createEngineeringKit = async (req, res) => {
  const {
    title,
    description,
    price,
    engineeringSubcategoryId,
    components,
    technologies,
    details,
    review,
    difficulty,
    image,
    block_diagram,
    abstract_file,
  } = req.body;

  try {
    if (!title || !description || !engineeringSubcategoryId || price === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const subcategory = await EngineeringSubcategory.findByPk(engineeringSubcategoryId);
    if (!subcategory) {
      return res.status(404).json({ error: "Engineering subcategory not found" });
    }

    let slug = slugify(title, { lower: true, strict: true });
    let counter = 1;
    const originalSlug = slug;
    while (await EngineeringKit.findOne({ where: { slug } })) {
      slug = `${originalSlug}-${counter}`;
      counter++;
    }

    const kit = await EngineeringKit.create({
      title,
      slug,
      description,
      price,
      image,
      engineeringSubcategoryId,
      components: parseArrayField(components),
      technologies: parseArrayField(technologies),
      block_diagram,
      abstract_file,
      details,
      review,
      difficulty,
    });

    res.status(201).json(kit);
  } catch (err) {
    console.error("Error creating engineering kit:", err);
    res.status(500).json({ error: "Failed to create engineering kit" });
  }
};

exports.getAllEngineeringKits = async (req, res) => {
  const { page = 1, limit = 12, engineeringSubcategoryId } = req.query;
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const pageLimit = Math.max(1, Math.min(1000, parseInt(limit, 10) || 12));

  try {
    const whereClause = {};
    if (engineeringSubcategoryId) whereClause.engineeringSubcategoryId = engineeringSubcategoryId;

    const offset = (pageNum - 1) * pageLimit;
    const { count, rows } = await EngineeringKit.findAndCountAll({
      where: whereClause,
      include: { model: EngineeringSubcategory, as: "subcategory" },
      order: [["createdAt", "DESC"]],
      limit: pageLimit,
      offset,
    });

    res.json({
      data: rows,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(count / pageLimit) || 1,
        total: count,
        limit: pageLimit,
      },
    });
  } catch (err) {
    console.error("Error fetching engineering kits:", err);
    res.status(500).json({ error: "Failed to fetch engineering kits" });
  }
};

exports.getEngineeringKitById = async (req, res) => {
  const { id } = req.params;
  try {
    const kit = await EngineeringKit.findByPk(id, {
      include: { model: EngineeringSubcategory, as: "subcategory" },
    });
    if (!kit) return res.status(404).json({ error: "Engineering kit not found" });
    res.json(kit);
  } catch (err) {
    console.error("Error fetching engineering kit:", err);
    res.status(500).json({ error: "Failed to fetch engineering kit" });
  }
};

exports.getEngineeringKitsBySubcategory = async (req, res) => {
  const { subcategoryId } = req.params;
  try {
    const kits = await EngineeringKit.findAll({
      where: { engineeringSubcategoryId: subcategoryId },
      include: { model: EngineeringSubcategory, as: "subcategory" },
      order: [["createdAt", "DESC"]],
    });
    res.json(kits);
  } catch (err) {
    console.error("Error fetching engineering kits by subcategory:", err);
    res.status(500).json({ error: "Failed to fetch engineering kits" });
  }
};

exports.updateEngineeringKit = async (req, res) => {
  const { id } = req.params;
  const updatedData = { ...req.body };

  try {
    const kit = await EngineeringKit.findByPk(id);
    if (!kit) return res.status(404).json({ error: "Engineering kit not found" });

    if (updatedData.title && updatedData.title !== kit.title) {
      let slug = slugify(updatedData.title, { lower: true, strict: true });
      let counter = 1;
      const originalSlug = slug;
      while (await EngineeringKit.findOne({ where: { slug, id: { [Op.ne]: id } } })) {
        slug = `${originalSlug}-${counter}`;
        counter++;
      }
      updatedData.slug = slug;
    }

    if (updatedData.components !== undefined) {
      updatedData.components = parseArrayField(updatedData.components);
    }
    if (updatedData.technologies !== undefined) {
      updatedData.technologies = parseArrayField(updatedData.technologies);
    }

    await kit.update(updatedData);
    res.json(kit);
  } catch (err) {
    console.error("Error updating engineering kit:", err);
    res.status(500).json({ error: "Failed to update engineering kit" });
  }
};

exports.deleteEngineeringKit = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await EngineeringKit.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: "Engineering kit not found" });
    res.json({ message: "Engineering kit deleted" });
  } catch (err) {
    console.error("Error deleting engineering kit:", err);
    res.status(500).json({ error: "Failed to delete engineering kit" });
  }
};
