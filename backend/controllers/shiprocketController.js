const axios = require("axios");

exports.createShiprocketOrder = async (req, res) => {
  try {
    // Always login before creating an order
    const loginRes = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/auth/login",
      {
        email: "valadog186@mardiek.com",
        password: "^Jw5jP1nEg6kmcQ9",
      }
    );
    const token = loginRes.data.token;
    const { profile, cartItems, paymentMethod, total } = req.body;

    let payment_method, shipping_is_billing;
    if (paymentMethod === "op") {
      payment_method = "Prepaid";
      shipping_is_billing = false;
    } else {
      payment_method = "Postpaid";
      shipping_is_billing = true;
    }

    const orderData = {
      order_id: `ORDER${Date.now()}`,
      order_date: new Date().toISOString().split("T")[0],
      pickup_location: "Home",
      billing_customer_name: profile?.name || "",
      billing_last_name: profile?.lastname || "",
      billing_address: profile?.address || "address",
      billing_city: profile?.city || "city",
      billing_pincode: profile?.pincode || "pincode",
      billing_state: profile?.state || "state",
      billing_country: profile?.country || "country",
      billing_email: profile?.email || "email",
      billing_phone: profile?.phoneNumber || "phoneNumber",
      shipping_is_billing: shipping_is_billing || true,

      // ✅ Map through all products in cartItems
      order_items: cartItems.map((item, index) => ({
        name: item.title || `Product-${index + 1}`,
        sku: item.projectId || `SKU-${index + 1}`,
        units: item.quantity || 1,
        selling_price: item.price || 1,
      })),

      payment_method: payment_method || "pay method",
      sub_total: total || "total",

      // you can also calculate total weight/dimensions dynamically if needed
      length: 10,
      breadth: 10,
      height: 10,
      weight: 1,
    };

    const response = await axios.post(
      "https://apiv2.shiprocket.in/v1/external/orders/create/adhoc",
      orderData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Shiprocket Error:", error.response?.data || error.message);
    res.status(500).json({ error: error.response?.data || error.message });
  }
};
