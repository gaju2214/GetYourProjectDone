// import { useEffect, useRef, useState } from "react";
// import BillingFormPopup from "./UserDetails";
// import api from "../api";

// export function OrderButton({
//   onOrderComplete,
//   disabled = false,
//   finalTotal,
//   paymentMethod,
//   cartItems,
//   profile,
// }) {
//   const buttonRef = useRef(null);
//   const [isAnimating, setIsAnimating] = useState(false);
//   const [scriptLoaded, setScriptLoaded] = useState(false);
//   const [isPopupOpen, setIsPopupOpen] = useState(false);

//   // Inject styles for button animation
//   useEffect(() => {
//     const styleId = "order-button-styles";
//     if (!document.getElementById(styleId)) {
//       const style = document.createElement("style");
//       style.id = styleId;
//       style.textContent = `
//         /* your full CSS from earlier (unchanged) */
//       `;
//       document.head.appendChild(style);
//     }
//     return () => {
//       const existingStyle = document.getElementById(styleId);
//       if (existingStyle) document.head.removeChild(existingStyle);
//     };
//   }, []);

//   // Load Razorpay script
//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.onload = () => setScriptLoaded(true);
//     document.body.appendChild(script);
//   }, []);

//   // 👉 Razorpay Payment flow
//   const handlePayment = async () => {
//   try {
//     const res = await api.post("/api/payment/order", {
//       amount: finalTotal,
//     });

//     const data = res.data; // ✅ FIXED

//     const options = {
//       key: import.meta.env.VITE_RAZORPAY_KEY_ID,
//       amount: data.amount, // in paise
//       currency: "INR",
//       name: "Getyourprojectdone",
//       description: "Buy Product from getyourprojectdone",
//       order_id: data.id,
//       handler: async function (response) {
//         if (response) {
//           await createOrderWithShipping();
//         }
//       },
//       theme: { color: "#3399cc" },
//     };

//     const rzp = new window.Razorpay(options);
//     rzp.open();
//   } catch (error) {
//     console.error("Payment Error:", error);
//   }
// };


//   // 👉 Create order in database first, then create Shiprocket order
//   const createOrderWithShipping = async () => {
//     try {
//       console.log("Creating order with shipping...");
      
//       // First create the order in your database to get order_id
//       const orderRes = await api.post("/api/orders/create-with-shipping", {
//   user_id: profile?.user_id || 1,
//   mobile: profile?.phoneNumber || "9999999999",
//   customerName: `${profile?.name || "Customer"} ${profile?.lastname || ""}`.trim(),
//   productId: cartItems?.[0]?.projectId || "DEFAULT_PRODUCT",
//   shippingAddress: profile?.address || "Default Address",
//   paymentMethod: paymentMethod,
//   totalAmount: finalTotal,
//   quantity: cartItems?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 1,
//   profile: profile,
//   cartItems: cartItems
// });

// // ❌ Wrong:
// // const orderData = await orderRes.json();

// // ✅ Correct:
// const orderData = orderRes.data;

//       console.log("Order created:", orderData);

//       if (orderData.success) {
//         console.log(`Order created successfully with ID: ${orderData.orderId}`);
//         if (onOrderComplete) onOrderComplete(orderData);
//       } else {
//         console.error("Order creation failed:", orderData.error);
//         alert("Order creation failed. Please try again.");
//       }

//     } catch (error) {
//       console.error("Order creation error:", error);
//       alert("Something went wrong. Please try again.");
//     }
//   };

//   // 👉 For COD orders - create order directly with shipping
//   const handleCODOrder = async () => {
//     try {
//       setIsAnimating(true);
//       await createOrderWithShipping();
//     } catch (error) {
//       console.error("COD Order Error:", error);
//     } finally {
//       setIsAnimating(false);
//     }
//   };

//   return (
//     <>
//       <div>
//         {profile?.address &&
//         profile?.email &&
//         profile?.name &&
//         profile?.lastname &&
//         profile?.state &&
//         profile?.city &&
//         profile?.phoneNumber ? (
//           <div>
//             {paymentMethod === "op" ? (
//               <button
//                 ref={buttonRef}
//                 className="order"
//                 onClick={handlePayment}
//                 disabled={disabled || isAnimating || !scriptLoaded}
//               >
//                 <span className="default">Continue to Pay</span>
//                 <span className="success">
//                   Order Placed
//                   <svg viewBox="0 0 12 10">
//                     <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
//                   </svg>
//                 </span>
//                 <div className="box"></div>
//                 <div className="truck">
//                   <div className="back"></div>
//                   <div className="front">
//                     <div className="window"></div>
//                   </div>
//                   <div className="light top"></div>
//                   <div className="light bottom"></div>
//                 </div>
//                 <div className="lines"></div>
//               </button>
//             ) : (
//               <button
//                 ref={buttonRef}
//                 className="order"
//                 onClick={handleCODOrder}
//                 disabled={disabled || isAnimating}
//               >
//                 <span className="default">
//                   {isAnimating ? "Processing..." : "Continue to Shipping"}
//                 </span>
//               </button>
//             )}
//           </div>
//         ) : (
//           <button
//             className="order"
//             onClick={() => {
//               setIsPopupOpen(true);
//             }}
//           >
//             <span className="default">Buy Now</span>
//           </button>
//         )}
//       </div>

