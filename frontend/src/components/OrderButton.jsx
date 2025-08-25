import { useEffect, useRef, useState } from "react";
import BillingFormPopup from "./UserDetails";

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
      const res = await fetch("http://localhost:5000/api/payment/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: finalTotal }),
      });

      const data = await res.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount, // in paise
        currency: "INR",
        name: "Electrosoft System",
        description: "Buy Prduct form getyourprojectdone",
        order_id: data.id,
        handler: async function () {
          if (response) createShiprocketOrder();
          await createShiprocketOrder();
          alert(`Payment Successful!`);
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment Error:", error);
    }
  };

  // 👉 Helper: Create Shiprocket order
  const createShiprocketOrder = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/shiprocket/createorder",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            total: finalTotal,
            profile: profile,
            cartItems: cartItems,
            paymentMethod: paymentMethod,
            // total: total,
          }),
        }
      );

      const data = await res.json();
      console.log("Shiprocket Response:", data);
      if (onOrderComplete) onOrderComplete(data);
    } catch (error) {
      console.error("Shiprocket Error:", error);
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
                onClick={createShiprocketOrder}
                disabled={disabled || isAnimating}
              >
                <span className="default">Continue to Shipping</span>
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
