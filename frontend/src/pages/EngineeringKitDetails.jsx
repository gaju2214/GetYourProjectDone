import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronRight, Star, ShoppingCart, Zap, Check, X, Box, Settings, Cpu, Layers } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import api from "../api";
import KitCard from "../components/KitCard";

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

export default function EngineeringKitDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn, login } = useAuth();
  const { dispatch } = useCart();

  // --- States ---
  const [product, setProduct] = useState(null);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  // --- Card Action States ---
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

  // Fetch product detail and similar products
  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(`/api/projects/${id}`);
        const prodData = response.data;
        setProduct(prodData);
        setQuantity(1);

        // Fetch similar products in the same subcategory
        if (prodData.subcategoryId) {
          const simResponse = await api.get(`/api/projects/by-subcategory/${prodData.subcategoryId}`);
          // Filter out current product and keep up to 4
          const filteredSim = simResponse.data
            .filter((item) => Number(item.id) !== Number(prodData.id))
            .slice(0, 4);
          setSimilarProducts(filteredSim);
        }
      } catch (err) {
        console.error("Error loading engineering kit details:", err);
        setError("Product not found or failed to load detail data.");
      } finally {
        setLoading(false);
      }
    };
    loadDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 animate-pulse space-y-8">
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-200 rounded"></div>
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-12 bg-gray-200 rounded w-1/3"></div>
            <div className="h-20 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="bg-red-50 text-red-700 p-6 rounded-lg max-w-md mx-auto border border-red-100">
          <h3 className="font-bold mb-2">Error Loading Kit Details</h3>
          <p className="text-xs mb-4">{error || "The product requested does not exist."}</p>
          <Link
            to="/engineering-kit"
            className="inline-block bg-[#003e8b] hover:bg-[#002e66] text-white text-xs font-bold px-4 py-2 rounded shadow transition-all"
          >
            Back to Engineering Kits
          </Link>
        </div>
      </div>
    );
  }

  // Parses PostgreSQL string arrays
  const components = Array.isArray(product.components)
    ? product.components
    : parsePostgresArray(product.components);

  // Generate stable mock values for visual premium feel
  const displayRating = product.rating || (4.2 + (Number(product.id || 0) % 8) * 0.1).toFixed(1);
  const reviewsCount = 10 + (Number(product.id || 0) * 7) % 150;
  const originalPrice = Math.floor(product.price * 1.3);

  const triggerAddToCart = async (userId) => {
    setIsAdding(true);
    try {
      const cartItem = {
        userId: userId || user?.id || user?.user_id,
        projectId: product.id,
        quantity: quantity,
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
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("❌ Failed to add item to cart.");
    } finally {
      setIsAdding(false);
    }
  };

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      setPendingAction("cart");
      setShowOtpModal(true);
      return;
    }
    triggerAddToCart();
  };

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      setPendingAction("buyNow");
      setShowOtpModal(true);
      return;
    }
    navigate("/checkout", { state: { buyNowProduct: product, quantity } });
  };

  // OTP Login Handlers
  const handleSendOtp = async () => {
    if (!name.trim() || phoneNumber.length !== 10) return;
    setAuthLoading(true);
    try {
      await api.post("/api/auth/send-otp", { phoneNumber, name });
      setOtpSent(true);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to send OTP. Try again.");
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
        login(response.data.user, response.data.token);
        setShowOtpModal(false);
        setOtpSent(false);
        setName("");
        setPhoneNumber("");
        setOtp("");

        if (pendingAction === "cart") {
          triggerAddToCart(response.data.user.id);
        } else if (pendingAction === "buyNow") {
          navigate("/checkout", { state: { buyNowProduct: product, quantity } });
        }
      } else {
        alert("❌ Invalid OTP.");
      }
    } catch (err) {
      console.error(err);
      alert("❌ Verification failed.");
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-4 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-gray-500 mb-6 bg-white py-3 px-4 rounded-md shadow-sm border border-gray-100">
          <Link to="/" className="hover:text-[#003e8b] transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link to="/engineering-kit" className="hover:text-[#003e8b] transition-colors">Engineering Kits</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-gray-800 font-medium truncate">{product.title}</span>
        </nav>

        {/* Product Details Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden p-6 md:p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

            {/* Left Column: Product Image Gallery */}
            <div className="flex flex-col items-center">
              <div className="w-full aspect-video md:aspect-square bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center p-6 mb-4 overflow-hidden">
                <img
                  src={product.image || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500"}
                  alt={product.title}
                  className="max-h-[350px] max-w-full object-contain hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>

            {/* Right Column: Title, Ratings, Pricing, Actions */}
            <div className="flex flex-col justify-between">
              <div>
                {/* Badges */}
                <div className="flex items-center gap-2.5 mb-3">
                  <span className="bg-[#003e8b]/10 text-[#003e8b] text-[10px] uppercase font-bold px-2.5 py-1 rounded">
                    Engineering Kit
                  </span>
                  <span className="bg-gray-100 text-gray-800 text-[10px] uppercase font-bold px-2.5 py-1 rounded">
                    {product.difficulty || "Intermediate"}
                  </span>
                </div>

                <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-snug mb-3">
                  {product.title}
                </h1>

                {/* Rating & Reviews */}
                <div className="flex items-center gap-1.5 mb-4 border-b border-gray-100 pb-4">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-bold text-gray-800">{displayRating}</span>
                  <span className="text-xs text-gray-400">({reviewsCount} customer reviews)</span>
                </div>

                {/* Description snippet */}
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed mb-5">
                  {product.description}
                </p>

                {/* Price Display */}
                <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-100">
                  <div className="flex items-baseline gap-2.5 mb-1">
                    <span className="text-2xl font-bold text-[#003e8b]">
                      ₹{product.price?.toLocaleString()}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      ₹{originalPrice.toLocaleString()}
                    </span>
                    <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded">
                      30% OFF
                    </span>
                  </div>
                  <span className="text-[10px] text-gray-400">Inclusive of all local taxes</span>
                </div>
              </div>

              {/* Quantity and Checkout Actions */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 font-bold">Quantity:</span>
                  <div className="flex items-center border border-gray-200 rounded bg-white">
                    <button
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="px-2.5 py-1 text-gray-500 hover:bg-gray-50 border-0 bg-transparent font-bold cursor-pointer"
                    >
                      -
                    </button>
                    <span className="px-3.5 py-1 text-xs font-bold text-gray-700 min-w-[20px] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity((q) => q + 1)}
                      className="px-2.5 py-1 text-gray-500 hover:bg-gray-50 border-0 bg-transparent font-bold cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <button
                    onClick={handleAddToCart}
                    disabled={isAdding}
                    className={`flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold rounded shadow-sm border border-[#003e8b] cursor-pointer transition duration-300 ${isAdded
                        ? "bg-green-600 border-green-600 text-white"
                        : "bg-white text-[#003e8b] hover:bg-gray-50"
                      }`}
                  >
                    {isAdding ? (
                      <div className="w-3.5 h-3.5 border-2 border-[#003e8b] border-t-transparent rounded-full animate-spin"></div>
                    ) : isAdded ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Added to Cart</span>
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-4 w-4" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="flex items-center justify-center gap-2 py-3 px-4 text-xs font-bold rounded shadow bg-[#fb7b02] hover:bg-[#e06c00] text-white border-0 cursor-pointer transition duration-300"
                  >
                    <Zap className="h-4 w-4 fill-white text-white" />
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Tab content specifications */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden mb-12">
          {/* Tabs bar */}
          <div className="flex border-b border-gray-100 bg-gray-50/50">
            {[
              { id: "description", label: "Description", icon: Box },
              { id: "specs", label: "Specifications", icon: Settings },
              { id: "components", label: "Kit Components", icon: Cpu },
              { id: "features", label: "Features", icon: Layers },
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-5 py-3.5 text-xs font-bold cursor-pointer border-0 bg-transparent transition-all border-b-2 ${isActive
                      ? "border-[#003e8b] text-[#003e8b] bg-white"
                      : "border-transparent text-gray-500 hover:text-gray-800"
                    }`}
                >
                  <TabIcon className="h-3.5 w-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab contents */}
          <div className="p-6 md:p-8">
            {activeTab === "description" && (
              <div className="space-y-4">
                <h3 className="font-bold text-gray-800 text-sm">Product Overview</h3>
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                  {product.description}
                </p>
                <p className="text-gray-600 text-xs md:text-sm leading-relaxed">
                  Each kit is built from industrial-grade electronics to assure robust operations under high-stress builds. Included are detailed blueprints, layout guidelines, and links to full source code repositories so you can configure and build from scratch.
                </p>
              </div>
            )}

            {activeTab === "specs" && (
              <div className="max-w-xl">
                <table className="w-full text-xs text-gray-600">
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="py-2.5 font-bold text-gray-700 w-1/3">Target Difficulty</td>
                      <td className="py-2.5">{product.difficulty || "Intermediate"}</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2.5 font-bold text-gray-700">Estimated Assembly Time</td>
                      <td className="py-2.5">4 to 6 Hours</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2.5 font-bold text-gray-700">Power Supply Requirements</td>
                      <td className="py-2.5">5V DC / 12V DC (Included)</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2.5 font-bold text-gray-700">Programming Language</td>
                      <td className="py-2.5">C++ / Python / G-Code (based on subcategory)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "components" && (
              <div className="space-y-4">
                <h3 className="font-bold text-gray-800 text-sm">Items Included in this Box</h3>
                {components.length > 0 ? (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-600">
                    {components.map((comp, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 bg-[#003e8b] rounded-full"></span>
                        <span>{comp}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 text-xs">No components listed for this product.</p>
                )}
              </div>
            )}

            {activeTab === "features" && (
              <div className="space-y-4">
                <h3 className="font-bold text-gray-800 text-sm">Key Features</h3>
                <ul className="space-y-2 text-xs text-gray-600">
                  <li className="flex items-start gap-2 leading-relaxed">
                    <span className="text-[#003e8b] font-bold">✔</span>
                    <span><strong>Full Circuit Diagrams:</strong> Complete layout schematics to aid wiring and debugging.</span>
                  </li>
                  <li className="flex items-start gap-2 leading-relaxed">
                    <span className="text-[#003e8b] font-bold">✔</span>
                    <span><strong>Pre-flashed Code:</strong> Microcontrollers come loaded with tests to check wiring immediately.</span>
                  </li>
                  <li className="flex items-start gap-2 leading-relaxed">
                    <span className="text-[#003e8b] font-bold">✔</span>
                    <span><strong>Comprehensive Manuals:</strong> Step-by-step guides for assembly, coding, and customization.</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Similar Products Section */}
        {similarProducts.length > 0 && (
          <div>
            <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-6">Similar Engineering Kits</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {similarProducts.map((simProd) => (
                <KitCard key={simProd.id} product={simProd} categorySlug="engineering-kit" />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Login OTP Modal */}
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
                className="text-gray-400 hover:text-gray-600 transition p-1 hover:bg-gray-50 rounded-full cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-gray-500 text-center text-xs">
                Please verify your details to continue with this checkout.
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
    </div>
  );
}