//       <div>
//         <BillingFormPopup
//           isPopupOpen={isPopupOpen}
//           setIsPopupOpen={setIsPopupOpen}
//           profile={profile}
//         />
//       </div>
//     </>
//   );
// }



import { useEffect, useRef, useState } from "react";
import { Edit } from "lucide-react"; // ✅ edit icon
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
  const [userProfile, setUserProfile] = useState(profile || null);

  // ✅ Load Razorpay script once
  useEffect(() => {
    if (!document.querySelector("#razorpay-script")) {
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => setScriptLoaded(true);
      document.body.appendChild(script);
    } else {
      setScriptLoaded(true);
    }
  }, []);

  // 👉 Razorpay Payment flow
  const handlePayment = async () => {
    try {
      const res = await api.post("/api/payment/order", { amount: finalTotal });
      const data = res.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "Getyourprojectdone",
        description: "Buy Product from getyourprojectdone",
        order_id: data.id,
        handler: async function (response) {
          if (response) await createOrderWithShipping();
        },
        theme: { color: "#000000" }, // ✅ Razorpay popup theme black
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment Error:", error);
    }
  };

  // 👉 Create order in DB + Shiprocket
  const createOrderWithShipping = async () => {
    try {
      const orderRes = await api.post("/api/orders/create-with-shipping", {
        user_id: userProfile?.user_id || 1,
        mobile: userProfile?.phoneNumber || "9999999999",
        customerName: `${userProfile?.name || "Customer"} ${userProfile?.lastname || ""}`.trim(),
        productId: cartItems?.[0]?.projectId || "DEFAULT_PRODUCT",
        shippingAddress: userProfile?.address || "Default Address",
        paymentMethod: paymentMethod,
        totalAmount: finalTotal,
        quantity: cartItems?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 1,
        profile: userProfile,
        cartItems: cartItems,
      });

      const orderData = orderRes.data;
      if (orderData.success) {
        if (onOrderComplete) onOrderComplete(orderData);
      } else {
        alert("Order creation failed. Please try again.");
      }
    } catch (error) {
      console.error("Order creation error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  // 👉 For COD orders
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
        {userProfile?.address ? (
          <div className="order-summary border p-4 rounded-md shadow">
            <h3 className="font-bold text-lg mb-2">Order Summary</h3>
            <p><strong>Name:</strong> {userProfile.name} {userProfile.lastname}</p>
            <p><strong>Phone:</strong> {userProfile.phoneNumber}</p>
            <p><strong>Address:</strong> {userProfile.address}, {userProfile.city}, {userProfile.state}</p>

            {/* ✅ Edit button with icon */}
            <button
              className="flex items-center gap-2 bg-gray-200 text-sm px-3 py-1 rounded mt-2 hover:bg-gray-300"
              onClick={() => setIsPopupOpen(true)}
            >
              <Edit size={16} /> Edit Address
            </button>

            {paymentMethod === "op" ? (
              <button
                ref={buttonRef}
                className="bg-gray-600 text-white px-4 py-2 rounded mt-3 hover:bg-gray-900"
                onClick={handlePayment}
                disabled={disabled || isAnimating || !scriptLoaded}
              >
                Continue to Pay
              </button>
            ) : (
              <button
                ref={buttonRef}
                className="bg-gray-700 text-white px-4 py-2 rounded mt-3 hover:bg-gray-900"
                onClick={handleCODOrder}
                disabled={disabled || isAnimating}
              >
                {isAnimating ? "Processing..." : "Continue to Shipping"}
              </button>
            )}
          </div>
        ) : (
          <button
            className="bg-black text-white px-6 py-2 rounded hover:bg-gray-900"
            onClick={() => setIsPopupOpen(true)}
          >
            Buy Now
          </button>
        )}
      </div>

      {/* Popup for editing/adding address */}
      <BillingFormPopup
        isPopupOpen={isPopupOpen}
        setIsPopupOpen={setIsPopupOpen}
        profile={userProfile}
        paymentMethod={paymentMethod}
        onConfirm={(updatedProfile) => {
          setUserProfile(updatedProfile);
          setIsPopupOpen(false);
        }}
      />
    </>
  );
}
