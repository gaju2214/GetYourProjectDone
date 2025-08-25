const { Order, OrderItem, CartItem, Project } = require("../models");

// const { Order } = require("../models");

exports.addOrder = async (req, res) => {
  try {
    const {
      orderId,
      user_id,
      mobile,
      customerName,
      productId,
      shippingAddress,
      paymentMethod,
      totalAmount,
      status,
      paymentStatus,
    } = req.body;

    const newOrder = await Order.create({
      orderId,
      user_id,
      mobile,
      customerName,
      productId,
      shippingAddress,
      paymentMethod,
      totalAmount,
      status,
      paymentStatus,
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error adding order:", error);
    res.status(500).json({ success: false, error: "Failed to add order" });
  }
};

exports.placeOrder = async (req, res) => {
  const { user_id } = req.body;

  try {
    const cartItems = await CartItem.findAll({
      where: { user_id },
      include: Project,
    });
    if (cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.quantity * item.Project.price,
      0
    );

    const order = await Order.create({ user_id, totalAmount });

    for (const item of cartItems) {
      await OrderItem.create({
        orderId: order.id,
        projectId: item.projectId,
        quantity: item.quantity,
        price: item.Project.price,
      });
    }

    await CartItem.destroy({ where: { user_id } });

    res.status(201).json({ message: "Order placed", orderId: order.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Order failed" });
  }
};

exports.getOrdersByUser = async (req, res) => {
  const { user_id } = req.params;
  try {
    const orders = await Order.findAll({
      where: { user_id },
      include: {
        model: OrderItem,
        include: "Project",
      },
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Could not fetch orders" });
  }
};

// controllers/orderController.js

exports.addOrder = async (req, res) => {
  try {
    const {
      orderId,
      user_id,
      mobile,
      customerName,
      productId,
      shippingAddress,
      paymentMethod,
      totalAmount,
      status,
      paymentStatus,
    } = req.body;

    const newOrder = await Order.create({
      orderId,
      user_id,
      mobile,
      customerName,
      productId,
      shippingAddress,
      paymentMethod,
      totalAmount,
      status,
      paymentStatus,
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error adding order:", error);
    res.status(500).json({ success: false, error: "Failed to add order" });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const {
      orderId,
      user_id,
      mobile,
      customerName,
      productId,
      shippingAddress,
      paymentMethod,
      totalAmount,
    } = req.body;

    const newOrder = await Order.create({
      orderId,
      user_id,
      mobile,
      customerName,
      productId,
      shippingAddress,
      paymentMethod,
      totalAmount,
      status: "pending",
      paymentStatus: paymentMethod === "cod" ? "pending" : "initiated",
    });

    res.status(201).json({ success: true, order: newOrder });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};
