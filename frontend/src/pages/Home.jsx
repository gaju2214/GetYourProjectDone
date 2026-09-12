import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
import { Button } from "../components/ui/Botton";
import { ProductCard } from "../components/ProductCard";
import KitCard from "../components/KitCard";
import {
  Users, Award, Star, Zap, ChevronRight, ChevronLeft, Play, ArrowRight, ShieldCheck,
  Truck, HelpCircle, Phone, Package, Heart, Shield, FileText, ExternalLink,
  Cpu, Rocket, Layers, Hammer, Compass, CheckCircle2, ShieldAlert,
  Bot, Wifi, Code, Settings, Plane, Home, Printer, Radio, Terminal
} from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api";
import usePageViews from "./hooks/usePageViews";
import ReactGA from "react-ga4";
import { getBlogs } from "../services/blogService";


ReactGA.initialize("G-RKR4H82WJW");
ReactGA.send("pageview");

const HomePage = () => {
  usePageViews();
  const [allProducts, setAllProducts] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [playingVideoId, setPlayingVideoId] = useState(null);
  const [playingShortId, setPlayingShortId] = useState(null);
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);
  const allProjectsRef = useRef(null);

  // Loading state for product list fetching
  const [loadingProducts, setLoadingProducts] = useState(true);

  // States and timer for the glowing product billboard images (delayed slideshow)
  const [currentBillboardImg, setCurrentBillboardImg] = useState(0);
  const billboardImages = [
    "/touch_display_dashboard.jpg",
    "/touch_display_robotics.jpg",
    "/touch_display_mediacenter.jpg",
    "/touch_display_audiostudio.jpg",
    "/touch_display_weather.jpg"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBillboardImg((prev) => (prev + 1) % billboardImages.length);
    }, 4000); // 4 seconds delay
    return () => clearInterval(timer);
  }, [billboardImages.length]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonialIdx((prev) => (prev + 1) % 3);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    document.title =
      "Project Kits for Engineering Students | Electronics, Mechanical, Computer & Robotics | KitsIndia";

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
    setLoadingProducts(true);
    api
      .get("/api/projects/by-category-slug/engineering-kit")
      .then((res) => {
        const mappedProjects = res.data.map((project) => ({
          ...project,
          originalPrice: Math.floor(project.price * 1.5),
          rating: 4.5,
          reviews: 12,
          difficulty: project.difficulty || "Beginner",
          components: project.components || ["Code", "Docs", "Support"],
        }));
        setAllProducts(mappedProjects);
      })
      .catch((err) => console.error("Error fetching projects:", err))
      .finally(() => setLoadingProducts(false));
  }, []);

  const [blogs, setBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(true);

  useEffect(() => {
    setLoadingBlogs(true);
    getBlogs({ limit: 3 })
      .then((res) => {
        if (res.success) {
          setBlogs(res.blogs || []);
        }
      })
      .catch((err) => console.error("Error fetching blogs:", err))
      .finally(() => setLoadingBlogs(false));
  }, []);


  // Filter products by category/difficulty
  const filteredProducts = allProducts.filter((product) => {
    if (selectedFilter === "All") return true;
    return product.difficulty === selectedFilter;
  });

  const sidebarCategories = [
    { name: "PCB Manufacturing", path: "/categories/electronics", icon: <Cpu className="w-4 h-4" /> },
    { name: "3D Printing & Design", path: "/categories/mechanical", icon: <Layers className="w-4 h-4" /> },
    { name: "Laser Precision Cutting", path: "/categories/mechanical", icon: <Compass className="w-4 h-4" /> },
    { name: "Custom Battery Packs", path: "/categories/electrical", icon: <Zap className="w-4 h-4" /> }
  ];

  const engineeringCategories = [
    { name: "Electronics Projects", icon: <Cpu className="w-5 h-5" />, tag: "Sensors & Circuits", path: "/categories/electronics" },
    { name: "Robotics & Automation", icon: <Bot className="w-5 h-5" />, tag: "Microcontrollers & Motors", path: "/categories/robotics" },
    { name: "IoT & Wireless", icon: <Wifi className="w-5 h-5" />, tag: "ESP32 & NodeMCU", path: "/categories/iot" },
    { name: "Electrical Projects", icon: <Zap className="w-5 h-5" />, tag: "Power & Systems", path: "/categories/electrical" },
    { name: "Computer Science", icon: <Code className="w-5 h-5" />, tag: "Python, Web & Software", path: "/categories/computer" },
    { name: "Mechanical Projects", icon: <Settings className="w-5 h-5" />, tag: "CAD, Mechanisms & 3D", path: "/categories/mechanical" }
  ];

  const diyCategories = [
    { name: "Drone Technologies", icon: <Plane className="w-5 h-5" />, tag: "Aerodynamics & Flight", path: "/categories/robotics" },
    { name: "Smart Home Automation", icon: <Home className="w-5 h-5" />, tag: "Espresso & Smart Devices", path: "/categories/iot" },
    { name: "Development Boards", icon: <Cpu className="w-5 h-5" />, tag: "Arduino, ESP & STM", path: "/categories/electronics" },
    { name: "DIY Maker Kits", icon: <Package className="w-5 h-5" />, tag: "Hobbyist Prototyping", path: "/categories/electronics" },
    { name: "Sensors & Modules", icon: <Radio className="w-5 h-5" />, tag: "DIY Hardware Components", path: "/categories/electronics" },
    { name: "3D Spares & CAD Design", icon: <Printer className="w-5 h-5" />, tag: "PLA/ABS Filament & Prints", path: "/categories/mechanical" }
  ];

  const diyShortsList = [
    { id: "uJ1T64w6-n0", title: "DIY Automatic Plant Waterer in 60s", views: "45k views", likes: "2.4k likes" },
    { id: "3lBEEkL4Msc", title: "Building a Micro Drone at Home!", views: "120k views", likes: "8.5k likes" },
    { id: "S3T_uH0vK8o", title: "ESP32 WiFi Scanner Project Guide", views: "85k views", likes: "5.1k likes" },
    { id: "pCspgBIPw2M", title: "Arduino Gesture Control Robotic Arm", views: "65k views", likes: "3.8k likes" }
  ];

  const learnVideosList = [
    { id: "d8_xXNcGYgo", title: "Getting Started with Arduino Uno: Complete Guide for Beginners", views: "15k views", duration: "12:45", category: "Microcontrollers" },
    { id: "3P_WjK16C9Y", title: "ESP32 Web Server Tutorial: Control LEDs from Anywhere", views: "8.5k views", duration: "18:20", category: "IoT" },
    { id: "7-z4XF3MhM4", title: "How to Design a Custom PCB Layout in EasyEDA", views: "22k views", duration: "25:10", category: "Hardware Design" },
    { id: "9U6GDonDYPA", title: "Introduction to ROS (Robot Operating System) with Python", views: "11k views", duration: "30:15", category: "Robotics" }
  ];

  // Blogs state is loaded dynamically from the backend API

  const testimonialsList = [
    {
      author: "Rahul Deshmukh",
      college: "Pune University",
      rating: 5,
      date: "2026.07.12",
      text: "I was worried if the kit sent would match my college project synopsis, but it was exactly the same! The ESP32 code compiled on the first try and the circuit diagrams were crystal clear."
    },
    {
      author: "Priya Sen",
      college: "VIT Vellore",
      rating: 5,
      date: "2026.06.28",
      text: "Perfect for final year submissions! The project kit matched the hardware shown in the demo video 100%. Highly recommend their custom design service."
    },
    {
      author: "Arjun Nair",
      college: "NIT Trichy",
      rating: 5,
      date: "2026.05.15",
      text: "I customized the ESP32 code they provided for my IoT project. It's the same robust quality as promised. Customer support helped me configure the sensors over WhatsApp."
    }
  ];

  const premiumServices = [
    { name: "Online FDM 3D Printing", desc: "Industrial grade PLA/ABS prototyping", icon: "🖨️" },
    { name: "Non-Metal Laser Cutting", desc: "Precision cuts on Acrylic & MDF", icon: "📐" },
    { name: "PCB Prototyping Service", desc: "Double-sided high speed circuit manufacturing", icon: "📟" },
    { name: "Custom Battery Pack Assembly", desc: "Lithium-Ion arrays with smart BMS boards", icon: "🔋" }
  ];

  const scrollToProjects = () =>
    allProjectsRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <div className="space-y-16 bg-[#fafafa] pb-16 text-gray-800">

      {/* 🔹 1. Hero / Dashboard Category & Interactive Banner */}
      <section className="max-w-7xl mx-auto px-4 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">

          {/* Quick-Access Tech Dock */}
          <div className="hidden lg:block lg:col-span-3 bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col justify-between shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
            <div>
              <div className="bg-[#1c1c1c] text-white py-4 px-5 flex items-center justify-between font-bold text-xs uppercase tracking-widest border-b border-gray-800">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#003e8b] animate-pulse"></span>
                  Tech Terminal
                </span>
              </div>
              <div className="p-2 space-y-1">
                {sidebarCategories.map((cat, i) => (
                  <Link
                    key={i}
                    to={cat.path}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-blue-50/50 transition-all text-xs font-bold text-gray-700 hover:text-[#003e8b] group"
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-400 group-hover:text-[#003e8b] transition-colors">{cat.icon}</span>
                      <span>{cat.name}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                ))}
              </div>
            </div>

            <div className="p-4 m-2 bg-gray-50 border border-gray-150 rounded-lg">
              <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block mb-1">Custom Design Request</span>
              <p className="text-[10px] text-gray-500 mb-3 leading-relaxed">Submit diagrams or CAD designs for fabrication.</p>
              <a
                href="https://wa.me/917030023573?text=Hi%20Support%2C%20I%2520need%2520custom%2520engineering%2520design"
                target="_blank"
                rel="noreferrer"
                className="w-full bg-[#003e8b] hover:bg-[#002e66] text-white font-bold py-2.5 rounded text-center block text-[10px] uppercase tracking-widest border-0 transition-colors cursor-pointer shadow-sm shadow-blue-600/10"
              >
                Inquire Terminal
              </a>
            </div>
          </div>

          {/* Glowing Product Billboard */}
          <div className="lg:col-span-9 bg-[#111] rounded-xl overflow-hidden relative min-h-[380px] md:min-h-[420px] flex flex-col justify-center p-8 sm:p-10 md:p-12 text-white border border-gray-800 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(251,123,2,0.15),rgba(0,0,0,0))]"></div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10 w-full">
              {/* Left Column: Text Content */}
              <div className="md:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-1.5 bg-[#fb7b02]/10 border border-[#fb7b02]/20 text-[#fb7b02] text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                  <Rocket className="w-3 h-3 animate-bounce" /> Developer Launchpad
                </div>

                <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
                  Raspberry Pi <span className="bg-gradient-to-r from-[#fb7b02] to-orange-400 bg-clip-text text-transparent">Touch Display 2</span>
                </h2>

                <p className="text-gray-400 text-xs sm:text-sm max-w-lg leading-relaxed font-medium">
                  Sleek 10.1" multi-touch display modules now ready for pre-order. Designed for smart automation dashboards, media centers, and robotics controls.
                </p>

                <div className="pt-2 flex flex-wrap gap-4 items-center">
                  <button
                    onClick={scrollToProjects}
                    className="bg-[#fb7b02] hover:bg-[#d46802] text-white font-extrabold px-6 py-3.5 rounded-lg text-xs uppercase tracking-wider transition-all border-0 cursor-pointer shadow-lg shadow-[#fb7b02]/20"
                  >
                    Configure Hardware
                  </button>
                  <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    Shipping worldwide
                  </div>
                </div>
              </div>

              {/* Right Column: Delayed Image Slider (Large size, no double border) */}
              <div className="md:col-span-5 w-full flex flex-col justify-center items-center relative group">
                <div className="w-full h-56 sm:h-64 md:h-[280px] lg:h-[320px] relative overflow-hidden rounded-xl border border-gray-800/60 shadow-xl bg-transparent">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentBillboardImg}
                      src={billboardImages[currentBillboardImg]}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.05 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                      className="w-full h-full object-cover rounded-xl"
                      alt="Developer Launchpad Screen Mockup"
                    />
                  </AnimatePresence>

                  {/* Carousel indicators overlaid on bottom of image */}
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-20">
                    {billboardImages.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentBillboardImg(idx)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          idx === currentBillboardImg ? "bg-[#fb7b02] w-4" : "bg-white/40 hover:bg-white/70"
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🔹 Glowing Impact Stats Banner Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-[#111] border border-gray-850 rounded-2xl p-8 relative overflow-hidden shadow-[0_10px_35px_-10px_rgba(0,0,0,0.4)]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_-20%,rgba(251,123,2,0.08),rgba(0,0,0,0))]"></div>
          <div className="relative grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">

            {/* Stat 1 */}
            <div className="flex flex-col items-center justify-center p-4">
              <span className="text-[#fb7b02] text-4xl sm:text-5xl font-black tracking-tight leading-none">
                <CountUp end={500} duration={2.5} enableScrollSpy scrollSpyOnce />+
              </span>
              <span className="text-white font-extrabold text-xs uppercase tracking-wider mt-3">Project Kits</span>
              <span className="text-gray-500 text-[10px] mt-1 font-medium leading-normal max-w-[160px]">Pre-assembled microcontroller modules</span>
            </div>

            {/* Stat 2 */}
            <div className="p-4 pt-6 lg:pt-4 border-l-0 border-t-0 border-gray-800 lg:border-l border-dashed flex flex-col items-center justify-center">
              <span className="text-white text-4xl sm:text-5xl font-black tracking-tight leading-none">
                <CountUp end={10} duration={2} enableScrollSpy scrollSpyOnce />k+
              </span>
              <span className="text-white font-extrabold text-xs uppercase tracking-wider mt-3">Projects Done</span>
              <span className="text-gray-500 text-[10px] mt-1 font-medium leading-normal max-w-[160px]">With verified schematic layouts & code</span>
            </div>

            {/* Stat 3 */}
            <div className="p-4 pt-6 lg:pt-4 border-l-0 border-t-0 border-gray-800 lg:border-l border-dashed flex flex-col items-center justify-center">
              <span className="text-[#fb7b02] text-4xl sm:text-5xl font-black tracking-tight leading-none">
                <CountUp end={24} duration={2} enableScrollSpy scrollSpyOnce />/7
              </span>
              <span className="text-white font-extrabold text-xs uppercase tracking-wider mt-3">Expert Support</span>
              <span className="text-gray-500 text-[10px] mt-1 font-medium leading-normal max-w-[160px]">Dedicated engineer WhatsApp helpdesk</span>
            </div>

            {/* Stat 4 */}
            <div className="p-4 pt-6 lg:pt-4 border-l-0 border-t-0 border-gray-800 lg:border-l border-dashed flex flex-col items-center justify-center">
              <span className="text-white text-4xl sm:text-5xl font-black tracking-tight leading-none">
                <CountUp end={99.8} decimals={1} duration={2.5} enableScrollSpy scrollSpyOnce />%
              </span>
              <span className="text-white font-extrabold text-xs uppercase tracking-wider mt-3">Success Rate</span>
              <span className="text-gray-500 text-[10px] mt-1 font-medium leading-normal max-w-[160px]">Direct college submission success</span>
            </div>

          </div>
        </div>
      </section>

      {/* 🔹 2. Modern Categories Navigation (Double-Row) */}
      <section className="max-w-7xl mx-auto px-4 space-y-10">
        {/* Row 1: Engineering Project Kits */}
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-3">
            <div>
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#003e8b]"></span>
                Engineering Kits Categories
              </h2>
              <p className="text-[10px] text-gray-400 mt-0.5">Ready-to-use project kits for university & college submissions</p>
            </div>
            <Link to="/categories" className="text-[10px] font-extrabold text-[#003e8b] hover:text-[#002e66] uppercase tracking-wider mt-2 sm:mt-0 flex items-center gap-1">
              Browse Categories <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {engineeringCategories.map((cat, idx) => (
              <div key={idx}>
                <Link
                  to={cat.path}
                  className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:border-[#003e8b] -translate-y-0 hover:-translate-y-1 transition-all duration-300 cursor-pointer group h-full justify-between"
                >
                  <div className="flex flex-col items-center w-full">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#003e8b] group-hover:bg-[#003e8b] group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-inner mb-4">
                      {cat.icon}
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-gray-800 block w-full group-hover:text-[#003e8b] transition-colors leading-snug">
                      {cat.name}
                    </span>
                    <span className="text-[10px] text-gray-500 font-semibold tracking-wide uppercase mt-1.5 block">{cat.tag}</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-[#003e8b] mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-0.5">
                    View Kits →
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Row 2: DIY Projects Kits */}
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 pb-3">
            <div>
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                DIY Project Kits
              </h2>
              <p className="text-[10px] text-gray-400 mt-0.5">Hobbyist electronics, smart automation, and maker boards</p>
            </div>
            <a href="https://getyourprojectdone.in/iot_platform/" target="_blank" rel="noreferrer" className="text-[10px] font-extrabold text-blue-500 hover:text-blue-600 uppercase tracking-wider mt-2 sm:mt-0 flex items-center gap-1">
              Explore IoT Platform <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {diyCategories.map((cat, idx) => (
              <div key={idx}>
                <Link
                  to={cat.path}
                  className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col items-center text-center shadow-sm hover:shadow-md hover:border-blue-500 -translate-y-0 hover:-translate-y-1 transition-all duration-300 cursor-pointer group h-full justify-between"
                >
                  <div className="flex flex-col items-center w-full">
                    <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-500 group-hover:bg-blue-500 group-hover:text-white flex items-center justify-center transition-all duration-300 shadow-inner mb-4">
                      {cat.icon}
                    </div>
                    <span className="text-xs sm:text-sm font-bold text-gray-800 block w-full group-hover:text-blue-500 transition-colors leading-snug">
                      {cat.name}
                    </span>
                    <span className="text-[10px] text-gray-500 font-semibold tracking-wide uppercase mt-1.5 block">{cat.tag}</span>
                  </div>
                  <span className="text-[10px] font-extrabold text-blue-500 mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-0.5">
                    Explore →
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🔹 3. Engineering Kits for Sale (Direct Kits Grid) */}
      <section className="max-w-7xl mx-auto px-4" ref={allProjectsRef}>
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-gray-200 pb-4 mb-8 gap-4">
          <div>
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-widest">
              Engineering Kits For Sale
            </h2>
            <p className="text-xs text-gray-400 mt-1">Pre-assembled systems complete with working source code, circuit schematic layouts & support documentation</p>
          </div>

          {/* Difficulty Filter Tabs */}
          <div className="flex bg-white border border-gray-250 p-1 rounded-lg shadow-sm gap-1 max-w-fit">
            {["All", "Beginner", "Intermediate", "Advanced"].map((level) => (
              <button
                key={level}
                onClick={() => setSelectedFilter(level)}
                className={`px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider cursor-pointer border-0 transition-all ${selectedFilter === level
                  ? "bg-[#003e8b] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-800 bg-transparent"
                  }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loadingProducts ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-lg p-4 animate-pulse space-y-4 shadow-sm">
                <div className="aspect-video bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                <div className="h-8 bg-gray-200 rounded w-full pt-2"></div>
              </div>
            ))
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredProducts.slice(0, 6).map((product) => (
                <motion.div
                  layout
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <KitCard product={product} categorySlug="engineering-kit" />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        <div className="text-center mt-10">
          <Link to="/engineering-kit">
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-3.5 text-xs font-extrabold text-[#003e8b] border-2 border-[#003e8b] rounded-lg hover:bg-blue-50 hover:text-[#002e66] transition-all cursor-pointer shadow-sm"
            >
              Load More Assembly Modules
            </Button>
          </Link>
        </div>
      </section>

      {/* 🔹 4. DIY (YouTube Shorts Shelf) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end border-b border-gray-200 pb-4 mb-8">
          <div>
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-widest">
              DIY Projects & Shorts
            </h2>
            <p className="text-xs text-gray-400 mt-1">Quick 60-second micro-project guides and robotics demos</p>
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">DIY Shelf</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {diyShortsList.map((short) => (
            <div
              key={short.id}
              className="relative w-full aspect-[9/16] rounded-xl overflow-hidden bg-black shadow-sm border border-gray-200 group hover:border-[#003e8b] hover:shadow-lg transition-all duration-300"
            >
              {playingShortId === short.id ? (
                <iframe
                  className="w-full h-full border-0 absolute inset-0"
                  src={`https://www.youtube.com/embed/${short.id}?autoplay=1&mute=0&modestbranding=1&rel=0`}
                  title={short.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              ) : (
                <>
                  <img
                    src={`https://img.youtube.com/vi/${short.id}/hqdefault.jpg`}
                    alt={short.title}
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/35 group-hover:bg-black/50 transition-colors flex items-center justify-center cursor-pointer" onClick={() => setPlayingShortId(short.id)}>
                    <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-200">
                      <Play className="w-6 h-6 fill-white ml-0.5" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 flex flex-col justify-end text-white">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#003e8b]">{short.likes}</span>
                    <h4 className="font-extrabold text-[11px] sm:text-xs leading-snug line-clamp-2 mt-0.5">{short.title}</h4>
                    <span className="text-[9px] text-gray-400 mt-1 font-bold">{short.views}</span>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 🔹 5. Learn (YouTube Video Cards) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end border-b border-gray-200 pb-4 mb-8">
          <div>
            <h2 className="text-lg font-black text-gray-900 uppercase tracking-widest">
              Learn & Build Tutorials
            </h2>
            <p className="text-xs text-gray-400 mt-1">Microcontroller interfacing, sensor layouts, and firmware step-by-step guides</p>
          </div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Video Hub</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {learnVideosList.map((vid) => (
            <div
              key={vid.id}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden group hover:border-[#003e8b] shadow-sm transition-all duration-300"
            >
              <div className="relative aspect-video bg-gray-950 flex items-center justify-center overflow-hidden">
                {playingVideoId === vid.id ? (
                  <iframe
                    className="w-full h-full border-0 absolute inset-0"
                    src={`https://www.youtube.com/embed/${vid.id}?autoplay=1&mute=0&modestbranding=1&rel=0`}
                    title={vid.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <>
                    <img
                      src={`https://img.youtube.com/vi/${vid.id}/hqdefault.jpg`}
                      alt={vid.title}
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/45 group-hover:bg-black/60 transition-colors flex items-center justify-center cursor-pointer" onClick={() => setPlayingVideoId(vid.id)}>
                      <div className="w-16 h-16 rounded-full bg-[#003e8b]/90 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-200">
                        <Play className="w-7 h-7 fill-white ml-1" />
                      </div>
                    </div>
                  </>
                )}
              </div>
              <div className="p-4 bg-white">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#003e8b] bg-blue-600/10 px-2.5 py-1 rounded-full">{vid.category}</span>
                <h4 className="font-extrabold text-sm sm:text-base text-gray-800 leading-snug line-clamp-2 mt-2.5">
                  {vid.title}
                </h4>
                <div className="flex items-center gap-4 text-xs text-gray-400 mt-3.5 font-bold">
                  <span>⏱️ {vid.duration} mins</span>
                  <span>👀 {vid.views}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🔹 6. Technical Blogs Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="border-b border-gray-200 pb-4 mb-8">
          <h2 className="text-lg font-black text-gray-900 uppercase tracking-widest">
            Latest Technical Blogs
          </h2>
          <p className="text-xs text-gray-400 mt-1">Read guides, component fabrication advice, and engineering tutorials</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {loadingBlogs ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm p-5 space-y-4 animate-pulse">
                <div className="bg-gray-200 aspect-[16/10] w-full rounded-lg"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </div>
            ))
          ) : blogs.length === 0 ? (
            <p className="col-span-3 text-center text-xs text-gray-400 italic py-10">No technical blogs published yet.</p>
          ) : (
            blogs.map((blog, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between hover:border-[#003e8b] hover:shadow-lg transition-all duration-300 group"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={blog.featuredImage || "https://via.placeholder.com/500"}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-[#1c1c1c]/90 text-white text-[9px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {blog.category}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider block">
                      {new Date(blog.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}{" "}
                      | By {blog.Author?.name || "Author"}
                    </span>
                    <h3 className="font-black text-sm sm:text-base text-gray-800 leading-snug group-hover:text-[#003e8b] transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">{blog.excerpt}</p>
                  </div>
                  <Link
                    to={`/blogs/${blog.slug}`}
                    className="pt-4 border-t border-gray-100 flex items-center text-xs font-extrabold text-[#003e8b] group-hover:text-[#002e66] transition-colors cursor-pointer"
                  >
                    Read Full Article <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* 🔹 7. Testimonials: Students Feedback ("Is my project same as kit?") */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            {/* Google Reviews Badge */}
            <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-gray-150 pb-6 lg:pb-0 lg:pr-8 text-center flex flex-col items-center justify-center">
              <div className="text-2xl font-black text-gray-900 flex items-center gap-1 justify-center mb-1">
                <span className="text-[#4285F4]">G</span>
                <span className="text-[#EA4335]">o</span>
                <span className="text-[#FBBC05]">o</span>
                <span className="text-[#4285F4]">g</span>
                <span className="text-[#34A853]">l</span>
                <span className="text-[#EA4335]">e</span>
              </div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Student Testimonials</h3>
              <div className="flex justify-center my-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-xs text-gray-400 font-extrabold tracking-wider">4.9 / 5.0 Rating</span>
            </div>

            {/* Testimonials Ticker (Carousel) */}
            <div className="lg:col-span-9 flex flex-col justify-between items-center relative min-h-[220px] bg-gray-50 border border-gray-150 p-6 rounded-xl">

              {/* Manual Nav Arrows */}
              <button
                onClick={() => setActiveTestimonialIdx((prev) => (prev - 1 + 3) % 3)}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white border border-gray-200 hover:border-[#003e8b] text-gray-500 hover:text-[#003e8b] p-1.5 rounded-full shadow-sm cursor-pointer z-10 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTestimonialIdx((prev) => (prev + 1) % 3)}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white border border-gray-200 hover:border-[#003e8b] text-gray-500 hover:text-[#003e8b] p-1.5 rounded-full shadow-sm cursor-pointer z-10 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Slider Area */}
              <div className="w-full px-6 flex-1 flex flex-col justify-between">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTestimonialIdx}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col justify-between h-full"
                  >
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex flex-col">
                          <span className="text-xs sm:text-sm font-extrabold text-gray-800 leading-none">{testimonialsList[activeTestimonialIdx].author}</span>
                          <span className="text-[9px] text-gray-400 mt-1.5 font-bold uppercase tracking-wider">{testimonialsList[activeTestimonialIdx].college}</span>
                        </div>
                        <span className="text-[9px] text-gray-400 font-bold">{testimonialsList[activeTestimonialIdx].date}</span>
                      </div>

                      <div className="flex mb-3">
                        {[...Array(testimonialsList[activeTestimonialIdx].rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>

                      <p className="text-xs text-gray-500 italic leading-relaxed font-medium">
                        "{testimonialsList[activeTestimonialIdx].text}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-6 border-t border-gray-150 pt-3">
                      <div className="flex items-center gap-1.5 text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 bg-[#34A853] rounded-full"></span>
                        <span>Verified Project Match</span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Slider Dots */}
              <div className="flex items-center gap-1.5 mt-4">
                {[...Array(3)].map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveTestimonialIdx(idx)}
                    className={`w-2 h-2 rounded-full cursor-pointer transition-all ${activeTestimonialIdx === idx
                      ? "bg-[#003e8b] w-4"
                      : "bg-gray-300 hover:bg-gray-400"
                      }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  ></button>
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 🔹 8. Custom Engineering & Fabrication Services */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="border-b border-gray-200 pb-4 mb-8">
          <h2 className="text-lg font-black text-gray-900 uppercase tracking-widest">
            Custom Engineering Services
          </h2>
          <p className="text-xs text-gray-400 mt-1">Submit diagrams or CAD models for double-sided PCB layout, 3D printing & laser cut design fabrication</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {premiumServices.map((service, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col justify-between hover:border-[#003e8b] hover:shadow-[0_4px_25px_-5px_rgba(251,123,2,0.12)] transition-all duration-200 group"
            >
              <div className="p-5">
                <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-xl shadow-inner mb-4 group-hover:scale-105 transition-transform duration-200">
                  {service.icon}
                </div>
                <h3 className="font-extrabold text-sm text-gray-800 leading-snug">
                  {service.name}
                </h3>
                <p className="text-[10px] text-gray-400 mt-1.5 leading-relaxed">{service.desc}</p>
              </div>
              <div className="px-5 pb-5 pt-2">
                <a
                  href="https://wa.me/917030023573?text=Hi%20Support%2C%20I%20want%20to%20order%20the%20service"
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-[#1c1c1c] hover:bg-black text-white font-bold py-2 rounded text-center block text-[10px] uppercase tracking-wider cursor-pointer border-0 transition-colors shadow-sm"
                >
                  Configure Service
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 🔹 9. Benefits Banner */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border border-gray-200 bg-white rounded-xl p-6 shadow-sm text-center">
          <div className="flex flex-col items-center p-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-3">
              <Truck className="h-5 w-5 text-[#003e8b]" />
            </div>
            <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider">Same Day Shipping</h4>
            <p className="text-[10px] text-gray-400 mt-1 max-w-[200px] mx-auto leading-relaxed">Quick packaging and carrier dispatch on stock kits</p>
          </div>

          <div className="flex flex-col items-center p-3 border-y sm:border-y-0 sm:border-x border-gray-150">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-3">
              <Users className="h-5 w-5 text-[#003e8b]" />
            </div>
            <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider">Expert Call Support</h4>
            <p className="text-[10px] text-gray-400 mt-1 max-w-[200px] mx-auto leading-relaxed">Direct support from certified design engineering specialists</p>
          </div>

          <div className="flex flex-col items-center p-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-3">
              <Award className="h-5 w-5 text-[#003e8b]" />
            </div>
            <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider">140+ Brand Nodes</h4>
            <p className="text-[10px] text-gray-400 mt-1 max-w-[200px] mx-auto leading-relaxed">Direct integrations with top tier hardware component suppliers</p>
          </div>
        </div>
      </section>

      {/* 🔹 10. Infinite Brand loop */}
      <section className="max-w-7xl mx-auto px-4 pb-4">
        <div className="border border-gray-200 bg-white rounded-xl p-5 shadow-sm overflow-hidden">
          <div className="flex items-center space-x-12 animate-scroll-brands whitespace-nowrap">
            {[
              "ARDUINO", "RASPBERRY PI", "STMicroelectronics", "ESPRESSIF", "ALTERA",
              "SKYDROID", "ELEGOO", "SmartElex", "HTRC", "DOBOT", "WAVESHARE",
              "ARDUINO", "RASPBERRY PI", "STMicroelectronics", "ESPRESSIF", "ALTERA",
              "SKYDROID", "ELEGOO", "SmartElex", "HTRC", "DOBOT", "WAVESHARE"
            ].map((brand, idx) => (
              <span
                key={idx}
                className="text-gray-300 text-xs font-black tracking-widest uppercase select-none hover:text-[#003e8b] transition-colors cursor-default inline-block"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
