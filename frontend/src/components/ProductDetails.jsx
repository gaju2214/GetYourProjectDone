import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import api from "../api";
import { useNavigate, useParams, Link } from "react-router-dom";
import { Button } from "../components/ui/Botton";
import { Badge } from "../components/ui/Badge";
import { Card, CardContent } from "../components/ui/Card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/Tabs";
import {
  Star,
  ShoppingCart,
  Heart,
  Share2,
  Truck,
  Shield,
  Headphones,
  FileText,
  X,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { dispatch } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);

  const { user: authUser, isLoggedIn, login } = useAuth();

  // New states for backend discount integration
  const [globalDiscount, setGlobalDiscount] = useState(null);
  const [discountLoading, setDiscountLoading] = useState(true);

  // Form modal states
  const [showDownloadForm, setShowDownloadForm] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", mobile: "" });
  const [otp, setOtp] = useState("");
  const [cartOtp, setCartOtp] = useState("");
  const [userId, setUserId] = useState(null);
  const [cartUserId, setCartUserId] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [otpError, setOtpError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [cartPhoneNumber, setCartPhoneNumber] = useState("");
  const [cartName, setCartName] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  // Handle initial form submission (send OTP)
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api.post("/api/userinfos/send-otp", {
        name: formData.name.trim(),
        phoneNumber: formData.mobile.trim(),
        projectId: product.id
      });

      if (response.data.success) {
        setUserId(response.data.userId);
        setShowDownloadForm(false);
        setShowOtpForm(true);
        alert("OTP sent successfully to your mobile number!");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert(error.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle OTP verification
  const handleOtpVerification = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsVerifying(true);
    setOtpError("");

    try {
      const response = await api.post("/api/userinfos/verify-otp", {
        userId: userId,
        otp: otp
      });

      if (response.data.success) {
        // Store download info in localStorage
        const localData = {
          projectId: product.id,
          projectTitle: product.title,
          downloadDate: new Date().toISOString(),
        };

        const existing = JSON.parse(localStorage.getItem("abstractDownloads") || "[]");
        existing.push(localData);
        localStorage.setItem("abstractDownloads", JSON.stringify(existing));

        // Trigger download
        const link = document.createElement("a");
        link.href = product.abstract_file;
        link.download = `${product.title}-abstract.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Reset states
        setShowOtpForm(false);
        setFormData({ name: "", mobile: "" });
        setOtp("");
        setUserId(null);
        setFormErrors({});

        alert("OTP verified successfully! Your download will start shortly.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setOtpError(error.response?.data?.message || "Invalid or expired OTP. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    setIsSubmitting(true);
    setOtpError("");

    try {
      const response = await api.post("/api/userinfos/send-otp", {
        name: formData.name.trim(),
        phoneNumber: formData.mobile.trim(),
        projectId: product.id
      });

      if (response.data.success) {
        setUserId(response.data.userId);
        alert("OTP resent successfully!");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      alert("Failed to resend OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };



  // Google Login Modal states
  const [showGoogleLoginModal, setShowGoogleLoginModal] = useState(false);

  const navigate = useNavigate();



  // Auth state is read from AuthContext so the component updates
  // automatically when the user logs in/out elsewhere in the app.

  // Fetch product data
  // First useEffect: Fetch product data
  useEffect(() => {
    const slug = window.location.pathname.split("/").pop();
    api
      .get(`/api/projects/by-slug/${slug}`)
      .then((res) => {
        const p = res.data.data;
        setProduct({
          ...p,
          originalPrice: Math.floor(p.price * 1.5),
        });
      })
      .catch((err) => {
        console.error("Error fetching project:", err);
      });
  }, [id]);

  // Second useEffect: Set dynamic meta tags
  useEffect(() => {
    if (product) {
      // Set dynamic page title
      document.title = `${product.title} Engineering Project | KitsIndia`;

      // Create dynamic meta description
      const benefits = [];
      if (product.abstract_file) benefits.push("documentation");
      if (product.source_code) benefits.push("source code");
      if (product.circuit_diagram) benefits.push("circuit diagrams");
      if (product.video_tutorial) benefits.push("video tutorials");

      const benefitsText = benefits.length > 0 ? benefits.join(", ") : "complete documentation";
      const category = product.category || "Engineering";
      const discountInfo = getDiscountInfo();

      // Format price with rupee symbol using proper Unicode
      const formatPrice = (price) => `₹${price.toLocaleString('en-IN')}`;

      let descriptionContent;
      if (discountInfo) {
        descriptionContent = `${product.title} - Complete ${category} project with ${benefitsText} & expert support. ${discountInfo.percentage}% OFF! Now ${formatPrice(product.price)} (was ${formatPrice(discountInfo.originalPrice)}). Download instantly!`;
      } else {
        descriptionContent = `${product.title} - Complete ${category} project with ${benefitsText} & expert support. Perfect for engineering students. ${formatPrice(product.price)} - Download now!`;
      }

      // Ensure description stays under 160 characters
      descriptionContent = descriptionContent.substring(0, 160);

      // Set meta description
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', descriptionContent);
      } else {
        const meta = document.createElement('meta');
        meta.name = 'description';
        meta.content = descriptionContent;
        document.head.appendChild(meta);
      }

      // Add Open Graph meta tags for social sharing
      const updateOrCreateMetaTag = (property, content) => {
        let metaTag = document.querySelector(`meta[property="${property}"]`);
        if (metaTag) {
          metaTag.setAttribute('content', content);
        } else {
          metaTag = document.createElement('meta');
          metaTag.setAttribute('property', property);
          metaTag.setAttribute('content', content);
          document.head.appendChild(metaTag);
        }
      };

      updateOrCreateMetaTag('og:title', `${product.title} | Complete ${category} Project Kit`);
      updateOrCreateMetaTag('og:description', descriptionContent);
      updateOrCreateMetaTag('og:image', product.image || '/placeholder-logo.png');
      updateOrCreateMetaTag('og:url', window.location.href);
      updateOrCreateMetaTag('og:type', 'product');
    }
  }, [product]); // This runs when product state changes


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

    // Refresh discount every 5 minutes for real-time updates
    const interval = setInterval(fetchGlobalDiscount, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Form validation
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    const mobileRegex = /^[6-9]\d{9}$/;
    if (!formData.mobile.trim()) {
      errors.mobile = 'Mobile number is required';
    } else if (!mobileRegex.test(formData.mobile.trim())) {
      errors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    return errors;
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle form submission


  // Handle Google Login
  const handleGoogleLogin = () => {
    const currentUrl = window.location.href;
    const encodedRedirectUrl = encodeURIComponent(currentUrl);
    window.location.href = `${api.defaults.baseURL}/api/auth/google?returnUrl=${encodedRedirectUrl}`;
  };

  // Cart OTP flow
  const handleSendCartOtp = async () => {
    if (!cartName.trim()) {
      alert("Please enter your name");
      return;
    }
    if (!/^\d{10}$/.test(cartPhoneNumber)) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await api.post("/api/auth/send-otp", {
        phoneNumber: cartPhoneNumber,
        name: cartName,
      });

      setCartUserId(res.data.userId);
      setOtpSent(true);
      alert("✅ OTP sent to your phone!");
    } catch (error) {
      alert(error.response?.data?.error || "Failed to send OTP");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyCartOtp = async () => {
    if (!/^\d{6}$/.test(cartOtp)) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setIsVerifying(true);
      const res = await api.post("/api/auth/verify-otp", {
        userId: cartUserId,
        otp: cartOtp,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // Update global auth context so other components reflect login immediately
      try {
        login && login(res.data.user, res.data.token);
      } catch (err) {
        console.warn('Failed to update AuthContext after OTP verify', err);
      }

      // Now add to cart
      const cartItem = {
        userId: res.data.user.id,
        projectId: product.id,
        quantity: 1,
      };

      const token = res.data.token; // Use the token from OTP verification response

      const cartRes = await api.post("/api/cart/add", cartItem, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` // Include the token
        },
        withCredentials: true,
      });

      if (cartRes.status === 200 || cartRes.status === 201) {
        alert("✅ Login successful! Item added to cart!");
        setShowOtpModal(false);
        setCartName("");
        setCartPhoneNumber("");
        setCartOtp("");
        setOtpSent(false);
      }
    } catch (error) {
      alert(error.response?.data?.error || "Failed to verify OTP");
    } finally {
      setIsVerifying(false);
    }
  };

  // Enhanced discount calculation with backend integration
  const getDiscountInfo = () => {
    if (!product?.price) {
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
        const actualSavings = calculatedOriginalPrice - product.price;

        return {
          percentage: Math.round(discountPercentage),
          label: globalDiscount.label || 'OFF',
          backgroundColor: globalDiscount.backgroundColor || '#ef4444',
          textColor: globalDiscount.textColor || '#ffffff',
          isBackendControlled: true,
          originalPrice: calculatedOriginalPrice,
          savings: actualSavings
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
      };
    }

    return null;
  };




  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse space-y-8">
        {/* Breadcrumb skeleton */}
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>

        {/* Content columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image Box */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-200 rounded-lg w-full h-96"></div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded w-5/6"></div>
            </div>

            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>

            {/* Price Box */}
            <div className="bg-gray-50 p-6 rounded-lg space-y-3">
              <div className="flex items-center gap-4">
                <div className="h-8 bg-gray-250 rounded w-24"></div>
                <div className="h-6 bg-gray-250 rounded w-20"></div>
                <div className="h-6 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <div className="h-12 bg-gray-200 rounded w-40"></div>
              <div className="h-12 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="h-12 bg-gray-250 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  // Handle Add to Cart - Show OTP modal if not authenticated
  const handleAddToCart = async () => {
    if (!authUser || !isLoggedIn) {
      setShowOtpModal(true);
      return;
    }

    console.log("Auth user object:", authUser);

    try {
      const cartItem = {
        userId: authUser?.id || authUser?.userId,
        projectId: product.id,
        quantity: 1,
      };

      console.log("Cart item payload:", cartItem);

      const response = await api.post("/api/cart/add", cartItem, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      console.log("Cart add response:", response.data);

      if (response.status === 200 || response.status === 201) {
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
    }
  };

  const discountInfo = getDiscountInfo();
  const gstAmount = Math.round(product.price * 0.18);
  const totalPrice = product.price + gstAmount;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="text-xs text-gray-500 mb-6 flex items-center space-x-2">
        <Link to="/" className="hover:text-[#003e8b] transition-colors">Home</Link>
        <span>/</span>
        <Link to="/categories" className="hover:text-[#003e8b] transition-colors">Project Kits</Link>
        <span>/</span>
        <span className="text-gray-700 font-semibold truncate max-w-[200px] sm:max-w-none">{product.title}</span>
      </div>

      {/* Login Modal - Name + Phone + OTP/Google */}
      {showGoogleLoginModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-800">
                Sign In Required
              </h3>
              <button
                onClick={() => setShowGoogleLoginModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-50 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-gray-500 text-center text-xs">
                Please log in to add items to your cart and make purchases.
              </p>

              {/* Name & Phone Fields */}
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter your name"
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
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-r-md focus:outline-none focus:border-[#003e8b] bg-gray-50 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OTP Modal for Add to Cart */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-800">
                Verify Mobile to Continue
              </h3>
              <button
                onClick={() => {
                  setShowOtpModal(false);
                  setCartName("");
                  setCartPhoneNumber("");
                  setCartOtp("");
                  setOtpSent(false);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-50 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {!otpSent ? (
                <>
                  <p className="text-gray-500 text-center text-xs">
                    Please enter your details to verify and add this item to cart.
                  </p>

                  <div className="space-y-3 mb-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        placeholder="Enter your name"
                        value={cartName}
                        onChange={(e) => setCartName(e.target.value)}
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
                          value={cartPhoneNumber}
                          onChange={(e) => setCartPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-r-md focus:outline-none focus:border-[#003e8b] bg-gray-50 focus:bg-white transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleSendCartOtp}
                    disabled={isSubmitting || !cartName.trim() || cartPhoneNumber.length !== 10}
                    className="w-full bg-[#003e8b] hover:bg-[#002e66] text-white font-bold py-2.5 rounded-md transition duration-300 text-xs border-0 cursor-pointer"
                  >
                    {isSubmitting ? "Sending OTP..." : "Send OTP"}
                  </Button>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Enter 6-digit OTP</label>
                    <input
                      type="text"
                      placeholder="000000"
                      maxLength="6"
                      value={cartOtp}
                      onChange={(e) => setCartOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-center text-xl tracking-widest focus:outline-none focus:border-[#003e8b] bg-gray-50 focus:bg-white transition-all"
                    />
                    <p className="text-xs text-gray-500 text-center">
                      OTP sent to +91 {cartPhoneNumber}
                    </p>
                  </div>

                  <Button
                    onClick={handleVerifyCartOtp}
                    disabled={isVerifying || cartOtp.length !== 6}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-md transition duration-300 text-xs border-0 cursor-pointer"
                  >
                    {isVerifying ? "Verifying..." : "Verify & Add to Cart"}
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

      {/* Download Form Modal */}
      {showDownloadForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-800">
                Download Abstract
              </h3>
              <button
                onClick={() => {
                  setShowDownloadForm(false);
                  setFormData({ name: '', mobile: '' });
                  setFormErrors({});
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-50 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:border-[#003e8b] bg-gray-50 focus:bg-white transition-all ${formErrors.name ? 'border-red-500' : 'border-gray-200'
                    }`}
                  placeholder="Enter your full name"
                  maxLength={50}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-[10px] mt-1">{formErrors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-xs">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className={`w-full px-3 py-2 text-sm border rounded-r-md focus:outline-none focus:border-[#003e8b] bg-gray-50 focus:bg-white transition-all ${formErrors.mobile ? 'border-red-500 animate-shake' : 'border-gray-200'
                      }`}
                    placeholder="Enter 10-digit mobile number"
                    maxLength={10}
                  />
                </div>
                {formErrors.mobile && (
                  <p className="text-red-500 text-[10px] mt-1">{formErrors.mobile}</p>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowDownloadForm(false);
                    setFormData({ name: '', mobile: '' });
                    setFormErrors({});
                  }}
                  className="flex-1 text-gray-700 hover:bg-gray-50 cursor-pointer text-xs"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[#003e8b] hover:bg-[#002e66] text-white font-bold py-2 border-0 cursor-pointer text-xs"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending OTP...' : 'Send OTP'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* OTP Verification Modal */}
      {showOtpForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-800">
                Verify OTP
              </h3>
              <button
                onClick={() => {
                  setShowOtpForm(false);
                  setOtp("");
                  setOtpError("");
                  setShowDownloadForm(true);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-50 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleOtpVerification} className="p-6 space-y-4">
              <div className="mb-4">
                <p className="text-xs text-gray-500 text-center mb-4">
                  Enter the 6-digit OTP sent to <strong>+91 {formData.mobile}</strong>
                </p>

                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  OTP <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setOtp(value);
                    setOtpError("");
                  }}
                  className={`w-full px-3 py-2 border rounded-md text-center text-xl tracking-widest focus:outline-none focus:border-[#003e8b] bg-gray-50 focus:bg-white transition-all ${otpError ? 'border-red-500' : 'border-gray-200'
                    }`}
                  placeholder="000000"
                  maxLength={6}
                />
                {otpError && (
                  <p className="text-red-500 text-[10px] mt-1">{otpError}</p>
                )}

                <div className="mt-3 text-center">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isSubmitting}
                    className="text-xs font-bold text-[#003e8b] hover:text-[#002e66] disabled:text-gray-400 cursor-pointer bg-transparent border-0"
                  >
                    {isSubmitting ? 'Resending...' : 'Resend OTP'}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowOtpForm(false);
                    setOtp("");
                    setOtpError("");
                    setShowDownloadForm(true);
                  }}
                  className="flex-1 text-gray-700 hover:bg-gray-50 cursor-pointer text-xs"
                  disabled={isVerifying}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 border-0 cursor-pointer text-xs"
                  disabled={isVerifying || otp.length !== 6}
                >
                  {isVerifying ? 'Verifying...' : 'Verify & Download'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Discount Banner */}
      {globalDiscount && globalDiscount.isActive && !discountLoading && (
        <div
          className="text-center py-2.5 mb-6 text-white text-sm font-bold animate-pulse rounded shadow-sm"
          style={{
            backgroundColor: globalDiscount.backgroundColor || '#ef4444',
            color: globalDiscount.textColor || '#ffffff'
          }}
        >
          ⚡ {globalDiscount.label} - Get {Math.round(parseFloat(globalDiscount.discountValue))}% OFF on All Project Kits! ⚡
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Box */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative overflow-hidden rounded-lg bg-white border border-gray-200 p-6 flex justify-center items-center shadow-sm">
            <img
              src={`${product.image}`}
              alt={product.title}
              loading="lazy"
              className="w-full h-80 sm:h-96 object-contain hover:scale-105 transition-transform duration-300"
            />

            {/* Discount Badge */}
            {discountInfo && discountInfo.percentage > 0 && !discountLoading && (
              <span
                className="absolute top-4 left-4 font-bold text-sm text-white px-3 py-1.5 rounded shadow-md"
                style={{
                  backgroundColor: discountInfo.backgroundColor || '#003e8b',
                  color: discountInfo.textColor || '#ffffff'
                }}
              >
                {`${discountInfo.percentage}% ${discountInfo.label}`}
              </span>
            )}

            {/* Loading state for discount */}
            {discountLoading && (
              <div className="absolute top-4 left-4 bg-gray-200 text-gray-500 px-3 py-1.5 rounded text-xs animate-pulse">
                Loading offer...
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Information & Order Action Block */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                {typeof product.subcategory === "object"
                  ? product.subcategory.name
                  : product.subcategory}
              </span>
              <span className="text-[10px] bg-gray-800 text-white px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                {product.difficulty || 'Beginner'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-3">
              {product.title}
            </h1>

            <div className="flex items-center gap-1.5 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-yellow-400 text-yellow-400"
                />
              ))}
              <span className="text-xs text-gray-500 font-bold ml-1">4.8 / 5 Rating</span>
            </div>

            <div
              className="text-gray-600 text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: product.description }}
            ></div>
          </div>

          {/* Pricing Box */}
          <div className="bg-gray-50 border border-gray-100 p-5 rounded-lg">
            <div className="flex items-baseline gap-3 mb-3">
              <span className="text-3xl font-extrabold text-[#003e8b]">
                ₹{product.price.toLocaleString()}
              </span>
              {discountInfo && (
                <>
                  <span className="text-base text-gray-400 line-through">
                    ₹{discountInfo.originalPrice.toLocaleString()}
                  </span>
                  <span
                    className="text-white text-xs font-bold px-2 py-0.5 rounded"
                    style={{
                      backgroundColor: discountInfo.backgroundColor || '#ef4444',
                      color: discountInfo.textColor || '#ffffff'
                    }}
                  >
                    Save ₹{(discountInfo.originalPrice - product.price).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            {/* Backend Discount Indicator */}
            {discountInfo && discountInfo.isBackendControlled && !discountLoading && (
              <div className="flex items-center gap-1.5 mb-3">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                </span>
                <span className="text-[11px] text-green-600 font-bold">
                  Live offer is active! - {discountInfo.percentage}% {discountInfo.label}
                </span>
              </div>
            )}

            <div className="space-y-1.5 text-xs text-gray-500 border-t border-gray-200 pt-3">
              <div className="flex justify-between">
                <span>Base Price:</span>
                <span>₹{product.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%):</span>
                <span>₹{gstAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-800 border-t border-gray-100 pt-1.5 text-sm">
                <span>Total Payable (incl. GST):</span>
                <span className="text-gray-900">₹{totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Action section */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="text-xs font-bold text-gray-700">Quantity:</label>
              <div className="flex items-center border border-gray-200 rounded overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors border-r border-gray-200 font-bold cursor-pointer"
                >
                  -
                </button>
                <span className="px-4 text-sm font-bold text-gray-700">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 transition-colors border-l border-gray-200 font-bold cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                size="lg"
                className="flex items-center justify-center gap-2 bg-[#003e8b] hover:bg-[#002e66] text-white font-bold py-3 px-8 text-sm flex-1 cursor-pointer border-0 shadow-sm transition-all"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-4 w-4" />
                Add to Cart
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="flex items-center justify-center gap-2 border-gray-200 text-gray-600 hover:text-[#003e8b] font-bold py-3 px-6 text-sm hover:bg-gray-50 cursor-pointer shadow-sm transition-all"
                onClick={() => {
                  if (navigator.share) {
                    navigator
                      .share({
                        title: product.title,
                        text: `Check out this project: ${product.title}`,
                        url: window.location.href,
                      })
                      .catch((err) => console.error("Share failed:", err));
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Link copied to clipboard!");
                  }
                }}
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>

            <button
              onClick={() => {
                if (user && isAuthenticated) {
                  const link = document.createElement("a");
                  link.href = product.abstract_file;
                  link.download = `${product.title}-abstract.pdf`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                } else {
                  setShowDownloadForm(true);
                }
              }}
              className="w-full bg-[#1c1c1c] text-white hover:bg-black font-bold py-2.5 rounded text-xs transition duration-300 shadow-sm cursor-pointer border-0 flex items-center justify-center gap-1.5"
            >
              📄 Download Abstract File (PDF)
            </button>
          </div>

          {/* Trust Flags */}
          <div className="grid grid-cols-3 gap-3 border-t border-gray-100 pt-6">
            <div className="text-center p-3 bg-gray-50 rounded border border-gray-100">
              <Truck className="h-5 w-5 text-[#003e8b] mx-auto mb-1.5" />
              <div className="text-[10px] font-bold text-gray-800">Free Shipping</div>
              <div className="text-[9px] text-gray-500">Above ₹2000</div>
            </div>

            <div className="text-center p-3 bg-gray-50 rounded border border-gray-100">
              <Shield className="h-5 w-5 text-green-600 mx-auto mb-1.5" />
              <div className="text-[10px] font-bold text-gray-800">100% Tested</div>
              <div className="text-[9px] text-gray-500">Quality Verified</div>
            </div>

            <div className="text-center p-3 bg-gray-50 rounded border border-gray-100">
              <FileText className="h-5 w-5 text-[#003e8b] mx-auto mb-1.5" />
              <div className="text-[10px] font-bold text-gray-800">Full Report</div>
              <div className="text-[9px] text-gray-500">Included on Buy</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs specs & components block */}
      <div className="mt-12">
        <Tabs defaultValue="components" className="w-full">
          <TabsList className="flex bg-gray-50 border border-gray-200 rounded-md p-1">
            <TabsTrigger
              value="components"
              className="flex-1 py-2 text-center text-xs font-bold text-gray-600 hover:text-[#003e8b] cursor-pointer rounded transition-all data-[state=active]:bg-white data-[state=active]:text-[#003e8b] data-[state=active]:shadow-sm"
            >
              Included Components
            </TabsTrigger>
            <TabsTrigger
              value="specifications"
              className="flex-1 py-2 text-center text-xs font-bold text-gray-600 hover:text-[#003e8b] cursor-pointer rounded transition-all data-[state=active]:bg-white data-[state=active]:text-[#003e8b] data-[state=active]:shadow-sm"
            >
              Technical Specifications
            </TabsTrigger>
            <TabsTrigger
              value="reviews"
              className="flex-1 py-2 text-center text-xs font-bold text-gray-600 hover:text-[#003e8b] cursor-pointer rounded transition-all data-[state=active]:bg-white data-[state=active]:text-[#003e8b] data-[state=active]:shadow-sm"
            >
              Reviews
            </TabsTrigger>
          </TabsList>

          <TabsContent value="components" className="mt-6">
            <Card className="bg-white shadow-sm border border-gray-200 rounded-md">
              <CardContent className="p-5">
                <h3 className="text-sm font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">
                  Package List of Components
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {(product.components || []).map((component, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2.5 bg-gray-50 border border-gray-100 rounded text-xs font-medium text-gray-700"
                    >
                      <div className="w-1.5 h-1.5 bg-[#003e8b] rounded-full shrink-0"></div>
                      <span className="truncate">{component}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specifications" className="mt-6">
            <Card className="bg-white shadow-sm border border-gray-200 rounded-md">
              <CardContent className="p-5">
                <h3 className="text-sm font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">
                  Specifications Summary
                </h3>
                <div className="border border-gray-100 rounded overflow-hidden">
                  {[
                    ["Subcategory", product.subcategory?.name || "N/A"],
                    ["Project Kit Name", product.title],
                    ["Category Price", `₹${product.price.toLocaleString()}`],
                    ["Complexity Difficulty", product.difficulty || 'Beginner'],
                    [
                      "Components Count",
                      `${(product.components || []).length} items included`,
                    ],
                    [
                      "Technical Details",
                      <div
                        key="details"
                        className="prose prose-xs text-xs"
                        dangerouslySetInnerHTML={{
                          __html: product.details || "Not provided",
                        }}
                      />,
                    ],
                    [
                      "Project Overview Description",
                      <div
                        key="desc"
                        className="prose prose-xs text-xs"
                        dangerouslySetInnerHTML={{
                          __html: product.description || "Not provided",
                        }}
                      />,
                    ],
                    ["Estimated Assembly Time", "2–4 hours"],
                  ].map(([label, value], i) => (
                    <div
                      key={i}
                      className="grid grid-cols-3 gap-4 p-3 border-b border-gray-100 last:border-b-0 even:bg-gray-50/50 text-xs"
                    >
                      <span className="font-bold text-gray-500 col-span-1">{label}</span>
                      <span className="text-gray-700 col-span-2 leading-relaxed">{value}</span>
                    </div>
                  ))}
                  {product.block_diagram && typeof product.block_diagram === "string" && (
                    <div className="p-4 bg-gray-50/20 border-t border-gray-100">
                      <h4 className="font-bold text-xs text-gray-700 mb-2">Block Diagram Preview</h4>
                      <img
                        src={`${product.block_diagram}`}
                        alt="Block Diagram"
                        className="max-h-60 rounded border border-gray-100 shadow-sm"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <Card className="bg-white shadow-sm border border-gray-200 rounded-md">
              <CardContent className="p-5">
                <h3 className="text-sm font-bold text-gray-800 mb-4 border-b border-gray-100 pb-2">
                  Customer Reviews
                </h3>
                {product.review ? (
                  <div className="space-y-4">
                    <div className="bg-gray-50 border border-gray-100 p-4 rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                        <span className="font-bold text-xs text-gray-700">Verified Buyer</span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed italic">"{product.review}"</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 text-center py-4">No reviews yet. Be the first to build and review this kit!</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
