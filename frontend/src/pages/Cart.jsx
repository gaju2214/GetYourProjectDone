import { useEffect, useState } from "react";
import api from "../api"; // adjust path based on file location
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Botton"; // Fixed typo: was "Botton"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Label } from "../components/ui/Label";
import { Separator } from "../components/ui/Separator";
import { Badge } from "../components/ui/Badge";
import {
  Trash2,
  Plus,
  Minus,
  CreditCard,
  Smartphone,
  Banknote,
  Wallet,
  MapPin,
  User,
  Mail,
  Phone,
  Package,
} from "lucide-react";
import { OrderButton } from "../components/OrderButton";

// import { useAuth } from "../context/AuthContext"; // ✅

export default function CartPage() {
  const navigate = useNavigate();
  // const { user, loading } = useUserAuth();
  // const userId = user?.userId;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState(null);

  const [cartItems, setCartItems] = useState([]);
  const [itemCount, setItemCount] = useState(0);
  const [total, setTotal] = useState(0);

  const [deliveryInfo, setDeliveryInfo] = useState({
    name: "",
    lastname: "",
    mobile: "",
    pincode: "",
    city: "",
    state: "",
    email: "",
    landmark: "",
    address: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("op");
  const [error, setError] = useState(null);

  // Extract userId safely
  const userId = user?.userId;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/api/auth/profile`, {
          withCredentials: true,
        });
        setProfile(res.data);
        setError(null);
        // console.log(res.data);
      } catch (err) {
        console.error("Profile fetch failed:", err);
        setError("You must be logged in to view your profile.");
        setProfile(null);
      }
    };
    fetchProfile();
  }, []);

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
    checkAuth();
  }, []);

  // Redirect to login if not authenticated after loading
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth/login", { replace: true });
    }
  }, [loading, user, navigate]);

  // Fetch cart only when userId is available
  useEffect(() => {
    if (!userId) return;

    const fetchCart = async () => {
      try {
        const res = await api.get(`/api/cart/${userId}`);
        setCartItems(res.data);
        setItemCount(res.data.reduce((sum, item) => sum + item.quantity, 0));
        setTotal(
          res.data.reduce(
            (sum, item) => sum + (item.price || 0) * item.quantity,
            0
          )
        );
      } catch (err) {
        console.error("Error fetching cart:", err);
        setError("Failed to load cart items");
      }
    };

    fetchCart();
  }, [userId]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated (redirect will happen)
  if (!user) return null;

  const updateQuantity = async (cartId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const res = await api.put(`/api/cart/update/${cartId}`, {
        quantity: newQuantity,
      });

      const updatedCart = cartItems.map((item) =>
        item.id === cartId ? { ...item, quantity: newQuantity } : item
      );

      setCartItems(updatedCart);

      // Update totals
      const newTotal = updatedCart.reduce(
        (sum, i) => sum + (i.price || 0) * i.quantity,
        0
      );
      const newItemCount = updatedCart.reduce(
        (sum, i) => sum + i.quantity,
        0
      );
      setTotal(newTotal);
      setItemCount(newItemCount);
    } catch (err) {
      console.error("Failed to update quantity:", err);
      setError("Failed to update item quantity");
    }
  };

  const removeItem = async (id) => {
    try {
      await api.delete(`/api/cart/${id}`);
      const updatedCart = cartItems.filter((item) => item.id !== id);
      setCartItems(updatedCart);

      // Recalculate totals after removal
      const newTotal = updatedCart.reduce(
        (sum, item) => sum + (item.price || 0) * item.quantity,
        0
      );
      const newItemCount = updatedCart.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      setTotal(newTotal);
      setItemCount(newItemCount);
    } catch (err) {
      console.error("Failed to remove item:", err);
      setError("Failed to remove item from cart");
    }
  };

  const gstAmount = Math.round(total * 0.18);
  const deliveryCharge = total > 2000 ? 0 : 99;
  const discount = Math.round(total * 0.05);
  const finalTotal = total + gstAmount + deliveryCharge - discount;

  const handlePincodeChange = (pincode) => {
    setDeliveryInfo((prev) => ({ ...prev, pincode }));

    if (pincode.length === 6) {
      const mockData = {
        110001: { city: "New Delhi", state: "Delhi" },
        400001: { city: "Mumbai", state: "Maharashtra" },
        560001: { city: "Bangalore", state: "Karnataka" },
        600001: { city: "Chennai", state: "Tamil Nadu" },
        700001: { city: "Kolkata", state: "West Bengal" },
      };

      const location = mockData[pincode] || {
        city: "Unknown",
        state: "Unknown",
      };
      setDeliveryInfo((prev) => ({
        ...prev,
        city: location.city,
        state: location.state,
      }));
    }
  };

  const handleCheckout = async () => {
    if (!paymentMethod) {
      setError("Please select a payment method");
      return;
    }

    if (!profile?.id) {
      setError("Profile information is required for checkout");
      return;
    }

    try {
      setError(null); // Clear any previous errors

      // Create an array to store all order promises
      const orderPromises = cartItems.map(async (item) => {
        const orderData = {
          orderId: `ORD-${Date.now()}-${item.id}`, // Make each order ID unique
          user_id: profile.id,
          mobile: profile.phoneNumber,
          customerName: `${profile.name} ${profile.lastname || ""}`,
          productId: item.projectId, // Use the current item's ID
          shippingAddress: profile.address,
          paymentMethod: paymentMethod,
          totalAmount: (item.price || 0) * item.quantity, // Individual item total
          quantity: item.quantity, // Individual item quantity
        };

        const response = await api.post("/api/orders", orderData);
        return response.data;
      });

      // Wait for all orders to complete
      const allResults = await Promise.all(orderPromises);
      console.log("All Orders Saved:", allResults);

      // Clear cart after successful orders
      setCartItems([]);
      setItemCount(0);
      setTotal(0);

      alert(`Successfully placed ${allResults.length} orders!`);
      // navigate("/success");
    } catch (error) {
      console.error("Error placing orders:", error);
      setError("Failed to place some orders. Please try again.");
    }
  };

  // Show error message if exists
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
          <div className="text-red-500 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trash2 className="h-12 w-12 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Your Cart is Empty
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Add some amazing project kits to get started!
          </p>
          <Button
            size="lg"
            onClick={() => navigate("/")}
            className="text-lg px-20 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Page Title Header */}
        <div className="mb-8 flex flex-col">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-1">
            Shopping Cart
          </h1>
          <div className="h-1 w-12 bg-[#003e8b] mb-3 rounded"></div>
          <p className="text-gray-500 text-sm">
            Review your items and complete your order
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="shadow-sm border border-gray-200 bg-white w-full rounded-lg overflow-hidden">
              <CardHeader className="bg-[#1c1c1c] text-white p-4">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Package className="h-5 w-5 text-[#003e8b]" />
                  Order Items ({itemCount})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {cartItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={`p-5 ${index !== cartItems.length - 1 ? "border-b border-gray-100" : ""
                      }`}
                  >
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                      {/* Item Thumbnail */}
                      <div className="relative shrink-0 flex justify-center items-center">
                        <img
                          src={item.image || '/placeholder-image.jpg'}
                          alt={item.title || 'Product'}
                          loading="lazy"
                          className="w-24 h-24 sm:w-28 sm:h-28 object-contain rounded border border-gray-100 bg-gray-50"
                          onError={(e) => {
                            e.target.src = '/placeholder-image.jpg';
                          }}
                        />

                        <span className="absolute -top-1.5 -right-1.5 bg-gray-800 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm border border-white">
                          {item.difficulty || 'Beginner'}
                        </span>
                      </div>

                      {/* Item details */}
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="font-bold text-base text-gray-800 hover:text-[#003e8b] transition-colors leading-snug">
                            {item.title || 'Untitled Product'}
                          </h3>
                          <div
                            className="text-gray-500 text-xs mt-1 leading-relaxed line-clamp-2"
                            dangerouslySetInnerHTML={{
                              __html:
                                item.description?.length > 120
                                  ? item.description.slice(0, 120) + "..."
                                  : item.description || 'No description available',
                            }}
                          ></div>
                          <div className="flex gap-1.5 mt-2.5">
                            <span className="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-semibold">
                              {typeof item.category === "object"
                                ? item.category?.name || 'Category'
                                : item.category || 'Category'}
                            </span>
                            <span className="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-semibold">
                              {typeof item.subcategory === "object"
                                ? item.subcategory?.name || 'Subcategory'
                                : item.subcategory || 'Subcategory'}
                            </span>
                          </div>
                        </div>

                        {/* Quantity controls and price tag */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-gray-50 pt-3">
                          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded overflow-hidden max-w-fit">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="h-8 w-8 p-0 rounded-none bg-gray-50 hover:bg-gray-100 border-r border-gray-200 text-gray-600 cursor-pointer"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="px-3 text-xs font-bold text-gray-800 min-w-[30px] text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="h-8 w-8 p-0 rounded-none bg-gray-50 hover:bg-gray-100 border-l border-gray-200 text-gray-600 cursor-pointer"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                            <div className="text-right">
                              <div className="text-base font-extrabold text-[#003e8b]">
                                ₹{((item.price || 0) * item.quantity).toLocaleString()}
                              </div>
                              <div className="text-[10px] text-gray-400">
                                ₹{(item.price || 0).toLocaleString()} each
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-full cursor-pointer transition-colors"
                            >
                              <Trash2 className="h-4.5 w-4.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Checkout block */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Method Selector */}
            <Card className="shadow-sm border border-gray-200 bg-white rounded-lg overflow-hidden">
              <CardHeader className="bg-[#1c1c1c] text-white p-4">
                <CardTitle className="text-sm font-bold">Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2.5">
                  {[
                    {
                      id: "op",
                      icon: Smartphone,
                      label: "Online Payment",
                      color: "text-[#003e8b]",
                    },
                    {
                      id: "cod",
                      icon: Banknote,
                      label: "Cash on Delivery (COD)",
                      color: "text-gray-500",
                    },
                  ].map((method) => (
                    <div
                      key={method.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-between ${paymentMethod === method.id
                        ? "border-[#003e8b] bg-blue-50/50 shadow-sm"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                      onClick={() => setPaymentMethod(method.id)}
                    >
                      <div className="flex items-center gap-2.5">
                        <method.icon className={`h-5 w-5 ${method.color}`} />
                        <span className="text-xs font-bold text-gray-700">
                          {method.label}
                        </span>
                      </div>
                      <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${paymentMethod === method.id ? "border-[#003e8b]" : "border-gray-300"
                        }`}>
                        {paymentMethod === method.id && (
                          <div className="w-1.5 h-1.5 bg-[#003e8b] rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Summary Checkout details */}
            <Card className="shadow-sm border border-gray-200 bg-white rounded-lg overflow-hidden">
              <CardHeader className="bg-[#1c1c1c] text-white p-4">
                <CardTitle className="text-sm font-bold">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="space-y-2.5 text-xs text-gray-500">
                  <div className="flex justify-between">
                    <span>Subtotal ({itemCount} items)</span>
                    <span className="font-semibold text-gray-800">
                      ₹{total.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between text-green-600">
                    <span>Discount (5%)</span>
                    <span className="font-semibold">
                      -₹{discount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>GST (18%)</span>
                    <span className="font-semibold text-gray-800">
                      ₹{gstAmount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Delivery Charges</span>
                    <span
                      className={`font-semibold ${deliveryCharge === 0 ? "text-green-600" : "text-gray-800"
                        }`}
                    >
                      {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
                    </span>
                  </div>

                  <Separator className="my-3" />

                  <div className="flex justify-between text-sm font-bold text-gray-800 pt-1">
                    <span>Total Amount</span>
                    <span className="text-[#003e8b] text-base font-extrabold">
                      ₹{finalTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-2 flex justify-center w-full">
                  <OrderButton
                    onOrderComplete={handleCheckout}
                    finalTotal={finalTotal}
                    disabled={!paymentMethod || !profile?.id}
                    paymentMethod={paymentMethod}
                    cartItems={cartItems}
                    total={total}
                    setError={setError}
                    setProfile={setProfile}
                    profile={profile}
                  />
                </div>

                <div className="text-center text-[10px] text-gray-400 mt-2">
                  <p>🔒 Your payment details are encrypted and secure.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}