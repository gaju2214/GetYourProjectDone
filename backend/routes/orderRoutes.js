const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const authenticateUser = require('../middleware/auth');
const axios = require('axios');

// Your existing routes
router.post("/add", orderController.addOrder);
router.post("/place", orderController.placeOrder);
router.get("/user/:user_id", orderController.getOrdersByUser);
router.post("/", orderController.createOrder);
router.get("/", orderController.getAllOrders);
router.put("/:id", orderController.updateOrderStatus);
router.post('/create-with-shipping', orderController.createOrderWithShipping);
router.post('/:orderId/cancel', authenticateUser, orderController.cancelOrder);


// ✅ Fix: Add the missing tracking routes
router.get('/shiprocket/track/awb/:awb', async (req, res) => {
  try {
    const { awb } = req.params;
    
    // Authenticate with Shiprocket first
    const token = await authenticateShiprocket();
    
    const response = await axios.get(`https://apiv2.shiprocket.in/v1/external/courier/track/awb/${awb}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error tracking by AWB:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track shipment by AWB'
    });
  }
});

router.get("/shiprocket/track/order/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({ success: false, message: "Order ID is required" });
    }

    const token = await authenticateShiprocket();
    if (!token) {
      return res.status(500).json({ success: false, message: "Failed to authenticate Shiprocket" });
    }

    const response = await axios.get(
      `https://apiv2.shiprocket.in/v1/external/orders/track/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Ensure response data exists
    if (!response.data) {
      return res.status(404).json({ success: false, message: "No tracking info found" });
    }

    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error("Error tracking by Order ID:", error.response?.data || error.message || error);
    res.status(500).json({
      success: false,
      message: "Failed to track shipment by Order ID",
      error: error.response?.data || error.message || null,
    });
  }
});

// ✅ Fix: Add missing Shiprocket order update route
router.put("/shiprocket/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    
    const token = await authenticateShiprocket();
    
    // Update order status in Shiprocket
    const response = await axios.put(`https://apiv2.shiprocket.in/v1/external/orders/update/${orderId}`, {
      status: status
    }, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: response.data
    });
  } catch (error) {
    console.error('Error updating Shiprocket order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status in Shiprocket'
    });
  }
});

// Shiprocket API configuration
const SHIPROCKET_API_BASE = 'https://apiv2.shiprocket.in/v1/external';

// ✅ Improved authentication function with proper error handling
async function authenticateShiprocket() {
  try {
    console.log('Authenticating with Shiprocket...');
    
    // Make sure environment variables are set
    if (!process.env.SHIPROCKET_EMAIL || !process.env.SHIPROCKET_PASSWORD) {
      throw new Error('Shiprocket credentials not found in environment variables');
    }
    
    const response = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.data.token) {
      throw new Error('No token received from Shiprocket');
    }
    
    console.log('Shiprocket authentication successful');
    return response.data.token;
  } catch (error) {
    console.error('Shiprocket authentication failed:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 422) {
      throw new Error('Invalid Shiprocket API credentials. Please check your API user email and password.');
    }
    
    throw new Error('Shiprocket authentication failed');
  }
}

// ✅ Enhanced function to fetch orders from Shiprocket
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

// ✅ Updated route to get Shiprocket orders with better error handling
router.get('/shiprocket', async (req, res) => {
  try {
    console.log('Fetching Shiprocket orders...');
    
    const token = await authenticateShiprocket();
    
    const ordersResponse = await axios.get('https://apiv2.shiprocket.in/v1/external/orders', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Orders fetched successfully:', ordersResponse.data?.data?.length || 0, 'orders');
    
    res.json({
      success: true,
      data: ordersResponse.data.data || ordersResponse.data || []
    });
  } catch (error) {
    console.error('Shiprocket API error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      res.status(401).json({
        success: false,
        message: 'Shiprocket authentication failed. Please check API credentials.'
      });
    } else if (error.response?.status === 422) {
      res.status(422).json({
        success: false,
        message: 'Invalid request data. Please check your API credentials.'
      });
    } else {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch Shiprocket orders'
      });
    }
  }
});

// ✅ Update Shiprocket order address
router.put("/shiprocket/address/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { shipping_address } = req.body; // <-- nested object from frontend

    if (!shipping_address) {
      return res.status(400).json({
        success: false,
        message: "Missing shipping_address in request body",
      });
    }

    const token = await authenticateShiprocket();

    const response = await axios.put(
      `${SHIPROCKET_API_BASE}/orders/address/${orderId}`,
      {
        shipping_customer_name: shipping_address.name?.split(" ")[0] || "",
        shipping_last_name: shipping_address.name?.split(" ").slice(1).join(" ") || "",
        shipping_address: shipping_address.address,
        shipping_address_2: "",
        shipping_city: shipping_address.city,
        shipping_state: shipping_address.state,
        shipping_country: shipping_address.country,
        shipping_pincode: shipping_address.pincode,
        shipping_email: shipping_address.email,
        shipping_phone: shipping_address.phone,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({
      success: true,
      message: "Order address updated successfully",
      data: response.data,
    });
  } catch (error) {
    console.error("Error updating Shiprocket order address:", error.response?.data || error.message);
    res.status(error.response?.status || 500).json({
      success: false,
      message: error.response?.data?.message || "Failed to update order address in Shiprocket",
    });
  }
});


