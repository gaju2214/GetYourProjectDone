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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Shopping Cart
          </h1>
          <p className="text-gray-600 text-lg">
            Review your items and complete your order
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8">
          <div className="xl:col-span-3 space-y-6">
            <Card className="shadow-lg border-0 w-full">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Package className="h-6 w-6" />
                  Order Items ({itemCount})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {cartItems.map((item, index) => (
                  <div
                    key={item.id}
                    className={`p-6 ${
                      index !== cartItems.length - 1 ? "border-b" : ""
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                      <div className="relative">
                        <img
                          src={item.image || '/placeholder-image.jpg'} // Add fallback image
                          alt={item.title || 'Product'}
                          loading="lazy"
                          className="w-full sm:w-[120px] sm:h-[120px] object-cover rounded-xl shadow-md"
                          onError={(e) => {
                            e.target.src = '/placeholder-image.jpg'; // Fallback on error
                          }}
                        />

                        <Badge className="absolute -top-2 -right-2 bg-blue-600">
                          {item.difficulty || 'N/A'}
                        </Badge>
                      </div>

                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="font-bold text-xl text-gray-900 mb-2">
                            {item.title || 'Untitled Product'}
                          </h3>
                          <div
                            className="text-gray-600 leading-relaxed"
                            dangerouslySetInnerHTML={{
                              __html:
                                item.description?.length > 120
                                  ? item.description.slice(0, 120) + "..."
                                  : item.description || 'No description available',
                            }}
                          ></div>
                          <div className="flex gap-2 mt-3">
                            <Badge variant="outline">
                              {typeof item.category === "object"
                                ? item.category?.name || 'Category'
                                : item.category || 'Category'}
                            </Badge>
                            <Badge variant="outline">
                              {typeof item.subcategory === "object"
                                ? item.subcategory?.name || 'Subcategory'
                                : item.subcategory || 'Subcategory'}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="h-8 w-8 p-0"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="px-4 py-2 bg-gray-100 rounded-lg font-semibold min-w-[60px] text-center">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-600">
                                ₹{((item.price || 0) * item.quantity).toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-500">
                                ₹{(item.price || 0).toLocaleString()} each
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-5 w-5" />
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

          <div className="xl:col-span-2 space-y-6">
            {/* Payment Method */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
                <CardTitle className="text-xl">Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {[
                    {
                      id: "op",
                      icon: Smartphone,
                      label: "Online Payment",
                      color: "text-blue-600",
                    },
                    {
                      id: "cod",
                      icon: Banknote,
                      label: "Cash on Delivery",
                      color: "text-gray-600",
                    },
                  ].map((method) => (
                    <div
                      key={method.id}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                        paymentMethod === method.id
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setPaymentMethod(method.id)}
                    >
                      <div className="flex items-center gap-3">
                        <method.icon className={`h-6 w-6 ${method.color}`} />
                        <span className="font-semibold text-gray-900">
                          {method.label}
                        </span>
                        {paymentMethod === method.id && (
                          <div className="ml-auto w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-t-lg">
                <CardTitle className="text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-lg">
                    <span>Subtotal ({itemCount} items)</span>
                    <span className="font-semibold">
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
                    <span className="font-semibold">
                      ₹{gstAmount.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Delivery Charges</span>
                    <span
                      className={`font-semibold ${
                        deliveryCharge === 0 ? "text-green-600" : ""
                      }`}
                    >
                      {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
                    </span>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex justify-between text-xl font-bold">
                    <span>Total Amount</span>
                    <span className="text-green-600">
                      ₹{finalTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex justify-center">
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

                <div className="text-center text-sm text-gray-500 mt-4">
                  <p>🔒 Your payment information is secure and encrypted</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}