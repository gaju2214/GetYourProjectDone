// routes/admin.js

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

    const token = jwt.sign({ id: admin.id, email: admin.email, role: 'admin' }, JWT_SECRET, {
      expiresIn: '1d'
    });

    res.cookie('admin', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: 'strict',
      path: '/',
    });

    return res.status(200).json({
      message: 'Login successful',
      admin: { id: admin.id, email: admin.email },
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET /api/admin/checkAdmin
router.get('/checkAdmin', authenticateAdmin, (req, res) => {
  res.status(200).json({
    message: 'Admin authenticated',
    admin: req.admin,
    status: 200,
  });
});

module.exports = router;
