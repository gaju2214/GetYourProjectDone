const { CartItem, Project } = require('../models');

// Add item to cart
// filepath: /home/gaju/Getprojectdonebackend/backend/controllers/cartController.js
exports.addToCart = async (req, res) => {
  if (!req.body || !req.body.userId) {
    return res.status(400).json({ message: 'Missing userId in request body' });
  }
  const { userId, projectId, quantity } = req.body;
  // ...existing code...

  try {
    const existing = await CartItem.findOne({ where: { userId, projectId } });

    if (existing) {
      existing.quantity += quantity || 1;
      await existing.save();
      return res.json(existing);
    }

    const cartItem = await CartItem.create({ userId, projectId, quantity: quantity || 1 });
    res.status(201).json(cartItem);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add to cart' });
  }
};

// Get user's cart
exports.getCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const cartItems = await CartItem.findAll({
      where: { userId },
      include: [{ model: Project }]
    });
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  const { id } = req.params;
  try {
    await CartItem.destroy({ where: { id } });
    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to remove item' });
  }
};
