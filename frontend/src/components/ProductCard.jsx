import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/Botton";
import { Card, CardContent, CardFooter } from "../components/ui/Card";
import { Badge } from "./ui/Badge";
import { Star, ShoppingCart, Check, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext"; // ✅ Import useCart
import axios from "axios";
import api from "../api"; // adjust path based on file location
import { useAuth } from "../context/AuthContext"; // Adjust path as needed

export function ProductCard({ product }) {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [showGoogleLoginModal, setShowGoogleLoginModal] = useState(false);
  const { dispatch } = useCart();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const [randomRating, setRandomRating] = useState(0);

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
    const rating = (Math.random() * 0.9 + 4.0).toFixed(1); // Generates 4.0 to 4.9
    setRandomRating(rating);
    checkAuth();
  }, []);

  const handleGoogleLogin = () => {
    const currentUrl = window.location.href;
    const encodedRedirectUrl = encodeURIComponent(currentUrl);
    window.location.href = `${api.defaults.baseURL}/api/auth/google?returnUrl=${encodedRedirectUrl}`;
  };

  const handleAddToCart = async () => {
    if (!user || !isAuthenticated) {
      setShowGoogleLoginModal(true);
      return;
    }

    console.log("User object:", user);

    try {
      const cartItem = {
        userId: user.userId, // ✅ dynamic user ID from context
        projectId: product.id,
        quantity: 1,
      };

      setIsAdding(true);
      console.log("Cart item payload:", cartItem);

      const response = await api.post("/api/cart/add", cartItem, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      console.log("Cart add response:", response.data);

      if (response.status === 200 || response.status === 201) {
        // Add to local cart context
        dispatch({ type: "ADD_ITEM", payload: product });
        
        // Show success state
        setIsAdded(true);
        setTimeout(() => {
          setIsAdded(false);
        }, 2000);
        
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
    } finally {
      setIsAdding(false);
    }
  };

  const discountPercentage = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  // Helper function to parse PostgreSQL arrays
  const parsePostgresArray = (arrayString) => {
    if (!arrayString || typeof arrayString !== 'string') return [];
    // Remove curly braces and split by comma
    return arrayString.replace(/[{}]/g, '').split(',').map(item => item.trim());
  };

  return (
    <>
      <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
        <Link to={`/product/${product.slug}`}>
          <CardContent className="p-0">
            <div className="relative overflow-hidden rounded-t-lg">
              <img
                src={product.image}
                alt={product.title}
                className="w-full max-h-60 object-contain bg-gray-100 rounded-t-lg"
              />
              {typeof product.price === "number" && (
                <Badge className="text-white absolute top-3 left-3 bg-red-500 hover:bg-red-600">
                  {`${Math.round(
                    100 -
                    (product.price /
                      (product.originalPrice || product.price / 0.6)) *
                    100
                  )}% OFF`}
                </Badge>
              )}

              <Badge
                className="absolute top-3 right-3"
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

            <div className="p-6">
              <div className="flex items-center gap-1 mb-3">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{randomRating}</span>
              </div>

              <h3 className="font-bold text-lg mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {product.title}
              </h3>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {product.description}
              </p>

              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl font-bold text-green-600">
                  ₹{product.price?.toLocaleString?.()}
                </span>
                {typeof product.price === "number" && (
                  <span className="text-lg text-gray-500 line-through">
                    ₹{Math.round(product.price / 0.6).toLocaleString()}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {(() => {
                  const components = Array.isArray(product.components)
                    ? product.components
                    : typeof product.components === "string"
                      ? parsePostgresArray(product.components)
                      : [];

                  return components.length > 0 ? (
                    components.slice(0, 3).map((component, index) => (
                      <Badge key={index} className="text-sm">
                        {component}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">No components listed</p>
                  );
                })()}
              </div>
            </div>
          </CardContent>
        </Link>

        <CardFooter className="p-6 pt-0">
          <Button
            className={`w-full transition-all duration-300 ${isAdded
              ? "focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
              : "text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
              }`}
            onClick={handleAddToCart}
            disabled={isAdding}
          >
            {isAdding ? (
              <div className="flex items-center gap-2 py-2 text-sm">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Adding...
              </div>
            ) : isAdded ? (
              <div className="flex items-center gap-2 py-2 text-sm">
                <Check className="h-4 w-4" />
                Added to Cart!
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2 py-2 text-sm">
                <ShoppingCart className="h-4 w-4" />
                <span className="leading-none">Add to Cart</span>
              </div>
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Google Login Modal */}
      {showGoogleLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Login Required
              </h3>
              <button
                onClick={() => setShowGoogleLoginModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-600 mb-6 text-center">
                Please log in to add items to your cart and make purchases.
              </p>
              
              <div className="space-y-3">
                {/* Google Login Button */}
                <Button
                  onClick={handleGoogleLogin}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-3 transition duration-300"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}