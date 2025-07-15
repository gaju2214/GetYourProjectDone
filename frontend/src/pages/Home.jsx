import React from "react";
import { Button } from "../components/ui/Botton";
import { ProductCard } from "../components/ProductCard";
import { mockProducts } from "../lib/mock-data";
import { ArrowRight, Star, Users, Award, Zap } from "lucide-react";
import { Link } from "react-router-dom"; // Replace if you're still using Next.js

export default function HomePage() {
  const allProducts = mockProducts;

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-white to-red-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Premium Engineering
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500">
                {" "}
                Project Solutions
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Complete project solutions for Electronics, Mechanical,
              Electrical, Software, Civil, and Mechatronics students. Build,
              Learn, and Excel in your engineering journey with Get Your Project
              Done.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="w-[240px] text-lg text-white px-8 py-3 bg-red-600 hover:bg-red-700 rounded-md transition-all duration-300 active:border active:border-orange-400 active:ring-2 active:ring-orange-300 flex items-center justify-center gap-2"
              >
                Explore Projects{" "}
                <span className="text-white transition-all duration-300">
                  →
                </span>
              </Button>

              <Link to="/404">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-[240px] relative overflow-hidden px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 border-none rounded-md shadow-md transition-all duration-300 hover:from-white hover:to-white hover:text-orange-600 hover:ring-2 hover:ring-orange-500 active:scale-95 flex items-center justify-center gap-2"
                >
                  View Categories
                </Button>
              </Link>
            </div>

            {/* Network Hint */}
            <div className="mt-8 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <p className="text-sm text-orange-700">
                💡 <strong>Pro Tip:</strong> Click on the "Get Your Project
                Done" logo above to explore our complete ecosystem network!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-red-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                10,000+
              </div>
              <div className="text-gray-600">Happy Students</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">500+</div>
              <div className="text-gray-600">Project Kits</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">4.8/5</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-orange-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">24/7</div>
              <div className="text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* All Projects Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              All Engineering Project Kits
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive collection of premium project kits across all
              engineering disciplines with detailed components and expert
              guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/404">
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-3 text-lg font-semibold text-orange-600 border border-orange-500 bg-gradient-to-r from-orange-50 via-white to-orange-100 rounded-md shadow-sm transition-all duration-300 hover:from-orange-100 hover:to-orange-200 hover:shadow-md active:ring-2 active:ring-orange-300 focus:ring-2 focus:ring-orange-400 hover:text-orange-600 active:text-orange-600 focus:text-orange-600"
              >
                Load More Projects
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Preview */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Engineering Disciplines
            </h2>
            <p className="text-xl text-gray-600">
              Comprehensive project solutions across all major engineering
              fields
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              "Electronics",
              "Mechanical",
              "Electrical",
              "Software",
              "Civil",
              "Mechatronics",
            ].map((category) => (
              <div key={category} className="text-center group cursor-pointer">
                <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-bold text-red-600">
                    {category[0]}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                  {category}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-orange-500">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get Your Project Done?
          </h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            Join thousands of engineering students who have successfully
            completed their projects with our premium kits. Achieve your goals
            today!
          </p>
          <Link to="/404">
            <Button
              size="lg"
              className="bg-white text-red-600 hover:bg-gray-100"
            >
              Browse All Projects
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, value, label, bg }) {
  return (
    <div className="text-center">
      <div
        className={`w-16 h-16 ${bg} rounded-full flex items-center justify-center mx-auto mb-4`}
      >
        {icon}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
      <div className="text-gray-600">{label}</div>
    </div>
  );
}
