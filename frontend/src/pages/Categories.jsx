import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Botton";
import { ArrowRight, Users, Award, Clock, Zap } from "lucide-react";
import api from "../api"; // adjust path based on file location

export default function CategoriesPage() {
  const [categoriesData, setCategoriesData] = useState([]);

  const categoryIcons = {
    Electronics: "⚡",
    Software: "💻",
    Mechanical: "⚙️",
    Electrical: "🔌",
    Civil: "🏗️",
    Mechatronics: "🤖",
  };

  const categoryColors = {
    Electronics: "from-blue-500 to-cyan-500",
    Software: "from-purple-500 to-pink-500",
    Mechanical: "from-orange-500 to-red-500",
    Electrical: "from-yellow-500 to-orange-500",
    Civil: "from-green-500 to-teal-500",
    Mechatronics: "from-indigo-500 to-purple-500",
  };

  useEffect(() => {
    api
      .get("/api/categories/categoryall")
      .then((res) => {
        setCategoriesData(res.data);
        // Fetch subcategories for each category
        res.data.forEach((category) => {
          api
            .get(`/api/subcategories/by-category/${category.id}`)
            .then((subRes) => {
              // Update the category object with its subcategories
              setCategoriesData((prevData) =>
                prevData.map((cat) =>
                  cat.id === category.id
                    ? { ...cat, subcategories: subRes.data }
                    : cat
                )
              );
            })
            .catch((err) =>
              console.error("Error fetching subcategories:", err)
            );
        });
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  if (!categoriesData.length)
    return <p className="text-center">Loading categories...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Engineering Categories
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore comprehensive project solutions across all major engineering
            disciplines. Each category offers premium kits designed by industry
            experts.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">10,000+</div>
            <div className="text-gray-600">Students</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">500+</div>
            <div className="text-gray-600">Projects</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">24/7</div>
            <div className="text-gray-600">Support</div>
          </div>
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <Zap className="h-8 w-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">4.8/5</div>
            <div className="text-gray-600">Rating</div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categoriesData.map((categoryObj) => {
            const category = categoryObj.name;
            const categoryId = categoryObj.id;
            const categorySlug = categoryObj.slug; // ✅ define slug
            const subcategories = categoryObj.subcategories || [];
            const icon = categoryIcons[category] || "📦";
            const gradient =
              categoryColors[category] || "from-gray-400 to-gray-600";

            return (
              <Card
                key={category}
                className="shadow-xl border-0 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <CardHeader
                  className={`bg-gradient-to-r ${gradient} text-white rounded-t-lg`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{icon}</span>
                      <div>
                        <CardTitle className="text-2xl">{category}</CardTitle>
                        <p className="text-white/80">
                          {subcategories.length} Specializations
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  <div className="space-y-4">
                    <p className="text-gray-600 leading-relaxed">
                      Comprehensive {category.toLowerCase()} engineering
                      projects with industry-standard components and expert
                      guidance.
                    </p>

                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">
                        Specializations:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {subcategories.slice(0, 4).map((sub) => (
                          <Badge
                            key={sub.id}
                            variant="outline"
                            className="text-xs"
                          >
                            {sub.name}
                          </Badge>
                        ))}
                        {subcategories.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{subcategories.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* ✅ Fixed this line by defining categoryId above */}
                    {category && categorySlug && (
                      <Link to={`/projects/${categorySlug}`}>
                        <Button className="text-white mt-4 grouptext-lg px-20 bg-red-500 hover:bg-red-700">
                          Explore {category} Projects
                        </Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
