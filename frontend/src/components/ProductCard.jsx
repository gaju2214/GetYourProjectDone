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
      <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
        <Link to={`/projects/${product.slug}`}>
          <CardContent className="p-0">
            <div className="relative overflow-hidden rounded-t-lg">
              <img
                src={product.image}
                alt={product.title}
                loading="lazy"
                className="w-full max-h-60 object-contain bg-gray-100 rounded-t-lg"
              />
              
              {/* Dynamic Backend-Controlled Discount Badge */}
              {discountInfo && discountInfo.percentage > 0 && !discountLoading && (
                <Badge 
                  className={`text-white absolute top-3 left-3 transition-all duration-300 hover:scale-105 font-semibold ${
                    discountInfo.isBackendControlled 
                      ? 'animate-pulse shadow-lg border-2 border-white/30' 
                      : 'hover:opacity-90'
                  }`}
                  style={{
                    backgroundColor: discountInfo.backgroundColor,
                    color: discountInfo.textColor
                  }}
                >
                  {`${discountInfo.percentage}% ${discountInfo.label}`}
                </Badge>
              )}

              {/* Loading state for discount */}
              {discountLoading && typeof product.price === "number" && (
                <div className="absolute top-3 left-3 bg-gray-300 text-gray-600 px-3 py-1 rounded text-xs animate-pulse">
                  Loading offer...
                </div>
              )}

              <Badge
                className="absolute top-3 right-3"
                variant={
                  product.difficulty === "Beginner"
                    ? "secondary"
                    : product.difficulty === "Intermediate"
                      ? "default"
                      : "destructive"
                }
              >
                {product.difficulty}
              </Badge>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-1 mb-3">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{randomRating}</span>
              </div>

              <h3 className="font-bold text-lg mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {product.title}
              </h3>

              <div
                className="text-gray-600 text-lg"
                dangerouslySetInnerHTML={{
                  __html:
                    product.description?.length > 120
                      ? product.description.slice(0, 120) + "..."
                      : product.description
                }}
              ></div>

              <div className="flex items-center gap-3 mb-4">
  <span className="text-2xl font-bold text-green-600">
    ₹{product.price?.toLocaleString?.()}
  </span>
  {discountInfo && (
    <span className="text-lg text-gray-500 line-through">
      ₹{discountInfo.originalPrice.toLocaleString()}
    </span>
  )}
</div>

              <div className="flex flex-wrap gap-2 mb-4">
                {(() => {
                  const components = Array.isArray(product.components)
                    ? product.components
                    : typeof product.components === "string"
                      ? parsePostgresArray(product.components)
                      : [];

                  return components.length > 0 ? (
                    components.slice(0, 3).map((component, index) => (
                      <Badge key={index} className="text-sm">
                        {component}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">No components listed</p>
                  );
                })()}
              </div>

              {/* Backend Discount Indicator */}
              {discountInfo && discountInfo.isBackendControlled && !discountLoading && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-600 font-medium">Live Offer Active</span>
                </div>
              )}
            </div>
          </CardContent>
        </Link>

        <CardFooter className="p-6 pt-0">
          <Button
            className={`w-full transition-all duration-300 ${isAdded
              ? "focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              : "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              }`}
            onClick={handleAddToCart}
            disabled={isAdding}
          >
            {isAdding ? (
              <div className="flex items-center gap-2 py-2 text-sm">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Adding...
              </div>
            ) : isAdded ? (
              <div className="flex items-center gap-2 py-2 text-sm">
                <Check className="h-4 w-4" />
                Added to Cart!
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 py-2 text-sm">
                <ShoppingCart className="h-4 w-4" />
                <span className="leading-none">Add to Cart</span>
              </div>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Login Modal - Name + Phone + OTP/Google */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Login Required
              </h3>
              <button
                onClick={() => {
                  setShowOtpModal(false);
                  setName("");
                  setPhoneNumber("");
                  setOtp("");
                  setOtpSent(false);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-gray-600 text-center text-sm">
                Please verify your details to add items to cart.
              </p>
              
              {!otpSent ? (
                <>
                  {/* Name & Phone Fields */}
                  <div className="space-y-3 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        placeholder="Enter your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                          +91
                        </span>
                        <input
                          type="tel"
                          placeholder="10-digit number"
                          maxLength="10"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Send OTP Button */}
                  <Button
                    onClick={handleSendOtp}
                    disabled={isLoading || !name.trim() || phoneNumber.length !== 10}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
                  >
                    {isLoading ? "Sending OTP..." : "Send OTP"}
                  </Button>

                  {/* Google login removed: only OTP flow available */}
                  <div className="text-center text-sm text-gray-500 my-4">Only login with OTP is available</div>
                </>
              ) : (
                <>
                  {/* OTP Verification */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Enter 6-digit OTP</label>
                    <input
                      type="text"
                      placeholder="000000"
                      maxLength="6"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-center text-2xl tracking-widest focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-sm text-gray-600 mt-2">
                      OTP sent to +91 {phoneNumber}
                    </p>
                  </div>

                  <Button
                    onClick={handleVerifyOtp}
                    disabled={isLoading || otp.length !== 6}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
                  >
                    {isLoading ? "Verifying..." : "Verify & Add to Cart"}
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => setOtpSent(false)}
                    className="w-full"
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
