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

  useEffect(() => {
    // Set page title
    document.title = "Engineering Project Categories | Electronics, Mechanical, Software | KitsIndia";

    // Set meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content',
        'Explore 6+ engineering project categories: Electronics, Software, Mechanical, Electrical, Civil & Mechatronics. 500+ complete project kits with source code & expert support!'
      );
    } else {
      // Create meta description if it doesn't exist
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Explore 6+ engineering project categories: Electronics, Software, Mechanical, Electrical, Civil & Mechatronics. 500+ complete project kits with source code & expert support!';
      document.head.appendChild(meta);
    }
  }, []);

  const categoryIcons = {
    Electronics: "⚡",
    Software: "💻",
    Computer: "💻",
    Mechanical: "⚙️",
    Electrical: "🔌",
    Civil: "🏗️",
    Mechatronics: "🤖",
    Robotics: "🤖",
    IoT: "🌐",
    "AI/ML": "🧠",
    "Data Science": "📊",
    "Engineering kits": "🛠️",
  };

  const categoryColors = {
    Electronics: "from-[#003e8b] to-[#002e66]",
    Software: "from-[#003e8b] to-[#002e66]",
    Computer: "from-[#003e8b] to-[#002e66]",
    Mechanical: "from-[#003e8b] to-[#002e66]",
    Electrical: "from-[#003e8b] to-[#002e66]",
    Civil: "from-[#003e8b] to-[#002e66]",
    Mechatronics: "from-[#003e8b] to-[#002e66]",
    Robotics: "from-[#003e8b] to-[#002e66]",
    IoT: "from-[#003e8b] to-[#002e66]",
    "AI/ML": "from-[#003e8b] to-[#002e66]",
    "Data Science": "from-[#003e8b] to-[#002e66]",
    "Engineering kits": "from-[#003e8b] to-[#002e66]",
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

  if (!categoriesData.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Skeleton Header */}
          <div className="text-center mb-12 animate-pulse">
            <div className="h-12 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-2/3 mx-auto mb-2"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>

          {/* Skeleton Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 animate-pulse">
                {/* Header aspect */}
                <div className="h-24 bg-gray-200 p-6 flex items-center justify-between">
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-12 h-12 rounded-full bg-gray-300"></div>
                    <div className="space-y-2 w-2/3">
                      <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
                {/* Content aspect */}
                <div className="p-6 space-y-5">
                  <div className="space-y-2">
                    <div className="h-3.5 bg-gray-200 rounded w-full"></div>
                    <div className="h-3.5 bg-gray-200 rounded w-5/6"></div>
                  </div>
                  <div className="space-y-2.5">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                      <div className="h-6 bg-gray-200 rounded w-20"></div>
                      <div className="h-6 bg-gray-200 rounded w-14"></div>
                    </div>
                  </div>
                  <div className="h-10 bg-gray-200 rounded w-full mt-4"></div>
                </div>
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
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Engineering Projects
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore comprehensive project solutions across all major engineering
            disciplines. Each category offers premium kits designed by industry
            experts.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {categoriesData.map((categoryObj) => {
            const category = categoryObj.name;
            const categoryId = categoryObj.id;
            const categorySlug = categoryObj.slug;
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

                    {category && categorySlug && (
                      <div className="flex justify-center mt-6">
                        <Link to={`/categories/${categorySlug}`} className="w-full">
                          <Button className="w-full text-white bg-red-500 hover:bg-red-700 font-semibold py-2.5 rounded-lg transition-colors text-sm">
                            Explore {category} Projects
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* ✅ Stats Section (AFTER the cards) */}
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
            <Zap className="h-8 w-8 text-blue-700 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">4.8/5</div>
            <div className="text-gray-600">Rating</div>
          </div>
        </div>
      </div>
    </div>
  );

}
