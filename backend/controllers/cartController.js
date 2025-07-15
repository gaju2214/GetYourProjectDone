const { CartItem, Project } = require('../models');

// Add item to cart
// filepath: /home/gaju/Getprojectdonebackend/backend/controllers/cartController.js
exports.addToCart = async (req, res) => {
  if (!req.body || !req.body.userId) {
    return res.status(400).json({ message: 'Missing userId in request body' });
  }
  const { userId, projectId, quantity } = req.body;

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

    // Flatten the response for the frontend
    const result = cartItems.map(item => ({
      id: item.id,
      userId: item.userId,
      projectId: item.projectId,
      quantity: item.quantity,
      // Spread project details if available
      ...(item.Project ? {
        title: item.Project.title,
        description: item.Project.description,
        image: item.Project.image,
        price: item.Project.price,
        category: item.Project.categoryId,
        subcategory: item.Project.subcategoryId,
        difficulty: item.Project.difficulty
      } : {})
    }));

    res.json(result);
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
exports.updateQuantity = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    console.log("Request to update cart item:", id, "to quantity:", quantity);

const cartItem = await CartItem.findByPk(id);
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    cartItem.quantity = quantity;
    await cartItem.save();

    res.json(cartItem);
  } catch (error) {
    console.error("❌ Error updating cart quantity:", error); // Log real error
    res.status(500).json({ message: "Server error" });
  }
};
