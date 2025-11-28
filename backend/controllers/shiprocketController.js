const axios = require("axios");
const HttpsProxyAgent = require('https-proxy-agent');

const getShiprocketToken = async () => {
  try {
    console.log("Logging into Shiprocket...");
    
    const config = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 10000
    };

    const loginRes = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/auth/login",
      {
        email: process.env.SHIPROCKET_EMAIL,
        password: process.env.SHIPROCKET_PASSWORD
      },
      config
    );
    
    if (!loginRes.data.token) {
      throw new Error("No token received from Shiprocket login");
    }
    
    console.log("Shiprocket login successful");
    return loginRes.data.token;
  } catch (error) {
    const errorData = error.response && error.response.data;
    console.error("Shiprocket login failed:", {
      status: error.response && error.response.status,
      data: errorData
    });
    throw new Error("Failed to authenticate: " + (error.message || 'Unknown error'));
  }
};


// Create Shiprocket order
exports.createShiprocketOrder = async (req, res) => {
  try {
    console.log("=== SHIPROCKET ORDER CREATION START ===");
    console.log("Received request:", JSON.stringify(req.body, null, 2));

    const { order_id, profile, cartItems, paymentMethod, total } = req.body;

    // Validate required fields
    if (!order_id) {
      console.error("Missing order_id");
      return res.status(400).json({ 
        success: false,
        error: "order_id is required",
        message: "Order ID must be provided from order controller"
      });
    }

    if (!total || total <= 0) {
      console.error("Invalid total amount:", total);
      return res.status(400).json({ 
        success: false,
        error: "total amount is required and must be greater than 0"
      });
    }

    // Get Shiprocket token
    const token = await getShiprocketToken();

    // Determine payment method
    let payment_method;
    if (paymentMethod === "op" || paymentMethod === "online" || paymentMethod === "prepaid") {
      payment_method = "Prepaid";
    } else {
      payment_method = "COD";
    }

    // Validate and prepare profile data with better validation
    const validatedProfile = {
      name: ((profile && profile.name) || "Customer").substring(0, 50),
      lastname: ((profile && profile.lastname) || "").substring(0, 50),
      address: ((profile && profile.address) || "Default Address").substring(0, 100),
      city: ((profile && profile.city) || "Mumbai").substring(0, 50),
      pincode: String((profile && profile.pincode) || "400001").replace(/\D/g, '').substring(0, 6) || "400001",
      state: ((profile && profile.state) || "Maharashtra").substring(0, 50),
      country: ((profile && profile.country) || "India").substring(0, 50),
      email: ((profile && profile.email) || "customer@example.com").substring(0, 50),
      phoneNumber: String((profile && profile.phoneNumber) || "9999999999").replace(/\D/g, '').substring(0, 10) || "9999999999"
    };

    // Ensure pincode is 6 digits
    if (validatedProfile.pincode.length !== 6) {
      validatedProfile.pincode = "400001";
    }

    // Ensure phone number is 10 digits
    if (validatedProfile.phoneNumber.length !== 10) {
      validatedProfile.phoneNumber = "9999999999";
    }

    console.log("Validated Profile:", validatedProfile);

    // Prepare order data
    const orderData = {
      order_id: String(order_id),
      order_date: new Date().toISOString().slice(0, 16).replace('T', ' '),
      pickup_location: "Home-1",
      billing_customer_name: validatedProfile.name,
      billing_last_name: validatedProfile.lastname,
      billing_address: validatedProfile.address,
      billing_city: validatedProfile.city,
      billing_pincode: validatedProfile.pincode,
      billing_state: validatedProfile.state,
      billing_country: validatedProfile.country,
      billing_email: validatedProfile.email,
      billing_phone: validatedProfile.phoneNumber,
      shipping_is_billing: true,

      // Map cart items with validation
      order_items: cartItems && cartItems.length > 0 ? cartItems.map(function(item, index) {
        return {
          name: String(item.title || ("Product-" + (index + 1))).substring(0, 50),
          sku: String(item.projectId || ("SKU-" + order_id + "-" + (index + 1))),
          units: Math.max(1, parseInt(item.quantity) || 1),
          selling_price: Math.max(1, parseFloat(item.price) || 1)
        };
      }) : [
        {
          name: "Default Product",
          sku: "SKU-" + order_id,
          units: 1,
          selling_price: Math.max(1, parseFloat(total))
        }
      ],

      payment_method: payment_method,
      sub_total: Math.max(1, parseFloat(total)),

      // Required dimensions (minimum values)
      length: 10,
      breadth: 10,
      height: 10,
      weight: 0.5
    };

    console.log("=== SENDING TO SHIPROCKET ===");
    console.log("Order Data:", {
      order_id: orderData.order_id,
      items_count: orderData.order_items.length,
      payment_method: orderData.payment_method,
      sub_total: orderData.sub_total,
      billing_phone: orderData.billing_phone,
      billing_pincode: orderData.billing_pincode
    });

    // Create order on Shiprocket
    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      orderData,
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        timeout: 30000
      }
    );

    console.log("=== SHIPROCKET SUCCESS ===");
    console.log("Shiprocket Response:", response.data);

    res.json({
      success: true,
      message: "Shiprocket order created successfully",
      shiprocket_data: response.data,
      order_id: order_id,
      shiprocket_order_id: response.data.order_id || response.data.id
    });

  } catch (error) {
    console.log("=== SHIPROCKET ERROR ===");
    const errorResponse = error.response;
    const errorData = errorResponse && errorResponse.data;
    
    console.error("Status:", errorResponse && errorResponse.status);
    console.error("Data:", errorData);
    console.error("Message:", error.message);

    const errorMessage = (errorData && errorData.message) || 
                        (errorData && errorData.error) || 
                        error.message || 
                        "Unknown Shiprocket error";

    res.status((errorResponse && errorResponse.status) || 500).json({ 
      success: false,
      error: "Failed to create Shiprocket order",
      details: errorMessage,
      shiprocket_error: errorData,
      order_id: req.body.order_id
    });
  }
};

