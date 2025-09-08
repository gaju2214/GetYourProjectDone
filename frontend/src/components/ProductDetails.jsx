// import { useState } from "react";
// import { useEffect } from "react";
// import axios from "axios";
// import api from "../api"; // adjust path based on file location

// import { useNavigate, useParams } from "react-router-dom";
// import { Button } from "../components/ui/Botton";
// import { Badge } from "../components/ui/Badge";
// import { Card, CardContent } from "../components/ui/Card";
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "../components/ui/Tabs";
// import {
//   Star,
//   ShoppingCart,
//   Heart,
//   Share2,
//   Truck,
//   Shield,
//   RotateCcw,
// } from "lucide-react";
// //import { mockProducts } from "../lib/mock-data";
// import { useCart } from "../context/CartContext";
// import { useAuth } from "../context/AuthContext"; // Adjust path as needed

// export default function ProductDetailPage() {
//   const { id } = useParams();
//   const { dispatch } = useCart();

//   const [quantity, setQuantity] = useState(1);
//   const [product, setProduct] = useState(null);

//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const navigate = useNavigate();

//   // const { user } = useAuth(); // 👈 get logged-in user
//   // Check auth on mount
//   useEffect(() => {
//     const checkAuth = async () => {
//       try {
//         const res = await api.get("/api/protected/checkAuth");
//         if (res.data?.success === true && res.data?.status === 200) {
//           setUser(res.data.user);
//           setIsAuthenticated(true);
//         } else {
//           setUser(null);
//           setIsAuthenticated(false);
//         }
//       } catch (error) {
//         console.error("Authentication check failed:", error);
//         setUser(null);
//         setIsAuthenticated(false);
//       } finally {
//         setLoading(false);
//       }
//     };
//     checkAuth();
//   }, []); // Redirect to login if not authenticated after loading

//   useEffect(() => {
//     const slug = window.location.pathname.split("/").pop();
//     api
//       .get(`/api/projects/by-slug/${slug}`)
//       .then((res) => {
//         const p = res.data.data; // <-- FIXED
//         setProduct({
//           ...p,
//           originalPrice: Math.floor(p.price * 1.5),
//         });
//       })
//       .catch((err) => {
//         console.error("Error fetching project:", err);
//       });
//   }, [id]);
//   if (!product) {
//     return (
//       <div className="container mx-auto px-4 py-8 text-center text-gray-600">
//         Loading project details...
//       </div>
//     );
//   }

//   // Make API call to backend
//   const handleAddToCart = async () => {
//   if (!user) {
//     alert("Please log in to add items to cart.");
//     return;
//   }
// console.log("User object:", user);

//   try {
//     const cartItem = {
//   userId: user?.userId,  // 👈 from backend
//   projectId: product.id,
//   quantity: 1,
// };

//     console.log("Cart item payload:", cartItem);

//    const response = await api.post("/api/cart/add", cartItem, {
//   headers: { "Content-Type": "application/json" },
//   withCredentials: true,
// });

//     console.log("Cart add response:", response.data);

//     if (response.status === 200 || response.status === 201) {
//       alert("✅ Item added to cart!");
//     } else {
//       alert("❌ Failed to add item to cart.");
//     }
//   } catch (error) {
//     if (error.response) {
//       console.error("Error adding to cart:", error.response.data);
//       alert("⚠️ Error: " + JSON.stringify(error.response.data));
//     } else {
//       console.error("Error adding to cart:", error.message);
//       alert("⚠️ Something went wrong.");
//     }
//   }
// };

//   const discountPercentage = Math.round(
//     ((product.originalPrice - product.price) / product.originalPrice) * 100
//   );
//   const gstAmount = Math.round(product.price * 0.18);
//   const totalPrice = product.price + gstAmount;

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//         {/* Product Image */}
//         <div className="space-y-4">
//           <div className="relative overflow-hidden rounded-lg">
//             <img
//               src={`${product.image}`}
//               alt={product.title}
//               className="w-full h-96 object-cover"
//             />

//             <Badge className="absolute top-4 left-4 bg-red-500">
//               {discountPercentage}% OFF
//             </Badge>
//           </div>
//         </div>

