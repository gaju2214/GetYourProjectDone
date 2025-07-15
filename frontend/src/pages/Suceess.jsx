import React, { useState } from "react";
import { Button } from "../components/ui/Botton";
import { Card, CardContent } from "../components/ui/Card";
import { CheckCircle, Package, Download, MessageCircle } from "lucide-react";
import { ShippingAnimation } from "../components/ShippingAnimation";
import { InvoiceDownload } from "../components/InvoiceDownload";
import { Link } from "react-router-dom";

export default function SuccessPage() {
  const [orderId] = useState(`EP${Date.now().toString().slice(-6)}`);
  const [estimatedDelivery] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 5);
    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  });

  const [orderData] = useState({
    orderId: orderId,
    orderDate: new Date().toLocaleDateString("en-IN"),
    customerInfo: {
      name: "John Doe",
      email: "john.doe@example.com",
      mobile: "+91-9876543210",
      address: "123 Tech Street, Innovation Hub",
      city: "Bangalore",
      state: "Karnataka",
      pincode: "560001",
      landmark: "Near Tech Park",
    },
    items: [
      {
        title: "Smart Home Automation System",
        quantity: 1,
        price: 2499,
        total: 2499,
      },
      {
        title: "RFID Access Control System",
        quantity: 2,
        price: 1899,
        total: 3798,
      },
    ],
    pricing: {
      subtotal: 6297,
      discount: 315,
      gst: 1133,
      deliveryCharge: 0,
      finalTotal: 7115,
    },
    paymentMethod: "UPI Payment",
  });

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Thank you for your purchase. Your engineering project kit is on its
            way!
          </p>
          <div className="text-lg">
            <span className="text-gray-600">Order ID: </span>
            <span className="font-bold text-blue-600">{orderId}</span>
          </div>
        </div>

        {/* Invoice Download Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">Download Invoice</h3>
                <p className="text-gray-600">
                  Get your invoice in Excel or PDF format
                </p>
              </div>
              <InvoiceDownload orderData={orderData} />
            </div>
          </CardContent>
        </Card>

        {/* Shipping Animation */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold text-center mb-8">
              Tracking Your Order
            </h2>
            <ShippingAnimation />
            <div className="text-center mt-8">
              <p className="text-gray-600 mb-2">Estimated Delivery Date</p>
              <p className="text-xl font-semibold text-green-600">
                {estimatedDelivery}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Package className="h-8 w-8 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">What's Next?</h3>
              <p className="text-sm text-gray-600">
                You'll receive SMS and email updates about your order status
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Download className="h-8 w-8 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Project Resources</h3>
              <p className="text-sm text-gray-600">
                Access documentation, code, and tutorials in your account
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-8 w-8 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-gray-600">
                Our support team is here to help with your project
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <button
              class="transition-colors py-3 text-lg px-5 focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-md dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              fdprocessedid="r1clir"
            >
              Continue Shopping
            </button>
          </Link>
          <Link to="/orders">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto bg-transparent"
            >
              Track Order
            </Button>
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-12 p-6 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-lg mb-4">Important Information</h3>
          <ul className="space-y-2 text-sm text-gray-700">
            <li>
              • You will receive a confirmation email with order details shortly
            </li>
            <li>
              • Project documentation and code will be available in your account
            </li>
            <li>
              • For technical support, contact us at support@engiprojects.com
            </li>
            <li>• Free returns within 7 days if you're not satisfied</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
