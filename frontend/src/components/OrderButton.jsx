import { useEffect, useRef, useState } from "react";
import BillingFormPopup from "./UserDetails";
import api from "../api";

export function OrderButton({
  onOrderComplete,
  disabled = false,
  finalTotal,
  paymentMethod,
  cartItems,
  profile,
}) {
  const buttonRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Inject styles for button animation
  useEffect(() => {
    const styleId = "order-button-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        /* your full CSS from earlier (unchanged) */
      `;
      document.head.appendChild(style);
    }
    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) document.head.removeChild(existingStyle);
    };
  }, []);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);
  }, []);

  // 👉 Razorpay Payment flow
  const handlePayment = async () => {
  try {
    const res = await api.post("/api/payment/order", {
      amount: finalTotal,
    });

    const data = res.data; // ✅ FIXED

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: data.amount, // in paise
      currency: "INR",
      name: "Getyourprojectdone",
      description: "Buy Product from getyourprojectdone",
      order_id: data.id,
      handler: async function (response) {
        if (response) {
          await createOrderWithShipping();
        }
      },
      theme: { color: "#3399cc" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error("Payment Error:", error);
  }
};


  // 👉 Create order in database first, then create Shiprocket order
  const createOrderWithShipping = async () => {
    try {
      console.log("Creating order with shipping...");
      
      // First create the order in your database to get order_id
      const orderRes = await api.post("/api/orders/create-with-shipping", {
  user_id: profile?.user_id || 1,
  mobile: profile?.phoneNumber || "9999999999",
  customerName: `${profile?.name || "Customer"} ${profile?.lastname || ""}`.trim(),
  productId: cartItems?.[0]?.projectId || "DEFAULT_PRODUCT",
  shippingAddress: profile?.address || "Default Address",
  paymentMethod: paymentMethod,
  totalAmount: finalTotal,
  quantity: cartItems?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 1,
  profile: profile,
  cartItems: cartItems
});

// ❌ Wrong:
// const orderData = await orderRes.json();

// ✅ Correct:
const orderData = orderRes.data;

      console.log("Order created:", orderData);

      if (orderData.success) {
        console.log(`Order created successfully with ID: ${orderData.orderId}`);
        if (onOrderComplete) onOrderComplete(orderData);
      } else {
        console.error("Order creation failed:", orderData.error);
        alert("Order creation failed. Please try again.");
      }

    } catch (error) {
      console.error("Order creation error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  // 👉 For COD orders - create order directly with shipping
  const handleCODOrder = async () => {
    try {
      setIsAnimating(true);
      await createOrderWithShipping();
    } catch (error) {
      console.error("COD Order Error:", error);
    } finally {
      setIsAnimating(false);
    }
  };

  return (
    <>
      <div>
        {profile?.address &&
        profile?.email &&
        profile?.name &&
        profile?.lastname &&
        profile?.state &&
        profile?.city &&
        profile?.phoneNumber ? (
          <div>
            {paymentMethod === "op" ? (
              <button
                ref={buttonRef}
                className="order"
                onClick={handlePayment}
                disabled={disabled || isAnimating || !scriptLoaded}
              >
                <span className="default">Continue to Pay</span>
                <span className="success">
                  Order Placed
                  <svg viewBox="0 0 12 10">
                    <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                  </svg>
                </span>
                <div className="box"></div>
                <div className="truck">
                  <div className="back"></div>
                  <div className="front">
                    <div className="window"></div>
                  </div>
                  <div className="light top"></div>
                  <div className="light bottom"></div>
                </div>
                <div className="lines"></div>
              </button>
            ) : (
              <button
                ref={buttonRef}
                className="order"
                onClick={handleCODOrder}
                disabled={disabled || isAnimating}
              >
                <span className="default">
                  {isAnimating ? "Processing..." : "Continue to Shipping"}
                </span>
              </button>
            )}
          </div>
        ) : (
          <button
            className="order"
            onClick={() => {
              setIsPopupOpen(true);
            }}
          >
            <span className="default">Buy Now</span>
          </button>
        )}
      </div>

      <div>
        <BillingFormPopup
          isPopupOpen={isPopupOpen}
          setIsPopupOpen={setIsPopupOpen}
          profile={profile}
        />
      </div>
    </>
  );
}
