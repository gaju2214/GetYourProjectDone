const axios = require("axios");
const crypto = require("crypto");
const { Order, OrderItem, CartItem, Project, Subcategory, Category } = require("../models");
const generateOrderId = require("../utils/generateOrderId");

// HMAC Generation
function generateCheckoutHMAC(secretKey, requestBody) {
  const message = JSON.stringify(requestBody);
  return crypto
    .createHmac('sha256', secretKey)
    .update(message)
    .digest('base64');
}

// ==================== CATALOG SYNC APIs ====================

exports.getProductsForShiprocket = async (req, res) => {
  try {
    const { page = 1, limit = 100 } = req.query;
    const offset = (page - 1) * limit;

    const projects = await Project.findAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [{
        model: Subcategory,
        as: "subcategory",
        include: [{ model: Category, as: "category" }]
      }]
    });

    const products = projects.map(project => ({
      id: project.id,
      title: project.title,
      body_html: project.description || "",
      vendor: "GetYourProjectDone",
      product_type: (project.subcategory && project.subcategory.name) || "General",
      updated_at: project.updatedAt,
      status: "active",
      variants: [{
        id: project.id,
        title: "Default",
        price: String(project.price || 0),
        quantity: 999,
        sku: "PRJ-" + project.id,
        updated_at: project.updatedAt,
        image: {
          src: project.image || ""
        },
        weight: 0.5
      }],
      image: {
        src: project.image || ""
      }
    }));

    console.log("✅ Fetched " + products.length + " products for Shiprocket");

    res.json({
      products: products,
      page: parseInt(page),
      total: await Project.count()
    });
  } catch (error) {
    console.error("Error fetching products for Shiprocket:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

exports.getCollectionsForShiprocket = async (req, res) => {
  try {
    const { page = 1, limit = 100 } = req.query;
    const offset = (page - 1) * limit;

    const subcategories = await Subcategory.findAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [{ model: Category, as: "category" }]
    });

    const collections = subcategories.map(sub => ({
      id: sub.id,
      updated_at: sub.updatedAt,
      title: sub.name,
      body_html: "<p>" + sub.name + "</p>",
      image: { src: "" }
    }));

    console.log("✅ Fetched " + collections.length + " collections for Shiprocket");

    res.json({
      collections: collections,
      page: parseInt(page),
      total: await Subcategory.count()
    });
  } catch (error) {
    console.error("Error fetching collections:", error);
    res.status(500).json({ error: "Failed to fetch collections" });
  }
};