module.exports = router;




// const express = require("express");
// const router = express.Router();
// const orderController = require("../controllers/orderController");
// const axios = require('axios');

// // Your existing routes
// router.post("/add", orderController.addOrder);
// router.post("/place", orderController.placeOrder);
// router.get("/user/:user_id", orderController.getOrdersByUser);
// router.post("/", orderController.createOrder);
// router.get("/", orderController.getAllOrders);
// router.put("/:id", orderController.updateOrderStatus);
// router.post('/create-with-shipping', orderController.createOrderWithShipping);

// // ✅ Enhanced Shiprocket Authentication with proper error handling
// async function authenticateShiprocket() {
//   try {
//     console.log('Authenticating with Shiprocket...');
    
//     if (!process.env.SHIPROCKET_EMAIL || !process.env.SHIPROCKET_PASSWORD) {
//       throw new Error('Shiprocket credentials not found in environment variables');
//     }
    
//     const response = await axios.post('https://apiv2.shiprocket.in/v1/external/auth/login', {
//       email: process.env.SHIPROCKET_EMAIL,
//       password: process.env.SHIPROCKET_PASSWORD
//     }, {
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       timeout: 10000 // 10 second timeout
//     });
    
//     if (!response.data.token) {
//       throw new Error('No token received from Shiprocket');
//     }
    
//     console.log('Shiprocket authentication successful');
//     return response.data.token;
//   } catch (error) {
//     console.error('Shiprocket authentication failed:', {
//       status: error.response?.status,
//       data: error.response?.data,
//       message: error.message
//     });
    
//     if (error.response?.status === 422 || error.response?.status === 401) {
//       throw new Error('Invalid Shiprocket API credentials. Please check your API user email and password.');
//     }
    
//     throw new Error('Shiprocket authentication failed');
//   }
// }

// // ✅ Fixed: Track by AWB with proper endpoint and error handling
// router.get('/shiprocket/track/awb/:awb', async (req, res) => {
//   try {
//     const { awb } = req.params;
    
//     console.log(`Tracking AWB: ${awb}`);
    
//     if (!awb || awb === 'Not assigned' || awb === 'undefined') {
//       return res.status(400).json({
//         success: false,
//         message: 'Valid AWB number is required'
//       });
//     }
    
//     const token = await authenticateShiprocket();
    
//     // ✅ Using correct Shiprocket endpoint for AWB tracking
//     const response = await axios.get(`https://apiv2.shiprocket.in/v1/external/courier/track/awb/${awb}`, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       },
//       timeout: 15000 // 15 second timeout
//     });
    
//     console.log('AWB tracking response:', response.data);
    
//     // ✅ Handle different response structures from Shiprocket
//     const trackingData = response.data.tracking || response.data;
    
//     res.json({
//       success: true,
//       track: {
//         status: trackingData.status || 'Unknown',
//         last_update: trackingData.last_update || new Date().toISOString(),
//         current_location: trackingData.current_location || 'N/A',
//         expected_delivery: trackingData.expected_delivery || null,
//         courier_company: trackingData.courier_company || 'N/A',
//         awb: awb,
//         checkpoints: trackingData.checkpoints || []
//       }
//     });
    
//   } catch (error) {
//     console.error('Error tracking by AWB:', {
//       awb: req.params.awb,
//       status: error.response?.status,
//       data: error.response?.data,
//       message: error.message
//     });
    
//     if (error.response?.status === 404) {
//       res.status(404).json({
//         success: false,
//         message: `AWB ${req.params.awb} not found in Shiprocket system`
//       });
//     } else if (error.response?.status === 401) {
//       res.status(401).json({
//         success: false,
//         message: 'Authentication failed with Shiprocket'
//       });
//     } else {
//       res.status(500).json({
//         success: false,
//         message: 'Failed to track shipment by AWB'
//       });
//     }
//   }
// });

// // ✅ Fixed: Track by Order ID with proper endpoint
// router.get('/shiprocket/track/order/:orderId', async (req, res) => {
//   try {
//     const { orderId } = req.params;
    
//     console.log(`Tracking Order ID: ${orderId}`);
    
//     if (!orderId) {
//       return res.status(400).json({
//         success: false,
//         message: 'Valid Order ID is required'
//       });
//     }
    
