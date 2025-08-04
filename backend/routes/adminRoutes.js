const express = require("express");
const router = express.Router();
const { Admin } = require("../models");

// Store Admin Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Missing fields" });

  try {
    let admin = await Admin.findOne({ where: { email } });

    if (!admin) {
      // Store new admin (for demo only)
      admin = await Admin.create({ email, password });
      return res.status(201).json({ message: "New admin registered", admin });
    }

    if (admin.password !== password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful", admin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