exports.getProductsByCollection = async (req, res) => {
  try {
    const { collection_id, page = 1, limit = 100 } = req.query;
    const offset = (page - 1) * limit;

    if (!collection_id) {
      return res.status(400).json({ error: "collection_id is required" });
    }

    const projects = await Project.findAll({
      where: { subcategoryId: collection_id },
      limit: parseInt(limit),
      offset: parseInt(offset),
      include: [{
        model: Subcategory,
        as: "subcategory"
      }]
    });

    const products = projects.map(project => ({
      id: project.id,
      title: project.title,
      body_html: project.description || "",
      vendor: "GetYourProjectDone",
      product_type: (project.subcategory && project.subcategory.name) || "General",
      updated_at: project.updatedAt,
      status: "active",
      variants: [{
        id: project.id,
        title: "Default",
        price: String(project.price || 0),
        quantity: 999,
        sku: "PRJ-" + project.id,
        updated_at: project.updatedAt,
        image: { src: project.image || "" },
        weight: 0.5
      }],
      image: { src: project.image || "" }
    }));

    res.json({
      products: products,
      page: parseInt(page),
      total: await Project.count({ where: { subcategoryId: collection_id } })
    });
  } catch (error) {
    console.error("Error fetching products by collection:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// ==================== CHECKOUT TOKEN ====================

exports.generateCheckoutToken = async (req, res) => {
  try {
    const { userId, cartItems } = req.body;

    console.log("=== GENERATING SHIPROCKET CHECKOUT TOKEN ===");
    console.log("Environment check:");
    console.log("- API Key exists:", !!process.env.SHIPROCKET_CHECKOUT_API_KEY);
    console.log("- Secret Key exists:", !!process.env.SHIPROCKET_CHECKOUT_SECRET_KEY);
    console.log("- Frontend URL:", process.env.FRONTEND_URL);

    if (!process.env.SHIPROCKET_CHECKOUT_API_KEY || !process.env.SHIPROCKET_CHECKOUT_SECRET_KEY) {
      return res.status(500).json({
        success: false,
        error: "Shiprocket Checkout credentials not configured"
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "userId is required"
      });
    }

    let items = cartItems;
    if (!items || items.length === 0) {
      const dbCartItems = await CartItem.findAll({
        where: { userId: userId },
        include: [{ model: Project }]
      });

      if (dbCartItems.length === 0) {
        return res.status(400).json({
          success: false,
          error: "Cart is empty"
        });
      }

      items = dbCartItems.map(item => ({
        variant_id: String(item.projectId),
        quantity: item.quantity
      }));
    } else {
      items = cartItems.map(item => ({
        variant_id: String(item.projectId || item.id),
        quantity: item.quantity || 1
      }));
    }

    const requestBody = {
      cart_data: {
        items: items
      },
      redirect_url: (process.env.FRONTEND_URL || 'http://localhost:5173') + '/order-success',
      timestamp: new Date().toISOString()
    };

    console.log("Request body:", JSON.stringify(requestBody, null, 2));

    const hmac = generateCheckoutHMAC(
      process.env.SHIPROCKET_CHECKOUT_SECRET_KEY,
      requestBody
    );

    console.log("HMAC generated:", hmac.substring(0, 20) + "...");
    console.log("API Key (first 10 chars):", process.env.SHIPROCKET_CHECKOUT_API_KEY.substring(0, 10) + "...");

    const response = await axios.post(
      'https://checkout-api.shiprocket.com/api/v1/access-token/checkout',
      requestBody,
      {
        headers: {
          'X-Api-Key': process.env.SHIPROCKET_CHECKOUT_API_KEY,
          'X-Api-HMAC-SHA256': hmac,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );

    console.log("✅ Checkout token generated successfully");

    res.json({
      success: true,
      token: response.data.result.token,
      order_id: response.data.result.order_id
    });

  } catch (error) {
    console.error("❌ Checkout token generation failed:");
    console.error("Status:", error.response && error.response.status);
    console.error("Response:", error.response && error.response.data);
    console.error("Message:", error.message);

    res.status(500).json({
      success: false,
      error: "Failed to generate checkout token",
      details: (error.response && error.response.data) || error.message,
      hint: "Products might not be synced with Shiprocket. Try syncing catalog first."
    });
  }
};

// ==================== WEBHOOK ====================

exports.receiveCheckoutOrder = async (req, res) => {
  try {
    console.log("=== SHIPROCKET CHECKOUT WEBHOOK RECEIVED ===");
    console.log("Payload:", JSON.stringify(req.body, null, 2));

    const {
      order_id,
      cart_data,
      status,
      phone,
      email,
      payment_type,
      total_amount_payable,
      shipping_address,
      billing_address,
      customer_details
    } = req.body;

    if (status !== "SUCCESS") {
      console.log("⚠️ Order status: " + status + " - Not processing");
      return res.status(200).json({
        success: true,
        message: "Order status not SUCCESS"
      });
    }

    const existingOrder = await Order.findOne({
      where: { shiprocket_checkout_order_id: order_id }
    });

    if (existingOrder) {
      console.log("⚠️ Order " + order_id + " already exists");
      return res.status(200).json({
        success: true,
        message: "Order already processed",
        order_id: existingOrder.orderId
      });
    }

    const internalOrderId = generateOrderId();

    const customerName = (customer_details && customer_details.name) ||
                        (shipping_address && shipping_address.name) ||
                        (billing_address && billing_address.name) ||
                        "Customer";

    const shippingAddr = shipping_address
      ? (shipping_address.address || '') + ", " + (shipping_address.city || '') + ", " + 
        (shipping_address.state || '') + " - " + (shipping_address.pincode || '')
      : "Address not provided";

    const newOrder = await Order.create({
      orderId: internalOrderId,
      user_id: null,
      mobile: phone || (shipping_address && shipping_address.phone) || "N/A",
      customerName: customerName,
      productId: null,
      shippingAddress: shippingAddr,
      paymentMethod: payment_type === "COD" ? "cod" : "online",
      totalAmount: total_amount_payable,
      status: "confirmed",
      paymentStatus: payment_type === "COD" ? "pending" : "paid",
      quantity: (cart_data && cart_data.items && cart_data.items.length) || 0,
      shiprocket_checkout_order_id: order_id,
      order_source: "shiprocket_checkout"
    });

    if (cart_data && cart_data.items && cart_data.items.length > 0) {
      for (const item of cart_data.items) {
        const project = await Project.findByPk(item.variant_id);

        await OrderItem.create({
          orderId: newOrder.orderId,
          projectId: item.variant_id,
          quantity: item.quantity,
          price: (project && project.price) || 0
        });
      }
      console.log("✅ Created " + cart_data.items.length + " order items");
    }

    console.log("✅ Order saved successfully:", internalOrderId);

    res.status(200).json({
      success: true,
      message: "Order received and processed",
      order_id: internalOrderId,
      shiprocket_order_id: order_id
    });

  } catch (error) {
    console.error("❌ Webhook processing error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process order",
      details: error.message
    });
  }
};

// ==================== GET ORDER DETAILS ====================

exports.getCheckoutOrderDetails = async (req, res) => {
  try {
    const { order_id } = req.params;

    const requestBody = {
      order_id: order_id,
      timestamp: new Date().toISOString()
    };

    const hmac = generateCheckoutHMAC(
      process.env.SHIPROCKET_CHECKOUT_SECRET_KEY,
      requestBody
    );

    const response = await axios.post(
      'https://checkout-api.shiprocket.com/api/v1/custom-platform-order/details',
      requestBody,
      {
        headers: {
          'X-Api-Key': process.env.SHIPROCKET_CHECKOUT_API_KEY,
          'X-Api-HMAC-SHA256': hmac,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      }
    );

    res.json({
      success: true,
      data: response.data
    });

  } catch (error) {
    console.error("Error fetching checkout order:", (error.response && error.response.data) || error.message);
    res.status(500).json({
      success: false,
      error: "Failed to fetch order details",
      details: (error.response && error.response.data) || error.message
    });
  }
};

// ==================== SYNC PRODUCT ====================

exports.syncProductUpdate = async (projectId) => {
  try {
    const project = await Project.findByPk(projectId, {
      include: [{ model: Subcategory, as: "subcategory" }]
    });

    if (!project) {
      console.log("Project " + projectId + " not found for sync");
      return;
    }

    const requestBody = {
      id: project.id,
      title: project.title,
      body_html: project.description || "",
      vendor: "GetYourProjectDone",
      product_type: (project.subcategory && project.subcategory.name) || "General",
      updated_at: project.updatedAt,
      status: "active",
      variants: [{
        id: project.id,
        title: "Default",
        price: String(project.price || 0),
        quantity: 999,
        sku: "PRJ-" + project.id,
        updated_at: project.updatedAt,
        image: { src: project.image || "" },
        weight: 0.5
      }],
      image: { src: project.image || "" }
    };

    const hmac = generateCheckoutHMAC(
      process.env.SHIPROCKET_CHECKOUT_SECRET_KEY,
      requestBody
    );

    await axios.post(
      'https://checkout-api.shiprocket.com/wh/v1/custom/product',
      requestBody,
      {
        headers: {
          'X-Api-Key': process.env.SHIPROCKET_CHECKOUT_API_KEY,
          'X-Api-HMAC-SHA256': hmac,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    console.log("✅ Product " + project.id + " synced with Shiprocket Checkout");
  } catch (error) {
    console.error("❌ Failed to sync product " + projectId + ":", error.message);
  }
};
// Add to shiprocketCheckoutController.js
exports.syncAllProducts = async (req, res) => {
  try {
    const projects = await Project.findAll({
      include: [{ model: Subcategory, as: "subcategory" }]
    });

    const results = [];
    for (const project of projects) {
      try {
        await exports.syncProductUpdate(project.id);
        results.push({ id: project.id, status: "success" });
      } catch (error) {
        results.push({ id: project.id, status: "failed", error: error.message });
      }
    }

    res.json({
      success: true,
      message: "Sync completed",
      total: projects.length,
      results: results
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.generateMockCheckoutToken = async (req, res) => {
  try {
    const { userId, cartItems } = req.body;

    console.log("⚠️ Using MOCK CHECKOUT (for testing only)");
    console.log("User ID:", userId);
    console.log("Cart items:", cartItems);

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "userId is required"
      });
    }

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Cart is empty"
      });
    }

    // Generate mock identifiers
    const mockToken = "MOCK_TOKEN_" + Date.now();
    const mockOrderId = "MOCK_ORDER_" + Date.now();

    console.log("✅ Mock token generated:", mockToken);

    // Simulate order creation after 2 seconds (like webhook)
    setTimeout(async () => {
      try {
        const internalOrderId = generateOrderId();
        
        const totalAmount = cartItems.reduce((sum, item) => 
          sum + ((item.price || 0) * (item.quantity || 1)), 0
        );

        const newOrder = await Order.create({
          orderId: internalOrderId,
          user_id: userId,
          mobile: "9999999999",
          customerName: "Test Customer",
          productId: null,
          shippingAddress: "Test Address, Mumbai, Maharashtra - 400001",
          paymentMethod: "online",
          totalAmount: totalAmount,
          status: "confirmed",
          paymentStatus: "paid",
          quantity: cartItems.length,
          shiprocket_checkout_order_id: mockOrderId,
          order_source: "mock_checkout"
        });

        // Create order items
        for (const item of cartItems) {
          await OrderItem.create({
            orderId: newOrder.orderId,
            projectId: item.projectId || item.id,
            quantity: item.quantity || 1,
            price: item.price || 0
          });
        }

        console.log("✅ Mock order created:", internalOrderId);

        // Clear cart
        await CartItem.destroy({
          where: { userId: userId }
        });

        console.log("✅ Cart cleared for user:", userId);

      } catch (error) {
        console.error("❌ Mock order creation failed:", error);
      }
    }, 2000);

    // Return immediately with mock token
    res.json({
      success: true,
      token: mockToken,
      order_id: mockOrderId,
      mock: true,
      message: "Mock checkout - order will be created automatically in 2 seconds"
    });

  } catch (error) {
    console.error("Mock checkout error:", error);
    res.status(500).json({
      success: false,
      error: "Mock checkout failed: " + error.message
    });
  }
};

module.exports = exports;