//         {/* Product Details */}
//         <div className="space-y-6">
//           <div>
//             <div className="flex items-center gap-2 mb-2">
//               {/* <Badge variant="outline">
//                   {typeof product.category === "object" ? product.category.name : product.category}
//                 </Badge> */}
//               <Badge variant="outline">
//                 {typeof product.subcategory === "object"
//                   ? product.subcategory.name
//                   : product.subcategory}
//               </Badge>
//               <Badge
//                 variant={
//                   product.difficulty === "Beginner"
//                     ? "secondary"
//                     : product.difficulty === "Intermediate"
//                     ? "default"
//                     : "destructive"
//                 }
//               >
//                 {product.difficulty}
//               </Badge>
//             </div>

//             <h1 className="text-3xl font-bold text-gray-900 mb-4">
//               {product.title}
//             </h1>

//             <div className="flex items-center gap-4 mb-4">
//               <div className="flex items-center gap-1">
//                 <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
//                 <span className="font-medium">{product.rating}</span>
//                 <span className="text-gray-500">
//                   ({product.reviews} reviews)
//                 </span>
//               </div>
//             </div>

//             <p className="text-gray-600 text-lg">{product.description}</p>
//           </div>

//           {/* Pricing */}
//           <div className="bg-gray-50 p-6 rounded-lg">
//             <div className="flex items-center gap-4 mb-4">
//               <span className="text-3xl font-bold text-green-600">
//                 ₹{product.price.toLocaleString()}
//               </span>
//               <span className="text-xl text-gray-500 line-through">
//                 ₹{product.originalPrice.toLocaleString()}
//               </span>
//               <Badge className="bg-red-500">
//                 Save ₹{(product.originalPrice - product.price).toLocaleString()}
//               </Badge>
//             </div>

//             <div className="space-y-2 text-sm text-gray-600">
//               <div className="flex justify-between">
//                 <span>Price:</span>
//                 <span>₹{product.price.toLocaleString()}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>GST (18%):</span>
//                 <span>₹{gstAmount.toLocaleString()}</span>
//               </div>
//               <div className="flex justify-between font-semibold text-gray-900 border-t pt-2">
//                 <span>Total:</span>
//                 <span>₹{totalPrice.toLocaleString()}</span>
//               </div>
//             </div>
//           </div>

//           {/* Quantity and Actions */}
//           <div className="space-y-4">
//             <div className="flex items-center gap-4">
//               <label className="font-medium">Quantity:</label>
//               <div className="flex items-center border rounded-lg">
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                 >
//                   -
//                 </Button>
//                 <span className="px-4 py-2 font-medium">{quantity}</span>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => setQuantity(quantity + 1)}
//                 >
//                   +
//                 </Button>
//               </div>
//             </div>

//             <div className="flex flex-wrap gap-3 justify-center sm:justify-start w-full">
//              <Button
//   size="lg"
//   disabled={loading}   // 👈 don't allow clicks until auth check finishes
//   className="flex items-center justify-center bg-blue-600 text-white px-6 py-3 flex-grow sm:flex-grow-0 sm:w-auto hover:bg-blue-700 transition duration-300 shadow-sm hover:shadow-md disabled:opacity-50"
//   onClick={handleAddToCart}
// >
//   <ShoppingCart className="h-5 w-5 mr-2" />
//   {loading ? "Checking login..." : "Add to Cart"}
// </Button>

//               <Button
//                 size="lg"
//                 variant="outline"
//                 className="flex items-center justify-center px-6 py-3 sm:w-auto"
//               >
//                 <Heart className="h-5 w-5" />
//               </Button>

//               <Button
//                 size="lg"
//                 variant="outline"
//                 className="flex items-center justify-center px-6 py-3 sm:w-auto"
//               >
//                 <Share2 className="h-5 w-5" />
//               </Button>
//             </div>

