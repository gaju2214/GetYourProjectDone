import React, { useEffect, useState } from "react";
import { Button } from "../components/ui/Botton";
import { Card, CardContent, CardFooter } from "../components/ui/Card";
import { Badge } from "./ui/Badge";
import { Star, ShoppingCart, Check } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext"; // ✅ Import useCart
import axios from "axios";
import api from "../api"; // adjust path based on file location
import { useAuth } from "../context/AuthContext"; // Adjust path as needed

export function ProductCard({ product }) {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const { dispatch } = useCart();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const [randomRating, setRandomRating] = useState(0);
  // const { user } = useAuth(); // 👈 get logged-in user
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
  }, []);  // Redirect to login if not authenticated after loading


  const handleAddToCart = async () => {
    // if (!user) {
    //   alert("Please log in to add items to cart.");
    //   return;
    // }

    if (!user) {
      alert("Please log in to add items to cart.");
      navigate("/auth/login");
      return;
    }

    try {
      const cartItem = {
        userId: user?.userId, //1,
        projectId: product.id,
        quantity: 1,
      };

      setIsAdding(true);
      console.log("Cart item payload:", cartItem);

      const response = await api.post("/api/cart/add", cartItem);

      if (response.status === 200 || response.status === 201) {
        alert("Item added to cart!");
      } else {
        alert("Failed to add item to cart.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Error adding to cart.");
    }

    setIsAdding(true);
    dispatch({ type: "ADD_ITEM", payload: product });

    setTimeout(() => {
      setIsAdding(false);
      setIsAdded(true);

      setTimeout(() => {
        setIsAdded(false);
      }, 2000);
    }, 500);
  };

  const discountPercentage = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
      <Link to={`/product/${product.slug}`}>
        <CardContent className="p-0">
          <div className="relative overflow-hidden rounded-t-lg">
            {/* <img
              src={`${product.image}`}
              alt={product.title}
              width={400}
              height={300}
              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            /> */}

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
  );
}
