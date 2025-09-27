
// // Add item to cart
// // filepath: /home/gaju/Getprojectdonebackend/backend/controllers/cartController.js
// // filepath: /home/gaju/GetYourProjectDone/backend/controllers/cartController.js
// // filepath: /home/gaju/GetYourProjectDone/backend/controllers/cartController.js
// const { CartItem, Project, User } = require('../models'); // Fix: User not user

// exports.addToCart = async (req, res) => {
//   if (!req.body || !req.body.userId) {
//     return res.status(400).json({ message: 'Missing userId in request body' });
//   }
//   const { userId, projectId, quantity } = req.body;

//   try {
//     console.log('Adding to cart:', { userId, projectId, quantity });
    
//     // Check if user exists
//     const userRecord = await User.findByPk(userId); // Rename variable to avoid conflict
//     if (!userRecord) {
//       return res.status(404).json({ error: 'User not found' });
//     }

//     // Check if project exists
//     const project = await Project.findByPk(projectId);
//     if (!project) {
//       return res.status(404).json({ error: 'Project not found' });
//     }
    
//     const existing = await CartItem.findOne({ where: { userId, projectId } });

//     if (existing) {
//       existing.quantity += quantity || 1;
//       await existing.save();
//       return res.json(existing);
//     }

//     const cartItem = await CartItem.create({ userId, projectId, quantity: quantity || 1 });
//     res.status(201).json(cartItem);
//   } catch (err) {
//     console.error('Cart error details:', {
//       message: err.message,
//       stack: err.stack,
//       name: err.name
//     });
//     res.status(500).json({ error: 'Failed to add to cart', details: err.message });
//   }
// };

// // Get user's cart
// exports.getCart = async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const cartItems = await CartItem.findAll({
//       where: { userId },
//       include: [{ model: Project }]
//     });

//     // Flatten the response for the frontend
//     const result = cartItems.map(item => ({
//       id: item.id,
//       userId: item.userId,
//       projectId: item.projectId,
//       quantity: item.quantity,
//       // Spread project details if available
//       ...(item.Project ? {
//         title: item.Project.title,
//         description: item.Project.description,
//         image: item.Project.image,
//         price: item.Project.price,
//         category: item.Project.categoryId,
//         subcategory: item.Project.subcategoryId,
//         difficulty: item.Project.difficulty
//       } : {})
//     }));

//     res.json(result);
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to fetch cart' });
//   }
// };

// // Remove item from cart
// exports.removeFromCart = async (req, res) => {
//   const { id } = req.params;
//   try {
//     await CartItem.destroy({ where: { id } });
//     res.json({ message: 'Item removed from cart' });
//   } catch (err) {
//     res.status(500).json({ error: 'Failed to remove item' });
//   }
// };
// exports.updateQuantity = async (req, res) => {
//   const { id } = req.params;
//   const { quantity } = req.body;

//   try {
//     console.log("Request to update cart item:", id, "to quantity:", quantity);

// const cartItem = await CartItem.findByPk(id);
//     if (!cartItem) {
//       return res.status(404).json({ message: "Cart item not found" });
//     }

//     cartItem.quantity = quantity;
//     await cartItem.save();

//     res.json(cartItem);
//   } catch (error) {
//     console.error("❌ Error updating cart quantity:", error); // Log real error
//     res.status(500).json({ message: "Server error" });
//   }
// };


const { CartItem, Project, User } = require('../models');

// Add item to cart
exports.addToCart = async (req, res) => {
  const { userId, projectId, quantity } = req.body;

  if (!userId || !projectId) {
    return res.status(400).json({ message: 'Missing userId or projectId in request body' });
  }

  try {
    // Check if user exists
    const userRecord = await User.findByPk(userId);
    if (!userRecord) return res.status(404).json({ error: 'User not found' });

    // Check if project exists
    const project = await Project.findByPk(projectId);
    if (!project) return res.status(404).json({ error: 'Project not found' });

    // Check if already in cart
    const existing = await CartItem.findOne({ where: { userId, projectId } });
    if (existing) {
      existing.quantity += quantity || 1;
      await existing.save();
      return res.json(existing);
    }

    const cartItem = await CartItem.create({
      userId,
      projectId,
      quantity: quantity || 1,
    });

    res.status(201).json(cartItem);

  } catch (err) {
    console.error('Cart add error:', err);
    res.status(500).json({ error: 'Failed to add to cart', details: err.message });
  }
};

// Get user's cart
exports.getCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const cartItems = await CartItem.findAll({
      where: { userId },
      include: [{ model: Project }],
    });

    const result = cartItems.map(item => ({
      id: item.id,           // CartItem ID
      userId: item.userId,
      projectId: item.projectId,
      quantity: item.quantity,
      price: item.Project?.price || 0,
      title: item.Project?.title || 'Untitled Project',
      description: item.Project?.description || '',
      image: item.Project?.image || '/placeholder-image.jpg',
      difficulty: item.Project?.difficulty || 'N/A',
      category: item.Project?.category || 'Category',
      subcategory: item.Project?.subcategory || 'Subcategory',
    }));

    res.json(result);

  } catch (err) {
    console.error('Cart fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
};

// Remove item from cart
exports.removeFromCart = async (req, res) => {
  const { id } = req.params;

  try {
    const deleted = await CartItem.destroy({ where: { id } });
    if (!deleted) return res.status(404).json({ error: 'Cart item not found' });

    res.json({ message: 'Item removed from cart' });
  } catch (err) {
    console.error('Cart remove error:', err);
    res.status(500).json({ error: 'Failed to remove item' });
  }
};

// Update quantity
exports.updateQuantity = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  if (quantity < 1) return res.status(400).json({ message: 'Quantity must be at least 1' });

  try {
    const cartItem = await CartItem.findByPk(id);
    if (!cartItem) return res.status(404).json({ message: 'Cart item not found' });

    cartItem.quantity = quantity;
    await cartItem.save();

    res.json(cartItem);
  } catch (err) {
    console.error('Cart update error:', err);
    res.status(500).json({ message: 'Failed to update cart item' });
  }
};
