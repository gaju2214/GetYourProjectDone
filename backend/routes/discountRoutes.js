// routes/discountRoutes.js
const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');

// Try different import approaches based on your project structure
let Discount;

try {
  // Option 1: If you have models/index.js that exports all models
  const db = require('../models');
  Discount = db.Discount;
} catch (error) {
  try {
    // Option 2: If you're importing models directly
    const { Discount: DiscountModel } = require('../models');
    Discount = DiscountModel;
  } catch (error2) {
    console.error('Failed to import Discount model:', error2.message);
  }
}

// Test route to verify the routes are working
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Discount routes are working!',
    modelLoaded: !!Discount 
  });
});

// Middleware to check if model is loaded
const checkModel = (req, res, next) => {
  if (!Discount) {
    return res.status(500).json({ 
      success: false, 
      error: 'Discount model not loaded. Please check model imports.' 
    });
  }
  next();
};

// Get all active discounts
router.get('/', checkModel, async (req, res) => {
  try {
    const discounts = await Discount.findAll({
      where: {
        isActive: true
      },
      order: [['createdAt', 'DESC']]
    });
    
    res.json({ success: true, discounts });
  } catch (error) {
    console.error('Error fetching discounts:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get global discount configuration (applies to all products)
router.get('/global', checkModel, async (req, res) => {
  try {
    const globalDiscount = await Discount.findOne({
      where: {
        isActive: true,
        applyToAll: true
      },
      order: [['createdAt', 'DESC']]
    });
    
    res.json({ 
      success: true, 
      discount: globalDiscount 
    });
  } catch (error) {
    console.error('Error fetching global discount:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin: Create global discount
router.post('/admin/global', checkModel, async (req, res) => {
  try {
    // Deactivate existing global discounts first
    await Discount.update(
      { isActive: false },
      { where: { applyToAll: true, isActive: true } }
    );

    // Create new global discount
    const discountData = {
      label: req.body.label || 'OFF',
      discountValue: req.body.discountValue || 20,
      backgroundColor: req.body.backgroundColor || '#ef4444',
      textColor: req.body.textColor || '#ffffff',
      isActive: req.body.isActive !== undefined ? req.body.isActive : true,
      applyToAll: true,
      productIds: null,
      priority: 1
    };
    
    const discount = await Discount.create(discountData);
    res.status(201).json({ success: true, discount });
  } catch (error) {
    console.error('Error creating global discount:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
