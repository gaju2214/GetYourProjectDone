import { useParams, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { ProductCard } from "../components/ProductCard";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Botton";
import { Card, CardContent } from "../components/ui/Card";
import { Filter, Grid, List, SortAsc, ChevronDown, Check } from "lucide-react";
import axios from "axios";
import api from "../api"; // adjust path based on file location

export default function CategoryPage() {
  const params = useParams();
  const category = params.category;
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const subQuery = queryParams.get("sub");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("popular");
  const [categoryName, setCategoryName] = useState("");


  //const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);
  const [products, setProducts] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeSubcategoryName = subcategories.find(s => s.id === selectedSubcategoryId)?.name || "";

  // Fetch subcategories using category slug


  useEffect(() => {
    const fetchSubcategoriesAndCategory = async () => {
      try {
        // Fetch category name using slug
        const categoryRes = await api.get(`/api/categories/${category}`);
        setCategoryName(categoryRes.data.name);

        // Fetch subcategories using slug
        const subRes = await api.get(
          `/api/categories/subcategories/by-slug/${category}`
        );
        setSubcategories(subRes.data);

        // Set default selected subcategory if available
        if (subRes.data.length > 0) {
          const matchingSub = subQuery ? subRes.data.find(s => s.slug === subQuery) : null;
          if (matchingSub) {
            setSelectedSubcategoryId(matchingSub.id);
          } else {
            setSelectedSubcategoryId(subRes.data[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to fetch category or subcategories", err);
      }
    };

    fetchSubcategoriesAndCategory();
  }, [category, subQuery]);



  // Fetch products when a subcategory is selected
  useEffect(() => {
    const fetchProjects = async () => {
      if (!selectedSubcategoryId) return;
      try {
        const res = await api.get(
          `/api/projects/by-subcategory/${selectedSubcategoryId}`
        );
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to fetch projects", err);
      }
    };
    fetchProjects();
  }, [selectedSubcategoryId]);

  if (!subcategories.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 animate-pulse">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header Skeleton */}
          <div className="mb-8 flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
            <div className="space-y-2 w-1/3">
              <div className="h-8 bg-gray-250 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>

          {/* Badges Skeleton */}
          <div className="flex flex-wrap gap-3 mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-8 w-28 bg-gray-200 rounded-full"></div>
            ))}
          </div>

          {/* Products Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-lg p-4 space-y-4 shadow-sm">
                <div className="aspect-video bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                <div className="h-8 bg-gray-200 rounded w-full pt-2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {categoryName[0]}
              </span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                {categoryName} Projects
              </h1>
              <p className="text-gray-600 text-lg">
                Premium project kits for {categoryName.toLowerCase()} engineering
              </p>
            </div>
          </div>

          {/* Custom Dropdown Selection */}
          <div className="relative mb-8 max-w-xs" ref={dropdownRef}>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
              Select Specialization
            </label>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-gray-200 hover:border-[#003e8b] rounded-xl shadow-sm text-xs sm:text-sm font-semibold text-gray-800 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              <span>{activeSubcategoryName || "Select Specialization"}</span>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-250 rounded-xl shadow-xl z-30 max-h-60 overflow-y-auto py-1.5 animate-slide-in">
                {subcategories.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => {
                      setSelectedSubcategoryId(sub.id);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-xs sm:text-sm font-medium transition-colors cursor-pointer border-0 ${
                      selectedSubcategoryId === sub.id
                        ? "bg-blue-50 text-[#003e8b] font-bold"
                        : "bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <span>{sub.name}</span>
                    {selectedSubcategoryId === sub.id && (
                      <Check className="w-4 h-4 text-[#003e8b]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div
          className={`grid gap-8 ${viewMode === "grid"
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1"
            }`}
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Category Info */}
        <Card className="shadow-lg border-0 mt-12">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              About {categoryName} Projects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-3">What You'll Learn</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Industry-standard practices and methodologies</li>
                  <li>• Hands-on experience with real-world projects</li>
                  <li>• Problem-solving and critical thinking skills</li>
                  <li>• Technical documentation and presentation</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Included Support</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Complete component kit with quality guarantee</li>
                  <li>• Step-by-step project documentation</li>
                  <li>• Video tutorials and code examples</li>
                  <li>• 24/7 technical support and mentorship</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
