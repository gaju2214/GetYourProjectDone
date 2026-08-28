import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/Botton";
import { Card, CardContent, CardFooter } from "../components/ui/Card";
import { Badge } from "./ui/Badge";
import { Star, ShoppingCart, Check, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axios from "axios";
import api from "../api";
import { useAuth } from "../context/AuthContext";

export function ProductCard({ product }) {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [showGoogleLoginModal, setShowGoogleLoginModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useCart();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const [randomRating, setRandomRating] = useState(0);

  // New states for backend discount integration
  const [globalDiscount, setGlobalDiscount] = useState(null);
  const [discountLoading, setDiscountLoading] = useState(true);

  // Check auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/api/protected/checkAuth");
        if (res.data?.success === true && res.data?.status === 200) {
          setUser(res.data.user);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    const rating = (Math.random() * 0.9 + 4.0).toFixed(1);
    setRandomRating(rating);
    checkAuth();
  }, []);

  // Fetch global discount from backend
  useEffect(() => {
    const fetchGlobalDiscount = async () => {
      try {
        setDiscountLoading(true);
        const response = await api.get('/api/discounts/global');
        if (response.data.success) {
          setGlobalDiscount(response.data.discount);
        }
      } catch (error) {
        console.error('Failed to fetch global discount:', error);
        // Don't show error to user, just continue with fallback
      } finally {
        setDiscountLoading(false);
      }
    };

    fetchGlobalDiscount();

    // Refresh discount every 2 minutes for real-time updates
    const interval = setInterval(fetchGlobalDiscount, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const handleGoogleLogin = () => {
    const currentUrl = window.location.href;
    const encodedRedirectUrl = encodeURIComponent(currentUrl);
    window.location.href = `${api.defaults.baseURL}/api/auth/google?returnUrl=${encodedRedirectUrl}`;
  };

  const handleSendOtp = async () => {
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }
    if (!/^\d{10}$/.test(phoneNumber)) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      setIsLoading(true);
      const res = await api.post("/api/auth/send-otp", {
        phoneNumber,
        name,
      });

      setUserId(res.data.userId);
      setOtpSent(true);
      alert("✅ OTP sent to your phone!");
    } catch (error) {
      alert(error.response?.data?.error || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!/^\d{6}$/.test(otp)) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setIsLoading(true);
      const res = await api.post("/api/auth/verify-otp", {
        userId,
        otp,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Now add to cart
      await handleAddToCartAfterAuth(res.data.user.id);

      setShowOtpModal(false);
      setName("");
      setPhoneNumber("");
      setOtp("");
      setOtpSent(false);
      alert("✅ Login successful! Item added to cart!");
    } catch (error) {
      alert(error.response?.data?.error || "Failed to verify OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCartAfterAuth = async (userId) => {
    try {
      const cartItem = {
        userId: userId,
        projectId: product.id,
        quantity: 1,
      };

      // Get token from localStorage
      const token = localStorage.getItem("token");

      const response = await api.post("/api/cart/add", cartItem, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Include the token
        },
        withCredentials: true,
      });

      if (response.status === 200 || response.status === 201) {
        dispatch({ type: "ADD_ITEM", payload: product });
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  };

  const handleAddToCart = async () => {
    if (!user || !isAuthenticated) {
      setShowOtpModal(true);
      return;
    }

    console.log("User object:", user);

    try {
      const cartItem = {
        userId: user.userId,
        projectId: product.id,
        quantity: 1,
      };

      setIsAdding(true);
      console.log("Cart item payload:", cartItem);

      const response = await api.post("/api/cart/add", cartItem, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      console.log("Cart add response:", response.data);

      if (response.status === 200 || response.status === 201) {
        dispatch({ type: "ADD_ITEM", payload: product });
        setIsAdded(true);
        setTimeout(() => {
          setIsAdded(false);
        }, 2000);
        alert("✅ Item added to cart!");
      } else {
        alert("❌ Failed to add item to cart.");
      }
    } catch (error) {
      if (error.response) {
        console.error("Error adding to cart:", error.response.data);
        alert("⚠️ Error: " + JSON.stringify(error.response.data));
      } else {
        console.error("Error adding to cart:", error.message);
        alert("⚠️ Something went wrong.");
      }
    } finally {
      setIsAdding(false);
    }
  };

  // Enhanced discount calculation with backend integration
  const getDiscountInfo = () => {
    if (!product.price) {
      return null;
    }

    // Use backend discount if available and active
    if (globalDiscount && globalDiscount.isActive && !discountLoading) {
      // Check if discount is currently valid (time-based)
      const now = new Date();
      const startDate = globalDiscount.startDate ? new Date(globalDiscount.startDate) : null;
      const endDate = globalDiscount.endDate ? new Date(globalDiscount.endDate) : null;

      const isTimeValid = (!startDate || now >= startDate) && (!endDate || now <= endDate);

      if (isTimeValid) {
        const discountPercentage = parseFloat(globalDiscount.discountValue) || 0;
        // Calculate what the original price should be based on backend discount
        const calculatedOriginalPrice = Math.round(product.price / (1 - discountPercentage / 100));

        return {
          percentage: Math.round(discountPercentage),
          label: globalDiscount.label || 'OFF',
          backgroundColor: globalDiscount.backgroundColor || '#ef4444',
          textColor: globalDiscount.textColor || '#ffffff',
          isBackendControlled: true,
          originalPrice: calculatedOriginalPrice
        };
      }
    }

    // Fallback to calculated discount if no backend discount is active
    const originalPrice = product.originalPrice || Math.round(product.price / 0.6);
    const calculatedPercentage = Math.round(
      ((originalPrice - product.price) / originalPrice) * 100
    );

    if (calculatedPercentage > 0) {
      return {
        percentage: calculatedPercentage,
        label: 'OFF',
        backgroundColor: '#ef4444',
        textColor: '#ffffff',
        isBackendControlled: false,
        originalPrice: originalPrice
      };
    }

    return null;
  };

  // Helper function to parse PostgreSQL arrays
  const parsePostgresArray = (arrayString) => {
    if (!arrayString || typeof arrayString !== 'string') return [];
    return arrayString.replace(/[{}]/g, '').split(',').map(item => item.trim());
  };

  const discountInfo = getDiscountInfo();

  return (
    <>
      <Card className="group bg-white border border-gray-100 hover:border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden h-full">
        <Link to={`/projects/${product.slug}`} className="flex-1 flex flex-col">
          <CardContent className="p-0 flex-1 flex flex-col">
            <div className="relative overflow-hidden bg-gray-50 aspect-video flex items-center justify-center p-4 border-b border-gray-100 shrink-0">
              <img
                src={product.image || '/placeholder-image.jpg'}
                alt={product.title}
                loading="lazy"
                className="max-h-48 max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
              />

              {/* Dynamic Discount Badge */}
              {discountInfo && discountInfo.percentage > 0 && !discountLoading && (
                <span
                  className="absolute top-2.5 left-2.5 text-xs font-bold text-white px-2 py-1 rounded shadow-sm"
                  style={{
                    backgroundColor: discountInfo.backgroundColor || '#003e8b',
                    color: discountInfo.textColor || '#ffffff'
                  }}
                >
                  {`${discountInfo.percentage}% ${discountInfo.label || 'OFF'}`}
                </span>
              )}

              {/* Loading state for discount */}
              {discountLoading && typeof product.price === "number" && (
                <div className="absolute top-2.5 left-2.5 bg-gray-200 text-gray-500 px-2 py-1 rounded text-[10px] animate-pulse">
                  Loading offer...
                </div>
              )}

              <Badge
                className="absolute top-2.5 right-2.5 bg-gray-800 text-white hover:bg-gray-700 text-[10px] px-2 py-0.5 border-0 rounded"
              >
                {product.difficulty || 'Beginner'}
              </Badge>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 mb-1.5">
                  <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-bold text-gray-700">{randomRating}</span>
                </div>

                <h3 className="font-bold text-sm text-gray-800 mb-2 line-clamp-2 group-hover:text-[#003e8b] transition-colors leading-snug">
                  {product.title}
                </h3>

                <div
                  className="text-gray-500 text-xs line-clamp-2 mb-3 leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html:
                      product.description?.length > 120
                        ? product.description.slice(0, 120) + "..."
                        : product.description
                  }}
                ></div>
              </div>

              <div>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-lg font-bold text-[#003e8b]">
                    ₹{product.price?.toLocaleString?.()}
                  </span>
                  {discountInfo && (
                    <span className="text-xs text-gray-400 line-through">
                      ₹{discountInfo.originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 mb-2">
                  {(() => {
                    const components = Array.isArray(product.components)
                      ? product.components
                      : typeof product.components === "string"
                        ? parsePostgresArray(product.components)
                        : [];

                    return components.length > 0 ? (
                      components.slice(0, 3).map((component, index) => (
                        <span key={index} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">
                          {component}
                        </span>
                      ))
                    ) : (
                      <p className="text-gray-400 text-[10px]">No components listed</p>
                    );
                  })()}
                </div>

                {/* Backend Discount Indicator */}
                {discountInfo && discountInfo.isBackendControlled && !discountLoading && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                    </span>
                    <span className="text-[10px] text-green-600 font-bold">Live Offer Active</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Link>

        <CardFooter className="p-4 pt-0">
          <Button
            className={`w-full transition-all duration-300 py-2.5 text-xs font-bold rounded-md shadow-sm border-0 cursor-pointer ${isAdded
              ? "bg-green-600 hover:bg-green-700 text-white"
              : "bg-[#003e8b] hover:bg-[#002e66] text-white"
              }`}
            onClick={handleAddToCart}
            disabled={isAdding}
          >
            {isAdding ? (
              <div className="flex items-center justify-center gap-1.5 py-0.5">
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Adding...
              </div>
            ) : isAdded ? (
              <div className="flex items-center justify-center gap-1.5 py-0.5">
                <Check className="h-3.5 w-3.5" />
                Added!
              </div>
            ) : (
              <div className="flex items-center justify-center gap-1.5 py-0.5">
                <ShoppingCart className="h-3.5 w-3.5" />
                <span>Add to Cart</span>
              </div>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Login Modal - Name + Phone + OTP/Google */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-800">
                Sign In Required
              </h3>
              <button
                onClick={() => {
                  setShowOtpModal(false);
                  setName("");
                  setPhoneNumber("");
                  setOtp("");
                  setOtpSent(false);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-50 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-gray-500 text-center text-xs">
                Please verify your details to add items to cart.
              </p>

              {!otpSent ? (
                <>
                  {/* Name & Phone Fields */}
                  <div className="space-y-3 mb-4">
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

                  {/* Send OTP Button */}
                  <Button
                    onClick={handleSendOtp}
                    disabled={isLoading || !name.trim() || phoneNumber.length !== 10}
                    className="w-full bg-[#003e8b] hover:bg-[#002e66] text-white font-bold py-2.5 rounded-md transition duration-300 text-xs cursor-pointer border-0"
                  >
                    {isLoading ? "Sending OTP..." : "Send OTP"}
                  </Button>

                  <div className="text-center text-xs text-gray-400 my-2">Only login with OTP is available</div>
                </>
              ) : (
                <>
                  {/* OTP Verification */}
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
                    <p className="text-xs text-gray-500 text-center">
                      OTP sent to +91 {phoneNumber}
                    </p>
                  </div>

                  <Button
                    onClick={handleVerifyOtp}
                    disabled={isLoading || otp.length !== 6}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-md transition duration-300 text-xs cursor-pointer border-0"
                  >
                    {isLoading ? "Verifying..." : "Verify & Add to Cart"}
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => setOtpSent(false)}
                    className="w-full text-xs text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    Change Phone Number
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
