import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { Button } from "../components/ui/Botton";
import { ProductCard } from "../components/ProductCard";
import { ArrowRight, Star, Users, Award, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api";

const HomePage = () => {
  const [allProducts, setAllProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const allProjectsRef = useRef(null);

  useEffect(() => {
    api
      .get("/api/projects")
      .then((res) => {
        const mappedProjects = res.data.map((project) => ({
          ...project,
          originalPrice: Math.floor(project.price * 1.5),
          rating: 4.5,
          reviews: 12,
          difficulty: "Beginner",
          components: ["Code", "Docs", "Support"],
        }));
        setAllProducts(mappedProjects);
      })
      .catch((err) => {
        console.error("Error fetching projects:", err);
      });
  }, []);

  const scrollToProjects = () => {
    allProjectsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-[240px] text-lg text-white px-8 py-3 bg-red-600 hover:bg-red-700 rounded-md transition-all duration-300 active:border active:border-orange-400 active:ring-2 active:ring-orange-300 flex items-center justify-center gap-2"
              >
                Explore Projects{" "}
                <span className="text-white transition-all duration-300">
                  →
                </span>
              </motion.button>

              <Link to="/categories">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-[240px] relative overflow-hidden px-8 py-3 text-lg font-semibold text-white bg-gradient-to-r from-orange-500 to-orange-600 border-none rounded-md shadow-md transition-all duration-300 hover:from-white hover:to-white hover:text-orange-600 hover:ring-2 hover:ring-orange-500 active:scale-95 flex items-center justify-center gap-2"
                >
                  View Categories
                </motion.button>
              </Link>
            </div>

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
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.2 }}
          >
            {[
              {
                icon: <Users className="h-8 w-8 text-red-600" />,
                bg: "bg-red-100",
                value: 10000,
                suffix: "+",
                label: "Happy Students",
              },
              {
                icon: <Award className="h-8 w-8 text-green-600" />,
                bg: "bg-green-100",
                value: 500,
                suffix: "+",
                label: "Project Kits",
              },
              {
                icon: <Star className="h-8 w-8 text-purple-600" />,
                bg: "bg-purple-100",
                value: 4.8,
                suffix: "/5",
                decimals: 1,
                label: "Average Rating",
              },
              {
                icon: <Zap className="h-8 w-8 text-orange-600" />,
                bg: "bg-orange-100",
                value: 24,
                suffix: "/7",
                label: "Support",
              },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="text-center hover:scale-105 transition-transform duration-300"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <div
                  className={`w-16 h-16 ${stat.bg} rounded-full flex items-center justify-center mx-auto mb-4 shadow-md`}
                >
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  <CountUp
                    start={0}
                    end={stat.value}
                    duration={2}
                    suffix={stat.suffix}
                    decimals={stat.decimals || 0}
                  />
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* All Projects Section */}
      <section className="py-16" ref={allProjectsRef}>
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
            <Link to="/projects">
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
              <motion.div
                key={category}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                className="text-center group cursor-pointer transition-transform"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-bold text-red-600">
                    {category[0]}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
                  {category}
                </h3>
              </motion.div>
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

          <motion.button
            onClick={scrollToProjects}
            className="bg-white text-red-600 px-6 py-3 rounded-lg text-lg font-semibold shadow-md hover:bg-gray-100 transition-all duration-300 ease-in-out hover:shadow-xl hover:scale-105"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Browse All Projects
          </motion.button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
