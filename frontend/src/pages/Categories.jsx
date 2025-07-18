import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Botton";
import { categories, categoryProducts } from "../lib/mock-data";
import { ArrowRight, Users, Award, Clock, Zap } from "lucide-react";

export default function CategoriesPage() {
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
          {Object.entries(categories).map(([category, subcategories]) => {
            const productCount = categoryProducts[category]?.length || 0;
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
                          {productCount} Projects Available
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

                    {/* Subcategories */}
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900">
                        Specializations:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {Object.keys(subcategories)
                          .slice(0, 4)
                          .map((subcategory) => (
                            <Badge
                              key={subcategory}
                              variant="outline"
                              className="text-xs"
                            >
                              {subcategory}
                            </Badge>
                          ))}
                        {Object.keys(subcategories).length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{Object.keys(subcategories).length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        Complete component kits included
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Step-by-step documentation
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        Video tutorials & code
                      </div>
                    </div>

                    <Link to={`/categories/${category.toLowerCase()}`}>
                      <Button className="text-white mt-4 grouptext-lg px-20 bg-red-500 hover:bg-red-700">
                        Explore {category} Projects
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your Engineering Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of engineering students who have successfully
            completed their projects with our premium kits and expert support.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/#all-projects">
              <Button
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Browse All Projects
              </Button>
            </Link>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                Contact Support
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
