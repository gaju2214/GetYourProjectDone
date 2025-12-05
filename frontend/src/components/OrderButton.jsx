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
import { Edit, MapPin } from "lucide-react";
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

  // Sync profile from parent
  useEffect(() => {
    setUserProfile(profile || null);
  }, [profile]);

  // Refresh profile when popup closes (after user updates address)
  const handlePopupClose = async () => {
    setIsPopupOpen(false);
    // Fetch fresh profile data to get updated address fields
    try {
      const res = await api.get(`/api/auth/profile`);
      setUserProfile(res.data);
      console.log('✅ Profile refreshed:', res.data);
    } catch (err) {
      console.error('Failed to refresh profile:', err);
    }
  };

  // Razorpay payment
  const handlePayment = async () => {
    try {
      const res = await api.post("/api/payment/order", { amount: finalTotal });
      const data = res.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: "INR",
        name: "Getyourprojectdone",
        description: "Order Payment",
        order_id: data.id,
        handler: async function (response) {
          if (response) await createOrderWithShipping();
        },
        theme: { color: "#000000" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment Error:", error);
    }
  };

const createOrderWithShipping = async () => {
  try {
    console.log('📋 userProfile object:', userProfile);
    
    const payload = {
      user_id: userProfile?.id || userProfile?.user_id,
      mobile: userProfile?.phoneNumber || "9999999999",
      customerName: `${userProfile?.name || "Customer"} ${userProfile?.lastname || ""}`.trim(),
      productId: cartItems?.[0]?.projectId || null,
      shippingAddress: userProfile?.address || "Default Address",
      address: userProfile?.address || null,
      city: userProfile?.city || null,
      pincode: userProfile?.pincode || null,
      state: userProfile?.state || null,
      country: userProfile?.country || null,
      paymentMethod,
      totalAmount: finalTotal,
      quantity: cartItems?.reduce((sum, item) => sum + (item.quantity || 1), 0) || 1,
      profile: userProfile,
      cartItems,
    };

    console.log("📦 Sending order payload:", payload);
    console.log("📍 Address fields in payload:", { 
      address: payload.address, 
      city: payload.city, 
      pincode: payload.pincode,
      state: payload.state,
      country: payload.country
    });

    const orderRes = await api.post("/api/orders/create-with-shipping", payload);

    console.log("✅ Order response from backend:", orderRes.data);

    if (orderRes.data.success) {
      alert("Order placed successfully!");
      
      // ✅ Call onOrderComplete here
      if (typeof onOrderComplete === "function") {
        onOrderComplete(orderRes.data); // pass backend response if needed
      }

    } else {
      alert("Order creation failed. Please try again.");
    }
  } catch (error) {
    console.error("❌ Order creation error:", error);
    alert("Something went wrong. Please try again.");
  }
};


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
          <div className="order-summary bg-white border p-6 rounded-lg shadow-md max-w-md mx-auto transition-transform hover:scale-[1.01]">
            <h3 className="font-semibold text-xl mb-4 border-b pb-2 text-gray-800">Address</h3>
            <div className="space-y-2 text-gray-700">
              <p className="flex items-center gap-2">
                <MapPin size={16} className="text-gray-500" />
                {userProfile.address}, {userProfile.city}, {userProfile.state}
              </p>
            </div>

            <button
              className="flex items-center gap-2 text-sm mt-3 px-3 py-1.5 border rounded-lg hover:bg-gray-100 transition"
              onClick={() => setIsPopupOpen(true)}
            >
              <Edit size={16} className="text-gray-600" /> Edit Address
            </button>

            <div className="mt-5 flex flex-col gap-3">
              {paymentMethod === "op" ? (
                <button
                  ref={buttonRef}
                  className="w-full bg-gray-700 text-white font-medium px-4 py-2.5 rounded-lg shadow hover:bg-gray-900 transition"
                  onClick={handlePayment}
                  disabled={disabled || isAnimating || !scriptLoaded}
                >
                  Continue to Pay ₹{finalTotal}
                </button>
              ) : (
                <button
                  ref={buttonRef}
                  className="w-full bg-gray-700 text-white font-medium px-4 py-2.5 rounded-lg shadow hover:bg-gray-900 transition"
                  onClick={handleCODOrder}
                  disabled={disabled || isAnimating}
                >
                  {isAnimating ? "Processing..." : "Cash on Delivery"}
                </button>
              )}
            </div>
          </div>
        ) : (
          <button
            className="bg-black text-white px-8 py-3 rounded-lg font-medium shadow hover:bg-gray-900 transition w-full max-w-sm mx-auto block"
            onClick={() => setIsPopupOpen(true)}
          >
            Buy Now
          </button>
        )}
      </div>

      <BillingFormPopup
        isPopupOpen={isPopupOpen}
        setIsPopupOpen={setIsPopupOpen}
        profile={userProfile}
        onConfirm={(updatedProfile) => {
          setUserProfile(updatedProfile);
          setIsPopupOpen(false);
        }}
      />
    </>
  );
}
