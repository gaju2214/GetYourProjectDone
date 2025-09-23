const db = require('../models');
const UserInfo = db.UserInfo;

// Get all user infos with project details
exports.getAllUserInfos = async (req, res) => {
  try {
    const userInfos = await UserInfo.findAll({
      include: [{
        model: db.Project,
        as: 'project',
        attributes: ['id', 'title', 'slug']
      }],
      order: [['createdAt', 'DESC']]
    });
    res.json({
      success: true,
      data: userInfos
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message || "Error retrieving user infos" 
    });
  }
};

// Get user info by ID with project details
exports.getUserInfoById = async (req, res) => {
  try {
    const id = req.params.id;
    const userInfo = await UserInfo.findByPk(id, {
      include: [{
        model: db.Project,
        as: 'project',
        attributes: ['id', 'title', 'slug']
      }]
    });
    
    if (userInfo) {
      res.json({
        success: true,
        data: userInfo
      });
    } else {
      res.status(404).json({ 
        success: false,
        message: "User info not found" 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Create new user info with projectId
exports.createUserInfo = async (req, res) => {
  try {
    const { name, phoneNumber, projectId } = req.body;
    
    // Debug logging (remove in production)
    console.log('Request body:', req.body);
    console.log('Extracted values:', { name, phoneNumber, projectId });
    
     // Validate that project exists (optional but recommended)
    const project = await db.Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    // Create user info with all required fields
    const userInfo = await UserInfo.create({
      name,
      phoneNumber,
      projectId // ✅ Now including projectId
    });
    
    // Fetch the created record with project details
    const userInfoWithProject = await UserInfo.findByPk(userInfo.id, {
      include: [{
        model: db.Project,
        as: 'project',
        attributes: ['id', 'title', 'slug']
      }]
    });
    
    res.status(201).json({
      success: true,
      data: userInfoWithProject,
      message: "User info created successfully"
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Update user info
exports.updateUserInfo = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, phoneNumber, projectId } = req.body;
    
    // Validate that project exists if projectId is being updated
    if (projectId) {
      const project = await db.Project.findByPk(projectId);
      if (!project) {
        return res.status(400).json({ 
          success: false,
          message: "Project not found" 
        });
      }
    }
    
    const [updated] = await UserInfo.update(
      { name, phoneNumber, projectId },
      { where: { id: id } }
    );
    
    if (updated) {
      const updatedUserInfo = await UserInfo.findByPk(id, {
        include: [{
          model: db.Project,
          as: 'project',
          attributes: ['id', 'title', 'slug']
        }]
      });
      res.json({
        success: true,
        data: updatedUserInfo,
        message: "User info updated successfully"
      });
    } else {
      res.status(404).json({ 
        success: false,
        message: "User info not found" 
      });
    }
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Delete user info remains the same
exports.deleteUserInfo = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await UserInfo.destroy({
      where: { id: id }
    });
    
    if (deleted) {
      res.json({ 
        success: true,
        message: "User info deleted successfully" 
      });
    } else {
      res.status(404).json({ 
        success: false,
        message: "User info not found" 
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};
