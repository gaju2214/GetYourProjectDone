import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Star, ShoppingCart, Zap, Check, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import api from "../api";

// Helper to parse Postgres text array format (e.g. "{item1,item2}")
const parsePostgresArray = (str) => {
  if (!str) return [];
  if (Array.isArray(str)) return str;
  if (typeof str !== "string") return [];
  return str
    .replace(/^\{|\}$/g, "")
    .split(",")
    .map((item) => item.trim().replace(/^"|"$/g, ""))
    .filter(Boolean);
};

export default function KitCard({ product, categorySlug }) {
  const { user, isLoggedIn, login } = useAuth();
  const { dispatch } = useCart();
  const navigate = useNavigate();

  // --- Card States ---
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  // --- Auth Modal States ---
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // "cart" or "buyNow"

  // Stable random rating based on product ID
  const displayRating = product.rating || (4.2 + (Number(product.id || 0) % 8) * 0.1).toFixed(1);
  const reviewsCount = 10 + (Number(product.id || 0) * 7) % 150;

  // Components list
  const components = Array.isArray(product.components)
    ? product.components
    : parsePostgresArray(product.components);

  // Define navigation link
  const detailLink = `/${categorySlug}/${product.id}`;

  const triggerAddToCart = async (userId) => {
    setIsAdding(true);
    try {
      const cartItem = {
        userId: userId || user?.id || user?.user_id,
        projectId: product.id,
        quantity: 1,
        price: product.price,
      };

      const response = await api.post("/api/cart/add", cartItem, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.status === 200 || response.status === 201) {
        dispatch({ type: "ADD_TO_CART", payload: product });
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("❌ Failed to add item to cart.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isLoggedIn) {
      setPendingAction("cart");
      setShowOtpModal(true);
      return;
    }
    triggerAddToCart();
  };

  const handleBuyNow = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isLoggedIn) {
      setPendingAction("buyNow");
      setShowOtpModal(true);
      return;
    }
    navigate("/checkout", { state: { buyNowProduct: product, quantity: 1 } });
  };

  // OTP Login APIs
  const handleSendOtp = async () => {
    if (!name.trim() || phoneNumber.length !== 10) return;
    setAuthLoading(true);
    try {
      await api.post("/api/auth/send-otp", { phoneNumber, name });
      setOtpSent(true);
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("❌ Failed to send OTP. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return;
    setAuthLoading(true);
    try {
      const response = await api.post("/api/auth/verify-otp", { phoneNumber, otp });
      if (response.data.success) {
        // Save to login context
        login(response.data.user, response.data.token);
        setShowOtpModal(false);
        setOtpSent(false);
        setName("");
        setPhoneNumber("");
        setOtp("");

        // Execute pending action
        if (pendingAction === "cart") {
          triggerAddToCart(response.data.user.id);
        } else if (pendingAction === "buyNow") {
          navigate("/checkout", { state: { buyNowProduct: product, quantity: 1 } });
        }
      } else {
        alert("❌ Invalid OTP. Please check and try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("❌ Verification failed. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <>
      <div className="group relative flex flex-col bg-white border border-gray-100 hover:border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden h-full">
        {/* Clickable Card Content area */}
        <Link to={detailLink} className="flex flex-col h-full cursor-pointer">
          <div className="aspect-video bg-gray-50 flex items-center justify-center p-4 border-b border-gray-100 overflow-hidden relative">
            <img
              src={product.image || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500"}
              alt={product.title}
              className="max-h-48 max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
            {product.difficulty && (
              <span className="absolute top-2.5 right-2.5 bg-gray-800 text-white text-[10px] px-2 py-0.5 rounded font-medium">
                {product.difficulty}
              </span>
            )}
          </div>

          <div className="p-4 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 mb-1.5">
                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-bold text-gray-700">{displayRating}</span>
                <span className="text-[10px] text-gray-400">({reviewsCount} reviews)</span>
              </div>

              <h3 className="font-bold text-sm text-gray-800 mb-2 line-clamp-2 group-hover:text-[#003e8b] transition-colors leading-snug">
                {product.title}
              </h3>

              <p className="text-gray-500 text-xs line-clamp-2 mb-3 leading-relaxed">
                {product.description}
              </p>
            </div>

            <div>
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-lg font-bold text-[#003e8b]">
                  ₹{product.price?.toLocaleString()}
                </span>
                <span className="text-xs text-gray-400 line-through">
                  ₹{Math.floor(product.price * 1.3).toLocaleString()}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-2">
                {components.slice(0, 3).map((comp, idx) => (
                  <span key={idx} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">
                    {comp}
                  </span>
                ))}
                {components.length > 3 && (
                  <span className="text-[10px] text-gray-400">+{components.length - 3} more</span>
                )}
              </div>
            </div>
          </div>
        </Link>

        {/* Buttons at the bottom - side by side */}
        <div className="p-4 pt-0 grid grid-cols-2 gap-2">
          <button
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded shadow-sm border border-[#003e8b] cursor-pointer transition-all duration-300 ${isAdded
                ? "bg-green-600 border-green-600 text-white"
                : "bg-white text-[#003e8b] hover:bg-gray-50"
              }`}
          >
            {isAdding ? (
              <div className="w-3.5 h-3.5 border-2 border-[#003e8b] border-t-transparent rounded-full animate-spin"></div>
            ) : isAdded ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingCart className="h-3.5 w-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>

          <button
            onClick={handleBuyNow}
            className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-bold rounded shadow-sm bg-[#fb7b02] hover:bg-[#e06c00] text-white border-0 cursor-pointer transition-all duration-300"
          >
            <Zap className="h-3.5 w-3.5 fill-white text-white" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>

      {/* Login Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-800">Sign In Required</h3>
              <button
                onClick={() => {
                  setShowOtpModal(false);
                  setOtpSent(false);
                  setName("");
                  setPhoneNumber("");
                  setOtp("");
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-50 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-gray-500 text-center text-xs">
                Please verify your details to continue with this action.
              </p>

              {!otpSent ? (
                <div className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:border-[#003e8b] bg-gray-50 focus:bg-white transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-xs">
                          +91
                        </span>
                        <input
                          type="tel"
                          placeholder="10-digit number"
                          maxLength="10"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-r-md focus:outline-none focus:border-[#003e8b] bg-gray-50 focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSendOtp}
                    disabled={authLoading || !name.trim() || phoneNumber.length !== 10}
                    className="w-full bg-[#003e8b] hover:bg-[#002e66] text-white font-bold py-2.5 rounded-md transition duration-300 text-xs cursor-pointer border-0 disabled:opacity-50"
                  >
                    {authLoading ? "Sending OTP..." : "Send OTP"}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Enter 6-digit OTP</label>
                    <input
                      type="text"
                      placeholder="000000"
                      maxLength="6"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-center text-xl tracking-widest focus:outline-none focus:border-[#003e8b] bg-gray-50 focus:bg-white transition-all"
                    />
                    <p className="text-xs text-gray-500 text-center">OTP sent to +91 {phoneNumber}</p>
                  </div>

                  <button
                    onClick={handleVerifyOtp}
                    disabled={authLoading || otp.length !== 6}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-md transition duration-300 text-xs cursor-pointer border-0 disabled:opacity-50"
                  >
                    {authLoading ? "Verifying..." : "Verify & Continue"}
                  </button>

                  <button
                    onClick={() => setOtpSent(false)}
                    className="w-full bg-transparent hover:bg-gray-50 text-xs text-gray-500 hover:text-gray-700 py-1.5 rounded transition cursor-pointer border-0"
                  >
                    Change Phone Number
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
