import { useEffect, useState } from "react";

import api from "../api"; // adjust path based on file location

import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Botton";
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
        console.log(res.data);
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

    api
      .get(`/api/cart/${userId}`)
      .then((res) => {
        setCartItems(res.data);
        setItemCount(res.data.reduce((sum, item) => sum + item.quantity, 0));
        setTotal(
          res.data.reduce(
            (sum, item) => sum + (item.price || 0) * item.quantity,
            0
          )
        );
      })
      .catch((err) => console.error("Error fetching cart:", err));
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (!user) return null; // or fallback UI

  const updateQuantity = (cartId, newQuantity) => {
    if (newQuantity < 1) return;

    api
      .put(`/api/cart/update/${cartId}`, {
        quantity: newQuantity,
      })
      .then((res) => {
        const updatedCart = cartItems.map((item) =>
          item.id === cartId ? { ...item, quantity: newQuantity } : item
        );

        setCartItems(updatedCart);

        // Optional: update totals
        const newTotal = updatedCart.reduce(
          (sum, i) => sum + i.price * i.quantity,
          0
        );
        const newItemCount = updatedCart.reduce(
          (sum, i) => sum + i.quantity,
          0
        );
        setTotal(newTotal);
        setItemCount(newItemCount);
      })
      .catch((err) => {
        console.error("Failed to update quantity:", err);
      });
  };

  const removeItem = (id) => {
    api
      .delete(`/api/cart/${id}`)
      .then(() => {
        setCartItems((prev) => prev.filter((item) => item.id !== id));
      })
      .catch((err) => console.error("Failed to remove item:", err));
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
      alert("Please select a payment method");
      return;
    }

    try {
      // Create an array to store all order promises
      const orderPromises = cartItems.map(async (item) => {
        const orderData = {
          orderId: `ORD-${Date.now()}-${item.id}`, // Make each order ID unique
          user_id: profile?.id,
          mobile: profile?.phoneNumber,
          customerName: `${profile?.name} ${profile?.lastname || ""}`,
          productId: item.id, // Use the current item's ID
          shippingAddress: profile?.address,
          paymentMethod: paymentMethod,
          totalAmount: item.price * item.quantity, // Individual item total
          quantity: item.quantity, // Individual item quantity
        };

        const response = await fetch("http://localhost:5000/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });

        const result = await response.json();
        return result;
      });

      // Wait for all orders to complete
      const allResults = await Promise.all(orderPromises);
      console.log("All Orders Saved:", allResults);

      // Clear cart after successful orders
      setCartItems([]);
      setItemCount(0);
      setTotal(0);

      alert(`Successfully placed ${cartItems.length} orders!`);
      // navigate("/success");
    } catch (error) {
      console.error("Error placing orders:", error);
      alert("Failed to place some orders. Please try again.");
    }
  };

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
                          src={item.image}
                          alt={item.title}
                          className="w-full sm:w-[120px] sm:h-[120px] object-cover rounded-xl shadow-md"
                        />

                        <Badge className="absolute -top-2 -right-2 bg-blue-600">
                          {item.difficulty}
                        </Badge>
                      </div>

                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="font-bold text-xl text-gray-900 mb-2">
                            {item.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {item.description}
                          </p>
                          <div className="flex gap-2 mt-3">
                            <Badge variant="outline">
                              {typeof item.category === "object"
                                ? item.category?.name
                                : item.category}
                            </Badge>
                            <Badge variant="outline">
                              {typeof item.subcategory === "object"
                                ? item.subcategory?.name
                                : item.subcategory}
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
                              className="h-6 w-6 p-0 ml-2"
                            >
                              <Minus className="h-4 w-4 m-1" />
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
                              className="h-6 w-6 p-0 ml-2"
                            >
                              <Plus className="h-4 w-4 m-1" />
                            </Button>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-600">
                                ₹{(item.price * item.quantity).toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-500">
                                ₹{item.price?.toLocaleString()} each
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
            {/* special */}
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
                    disabled={!paymentMethod}
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
