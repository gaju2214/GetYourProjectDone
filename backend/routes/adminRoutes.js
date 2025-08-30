const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { Admin } = require('../models');
const authenticateAdmin = require('../middleware/adminauth');

const JWT_SECRET = process.env.JWT_ADMIN_SECRET || 'sgjjvgvytfr67t87yughjvghgs';

// POST /api/admin/login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Missing fields" });

  try {
    const admin = await Admin.findOne({ where: { email } });

    if (!admin)
      return res.status(404).json({ message: 'Admin not found' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ 
      id: admin.id, 
      email: admin.email, 
      role: 'admin' 
    }, JWT_SECRET, {
      expiresIn: '1d'
    });

    // Set HTTP-only cookie (for server-side authentication)
    res.cookie('admin', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'strict',
      path: '/',
    });

    // ✅ Send token in response body (for frontend state management)
    return res.status(200).json({
      message: 'Login successful',
      token: token,
      admin: { 
        id: admin.id, 
        email: admin.email,
        name: admin.name || admin.email.split('@')[0], // Fallback name
        role: 'admin'
      },
      success: true
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: "Internal server error",
      success: false 
    });
  }
});

// POST /api/admin/register
router.post('/register', async (req, res) => {
  const { email, password, name } = req.body;

  if (!email || !password)
    return res.status(400).json({ 
      message: 'Email and password required',
      success: false 
    });

  try {
    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      return res.status(400).json({ 
        message: 'Admin already exists',
        success: false 
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await Admin.create({ 
      email, 
      password: hashedPassword,
      name: name || email.split('@')[0] // Use provided name or email prefix
    });

    // Generate token for immediate login after registration
    const token = jwt.sign({ 
      id: admin.id, 
      email: admin.email, 
      role: 'admin' 
    }, JWT_SECRET, {
      expiresIn: '1d'
    });

    // Set cookie
    res.cookie('admin', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'strict',
      path: '/',
    });

    return res.status(201).json({ 
      message: 'Admin registered successfully',
      token: token,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: 'admin'
      },
      success: true
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ 
      message: 'Server error during registration',
      success: false 
    });
  }
});

// POST /api/admin/logout
router.post("/logout", (req, res) => {
  try {
    // Clear the admin cookie
    res.clearCookie("admin", {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });

    // If using sessions, destroy them
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          console.error("Session destroy error:", err);
        }
      });
    }

    res.status(200).json({ 
      message: "Logout successful",
      success: true 
    }); 

  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ 
      message: "Logout failed",
      success: false 
    });
  }
});

// GET /api/admin/checkAdmin - Verify authentication
router.get('/checkAdmin', authenticateAdmin, (req, res) => {
  try {
    res.status(200).json({
      message: 'Admin authenticated',
      admin: {
        id: req.admin.id,
        email: req.admin.email,
        name: req.admin.name || req.admin.email.split('@')[0],
        role: 'admin'
      },
      isAuthenticated: true,
      success: true
    });
  } catch (error) {
    console.error("Check admin error:", error);
    res.status(500).json({
      message: 'Authentication check failed',
      success: false
    });
  }
});

// GET /api/admin/profile - Get admin profile
router.get('/profile', authenticateAdmin, async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.admin.id, {
      attributes: ['id', 'email', 'name', 'createdAt', 'updatedAt']
    });

    if (!admin) {
      return res.status(404).json({
        message: 'Admin not found',
        success: false
      });
    }

    res.status(200).json({
      message: 'Profile retrieved successfully',
      admin: admin,
      success: true
    });

  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      message: 'Failed to retrieve profile',
      success: false
    });
  }
});

// PUT /api/admin/profile - Update admin profile
router.put('/profile', authenticateAdmin, async (req, res) => {
  try {
    const { name, email } = req.body;
    const adminId = req.admin.id;

    const admin = await Admin.findByPk(adminId);
    if (!admin) {
      return res.status(404).json({
        message: 'Admin not found',
        success: false
      });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== admin.email) {
      const existingAdmin = await Admin.findOne({ where: { email } });
      if (existingAdmin) {
        return res.status(400).json({
          message: 'Email already in use',
          success: false
        });
      }
    }

    // Update admin
    await admin.update({
      name: name || admin.name,
      email: email || admin.email
    });

    res.status(200).json({
      message: 'Profile updated successfully',
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: 'admin'
      },
      success: true
    });

  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      message: 'Failed to update profile',
      success: false
    });
  }
});

// POST /api/admin/change-password
router.post('/change-password', authenticateAdmin, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminId = req.admin.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: 'Current password and new password are required',
        success: false
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: 'New password must be at least 6 characters long',
        success: false
      });
    }

    const admin = await Admin.findByPk(adminId);
    if (!admin) {
      return res.status(404).json({
        message: 'Admin not found',
        success: false
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, admin.password);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        message: 'Current password is incorrect',
        success: false
      });
    }

    // Hash and update new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await admin.update({ password: hashedNewPassword });

    res.status(200).json({
      message: 'Password changed successfully',
      success: true
    });

  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      message: 'Failed to change password',
      success: false
    });
  }
});

module.exports = router;
