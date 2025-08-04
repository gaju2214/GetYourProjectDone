const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { Admin } = require('../models'); // Make sure Admin model is exported

// POST /api/admin/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: 'Email and password are required' });

  try {
    let admin = await Admin.findOne({ where: { email } });

    if (!admin) {
      // Create new admin (for dev/demo only)
      const hashedPassword = await bcrypt.hash(password, 10);
      admin = await Admin.create({ email, password: hashedPassword });

      return res.status(201).json({ message: 'New admin registered', admin });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.status(200).json({ message: 'Login successful', admin });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
