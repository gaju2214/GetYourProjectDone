const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.post("/add", orderController.addOrder);
router.post("/place", orderController.placeOrder);
router.get("/user/:user_id", orderController.getOrdersByUser);
router.post("/", orderController.createOrder);

// Add these new routes for admin
router.get("/", orderController.getAllOrders); // Get all orders for admin
router.put("/:id", orderController.updateOrderStatus); // Update order status
router.post('/create-with-shipping', orderController.createOrderWithShipping);


// In your backend routes file
const axios = require('axios');

// Shiprocket API configuration
const SHIPROCKET_API_BASE = 'https://apiv2.shiprocket.in/v1/external';

// Function to authenticate with Shiprocket
async function authenticateShiprocket() {
  try {
    const response = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
      email: process.env.SHIPROCKET_EMAIL,    // API User email
      password: process.env.SHIPROCKET_PASSWORD // API User password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Authentication successful:', response.data);
    return response.data.token;
  } catch (error) {
    console.error('Authentication failed:', error.response?.data);
    throw new Error('Shiprocket authentication failed');
  }
}

// Function to fetch orders from Shiprocket
async function fetchShiprocketOrders(token) {
  try {
    const response = await axios.get(`${SHIPROCKET_API_BASE}/orders`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Failed to fetch Shiprocket orders:', error);
    throw new Error('Failed to fetch orders from Shiprocket');
  }
}

// Route to get Shiprocket orders
router.get('/shiprocket', async (req, res) => {
  try {
    console.log('Attempting Shiprocket authentication...');
    
    // Authenticate with Shiprocket
    const token = await authenticateShiprocket();
    console.log('Token received:', token ? 'Success' : 'Failed');
    
    // Fetch orders from Shiprocket
    const ordersResponse = await axios.get('https://apiv2.shiprocket.in/v1/external/orders', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Orders fetched successfully:', ordersResponse.data?.data?.length || 0, 'orders');
    
    res.json({
      success: true,
      data: ordersResponse.data.data || ordersResponse.data
    });
  } catch (error) {
    console.error('Shiprocket API error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      res.status(401).json({
        success: false,
        message: 'Shiprocket authentication failed. Please check API credentials.'
      });
    } else {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch Shiprocket orders'
      });
    }
  }
});

module.exports = router;
