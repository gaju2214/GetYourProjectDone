import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import api from '../api'; // adjust path based on file location

import { useParams } from "react-router-dom";
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
  RotateCcw,
} from "lucide-react";
//import { mockProducts } from "../lib/mock-data";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext"; // Adjust path as needed

export default function ProductDetailPage() {
  const { id } = useParams();
  const { dispatch } = useCart();
  const { user } = useAuth(); // ✅
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);


  useEffect(() => {
    api.get(`/api/projects/${id}`)
      .then((res) => {
        const p = res.data.data; // <-- FIXED
        setProduct({
          ...p,
          originalPrice: Math.floor(p.price * 1.5),
          rating: 4.5,
          reviews: 12,
          difficulty: "Beginner",
          components: ["Code", "Docs", "Support"],
        });
      })
      .catch((err) => {
        console.error("Error fetching project:", err);
      });
  }, [id]);
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-gray-600">
        Loading project details...
      </div>
    );
  }

  // Make API call to backend
  const handleAddToCart = async () => {
    for (let i = 0; i < quantity; i++) {
      dispatch({ type: "ADD_ITEM", payload: product });
    }

    // if (!user) {
    //   alert("Please log in to add items to cart.");
    //   return;
    // }

    try {
      const cartItem = {
        userId: 1, //user.id, // ✅ dynamic user ID from context
        projectId: product.id,
        quantity: quantity,
      };
      console.log("Cart item payload:", cartItem);

      const response = await api.post("/api/cart/add", cartItem);

      if (response.status === 200 || response.status === 201) {
        alert("✅ Item added to cart!");
      } else {
        alert("❌ Failed to add item to cart.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("⚠️ Error adding to cart.");
    }
  };


  const discountPercentage = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );
  const gstAmount = Math.round(product.price * 0.18);
  const totalPrice = product.price + gstAmount;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-lg">
            <img
              src={`${api.defaults.baseURL}/uploads/${product.image}`}
              alt={product.title}
              className="w-full h-96 object-cover"
            />

            <Badge className="absolute top-4 left-4 bg-red-500">
              {discountPercentage}% OFF
            </Badge>
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {/* <Badge variant="outline">
                  {typeof product.category === "object" ? product.category.name : product.category}
                </Badge>
                <Badge variant="outline">
                  {typeof product.subcategory === "object" ? product.subcategory.name : product.subcategory}
                </Badge>
              <Badge
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

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.title}
            </h1>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{product.rating}</span>
                <span className="text-gray-500">
                  ({product.reviews} reviews)
                </span>
              </div>
            </div>

            <p className="text-gray-600 text-lg">{product.description}</p>
          </div>

          {/* Pricing */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl font-bold text-green-600">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span className="text-xl text-gray-500 line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                  <Badge className="bg-red-500">
                    Save ₹{(product.originalPrice - product.price).toLocaleString()}
                  </Badge>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Price:</span>
                    <span>₹{product.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (18%):</span>
                    <span>₹{gstAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-gray-900 border-t pt-2">
                    <span>Total:</span>
                    <span>₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Quantity and Actions */}
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <label className="font-medium">Quantity:</label>
                  <div className="flex items-center border rounded-lg">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </Button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="flex gap-4 items-center">
                  <Button
                    size="lg"
                    className="flex bg-blue-600 text-white w-150 place-content-center hover:bg-blue-700 transition-colors duration-300 hover:shadow-md"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart
                  </Button>

                  <Button size="lg" variant="outline">
                    <Heart className="h-5 w-5" />
                  </Button>
                  <Button size="lg" variant="outline">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Truck className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-sm font-medium">Free Shipping</div>
                  <div className="text-xs text-gray-600">On orders above ₹2000</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Shield className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <div className="text-sm font-medium">1 Year Warranty</div>
                  <div className="text-xs text-gray-600">Manufacturing defects</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <RotateCcw className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-sm font-medium">Easy Returns</div>
                  <div className="text-xs text-gray-600">7 days return policy</div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-16">
            <Tabs defaultValue="components" className="w-full">
              {/* Tabs Header */}
              <TabsList className="grid w-full grid-cols-3 bg-white border border-orange-100 rounded-xl shadow-md overflow-hidden ">
                <TabsTrigger
                  value="components"
                  className="py-3 text-center font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-100 data-[state=active]:to-blue-100 data-[state=active]:text-orange-700"
                >
                  Components
                </TabsTrigger>
                <TabsTrigger
                  value="specifications"
                  className="py-3 text-center font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-100 data-[state=active]:to-blue-100 data-[state=active]:text-orange-700"
                >
                  Specifications
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="py-3 text-center font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-100 data-[state=active]:to-blue-100 data-[state=active]:text-orange-700"
                >
                  Reviews
                </TabsTrigger>
              </TabsList>

              {/* Components Tab */}
              <TabsContent value="components" className="mt-8">
                <Card className="bg-white shadow-md rounded-xl border border-orange-100">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-orange-700 mb-4">
                      Included Components
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {product.components.map((component, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg shadow-sm"
                        >
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <span className="text-sm font-medium text-blue-900">
                            {component}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Specifications Tab */}
              <TabsContent value="specifications" className="mt-8">
                <Card className="bg-white shadow-md rounded-xl border border-blue-100">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-blue-700 mb-4">
                      Technical Specifications
                    </h3>
                    <div className="space-y-4 text-blue-900">
                      {[
                        ["Category", typeof product.category === "object" ? product.category.name : product.category],
                        ["Subcategory", typeof product.subcategory === "object" ? product.subcategory.name : product.subcategory],
                        ["Difficulty Level", product.difficulty],
                        ["Components Count", `${product.components.length} items`],
                        ["Estimated Build Time", "2–4 hours"],
                        ["Documentation", "Complete manual included"],
                      ].map(([label, value], i) => (
                        <div
                          key={i}
                          className={`grid grid-cols-2 gap-4 py-2 ${i < 5 ? "border-b border-blue-100" : ""}`}
                        >
                          <span className="font-medium">{label}:</span>
                          <span>{value}</span>
                        </div>
                      ))
                      }
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="mt-8">
                <Card className="bg-white shadow-md rounded-xl border border-orange-100">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-orange-700 mb-4">
                      Customer Reviews
                    </h3>
                    <div className="space-y-6 text-blue-900">
                      {[1, 2, 3].map((review) => (
                        <div key={review} className="border-b border-blue-100 pb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className="h-4 w-4 fill-yellow-400 text-yellow-400"
                                />
                              ))}
                            </div>
                            <span className="font-medium text-orange-700">
                              Engineering Student
                            </span>
                            <span className="text-sm text-gray-500">
                              2 days ago
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Excellent project kit! All components were included and
                            the documentation was very clear. Helped me complete my
                            final year project successfully.
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
        );
}