//     const token = await authenticateShiprocket();
    
//     // ✅ Method 1: Try to get order details first
//     let orderResponse;
//     try {
//       orderResponse = await axios.get(`https://apiv2.shiprocket.in/v1/external/orders/show/${orderId}`, {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         },
//         timeout: 15000
//       });
//     } catch (orderError) {
//       console.log('Order not found, trying tracking endpoint directly');
//     }
    
//     // ✅ Method 2: Try tracking endpoint
//     const response = await axios.get(`https://apiv2.shiprocket.in/v1/external/orders/track/${orderId}`, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       },
//       timeout: 15000
//     });
    
//     console.log('Order tracking response:', response.data);
    
//     const trackingData = response.data.tracking || response.data;
    
//     res.json({
//       success: true,
//       track: {
//         status: trackingData.status || 'Unknown',
//         last_update: trackingData.last_update || new Date().toISOString(),
//         current_location: trackingData.current_location || 'N/A',
//         expected_delivery: trackingData.expected_delivery || null,
//         courier_company: trackingData.courier_company || 'N/A',
//         awb: trackingData.awb || 'N/A',
//         checkpoints: trackingData.checkpoints || []
//       }
//     });
    
//   } catch (error) {
//     console.error('Error tracking by Order ID:', {
//       orderId: req.params.orderId,
//       status: error.response?.status,
//       data: error.response?.data,
//       message: error.message
//     });
    
//     if (error.response?.status === 404) {
//       res.status(404).json({
//         success: false,
//         message: `Order ID ${req.params.orderId} not found in Shiprocket system`
//       });
//     } else if (error.response?.status === 401) {
//       res.status(401).json({
//         success: false,
//         message: 'Authentication failed with Shiprocket'
//       });
//     } else {
//       res.status(500).json({
//         success: false,
//         message: 'Failed to track shipment by Order ID'
//       });
//     }
//   }
// });

// // ✅ Fixed: Update Shiprocket order status
// router.put("/shiprocket/:orderId", async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { status } = req.body;
    
//     console.log(`Updating Order ID: ${orderId} to status: ${status}`);
    
//     if (!orderId || !status) {
//       return res.status(400).json({
//         success: false,
//         message: 'Order ID and status are required'
//       });
//     }
    
//     const token = await authenticateShiprocket();
    
//     // ✅ Note: Shiprocket may not allow status updates via API for some statuses
//     // This endpoint may not exist - check Shiprocket documentation
//     const response = await axios.put(`https://apiv2.shiprocket.in/v1/external/orders/update/${orderId}`, {
//       status: status
//     }, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       },
//       timeout: 15000
//     });
    
//     res.json({
//       success: true,
//       message: 'Order status updated successfully',
//       data: response.data
//     });
    
//   } catch (error) {
//     console.error('Error updating Shiprocket order:', {
//       orderId: req.params.orderId,
//       status: error.response?.status,
//       data: error.response?.data,
//       message: error.message
//     });
    
//     if (error.response?.status === 404) {
//       res.status(404).json({
//         success: false,
//         message: `Order ID ${req.params.orderId} not found or cannot be updated`
//       });
//     } else if (error.response?.status === 401) {
//       res.status(401).json({
//         success: false,
//         message: 'Authentication failed with Shiprocket'
//       });
//     } else {
//       res.status(500).json({
//         success: false,
//         message: 'Failed to update order status in Shiprocket'
//       });
//     }
//   }
// });

// // ✅ Enhanced Shiprocket orders endpoint with better error handling
// router.get('/shiprocket', async (req, res) => {
//   try {
//     console.log('Fetching Shiprocket orders...');
    
//     const token = await authenticateShiprocket();
    
//     const ordersResponse = await axios.get('https://apiv2.shiprocket.in/v1/external/orders', {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       },
//       timeout: 15000
//     });
    
//     console.log('Orders fetched successfully:', ordersResponse.data?.data?.length || 0, 'orders');
    
//     res.json({
//       success: true,
//       data: ordersResponse.data.data || ordersResponse.data || []
//     });
//   } catch (error) {
//     console.error('Shiprocket API error:', {
//       status: error.response?.status,
//       data: error.response?.data,
//       message: error.message
//     });
    
//     if (error.response?.status === 401) {
//       res.status(401).json({
//         success: false,
//         message: 'Shiprocket authentication failed. Please check API credentials.'
//       });
//     } else if (error.response?.status === 422) {
//       res.status(422).json({
//         success: false,
//         message: 'Invalid request data. Please check your API credentials.'
//       });
//     } else {
//       res.status(500).json({
//         success: false,
//         message: error.message || 'Failed to fetch Shiprocket orders'
//       });
//     }
//   }
// });

// module.exports = router;
