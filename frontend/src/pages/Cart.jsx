import { useEffect, useState } from "react";
import axios from "axios";
import api from '../api'; // adjust path based on file location

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

import { useAuth } from "../context/AuthContext"; // ✅

export default function CartPage() {
  // const { user } = useAuth(); // ✅
  const userId = 1//user?.id; // ✅

  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [itemCount, setItemCount] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {


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

  const [deliveryInfo, setDeliveryInfo] = useState({
    name: "",
    mobile: "",
    pincode: "",
    city: "",
    state: "",
    email: "",
    landmark: "",
    address: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("");
  const updateQuantity = (cartId, newQuantity) => {
    if (newQuantity < 1) return;

    api.put(`/api/cart/update/${cartId}`, {
      quantity: newQuantity
    })
      .then(res => {
        const updatedCart = cartItems.map(item =>
          item.id === cartId ? { ...item, quantity: newQuantity } : item
        );

        setCartItems(updatedCart);

        // Optional: update totals
        const newTotal = updatedCart.reduce((sum, i) => sum + i.price * i.quantity, 0);
        const newItemCount = updatedCart.reduce((sum, i) => sum + i.quantity, 0);
        setTotal(newTotal);
        setItemCount(newItemCount);
      })
      .catch(err => {
        console.error("Failed to update quantity:", err);
      });
  };

  const removeItem = (id) => {
    api.delete(`/api/cart/${id}`)
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

  const handleCheckout = () => {
    if (!paymentMethod) {
      alert("Please select a payment method");
      return;
    }
    // Optionally: send order to backend here
    setCartItems([]);
    setItemCount(0);
    setTotal(0);
    navigate("/success");
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

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div className="xl:col-span-3 space-y-6">
            <Card className="shadow-lg border-0">
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
                    className={`p-6 ${index !== cartItems.length - 1 ? "border-b" : ""
                      }`}
                  >
                    <div className="flex gap-6">
                      <div className="relative">
                        <img
                          src={`${api.defaults.baseURL}/uploads/${item.image}`}
                          alt={item.title}
                          width={120}
                          height={120}
                          className="rounded-xl object-cover shadow-md"
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

                        <div className="flex items-center justify-between">
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
            {/* Delivery info, payment method, and order summary go here as-is */}
            {/* <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-lg">
                <CardTitle className="text-xl flex items-center gap-2">
                  <MapPin className="h-6 w-6" />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="name"
                    className="text-sm font-semibold flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={deliveryInfo.name}
                    onChange={(e) =>
                      setDeliveryInfo((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="mobile"
                    className="text-sm font-semibold flex items-center gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    Mobile Number
                  </Label>
                  <Input
                    id="mobile"
                    placeholder="Enter 10-digit mobile number"
                    value={deliveryInfo.mobile}
                    onChange={(e) =>
                      setDeliveryInfo((prev) => ({
                        ...prev,
                        mobile: e.target.value,
                      }))
                    }
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-semibold flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={deliveryInfo.email}
                    onChange={(e) =>
                      setDeliveryInfo((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pincode" className="text-sm font-semibold">
                    Pincode
                  </Label>
                  <Input
                    id="pincode"
                    placeholder="Enter 6-digit pincode"
                    value={deliveryInfo.pincode}
                    onChange={(e) => handlePincodeChange(e.target.value)}
                    className="h-12"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-semibold">
                      City
                    </Label>
                    <Input
                      id="city"
                      value={deliveryInfo.city}
                      readOnly
                      className="h-12 bg-gray-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-sm font-semibold">
                      State
                    </Label>
                    <Input
                      id="state"
                      value={deliveryInfo.state}
                      readOnly
                      className="h-12 bg-gray-50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-semibold">
                    Full Address
                  </Label>
                  <Input
                    id="address"
                    placeholder="House/Flat, Street, Area"
                    value={deliveryInfo.address}
                    onChange={(e) =>
                      setDeliveryInfo((prev) => ({
                        ...prev,
                        address: e.target.value,
                      }))
                    }
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="landmark" className="text-sm font-semibold">
                    Landmark (Optional)
                  </Label>
                  <Input
                    id="landmark"
                    placeholder="Nearby landmark"
                    value={deliveryInfo.landmark}
                    onChange={(e) =>
                      setDeliveryInfo((prev) => ({
                        ...prev,
                        landmark: e.target.value,
                      }))
                    }
                    className="h-12"
                  />
                </div>
              </CardContent>
            </Card> */}

            {/* Payment Method */}
            <Card className="shadow-lg border-0">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-t-lg">
                <CardTitle className="text-xl">Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {[
                    {
                      id: "upi",
                      icon: Smartphone,
                      label: "UPI Payment",
                      color: "text-blue-600",
                    },
                    {
                      id: "card",
                      icon: CreditCard,
                      label: "Debit/Credit Card",
                      color: "text-green-600",
                    },
                    {
                      id: "netbanking",
                      icon: Banknote,
                      label: "Net Banking",
                      color: "text-purple-600",
                    },
                    {
                      id: "wallet",
                      icon: Wallet,
                      label: "Digital Wallet",
                      color: "text-orange-600",
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
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${paymentMethod === method.id
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
                      className={`font-semibold ${deliveryCharge === 0 ? "text-green-600" : ""
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
                    disabled={!paymentMethod}
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