//             <Button
//               size="lg"
//               className="w-full mt-2 bg-orange-500 text-white hover:bg-orange-600 transition duration-300 shadow-md"
//               onClick={() => {
//                 if (!user) {
//                   // Not logged in: save download intent and redirect to login
//                   localStorage.setItem(
//                     "downloadAfterLogin",
//                     JSON.stringify({
//                       title: product.title,
//                       abstract_pdf: product.abstract_file,
//                     })
//                   );
//                   alert("Please login to download the abstract.");
//                   window.location.href = "/auth/login"; // adjust if your route is different
//                 } else {
//                   // Logged in user: allow download
//                   const downloadUrl = product.abstract_file;
//                   const link = document.createElement("a");
//                   link.href = downloadUrl;
//                   link.download = `${product.title}-abstract.pdf`;
//                   document.body.appendChild(link);
//                   link.click();
//                   document.body.removeChild(link);
//                 }
//               }}
//             >
//               📄 Download Abstract
//             </Button>
//           </div>

//           {/* Features */}
//           <div className="grid grid-cols-3 gap-4">
//             <div className="text-center p-4 bg-blue-50 rounded-lg">
//               <Truck className="h-6 w-6 text-blue-600 mx-auto mb-2" />
//               <div className="text-sm font-medium">Free Shipping</div>
//               <div className="text-xs text-gray-600">On orders above ₹2000</div>
//             </div>
//             <div className="text-center p-4 bg-green-50 rounded-lg">
//               <Shield className="h-6 w-6 text-green-600 mx-auto mb-2" />
//               <div className="text-sm font-medium">1 Year Warranty</div>
//               <div className="text-xs text-gray-600">Manufacturing defects</div>
//             </div>
//             <div className="text-center p-4 bg-purple-50 rounded-lg">
//               <RotateCcw className="h-6 w-6 text-purple-600 mx-auto mb-2" />
//               <div className="text-sm font-medium">Easy Returns</div>
//               <div className="text-xs text-gray-600">7 days return policy</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Product Details Tabs */}
//       <div className="mt-16">
//         <Tabs defaultValue="components" className="w-full">
//           {/* Tabs Header */}
//           <TabsList className="grid w-full grid-cols-3 bg-white border border-orange-100 rounded-xl shadow-md overflow-hidden ">
//             <TabsTrigger
//               value="components"
//               className="py-3 text-center font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-100 data-[state=active]:to-blue-100 data-[state=active]:text-orange-700"
//             >
//               Components
//             </TabsTrigger>
//             <TabsTrigger
//               value="specifications"
//               className="py-3 text-center font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-100 data-[state=active]:to-blue-100 data-[state=active]:text-orange-700"
//             >
//               Specifications
//             </TabsTrigger>
//             <TabsTrigger
//               value="reviews"
//               className="py-3 text-center font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-all duration-300 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-100 data-[state=active]:to-blue-100 data-[state=active]:text-orange-700"
//             >
//               Reviews
//             </TabsTrigger>
//           </TabsList>

//           {/* Components Tab */}
//           {/* Components Tab */}
//           <TabsContent value="components" className="mt-8">
//             <Card className="bg-white shadow-md rounded-xl border border-orange-100">
//               <CardContent className="p-6">
//                 <h3 className="text-xl font-semibold text-orange-700 mb-4">
//                   Included Components
//                 </h3>
//                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                   {(product.components || []).map((component, index) => (
//                     <div
//                       key={index}
//                       className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg shadow-sm"
//                     >
//                       <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
//                       <span className="text-sm font-medium text-blue-900">
//                         {component}
//                       </span>
//                     </div>
//                   ))}
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>

//           {/* Specifications Tab */}
//           {product && (
//             <TabsContent value="specifications" className="mt-8">
//               <Card className="bg-white shadow-md rounded-xl border border-blue-100">
//                 <CardContent className="p-6">
//                   <h3 className="text-xl font-semibold text-blue-700 mb-4">
//                     Technical Specifications
//                   </h3>
//                   <div className="space-y-4 text-blue-900">
//                     {[
//                       //["Category", product.category?.slug || "N/A"],
//                       ["Specification", product.subcategory?.name || "N/A"],
//                       ["Project Title", product.title],
//                       ["Price", `₹${product.price.toLocaleString()}`],
//                       //["Original Price", `₹${product.originalPrice.toLocaleString()}`],
//                       //["Discount", `${discountPercentage}%`],
//                       [
//                         "Components",
//                         (product.components || []).length + " items",
//                       ],
//                       ["Details", product.details || "Not provided"],
//                       [
//                         "Project Description",
//                         product.description || "Not provided",
//                       ],
//                       [
//                         "Components Count",
//                         `${(product.components || []).length} items`,
//                       ],
//                       ["Estimated Build Time", "2–4 hours"],
//                     ].map(([label, value], i) => (
//                       <div
//                         key={i}
//                         className={`grid grid-cols-2 gap-4 py-2 ${
//                           i < 10 ? "border-b border-blue-100" : ""
//                         }`}
//                       >
//                         <span className="font-medium">{label}:</span>
//                         <span>{value}</span>
//                       </div>
//                     ))}