exports.getShiprocketOrder = async (req, res) => {
  try {
    const { order_id } = req.params;
    const token = await getShiprocketToken();

    const response = await axios.get(
      "https://apiv2.shiprocket.in/v1/external/orders/show/" + order_id,
      {
        headers: {
          Authorization: "Bearer " + token
        },
        timeout: 15000
      }
    );

    res.json({
      success: true,
      data: response.data
    });
  } catch (error) {
    const errorData = error.response && error.response.data;
    console.error("Error fetching Shiprocket order:", errorData || error.message);
    res.status(500).json({ 
      success: false,
      error: "Failed to fetch Shiprocket order details" 
    });
  }
};

exports.trackShipment = async (req, res) => {
  try {
    const { shipment_id } = req.params;
    const token = await getShiprocketToken();

    const response = await axios.get(
      "https://apiv2.shiprocket.in/v1/external/courier/track/shipment/" + shipment_id,
      {
        headers: {
          Authorization: "Bearer " + token
        },
        timeout: 15000
      }
    );

    res.json({
      success: true,
      tracking_data: response.data
    });
  } catch (error) {
    const errorData = error.response && error.response.data;
    console.error("Error tracking shipment:", errorData || error.message);
    res.status(500).json({ 
      success: false,
      error: "Failed to track shipment" 
    });
  }
};

exports.cancelShiprocketOrder = async (req, res) => {
  try {
    const { order_id } = req.params;
    const token = await getShiprocketToken();

    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/orders/cancel",
      { ids: [order_id] },
      {
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json"
        },
        timeout: 15000
      }
    );

    res.json({
      success: true,
      message: "Order cancelled successfully",
      data: response.data
    });
  } catch (error) {
    const errorData = error.response && error.response.data;
    console.error("Error cancelling order:", errorData || error.message);
    res.status(500).json({ 
      success: false,
      error: "Failed to cancel order" 
    });
  }
};
