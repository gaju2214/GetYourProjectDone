import { Link, useNavigate } from "react-router-dom";
import { Package, Truck, CheckCircle, Clock, X, Eye } from "lucide-react";
import { useState, useEffect } from "react";



import api from '../api';

// Replace these imports with local component implementations or from a UI library
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Botton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/Tabs";
import { mockOrders } from "../lib/mock-data";
import { InvoiceDownload } from "../components/InvoiceDownload";

export default function OrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

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

  const getStatusIcon = (status) => {
    switch (status) {
      case "Processing":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "Shipped":
        return <Truck className="h-5 w-5 text-blue-600" />;
      case "Delivered":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "Cancelled":
        return <X className="h-5 w-5 text-red-600" />;
      default:
        return <Package className="h-5 w-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Shipped":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Delivered":
        return "bg-green-100 text-green-800 border-green-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filterOrdersByStatus = (status) => {
    if (status === "all") return mockOrders;
    return mockOrders.filter((order) => order.status.toLowerCase() === status);
  };

  const getOrderInvoiceData = (order) => ({
    orderId: order.id,
    orderDate: new Date(order.date).toLocaleDateString("en-IN"),
    customerInfo: {
      name: "Nikhil",
      lastname: "Kandhare",
      email: "john.doe@example.com",
      mobile: "+91-9876543210",
      address: "123 Tech Street, Innovation Hub",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
      landmark: "Near Tech Park",
    },
    items: order.items.map((item) => ({
      title: item.title,
      quantity: item.quantity,
      price: item.price,
      total: item.price * item.quantity,
    })),
    pricing: {
      subtotal: order.total,
      discount: Math.round(order.total * 0.05),
      gst: Math.round(order.total * 0.18),
      deliveryCharge: order.total > 2000 ? 0 : 99,
      finalTotal:
        order.total +
        Math.round(order.total * 0.18) +
        (order.total > 2000 ? 0 : 99) -
        Math.round(order.total * 0.05),
    },
    paymentMethod: "UPI Payment",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600 text-lg">
            Track and manage your engineering project orders
          </p>
        </div>

        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white shadow-sm">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              All Orders
            </TabsTrigger>
            <TabsTrigger
              value="processing"
              className="data-[state=active]:bg-yellow-600 data-[state=active]:text-white"
            >
              Processing
            </TabsTrigger>
            <TabsTrigger
              value="shipped"
              className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
            >
              Shipped
            </TabsTrigger>
            <TabsTrigger
              value="delivered"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              Delivered
            </TabsTrigger>
            <TabsTrigger
              value="cancelled"
              className="data-[state=active]:bg-red-600 data-[state=active]:text-white"
            >
              Cancelled
            </TabsTrigger>
          </TabsList>

          {["all", "processing", "shipped", "delivered", "cancelled"].map(
            (status) => (
              <TabsContent key={status} value={status} className="space-y-6">
                {filterOrdersByStatus(status).length === 0 ? (
                  <Card className="shadow-lg border-0">
                    <CardContent className="p-12 text-center">
                      <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No Orders Found
                      </h3>
                      <p className="text-gray-600">
                        You don't have any {status === "all" ? "" : status}{" "}
                        orders yet.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  filterOrdersByStatus(status).map((order) => (
                    <Card
                      key={order.id}
                      className="shadow-lg border-0 hover:shadow-xl transition-shadow"
                    >
                      <CardHeader className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-t-lg">
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle className="text-xl">
                              Order #{order.id}
                            </CardTitle>
                            <p className="text-gray-300 mt-1">
                              Placed on{" "}
                              {new Date(order.date).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge
                            className={`${getStatusColor(order.status)} border`}
                          >
                            <div className="flex items-center gap-2">
                              {getStatusIcon(order.status)}
                              {order.status}
                            </div>
                          </Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="space-y-3">
                            {order.items.map((item, index) => (
                              <div
                                key={index}
                                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                              >
                                <img
                                  src={item.image || "/placeholder.svg"}
                                  alt={item.title}
                                  width={60}
                                  height={60}
                                  className="rounded-lg object-cover"
                                />
                                <div className="flex-1">
                                  <h4 className="font-semibold text-gray-900">
                                    {item.title}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    Quantity: {item.quantity}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-green-600">
                                    ₹{item.price.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-between items-center pt-4 border-t">
                            <div className="space-y-1">
                              <p className="text-2xl font-bold text-gray-900">
                                ₹{order.total.toLocaleString()}
                              </p>
                              {order.trackingId && (
                                <p className="text-sm text-gray-600">
                                  Tracking ID: {order.trackingId}
                                </p>
                              )}
                              {order.estimatedDelivery && (
                                <p className="text-sm text-gray-600">
                                  Est. Delivery:{" "}
                                  {new Date(
                                    order.estimatedDelivery
                                  ).toLocaleDateString()}
                                </p>
                              )}
                            </div>

                            <div className="flex gap-3">
                              <div className="flex">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex items-center gap-2"
                                >
                                  <Eye className="h-4 w-4" />
                                  View Details
                                </Button>
                              </div>
                              <InvoiceDownload
                                orderData={getOrderInvoiceData(order)}
                              />
                              {order.status === "Shipped" && (
                                <div className="flex">
                                  <Button
                                    size="sm"
                                    className="flex items-center gap-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm py-4 me-2  dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
                                  >
                                    <Truck className="h-4 w-4" />
                                    Track Order
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            )
          )}
        </Tabs>
      </div>
    </div>
  );
}