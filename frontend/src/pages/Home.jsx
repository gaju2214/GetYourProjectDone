import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { Button } from "../components/ui/Botton";
import { ProductCard } from "../components/ProductCard";
import { Users, Award, Star, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api";
import usePageViews from "./hooks/usePageViews";
import ReactGA from "react-ga4";
import AnimatedBuildScene from "../components/AnimatedBuildScene";

ReactGA.initialize("G-RKR4H82WJW");
ReactGA.send("pageview");

const HomePage = () => {
  usePageViews();
  const [allProducts, setAllProducts] = useState([]);
  const allProjectsRef = useRef(null);

  useEffect(() => {
    document.title =
      "Project Kits for Engineering Students | Electronics, Mechanical, Computer & Robotics | Get Your Project Done";

    const metaDescription = document.querySelector('meta[name="description"]');
    const descriptionContent =
      "Buy ready-to-use engineering project kits with source code, circuit diagrams & 24/7 expert help. 500+ Electronics, Mechanical & Software projects for students. Instant download!";

    if (metaDescription) {
      metaDescription.setAttribute("content", descriptionContent);
    } else {
      const meta = document.createElement("meta");
      meta.name = "description";
      meta.content = descriptionContent;
      document.head.appendChild(meta);
    }
  }, []);

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
      .catch((err) => console.error("Error fetching projects:", err));
  }, []);

  const scrollToProjects = () =>
    allProjectsRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="space-y-16">
      {/* 🔹 New Hero Section with Dynamic Animation */}
      <section className="relative w-full">
        <AnimatedBuildScene />
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
              Explore project kits across all engineering disciplines.
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
                className="px-8 py-3 text-lg font-semibold text-orange-600 border border-orange-500 rounded-md hover:bg-orange-50 transition-all duration-300"
              >
                Load More Projects
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
