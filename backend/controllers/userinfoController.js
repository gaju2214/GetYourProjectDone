const db = require('../models');
const UserInfo = db.UserInfo; // Note: Using your model name "UserInfo"

// Get all user infos
exports.getAllUserInfos = async (req, res) => {
  try {
    const userInfos = await UserInfo.findAll({
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

// Get user info by ID
exports.getUserInfoById = async (req, res) => {
  try {
    const id = req.params.id;
    const userInfo = await UserInfo.findByPk(id);
    
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

// Create new user info
exports.createUserInfo = async (req, res) => {
  try {
    const { name, phoneNumber } = req.body;
    
    const userInfo = await UserInfo.create({
      name,
      phoneNumber
    });
    
    res.status(201).json({
      success: true,
      data: userInfo,
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
    const { name, phoneNumber } = req.body;
    
    const [updated] = await UserInfo.update(
      { name, phoneNumber },
      { where: { id: id } }
    );
    
    if (updated) {
      const updatedUserInfo = await UserInfo.findByPk(id);
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

// Delete user info
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
