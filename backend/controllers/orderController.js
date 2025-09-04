const { Order, OrderItem, CartItem, Project, UserInfo } = require("../models");
const generateOrderId = require("../utils/generateOrderId");
const axios = require("axios");
const { Op } = require("sequelize");

exports.addOrder = async (req, res) => {
  try {
    const {
      user_id,
      mobile,
      customerName,
      productId,
      shippingAddress,
      paymentMethod,
      totalAmount,
      status,
      paymentStatus,
      quantity,
    } = req.body;

    const orderId = generateOrderId();
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
      quantity,
    });

    res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: newOrder,
      orderId: orderId,
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

    const orderId = generateOrderId();

    const order = await Order.create({
      user_id,
      totalAmount,
      orderId: orderId,
      status: "pending",
      paymentStatus: "initiated"
    });

    for (const item of cartItems) {
      await OrderItem.create({
        orderId: order.id,
        projectId: item.projectId,
        quantity: item.quantity,
        price: item.Project.price,
      });
    }

    await CartItem.destroy({ where: { user_id } });

    res.status(201).json({
      message: "Order placed successfully",
      orderId: order.orderId,
      order: order
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Order failed" });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const {
      user_id,
      mobile,
      customerName,
      productId,
      shippingAddress,
      paymentMethod,
      totalAmount,
      quantity,
    } = req.body;

    const orderId = generateOrderId();

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
      quantity,
      paymentStatus: paymentMethod === "cod" ? "pending" : "initiated",
    });

    res.status(201).json({ 
      success: true, 
      order: newOrder, 
      orderId: orderId 
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Failed to create order" });
  }
};

// FIXED: Direct Shiprocket integration without HTTP loop
exports.createOrderWithShipping = async (req, res) => {
  try {
    const {
      user_id,
      mobile,
      customerName,
      productId,
      shippingAddress,
      paymentMethod,
      totalAmount,
      quantity,
      profile,
      cartItems
    } = req.body;

    // Validate required fields
    if (!user_id || !mobile || !customerName || !totalAmount) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: user_id, mobile, customerName, totalAmount"
      });
    }

    // ✅ CHECK FOR DUPLICATE ORDERS (within last 2 minutes)
    // ✅ MORE STRICT DUPLICATE DETECTION
const existingOrder = await Order.findOne({
  where: {
    user_id,
    // Check for orders with similar amounts (within 5% difference to handle GST variations)
    totalAmount: {
      [Op.between]: [
        Math.floor(totalAmount * 0.95), // 5% lower
        Math.ceil(totalAmount * 1.05)   // 5% higher
      ]
    },
    paymentMethod,
    status: {
      [Op.in]: ['pending', 'confirmed', 'shipping_pending']
    },
    createdAt: {
      [Op.gte]: new Date(Date.now() - 5 * 60 * 1000) // Within last 5 minutes
    }
  },
  order: [['createdAt', 'DESC']]
});

if (existingOrder) {
  console.log(`Duplicate order detected for user ${user_id}:`, {
    existing_amount: existingOrder.totalAmount,
    new_amount: totalAmount,
    time_diff: Date.now() - new Date(existingOrder.createdAt).getTime()
  });
  
  return res.status(200).json({
    success: true,
    message: "Similar order already exists",
    order: existingOrder,
    orderId: existingOrder.orderId,
    isDuplicate: true
  });
}

    // Generate orderId
    const orderId = generateOrderId();

    // Create the order in database
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
      quantity,
      paymentStatus: paymentMethod === "cod" ? "pending" : "initiated",
    });

    console.log(`Order created with ID: ${orderId}`);

    // ✅ DIRECT SHIPROCKET INTEGRATION (NO HTTP LOOP)
    try {
      // Import shiprocket controller function directly
      const shiprocketController = require('./shiprocketController');
      
      // Prepare shiprocket request data
      const shiprocketReqData = {
        body: {
          order_id: orderId,
          profile: profile || {
            name: customerName,
            lastname: "",
            address: shippingAddress || "Default Address",
            city: "Mumbai",
            pincode: "400001",
            state: "Maharashtra",
            country: "India",
            email: "customer@example.com",
            phoneNumber: mobile
          },
          cartItems: cartItems || [{
            title: `Product for ${customerName}`,
            projectId: productId || `PROD-${orderId}`,
            quantity: quantity || 1,
            price: totalAmount || 1
          }],
          paymentMethod,
          total: totalAmount
        }
      };

      // Create mock response object
      let shiprocketSuccess = false;
      let shiprocketData = null;
      
      const mockRes = {
        json: (data) => {
          if (data.success) {
            shiprocketSuccess = true;
            shiprocketData = data;
          }
        },
        status: () => mockRes
      };

      // Call shiprocket function directly
      await shiprocketController.createShiprocketOrder(shiprocketReqData, mockRes);
      
      if (shiprocketSuccess) {
        console.log("Shiprocket order created successfully");
        await newOrder.update({ 
          status: "confirmed",
          shiprocket_order_id: shiprocketData.order_id
        });

        res.status(201).json({ 
          success: true, 
          message: "Order created and shipped successfully",
          order: newOrder, 
          orderId: orderId,
          shiprocket: shiprocketData
        });
      } else {
        throw new Error("Shiprocket integration failed");
      }

    } catch (shiprocketError) {
      console.error("Shiprocket integration failed:", shiprocketError.message);
      
      // Update order status to indicate shipping issue
      await newOrder.update({ status: "shipping_pending" });

      // Still return success since order was created
      res.status(201).json({ 
        success: true, 
        message: "Order created but shipping failed",
        order: newOrder, 
        orderId: orderId,
        warning: "Shiprocket integration failed, shipping will be processed manually"
      });
    }

  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ 
      success: false,
      error: "Failed to create order",
      details: error.message
    });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        {
          model: OrderItem,
          as: "OrderItems",
          include: [
            {
              model: Project,
              as: "Project",
              attributes: ["id", "title", "price"],
            },
          ],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const formattedOrders = orders.map(order => ({
      ...order.dataValues,
      order_items: order.OrderItems?.map(item => ({
        name: item.Project?.title || "N/A",
        sku: item.projectId,
        units: item.quantity,
        selling_price: item.Project?.price || 0,
      })) || [],
    }));

    res.json({
      success: true,
      data: formattedOrders,
    });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch orders",
    });
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
exports.updateShiprocketOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Update in your DB
    const updatedOrder = await Order.update(
      { status },
      { where: { orderId } }
    );

    if (updatedOrder[0] === 0) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Order updated successfully", orderId, status });
  } catch (error) {
    console.error("Error updating Shiprocket order:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: "Order not found"
      });
    }

    await order.update({
      status: status || order.status,
      paymentStatus: paymentStatus || order.paymentStatus
    });

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order
    });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update order"
    });
  }
};