//                     {product.block_diagram &&
//                       typeof product.block_diagram === "string" && (
//                         <div className="pt-6">
//                           <h4 className="font-medium text-blue-600">
//                             Block Diagram
//                           </h4>
//                           <img
//                             src={`${product.block_diagram}`}
//                             alt="Block Diagram"
//                             className="mt-2 rounded-lg shadow"
//                             onError={(e) => {
//                               e.target.style.display = "none";
//                             }}
//                           />
//                         </div>
//                       )}
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>
//           )}
//           {/* Reviews Tab */}
//           <TabsContent value="reviews" className="mt-8">
//             <Card className="bg-white shadow-md rounded-xl border border-orange-100">
//               <CardContent className="p-6">
//                 <h3 className="text-xl font-semibold text-orange-700 mb-4">
//                   Customer Reviews
//                 </h3>
//                 {product.review ? (
//                   <div className="space-y-6 text-blue-900">
//                     <div className="border-b border-blue-100 pb-4">
//                       <div className="flex items-center gap-2 mb-2">
//                         <div className="flex">
//                           {[...Array(5)].map((_, i) => (
//                             <Star
//                               key={i}
//                               className="h-4 w-4 fill-yellow-400 text-yellow-400"
//                             />
//                           ))}
//                         </div>
//                         <span className="font-medium text-orange-700">
//                           Verified User
//                         </span>
//                         <span className="text-sm text-gray-500">Recently</span>
//                       </div>
//                       <p className="text-sm text-gray-600">{product.review}</p>
//                     </div>
//                   </div>
//                 ) : (
//                   <p className="text-sm text-gray-500">No reviews yet.</p>
//                 )}
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>
//     </div>
//   );
// }




