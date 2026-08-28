import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ChevronRight, MapPin, Phone, Mail, User, CreditCard, ShoppingBag } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import BillingFormPopup from "../components/UserDetails";
import { OrderButton } from "../components/OrderButton";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();

  // --- Buy Now vs Cart State ---
  const buyNowProduct = location.state?.buyNowProduct || null;
  const buyNowQty = location.state?.quantity || 1;

  // --- States ---
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(""); // "op" or "cod"
  const [isAddressPopupOpen, setIsAddressPopupOpen] = useState(false);

  // --- Calculate Totals ---
  const subtotal = checkoutItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );
  const discount = Math.floor(subtotal * 0.05); // 5% discount
  const gst = Math.floor((subtotal - discount) * 0.18); // 18% GST
  const deliveryCharge = subtotal > 3000 ? 0 : 99; // Free over ₹3000
  const finalTotal = subtotal - discount + gst + deliveryCharge;

  // Load profile and checkout items
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        // 1. Fetch user profile
        const profRes = await api.get("/api/auth/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setProfile(profRes.data);

        // 2. Set checkout items
        if (buyNowProduct) {
          setCheckoutItems([
            {
              id: buyNowProduct.id,
              projectId: buyNowProduct.id,
              title: buyNowProduct.title,
              image: buyNowProduct.image,
              price: buyNowProduct.price,
              quantity: buyNowQty,
            },
          ]);
        } else {
          // Fetch from database cart
          const cartRes = await api.get(`/api/cart/${user.id || user.user_id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          const dbCartItems = cartRes.data.map((item) => ({
            id: item.projectId,
            projectId: item.projectId,
            title: item.Project?.title || "Product Kit",
            image: item.Project?.image,
            price: item.Project?.price || item.price,
            quantity: item.quantity,
          }));
          setCheckoutItems(dbCartItems);
          
          if (dbCartItems.length === 0) {
            setError("Your cart is empty. Please add items to proceed.");
          }
        }
      } catch (err) {
        console.error("Error loading checkout data:", err);
        setError("Failed to load checkout details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isLoggedIn, buyNowProduct, buyNowQty]);

  // Callback when order is placed successfully
  const handleOrderComplete = (orderResponse) => {
    const orderId = orderResponse?.orderId || orderResponse?.order?.orderId || "Order Placed";
    navigate("/order-success", {
      state: {
        orderId,
        total: finalTotal,
        paymentMethod: paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment",
      },
    });
  };

  const handleProfileConfirm = (updatedProfile) => {
    setProfile(updatedProfile);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 animate-pulse space-y-6">
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  const isAddressComplete =
    profile?.address && profile?.city && profile?.pincode && profile?.state;

  return (
    <div className="bg-gray-50 min-h-screen pt-4 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-gray-500 mb-6 bg-white py-3 px-4 rounded-md shadow-sm border border-gray-100">
          <Link to="/" className="hover:text-[#003e8b] transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-gray-800 font-medium">Secure Checkout</span>
        </nav>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg text-xs mb-6 border border-red-100 max-w-md mx-auto text-center">
            <p className="font-bold mb-3">{error}</p>
            <Link
              to="/categories"
              className="inline-block bg-[#003e8b] hover:bg-[#002e66] text-white text-xs font-bold px-4 py-2 rounded shadow transition-all border-0"
            >
              Browse Catalog
            </Link>
          </div>
        )}

        {!error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Columns: Forms */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Customer Details Block */}
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-bold text-sm text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-50 pb-2">
                  <User className="h-4 w-4 text-[#003e8b]" />
                  Customer Details
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="flex items-center gap-2.5 p-3 bg-gray-50 rounded border border-gray-100">
                    <User className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Name</p>
                      <p className="font-semibold text-gray-700">
                        {profile?.name} {profile?.lastname}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5 p-3 bg-gray-50 rounded border border-gray-100">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Contact</p>
                      <p className="font-semibold text-gray-700">+91 {profile?.phoneNumber}</p>
                    </div>
                  </div>
                  {profile?.email && (
                    <div className="sm:col-span-2 flex items-center gap-2.5 p-3 bg-gray-50 rounded border border-gray-100">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Email Address</p>
                        <p className="font-semibold text-gray-700">{profile.email}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Address Block */}
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                <div className="flex items-center justify-between border-b border-gray-50 pb-2 mb-4">
                  <h3 className="font-bold text-sm text-gray-800 flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#003e8b]" />
                    Shipping Address
                  </h3>
                  <button
                    onClick={() => setIsAddressPopupOpen(true)}
                    className="text-xs text-[#003e8b] hover:underline bg-transparent border-0 cursor-pointer font-bold"
                  >
                    {isAddressComplete ? "Edit Address" : "Add Address"}
                  </button>
                </div>

                {isAddressComplete ? (
                  <div className="text-xs text-gray-600 bg-gray-50 p-4 rounded border border-gray-100 leading-relaxed">
                    <p className="font-bold text-gray-800 mb-1">Deliver To:</p>
                    <p>{profile.address}</p>
                    <p>
                      {profile.city}, {profile.state} - <strong>{profile.pincode}</strong>
                    </p>
                    <p>{profile.country}</p>
                  </div>
                ) : (
                  <div className="border border-dashed border-red-200 bg-red-50/50 rounded-lg p-5 text-center flex flex-col items-center">
                    <MapPin className="h-8 w-8 text-red-400 mb-2" />
                    <p className="text-xs text-red-600 font-bold mb-2">No Shipping Address Found</p>
                    <p className="text-[10px] text-gray-400 mb-4 max-w-xs leading-relaxed">
                      A complete shipping address is mandatory for dispatching physical kits.
                    </p>
                    <button
                      onClick={() => setIsAddressPopupOpen(true)}
                      className="bg-[#003e8b] hover:bg-[#002e66] text-white text-xs font-bold px-4 py-2 rounded shadow cursor-pointer border-0"
                    >
                      Enter Shipping Address
                    </button>
                  </div>
                )}
              </div>

              {/* Payment Method Selector */}
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-bold text-sm text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-50 pb-2">
                  <CreditCard className="h-4 w-4 text-[#003e8b]" />
                  Select Payment Method
                </h3>
                <div className="space-y-3">
                  <label
                    className={`flex items-center gap-3 p-3.5 rounded border-2 transition cursor-pointer ${
                      paymentMethod === "op"
                        ? "border-[#003e8b] bg-[#003e8b]/5"
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="op"
                      checked={paymentMethod === "op"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-[#003e8b] focus:ring-[#003e8b] h-4 w-4 cursor-pointer"
                    />
                    <div className="text-xs">
                      <p className="font-bold text-gray-800">Online Payment</p>
                      <p className="text-gray-400 text-[10px] mt-0.5">
                        Pay securely using Credit/Debit Card, UPI, NetBanking, or Wallet (via Razorpay).
                      </p>
                    </div>
                  </label>

                  <label
                    className={`flex items-center gap-3 p-3.5 rounded border-2 transition cursor-pointer ${
                      paymentMethod === "cod"
                        ? "border-[#003e8b] bg-[#003e8b]/5"
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="text-[#003e8b] focus:ring-[#003e8b] h-4 w-4 cursor-pointer"
                    />
                    <div className="text-xs">
                      <p className="font-bold text-gray-800">Cash on Delivery (COD)</p>
                      <p className="text-gray-400 text-[10px] mt-0.5">
                        Pay cash at your doorstep upon delivery. Additional verification may apply.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

            </div>

            {/* Right Column: Order Summary */}
            <div className="space-y-6">
              
              {/* Summary Items list */}
              <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100">
                <h3 className="font-bold text-sm text-gray-800 mb-4 flex items-center gap-2 border-b border-gray-50 pb-2">
                  <ShoppingBag className="h-4 w-4 text-[#003e8b]" />
                  Order Summary
                </h3>
                
                {/* Product List */}
                <div className="space-y-3.5 max-h-60 overflow-y-auto mb-5 border-b border-gray-50 pb-4">
                  {checkoutItems.map((item) => (
                    <div key={item.id} className="flex gap-3 text-xs">
                      <div className="h-12 w-12 bg-gray-50 border rounded flex items-center justify-center p-1 overflow-hidden shrink-0">
                        <img
                          src={item.image || "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500"}
                          alt={item.title}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-700 truncate">{item.title}</p>
                        <p className="text-gray-400 text-[10px] mt-0.5">
                          Qty: {item.quantity} × ₹{item.price?.toLocaleString()}
                        </p>
                      </div>
                      <span className="font-bold text-gray-800 shrink-0">
                        ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Calculations */}
                <div className="space-y-2 text-xs text-gray-600 mb-5 border-b border-gray-50 pb-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount (5%)</span>
                    <span>- ₹{discount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18%)</span>
                    <span className="font-semibold">₹{gst.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Charges</span>
                    <span className="font-semibold">
                      {deliveryCharge === 0 ? (
                        <span className="text-green-600 font-bold uppercase">Free</span>
                      ) : (
                        `₹${deliveryCharge}`
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between text-sm font-bold text-gray-800 mb-6">
                  <span>Total Payable</span>
                  <span className="text-base text-[#003e8b]">₹{finalTotal.toLocaleString()}</span>
                </div>

                {/* Custom Native Order Button */}
                <div className="w-full">
                  <OrderButton
                    onOrderComplete={handleOrderComplete}
                    finalTotal={finalTotal}
                    disabled={!paymentMethod || !isAddressComplete || !profile?.id}
                    paymentMethod={paymentMethod}
                    cartItems={checkoutItems}
                    total={subtotal}
                    setError={setError}
                    setProfile={setProfile}
                    profile={profile}
                  />
                  
                  {(!paymentMethod || !isAddressComplete) && (
                    <p className="text-[10px] text-red-500 font-medium text-center mt-2.5 leading-relaxed">
                      {!isAddressComplete
                        ? "* Please enter a valid delivery address to place your order."
                        : "* Please choose a payment method to complete checkout."}
                    </p>
                  )}
                </div>

              </div>

            </div>
          </div>
        )}

      </div>

      {/* Address Form Popup */}
      {profile && (
        <BillingFormPopup
          isPopupOpen={isAddressPopupOpen}
          setIsPopupOpen={setIsAddressPopupOpen}
          profile={profile}
          onConfirm={handleProfileConfirm}
        />
      )}
    </div>
  );
}
