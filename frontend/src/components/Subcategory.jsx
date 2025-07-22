import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ProductCard } from "../components/ProductCard";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Botton";
import { Card, CardContent } from "../components/ui/Card";
import { Filter, Grid, List, SortAsc } from "lucide-react";
import axios from "axios";
import api from "../api"; // adjust path based on file location

export default function CategoryPage() {
  const params = useParams();
  const category = params.category;
  const [viewMode, setViewMode] = useState("grid");
 const [sortBy, setSortBy] = useState("popular");
const [categoryName, setCategoryName] = useState("");


  //const categoryName = category.charAt(0).toUpperCase() + category.slice(1);

  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(null);
  const [products, setProducts] = useState([]);

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
        setSelectedSubcategoryId(subRes.data[0].id);
      }
    } catch (err) {
      console.error("Failed to fetch category or subcategories", err);
    }
  };

  fetchSubcategoriesAndCategory();
}, [category]);



  // Fetch products when a subcategory is selected
  useEffect(() => {
    const fetchProjects = async () => {
      if (!selectedSubcategoryId) return;
      try {
        const res =  await api.get(
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Category Not Found
          </h1>
          <p className="text-gray-600">The requested category doesn't exist.</p>
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

          {/* Subcategories */}
          <div className="flex flex-wrap gap-3 mb-6">
            {subcategories.map((sub) => (
              <Badge
                key={sub.id}
                variant="outline"
                onClick={() => setSelectedSubcategoryId(sub.id)}
                className={`px-4 py-2 text-sm hover:bg-blue-50 cursor-pointer ${
                  selectedSubcategoryId === sub.id ? "bg-blue-100" : ""
                }`}
              >
                {sub.name}
              </Badge>
            ))}
          </div>
        </div>

        {/* Filters and Controls */}
        <Card className="shadow-lg border-0 mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 bg-transparent"
                >
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 bg-transparent"
                >
                  <SortAsc className="h-4 w-4" />
                  Sort by: {sortBy}
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {products.length} projects found
                </span>
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div
          className={`grid gap-8 ${
            viewMode === "grid"
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