import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import api from "../api";
import { useNavigate, useParams } from "react-router-dom";
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
  Headphones,
  X,
} from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function ProductDetailPage() {
  const { id } = useParams();
  const { dispatch } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // New states for backend discount integration
  const [globalDiscount, setGlobalDiscount] = useState(null);
  const [discountLoading, setDiscountLoading] = useState(true);
  
  // Form modal states
  const [showDownloadForm, setShowDownloadForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', mobile: '' });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Google Login Modal states
  const [showGoogleLoginModal, setShowGoogleLoginModal] = useState(false);
  
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

  // Fetch product data
  useEffect(() => {
    const slug = window.location.pathname.split("/").pop();
    api
      .get(`/api/projects/by-slug/${slug}`)
      .then((res) => {
        const p = res.data.data;
        setProduct({
          ...p,
          originalPrice: Math.floor(p.price * 1.5),
        });
      })
      .catch((err) => {
        console.error("Error fetching project:", err);
      });
  }, [id]);

  // Fetch global discount from backend
  useEffect(() => {
    const fetchGlobalDiscount = async () => {
      try {
        setDiscountLoading(true);
        const response = await api.get('/api/discounts/global');
        if (response.data.success) {
          setGlobalDiscount(response.data.discount);
        }
      } catch (error) {
        console.error('Failed to fetch global discount:', error);
        // Don't show error to user, just continue with fallback
      } finally {
        setDiscountLoading(false);
      }
    };

    fetchGlobalDiscount();

    // Refresh discount every 5 minutes for real-time updates
    const interval = setInterval(fetchGlobalDiscount, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!formData.mobile.trim()) {
      errors.mobile = 'Mobile number is required';
    } else if (!mobileRegex.test(formData.mobile.trim())) {
      errors.mobile = 'Please enter a valid 10-digit mobile number';
    }
    
    return errors;
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const downloadData = {
        name: formData.name.trim(),
        phoneNumber: formData.mobile.trim(),
      };

      await api.post("/api/auth/userinfo", downloadData);

      const localData = {
        projectTitle: product.title,
        projectId: product.id,
        downloadDate: new Date().toISOString(),
      };

      const existing = JSON.parse(localStorage.getItem("abstractDownloads") || "[]");
      existing.push(localData);
      localStorage.setItem("abstractDownloads", JSON.stringify(existing));

      const link = document.createElement("a");
      link.href = product.abstract_file;
      link.download = `${product.title}-abstract.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setShowDownloadForm(false);
      setFormData({ name: "", mobile: "" });
      setFormErrors({});
    } catch (error) {
      console.error("Error during download:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Google Login
  const handleGoogleLogin = () => {
    const currentUrl = window.location.href;
    const encodedRedirectUrl = encodeURIComponent(currentUrl);
    window.location.href = `${api.defaults.baseURL}/api/auth/google?returnUrl=${encodedRedirectUrl}`;
  };

  // Enhanced discount calculation with backend integration
const getDiscountInfo = () => {
  if (!product?.price) {
    return null;
  }

  // Use backend discount if available and active
  if (globalDiscount && globalDiscount.isActive && !discountLoading) {
    // Check if discount is currently valid (time-based)
    const now = new Date();
    const startDate = globalDiscount.startDate ? new Date(globalDiscount.startDate) : null;
    const endDate = globalDiscount.endDate ? new Date(globalDiscount.endDate) : null;
    
    const isTimeValid = (!startDate || now >= startDate) && (!endDate || now <= endDate);
    
    if (isTimeValid) {
      const discountPercentage = parseFloat(globalDiscount.discountValue) || 0;
      // Calculate what the original price should be based on backend discount
      const calculatedOriginalPrice = Math.round(product.price / (1 - discountPercentage / 100));
      const actualSavings = calculatedOriginalPrice - product.price;
      
      return {
        percentage: Math.round(discountPercentage),
        label: globalDiscount.label || 'OFF',
        backgroundColor: globalDiscount.backgroundColor || '#ef4444',
        textColor: globalDiscount.textColor || '#ffffff',
        isBackendControlled: true,
        originalPrice: calculatedOriginalPrice,
        savings: actualSavings
      };
    }
  }

  // Fallback to calculated discount if no backend discount is active
  const originalPrice = product.originalPrice || Math.round(product.price / 0.6);
  const calculatedPercentage = Math.round(
    ((originalPrice - product.price) / originalPrice) * 100
  );

  if (calculatedPercentage > 0) {
    return {
      percentage: calculatedPercentage,
      label: 'OFF',
      backgroundColor: '#ef4444',
      textColor: '#ffffff',
      isBackendControlled: false,
      originalPrice: originalPrice,
      savings: originalPrice - product.price
    };
  }

  return null;
};




  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center text-gray-600">
        Loading project details...
      </div>
    );
  }

  // Handle Add to Cart - Show Google login modal if not authenticated
  const handleAddToCart = async () => {
    if (!user || !isAuthenticated) {
      setShowGoogleLoginModal(true);
      return;
    }

    console.log("User object:", user);

    try {
      const cartItem = {
        userId: user.userId,
        projectId: product.id,
        quantity: 1,
      };

      console.log("Cart item payload:", cartItem);

      const response = await api.post("/api/cart/add", cartItem, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      console.log("Cart add response:", response.data);

      if (response.status === 200 || response.status === 201) {
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
    }
  };

 const discountInfo = getDiscountInfo();
const gstAmount = Math.round(product.price * 0.18);
const totalPrice = product.price + gstAmount;

  return (
    <div className="container mx-auto px-4 py-8">
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

      {/* Download Form Modal */}
      {showDownloadForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Download Abstract
              </h3>
              <button
                onClick={() => {
                  setShowDownloadForm(false);
                  setFormData({ name: '', mobile: '' });
                  setFormErrors({});
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleFormSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      formErrors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                    maxLength={50}
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                      formErrors.mobile ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter 10-digit mobile number"
                    maxLength={10}
                  />
                  {formErrors.mobile && (
                    <p className="text-red-500 text-xs mt-1">{formErrors.mobile}</p>
                  )}
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowDownloadForm(false);
                    setFormData({ name: '', mobile: '' });
                    setFormErrors({});
                  }}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-orange-500 hover:bg-orange-600"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Downloading...' : 'Download Abstract'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Discount Banner (Optional) */}
      {globalDiscount && globalDiscount.isActive && !discountLoading && (
        <div 
          className="text-center py-3 mb-6 text-white font-medium animate-pulse rounded-lg"
          style={{ 
            backgroundColor: globalDiscount.backgroundColor || '#ef4444',
            color: globalDiscount.textColor || '#ffffff'
          }}
        >
          🎉 {globalDiscount.label} - {Math.round(parseFloat(globalDiscount.discountValue))}% OFF on All Products! 🎉
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Image with Dynamic Discount Badge */}
        <div className="space-y-4">
          <div className="relative overflow-hidden rounded-lg">
            <img
              src={`${product.image}`}
              alt={product.title}
              loading="lazy"
              className="w-full h-96 object-cover"
            />

            {/* Dynamic Backend-Controlled Discount Badge */}
            {discountInfo && discountInfo.percentage > 0 && !discountLoading && (
              <Badge 
                className={`absolute top-4 left-4 font-semibold text-lg px-4 py-2 shadow-lg transition-all duration-300 hover:scale-110 ${
                  discountInfo.isBackendControlled 
                    ? 'animate-pulse border-2 border-white/30' 
                    : ''
                }`}
                style={{
                  backgroundColor: discountInfo.backgroundColor,
                  color: discountInfo.textColor
                }}
              >
                {`${discountInfo.percentage}% ${discountInfo.label}`}
              </Badge>
            )}

            {/* Loading state for discount */}
            {discountLoading && (
              <div className="absolute top-4 left-4 bg-gray-300 text-gray-600 px-4 py-2 rounded text-sm animate-pulse">
                Loading offer...
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline">
                {typeof product.subcategory === "object"
                  ? product.subcategory.name
                  : product.subcategory}
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

            <div
              className="text-gray-600 text-lg"
              dangerouslySetInnerHTML={{ __html: product.description }}
            ></div>
          </div>

          {/* Enhanced Pricing with Backend Discount Info */}
         <div className="bg-gray-50 p-6 rounded-lg">
  <div className="flex items-center gap-4 mb-4">
    <span className="text-3xl font-bold text-green-600">
      ₹{product.price.toLocaleString()}
    </span>
    {discountInfo && (
      <>
        <span className="text-xl text-gray-500 line-through">
          ₹{discountInfo.originalPrice.toLocaleString()}
        </span>
        <Badge 
          className="text-white font-semibold px-3 py-1"
          style={{
            backgroundColor: discountInfo.backgroundColor,
            color: discountInfo.textColor
          }}
        >
          Save ₹{discountInfo.savings.toLocaleString()}
        </Badge>
      </>
    )}
  </div>

  {/* Backend Discount Indicator */}
  {discountInfo && discountInfo.isBackendControlled && !discountLoading && (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      <span className="text-sm text-green-600 font-medium">
        Live Offer Active - {discountInfo.percentage}% {discountInfo.label}
      </span>
    </div>
  )}

  <div className="space-y-2 text-sm text-gray-600">
    <div className="flex justify-between">
      <span>Price:</span>
      <span>₹{product.price.toLocaleString()}</span>
    </div>
    {discountInfo && (
      <div className="flex justify-between text-green-600">
        <span>Discount ({discountInfo.percentage}%):</span>
        <span>-₹{discountInfo.savings.toLocaleString()}</span>
      </div>
    )}
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

            <div className="flex flex-wrap gap-3 justify-center sm:justify-start w-full">
              <Button
                size="lg"
                className="flex items-center justify-center bg-blue-600 text-white px-6 py-3 flex-grow sm:flex-grow-0 sm:w-auto hover:bg-blue-700 transition duration-300 shadow-sm hover:shadow-md disabled:opacity-50"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="flex items-center justify-center px-6 py-3 sm:w-auto"
                onClick={() => {
                  if (navigator.share) {
                    navigator
                      .share({
                        title: product.title,
                        text: `Check out this project: ${product.title}`,
                        url: window.location.href,
                      })
                      .then(() => console.log("Shared successfully"))
                      .catch((err) => console.error("Share failed:", err));
                  } else {
                    alert("Sharing is not supported in this browser. Copying link instead.");
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
              >
                <Share2 className="h-5 w-5 mr-2" />
                Share
              </Button>
            </div>

            <Button
              size="lg"
              className="w-full mt-2 bg-orange-500 text-white hover:bg-orange-600 transition duration-300 shadow-md"
              onClick={() => {
                if (user && isAuthenticated) {
                  const link = document.createElement("a");
                  link.href = product.abstract_file;
                  link.download = `${product.title}-abstract.pdf`;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                } else {
                  setShowDownloadForm(true);
                }
              }}
            >
              📄 Download Abstract
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Truck className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-sm font-medium">Free Shipping</div>
              <div className="text-xs text-gray-600">On orders above ₹2000</div>
            </div>

            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Shield className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="text-sm font-medium">100% Tested Project</div>
              <div className="text-xs text-gray-600">Quality checked & verified</div>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Headphones className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="text-sm font-medium">24×7 Support</div>
              <div className="text-xs text-gray-600">Always available for you</div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        <Tabs defaultValue="components" className="w-full">
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

          <TabsContent value="components" className="mt-8">
            <Card className="bg-white shadow-md rounded-xl border border-orange-100">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-orange-700 mb-4">
                  Included Components
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(product.components || []).map((component, index) => (
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

          {product && (
            <TabsContent value="specifications" className="mt-8">
              <Card className="bg-white shadow-md rounded-xl border border-blue-100">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-blue-700 mb-4">
                    Technical Specifications
                  </h3>
                  <div className="space-y-4 text-blue-900">
                    {[
                      ["Specification", product.subcategory?.name || "N/A"],
                      ["Project Title", product.title],
                      ["Price", `₹${product.price.toLocaleString()}`],
                      [
                        "Components",
                        (product.components || []).length + " items",
                      ],
                      [
                        "Details",
                        <div
                          key="details"
                          dangerouslySetInnerHTML={{
                            __html: product.details || "Not provided",
                          }}
                        />,
                      ],
                      [
                        "Project Description",
                        <div
                          key="desc"
                          dangerouslySetInnerHTML={{
                            __html: product.description || "Not provided",
                          }}
                        />,
                      ],
                      [
                        "Components Count",
                        `${(product.components || []).length} items`,
                      ],
                      ["Estimated Build Time", "2–4 hours"],
                    ].map(([label, value], i) => (
                      <div
                        key={i}
                        className={`grid grid-cols-2 gap-4 py-2 ${
                          i < 10 ? "border-b border-blue-100" : ""
                        }`}
                      >
                        <span className="font-medium">{label}:</span>
                        <span className="prose prose-sm max-w-none">{value}</span>
                      </div>
                    ))}
                    {product.block_diagram && typeof product.block_diagram === "string" && (
                      <div className="pt-6">
                        <h4 className="font-medium text-blue-600">Block Diagram</h4>
                        <img
                          src={`${product.block_diagram}`}
                          alt="Block Diagram"
                          className="mt-2 rounded-lg shadow"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          <TabsContent value="reviews" className="mt-8">
            <Card className="bg-white shadow-md rounded-xl border border-orange-100">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-orange-700 mb-4">
                  Customer Reviews
                </h3>
                {product.review ? (
                  <div className="space-y-6 text-blue-900">
                    <div className="border-b border-blue-100 pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="h-4 w-4 fill-yellow-400 text-yellow-400"
                            />
                          ))}
                        </div>
                        <span className="font-medium text-orange-700">
                          Verified User
                        </span>
                        <span className="text-sm text-gray-500">Recently</span>
                      </div>
                      <p className="text-sm text-gray-600">{product.review}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No reviews yet.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
