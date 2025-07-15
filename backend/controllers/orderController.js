const { Order, OrderItem, CartItem, Project } = require('../models');

exports.placeOrder = async (req, res) => {
  const { userId } = req.body;

  try {
    const cartItems = await CartItem.findAll({ where: { userId }, include: Project });
    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const totalAmount = cartItems.reduce((sum, item) => sum + item.quantity * item.Project.price, 0);

    const order = await Order.create({ userId, totalAmount });

    for (const item of cartItems) {
      await OrderItem.create({
        orderId: order.id,
        projectId: item.projectId,
        quantity: item.quantity,
        price: item.Project.price
      });
    }

    await CartItem.destroy({ where: { userId } });

    res.status(201).json({ message: 'Order placed', orderId: order.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Order failed' });
  }
};

exports.getOrdersByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await Order.findAll({
      where: { userId },
      include: {
        model: OrderItem,
        include: 'Project'
      }
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch orders' });
  }
};
