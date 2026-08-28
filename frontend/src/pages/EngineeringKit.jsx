import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Filter, SlidersHorizontal, Trash2 } from "lucide-react";
import api from "../api";
import KitCard from "../components/KitCard";

export default function EngineeringKit() {
  // --- States ---
  const [projects, setProjects] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- Active Filters ---
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedDifficulties, setSelectedDifficulties] = useState([]);
  const [selectedTechnologies, setSelectedTechnologies] = useState([]);
  const [sortBy, setSortBy] = useState("latest");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Available difficulty options
  const difficultyOptions = ["Beginner", "Intermediate", "Advanced"];

  // Available technology options
  const technologyOptions = [
    "Arduino",
    "ESP32",
    "Raspberry Pi",
    "Bluetooth",
    "RFID",
    "IoT",
    "Sensors"
  ];

  // --- Data Loading ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch subcategories for Engineering Kits
        const subRes = await api.get("/api/categories/subcategories/by-slug/engineering-kit");
        setSubcategories(subRes.data);

        // Fetch projects in Engineering Kits category
        const projRes = await api.get("/api/projects/by-category-slug/engineering-kit");
        setProjects(projRes.data);
        setFilteredProjects(projRes.data);
      } catch (err) {
        console.error("Error loading Engineering Kit catalog data:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- Filter and Sort Handler ---
  const handleApplyFilters = () => {
    let result = [...projects];

    // 1. Filter by Subcategory
    if (selectedSubcategories.length > 0) {
      result = result.filter((proj) =>
        selectedSubcategories.includes(Number(proj.subcategoryId))
      );
    }

    // 2. Filter by Min Price
    if (minPrice !== "") {
      result = result.filter((proj) => proj.price >= parseFloat(minPrice));
    }

    // 3. Filter by Max Price
    if (maxPrice !== "") {
      result = result.filter((proj) => proj.price <= parseFloat(maxPrice));
    }

    // 4. Filter by Difficulty Level
    if (selectedDifficulties.length > 0) {
      result = result.filter((proj) =>
        selectedDifficulties.some(
          (diff) => proj.difficulty?.toLowerCase() === diff.toLowerCase()
        )
      );
    }

    // 5. Filter by Technology
    if (selectedTechnologies.length > 0) {
      result = result.filter((proj) => {
        return selectedTechnologies.some((tech) => {
          const lowerTech = tech.toLowerCase();
          const titleMatch = proj.title?.toLowerCase().includes(lowerTech);
          const descMatch = proj.description?.toLowerCase().includes(lowerTech);

          // Parse Postgres string array format safely
          let componentsList = [];
          if (Array.isArray(proj.components)) {
            componentsList = proj.components;
          } else if (typeof proj.components === "string") {
            componentsList = proj.components
              .replace(/^\{|\}$/g, "")
              .split(",")
              .map((c) => c.trim().replace(/^"|"$/g, ""));
          }
          const compMatch = componentsList.some((c) =>
            c.toLowerCase().includes(lowerTech)
          );

          return titleMatch || descMatch || compMatch;
        });
      });
    }

    // Sort Projects
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === "popular") {
      result.sort((a, b) => {
        const ratingA = a.rating || (4.2 + (Number(a.id) % 8) * 0.1);
        const ratingB = b.rating || (4.2 + (Number(b.id) % 8) * 0.1);
        return ratingB - ratingA;
      });
    } else {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    setFilteredProjects(result);
    setMobileFiltersOpen(false);
  };

  // Run filters automatically when options or sorting changes
  useEffect(() => {
    handleApplyFilters();
  }, [projects, selectedSubcategories, selectedDifficulties, selectedTechnologies, sortBy]);

  // --- Reset Handler ---
  const handleClearFilters = () => {
    setSelectedSubcategories([]);
    setMinPrice("");
    setMaxPrice("");
    setSelectedDifficulties([]);
    setSelectedTechnologies([]);
    setSortBy("latest");
    setFilteredProjects(projects);
  };

  const handleSubcategoryToggle = (id) => {
    setSelectedSubcategories((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDifficultyToggle = (diff) => {
    setSelectedDifficulties((prev) =>
      prev.includes(diff) ? prev.filter((item) => item !== diff) : [...prev, diff]
    );
  };

  const handleTechnologyToggle = (tech) => {
    setSelectedTechnologies((prev) =>
      prev.includes(tech) ? prev.filter((item) => item !== tech) : [...prev, tech]
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen pt-4 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-gray-500 mb-6 bg-white py-3 px-4 rounded-md shadow-sm border border-gray-100">
          <Link to="/" className="hover:text-[#003e8b] transition-colors">Home</Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-gray-800 font-medium">Engineering Kits</span>
        </nav>

        {/* Catalog Banner */}
        <div className="bg-[#003e8b] text-white rounded-lg p-6 md:p-8 mb-8 shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-10 pointer-events-none transform translate-x-12 -translate-y-8">
            <SlidersHorizontal size={300} />
          </div>
          <div className="relative z-10 max-w-xl">
            <span className="bg-[#fb7b02] text-[10px] uppercase font-bold px-2 py-0.5 rounded shadow-sm">
              Professional Kits
            </span>
            <h1 className="text-xs md:text-3xl font-bold mt-2 mb-3">
              Engineering Kits
            </h1>
            <p className="text-gray-200 text-xs md:text-sm leading-relaxed">
              Accelerate your engineering experiments with complete build kits, detailed blueprints, full source code repositories, and reliable expert support.
            </p>
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col lg:flex-row gap-8">

          {/* LEFT COLUMN: Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 sticky top-24 max-h-[85vh] overflow-y-auto space-y-5">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-2">
                <span className="font-bold text-sm text-gray-800 flex items-center gap-1.5">
                  <Filter className="h-4 w-4 text-[#003e8b]" />
                  Filters
                </span>
                <button
                  onClick={handleClearFilters}
                  className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1 cursor-pointer font-semibold border-0 bg-transparent"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear All
                </button>
              </div>

              {/* Category Filter */}
              <div>
                <h4 className="font-bold text-xs text-gray-700 uppercase tracking-wider mb-2.5">
                  Categories
                </h4>
                <div className="space-y-2">
                  {subcategories.map((sub) => (
                    <label key={sub.id} className="flex items-center gap-2.5 text-xs text-gray-600 hover:text-gray-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedSubcategories.includes(sub.id)}
                        onChange={() => handleSubcategoryToggle(sub.id)}
                        className="rounded border-gray-300 text-[#003e8b] focus:ring-[#003e8b] h-3.5 w-3.5 cursor-pointer"
                      />
                      <span>{sub.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-bold text-xs text-gray-700 uppercase tracking-wider mb-2.5">
                  Price Range
                </h4>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 border border-gray-200 rounded focus:outline-none focus:border-[#003e8b] bg-gray-50 focus:bg-white"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 border border-gray-200 rounded focus:outline-none focus:border-[#003e8b] bg-gray-50 focus:bg-white"
                  />
                </div>
                <button
                  onClick={handleApplyFilters}
                  className="w-full bg-[#003e8b] hover:bg-[#002e66] text-white text-xs font-bold py-1.5 rounded shadow-sm transition border-0 cursor-pointer"
                >
                  Apply Price
                </button>
              </div>

              {/* Difficulty Level Filter */}
              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-bold text-xs text-gray-700 uppercase tracking-wider mb-2.5">
                  Difficulty Level
                </h4>
                <div className="space-y-2">
                  {difficultyOptions.map((diff) => (
                    <label key={diff} className="flex items-center gap-2.5 text-xs text-gray-600 hover:text-gray-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedDifficulties.includes(diff)}
                        onChange={() => handleDifficultyToggle(diff)}
                        className="rounded border-gray-300 text-[#003e8b] focus:ring-[#003e8b] h-3.5 w-3.5 cursor-pointer"
                      />
                      <span>{diff}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Technology Filter */}
              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-bold text-xs text-gray-700 uppercase tracking-wider mb-2.5">
                  Technology
                </h4>
                <div className="space-y-2">
                  {technologyOptions.map((tech) => (
                    <label key={tech} className="flex items-center gap-2.5 text-xs text-gray-600 hover:text-gray-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTechnologies.includes(tech)}
                        onChange={() => handleTechnologyToggle(tech)}
                        className="rounded border-gray-300 text-[#003e8b] focus:ring-[#003e8b] h-3.5 w-3.5 cursor-pointer"
                      />
                      <span>{tech}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </aside>

          {/* RIGHT COLUMN: Products Area */}
          <main className="flex-1">
            {/* Header filters wrapper */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 bg-white p-3.5 rounded-lg shadow-sm border border-gray-100">
              <span className="text-xs text-gray-500 font-medium">
                {loading ? "Searching..." : `Showing ${filteredProjects.length} products`}
              </span>

              <div className="flex items-center gap-3">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 rounded text-xs text-gray-600 bg-white font-semibold cursor-pointer"
                >
                  <Filter className="h-3.5 w-3.5" />
                  Filters
                </button>

                {/* Sort Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 whitespace-nowrap">Sort:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-xs px-2.5 py-1.5 border border-gray-200 rounded focus:outline-none focus:border-[#003e8b] bg-gray-50 font-medium cursor-pointer"
                  >
                    <option value="latest">Latest</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="popular">Popular</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-lg text-sm mb-6 border border-red-100">
                {error}
              </div>
            )}

            {/* Catalog Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white border border-gray-100 rounded-lg p-4 animate-pulse space-y-4">
                    <div className="aspect-video bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-8 bg-gray-200 rounded w-full pt-2"></div>
                  </div>
                ))}
              </div>
            ) : filteredProjects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <KitCard key={project.id} product={project} categorySlug="engineering-kit" />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center">
                <SlidersHorizontal className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-gray-700 font-bold mb-1">No Kits Found</h3>
                <p className="text-gray-400 text-xs max-w-sm mb-4 leading-relaxed">
                  We couldn't find any engineering kits matching your current filters. Try relaxing your filters or click below to clear everything.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="bg-[#003e8b] hover:bg-[#002e66] text-white text-xs font-bold px-4 py-2 rounded shadow-sm transition border-0 cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* MOBILE DRAWER FILTERS */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)}></div>

          <div className="fixed inset-y-0 left-0 w-80 max-w-full bg-white shadow-xl flex flex-col p-5 animate-slide-in">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
              <span className="font-bold text-sm text-gray-800 flex items-center gap-1.5">
                <Filter className="h-4 w-4 text-[#003e8b]" />
                Filters
              </span>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition p-1 hover:bg-gray-50 rounded-full border-0 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-5 pb-5">
              {/* Category Filter */}
              <div>
                <h4 className="font-bold text-xs text-gray-700 uppercase tracking-wider mb-2.5">
                  Categories
                </h4>
                <div className="space-y-2">
                  {subcategories.map((sub) => (
                    <label key={sub.id} className="flex items-center gap-2.5 text-xs text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedSubcategories.includes(sub.id)}
                        onChange={() => handleSubcategoryToggle(sub.id)}
                        className="rounded border-gray-300 text-[#003e8b] h-3.5 w-3.5"
                      />
                      <span>{sub.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-bold text-xs text-gray-700 uppercase tracking-wider mb-2.5">
                  Price Range
                </h4>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 border border-gray-200 rounded focus:outline-none focus:border-[#003e8b] bg-gray-50 focus:bg-white"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full text-xs px-2.5 py-1.5 border border-gray-200 rounded focus:outline-none focus:border-[#003e8b] bg-gray-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Difficulty Level Filter */}
              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-bold text-xs text-gray-700 uppercase tracking-wider mb-2.5">
                  Difficulty Level
                </h4>
                <div className="space-y-2">
                  {difficultyOptions.map((diff) => (
                    <label key={diff} className="flex items-center gap-2.5 text-xs text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedDifficulties.includes(diff)}
                        onChange={() => handleDifficultyToggle(diff)}
                        className="rounded border-gray-300 text-[#003e8b] h-3.5 w-3.5"
                      />
                      <span>{diff}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Technology Filter */}
              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-bold text-xs text-gray-700 uppercase tracking-wider mb-2.5">
                  Technology
                </h4>
                <div className="space-y-2">
                  {technologyOptions.map((tech) => (
                    <label key={tech} className="flex items-center gap-2.5 text-xs text-gray-600 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTechnologies.includes(tech)}
                        onChange={() => handleTechnologyToggle(tech)}
                        className="rounded border-gray-300 text-[#003e8b] h-3.5 w-3.5"
                      />
                      <span>{tech}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 flex gap-2.5 mt-auto bg-white">
              <button
                onClick={handleClearFilters}
                className="flex-1 border border-gray-200 hover:bg-gray-50 text-gray-600 text-xs font-bold py-2 rounded cursor-pointer"
              >
                Clear All
              </button>
              <button
                onClick={handleApplyFilters}
                className="flex-1 bg-[#003e8b] hover:bg-[#002e66] text-white text-xs font-bold py-2 rounded shadow-sm border-0 cursor-pointer"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function X({ className, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
