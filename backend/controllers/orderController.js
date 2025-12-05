const { Order, OrderItem, CartItem, Project, UserInfo, User } = require("../models");
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
      address,
      city,
      pincode,
      state,
      country,
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
      address,
      city,
      pincode,
      state,
      country,
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
        orderId: order.orderId,
        projectId: item.projectId,
        quantity: item.quantity,
        price: item.price,
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
      address,
      city,
      pincode,
      state,
      country,
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
      address,
      city,
      pincode,
      state,
      country,
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


exports.createOrderWithShipping = async (req, res) => {
  try {
    const {
      user_id,
      mobile,
      customerName,
      productId,
      shippingAddress,
      address,
      city,
      pincode,
      state,
      country,
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

    console.log('📍 Order address data received:', {
      address, city, pincode, state, country,
      profile_address: profile?.address,
      profile_city: profile?.city,
      profile_pincode: profile?.pincode,
      profile_state: profile?.state,
      profile_country: profile?.country,
      shippingAddress,
    });
    
    console.log('📦 Full request body:', JSON.stringify(req.body, null, 2));

    // Check for duplicate orders (last 5 minutes)
    const existingOrder = await Order.findOne({
      where: {
        user_id,
        totalAmount: {
          [Op.between]: [
            Math.floor(totalAmount * 0.95),
            Math.ceil(totalAmount * 1.05)
          ]
        },
        paymentMethod,
        status: { [Op.in]: ['pending', 'confirmed', 'shipping_pending'] },
        createdAt: { [Op.gte]: new Date(Date.now() - 5 * 60 * 1000) }
      },
      order: [['createdAt', 'DESC']]
    });

    if (existingOrder) {
      return res.status(200).json({
        success: true,
        message: "Similar order already exists",
        order: existingOrder,
        orderId: existingOrder.orderId,
        shiprocketOrderId: existingOrder.shiprocket_order_id || null,
        isDuplicate: true
      });
    }

    // Generate order ID and create order in DB
    const orderId = generateOrderId();
    
    // Try to fill in address fields from user profile if not provided in payload
    let finalAddress = address || (profile && profile.address) || null;
    let finalCity = city || (profile && profile.city) || null;
    let finalPincode = pincode || (profile && profile.pincode) || null;
    let finalState = state || (profile && profile.state) || null;
    let finalCountry = country || (profile && profile.country) || null;
    
    // If still not available, try to fetch from User table
    if (user_id && (!finalAddress || !finalCity)) {
      try {
        const userRecord = await User.findByPk(user_id);
        if (userRecord) {
          finalAddress = finalAddress || userRecord.address || null;
          finalCity = finalCity || userRecord.city || null;
          finalPincode = finalPincode || userRecord.pincode || null;
          finalState = finalState || userRecord.state || null;
          finalCountry = finalCountry || userRecord.country || null;
          console.log('✅ Fetched user address from DB:', {finalAddress, finalCity, finalPincode, finalState, finalCountry});
        }
      } catch (e) {
        console.warn('Could not fetch user record for address', e.message);
      }
    }
    
    const newOrder = await Order.create({
      orderId,
      user_id,
      mobile,
      customerName,
      productId,
      shippingAddress,
      address: finalAddress,
      city: finalCity,
      pincode: finalPincode,
      state: finalState,
      country: finalCountry,
      paymentMethod,
      totalAmount,
      status: "pending",
      quantity,
      paymentStatus: paymentMethod === "cod" ? "pending" : "initiated",
      shiprocket_order_id: null,
    });

    // ✅ CREATE ORDER ITEMS - This was missing!
    if (cartItems && cartItems.length > 0) {
      for (const item of cartItems) {
        await OrderItem.create({
          orderId: newOrder.orderId,
          projectId: item.projectId || item.id,
          quantity: item.quantity || 1,
          price: item.price || 0
        });
      }
      console.log(`✅ Created ${cartItems.length} order items for order ${orderId}`);
    }

    // Direct Shiprocket integration
    let shiprocketData = null;
    try {
      const shiprocketController = require('./shiprocketController');

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

      const mockRes = {
        json: (data) => { shiprocketData = data; },
        status: () => mockRes
      };

      await shiprocketController.createShiprocketOrder(shiprocketReqData, mockRes);

      if (shiprocketData && shiprocketData.success) {
        await newOrder.update({
          status: "confirmed",
          shiprocket_order_id: shiprocketData.shiprocket_order_id || shiprocketData.order_id
        });

        console.log("✅ Shiprocket order created:", shiprocketData.order_id);

        return res.status(201).json({
          success: true,
          message: "Order created and shipped successfully",
          order: newOrder,
          orderId,
          shiprocketOrderId: shiprocketData.shiprocket_order_id || shiprocketData.order_id,
          shiprocket: shiprocketData
        });
      } else {
        throw new Error("Shiprocket integration failed");
      }
    } catch (shiprocketError) {
      console.error("❌ Shiprocket integration failed:", shiprocketError.message);

      await newOrder.update({ status: "shipping_pending" });

      return res.status(201).json({
        success: true,
        message: "Order created but shipping failed",
        order: newOrder,
        orderId,
        warning: "Shiprocket integration failed, shipping will be processed manually",
        shiprocket: shiprocketData || null
      });
    }

  } catch (error) {
    console.error("❌ Error creating order:", error.message);
    return res.status(500).json({
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
              attributes: ["id", "title", "price", "image"]
            }
          ]
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    // ✅ Return with both formats for compatibility
    const formattedOrders = orders.map(order => ({
      ...order.toJSON(), // Includes OrderItems
      // Keep order_items for backward compatibility
      order_items: order.OrderItems?.map(item => ({
        name: item.Project?.title || "N/A",
        sku: item.projectId,
        units: item.quantity,
        selling_price: item.Project?.price || 0,
        // Also keep the full item data
        Project: item.Project
      })) || []
    }));

    res.json({
      success: true,
      data: formattedOrders
    });
  } catch (error) {
    console.error("Error fetching all orders:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch orders"
    });
  }
};


exports.getOrdersByUser = async (req, res) => {
  const { user_id } = req.params;
  
  try {
    console.log('Step 1: Testing simple Order query...');
    const simpleOrders = await Order.findAll({ 
      where: { user_id },
      raw: true 
    });
    console.log('Simple orders result:', simpleOrders);

    if (simpleOrders.length === 0) {
      return res.json({ message: 'No orders found for this user', orders: [] });
    }

    console.log('Step 2: Testing with OrderItems...');
    const ordersWithItems = await Order.findAll({
      where: { user_id },
      include: [{
        model: OrderItem,
        as: 'OrderItems' // ✅ Use the alias from your association
      }]
    });
    console.log('Orders with items:', ordersWithItems.length);

    console.log('Step 3: Testing full query...');
    const fullOrders = await Order.findAll({
      where: { user_id },
      include: [
        {
          model: OrderItem,
          as: 'OrderItems', // ✅ Use the alias from your association
          include: [
            {
              model: Project,
              as: 'Project' // ✅ Use the alias from OrderItem association
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    console.log('Full orders result:', fullOrders.length);
    res.json(fullOrders);
    
  } catch (err) {
    console.error('Error at step:', err.message);
    console.error('Full error:', err);
    res.status(500).json({ 
      error: err.message,
      details: err.stack
    });
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
