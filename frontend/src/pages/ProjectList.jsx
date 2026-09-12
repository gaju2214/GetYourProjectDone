import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import api from "../api";
import { Button } from "../components/ui/Botton";
import { Badge } from "../components/ui/Badge";
import { Card, CardContent } from "../components/ui/Card";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/Sheet";
import {
  Filter, Grid, List, Search, Cpu, Layers, Bot, Zap, Code,
  Settings, AlertCircle, X, ChevronDown, ChevronRight, ArrowUpDown, Sparkles, BookOpen, Star, RefreshCw, SlidersHorizontal
} from "lucide-react";

// Pricing presets
const PRICE_RANGES = [
  { id: "all", label: "All Prices" },
  { id: "under-1000", label: "Under ₹1,000", max: 1000 },
  { id: "1000-3000", label: "₹1,000 - ₹3,000", min: 1000, max: 3000 },
  { id: "3000-5000", label: "₹3,000 - ₹5,000", min: 3000, max: 5000 },
  { id: "above-5000", label: "Above ₹5,000", min: 5000 }
];

// Difficulty levels
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

const ProjectList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const sentinelRef = useRef(null);

  // --- States ---
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  // Active filters state
  const [searchQuery, setSearchQuery] = useState("");
  const [localSearch, setLocalSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategories, setSelectedSubcategories] = useState(new Set());
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [selectedDifficulties, setSelectedDifficulties] = useState(new Set());

  // UI states
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState("grid"); // grid | list
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState(new Set());

  // API loading states
  const [loading, setLoading] = useState(true);
  const [loadingFilters, setLoadingFilters] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // --- Extract 'q' query param from URL ---
  const getQueryParam = () => {
    const params = new URLSearchParams(location.search);
    return params.get("q") || "";
  };

  // --- Fetch categories and subcategories on mount ---
  useEffect(() => {
    const fetchFilters = async () => {
      setLoadingFilters(true);
      try {
        const catRes = await api.get("/api/categories/categoryall");
        const cats = catRes.data || [];
        setCategories(cats);

        // Fetch subcategories for all categories
        const subPromises = cats.map(async (cat) => {
          try {
            const subRes = await api.get(`/api/subcategories/by-category/${cat.id}`);
            return subRes.data || [];
          } catch (e) {
            console.error(`Error loading subcategories for category ${cat.id}:`, e);
            return [];
          }
        });
        const subResults = await Promise.all(subPromises);
        const mergedSubs = subResults.flat();
        setSubcategories(mergedSubs);
      } catch (err) {
        console.error("Failed to load filters:", err);
      } finally {
        setLoadingFilters(false);
      }
    };
    fetchFilters();
  }, []);

  // --- Fetch projects main function ---
  const fetchProjects = async (q = "", opts = { reset: true, page: 1, limit: 24 }) => {
    const { reset, page: fetchPage, limit } = opts;
    if (reset) {
      setLoading(true);
      setError("");
    } else {
      setLoadingMore(true);
    }

    try {
      if (q) {
        // Backend search endpoint (returns unpaginated matches)
        const url = `/api/projects/search?q=${encodeURIComponent(q)}`;
        const res = await api.get(url);
        setProjects(res.data || []);
        setHasMore(false);
        setPage(1);
      } else {
        // Standard paginated listing
        const url = `/api/projects?page=${fetchPage}&limit=${limit}`;
        const res = await api.get(url);
        const data = res.data && res.data.data ? res.data.data : res.data;

        if (reset) {
          setProjects(data || []);
        } else {
          setProjects(prev => [...prev, ...(data || [])]);
        }

        const pagination = res.data && res.data.pagination;
        if (pagination) {
          setHasMore(pagination.currentPage < pagination.totalPages);
          setPage(pagination.currentPage);
        } else {
          setHasMore((data || []).length >= limit);
          setPage(fetchPage);
        }
      }
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError(err.response?.data?.error || "Failed to load projects. Please try again.");
      if (reset) setProjects([]);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // --- Fetch projects on URL query changes ---
  useEffect(() => {
    const q = getQueryParam();
    setSearchQuery(q);
    setLocalSearch(q);

    // Clear dynamic page filters when doing a fresh search
    setSelectedCategory(null);
    setSelectedSubcategories(new Set());
    setSelectedPriceRange("all");
    setSelectedDifficulties(new Set());
    setPage(1);

    fetchProjects(q, { reset: true, page: 1, limit: 24 });
  }, [location.search]);

  // --- Fetch category projects dynamically when category changes ---
  useEffect(() => {
    const q = getQueryParam();
    if (q) return; // Search query overrides category selection

    if (selectedCategory) {
      const fetchCategoryProjects = async () => {
        setLoading(true);
        setError("");
        try {
          const res = await api.get(`/api/projects/search?q=${encodeURIComponent(selectedCategory.name)}`);
          setProjects(res.data || []);
          setHasMore(false); // Category search returns all matches
        } catch (err) {
          console.error("Failed to load category projects:", err);
          setError("Failed to load projects for the selected category.");
        } finally {
          setLoading(false);
        }
      };
      fetchCategoryProjects();
    } else {
      // Revert to default paginated projects if category is cleared
      setPage(1);
      fetchProjects("", { reset: true, page: 1, limit: 24 });
    }
  }, [selectedCategory]);

  // --- Sentinel for infinite scroll ---
  useEffect(() => {
    if (!sentinelRef.current) return;
    if (!hasMore || searchQuery || selectedCategory) return; // Only paginate on standard catalog

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !loadingMore && hasMore) {
            const nextPage = page + 1;
            fetchProjects("", { reset: false, page: nextPage, limit: 12 });
            setPage(nextPage);
          }
        });
      },
      { root: null, rootMargin: "250px", threshold: 0.1 }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [sentinelRef.current, hasMore, loadingMore, page, searchQuery, selectedCategory]);

  // --- Handle Category Accordion expansion & selection ---
  const handleCategoryClick = (category) => {
    if (selectedCategory?.id === category.id) {
      setSelectedCategory(null);
      setSelectedSubcategories(new Set());
    } else {
      setSelectedCategory(category);
      setSelectedSubcategories(new Set());
      // Auto expand in accordion
      setExpandedCategories(prev => {
        const next = new Set(prev);
        next.add(category.id);
        return next;
      });
    }
  };

  const toggleAccordion = (catId, e) => {
    e.stopPropagation(); // Don't trigger category selection when just expanding accordion
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(catId)) {
        next.delete(catId);
      } else {
        next.add(catId);
      }
      return next;
    });
  };

  const handleSubcategoryToggle = (subId) => {
    setSelectedSubcategories(prev => {
      const next = new Set(prev);
      if (next.has(subId)) {
        next.delete(subId);
      } else {
        next.add(subId);
      }
      return next;
    });
  };

  const handleDifficultyToggle = (difficulty) => {
    setSelectedDifficulties(prev => {
      const next = new Set(prev);
      if (next.has(difficulty)) {
        next.delete(difficulty);
      } else {
        next.add(difficulty);
      }
      return next;
    });
  };

  const handleLocalSearchSubmit = (e) => {
    e.preventDefault();
    if (localSearch.trim()) {
      navigate(`/projects?q=${encodeURIComponent(localSearch.trim())}`);
    } else {
      navigate("/projects");
    }
  };

  const handleClearAllFilters = () => {
    setSelectedCategory(null);
    setSelectedSubcategories(new Set());
    setSelectedPriceRange("all");
    setSelectedDifficulties(new Set());
    setLocalSearch("");
    setSearchQuery("");
    navigate("/projects");
  };

  const getCategoryIcon = (categoryName) => {
    const name = categoryName.toLowerCase();
    if (name.includes("electronics")) return <Cpu className="w-4 h-4" />;
    if (name.includes("robotics") || name.includes("automation") || name.includes("mechatronics")) return <Bot className="w-4 h-4" />;
    if (name.includes("iot") || name.includes("wireless") || name.includes("electrical")) return <Zap className="w-4 h-4" />;
    if (name.includes("computer") || name.includes("software") || name.includes("code")) return <Code className="w-4 h-4" />;
    if (name.includes("mechanical") || name.includes("cad")) return <Settings className="w-4 h-4" />;
    return <Layers className="w-4 h-4" />;
  };

  // --- Filtering Logic ---
  const filteredProjects = projects.filter((project) => {
    // 1. Text Search Filter (client-side backup refinement)
    if (localSearch.trim() && !searchQuery) {
      const term = localSearch.toLowerCase().trim();
      const titleMatch = project.title?.toLowerCase().includes(term);
      const descMatch = project.description?.toLowerCase().includes(term);
      const subcatMatch = project.subcategory?.name?.toLowerCase().includes(term);
      if (!titleMatch && !descMatch && !subcatMatch) return false;
    }

    // 2. Category Filter (If Category selected, filter by parent category ID)
    if (selectedCategory) {
      // Check if project has subcategory and matches category ID
      const catId = project.subcategory?.categoryId || project.categoryId;
      if (catId !== selectedCategory.id) return false;
    }

    // 3. Subcategory Filter
    if (selectedSubcategories.size > 0) {
      if (!selectedSubcategories.has(project.subcategoryId)) return false;
    }

    // 4. Price Filter
    if (selectedPriceRange !== "all") {
      const range = PRICE_RANGES.find(r => r.id === selectedPriceRange);
      if (range) {
        const price = project.price || 0;
        if (range.min !== undefined && price < range.min) return false;
        if (range.max !== undefined && price > range.max) return false;
      }
    }

    // 5. Difficulty Filter
    if (selectedDifficulties.size > 0) {
      const diff = project.difficulty || "Beginner";
      if (!selectedDifficulties.has(diff)) return false;
    }

    return true;
  });

  // --- Sorting Logic ---
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === "price-low-high") {
      return a.price - b.price;
    }
    if (sortBy === "price-high-low") {
      return b.price - a.price;
    }
    if (sortBy === "newest") {
      return new Date(b.createdAt || b.id) - new Date(a.createdAt || a.id);
    }
    // "popular" / default: sort by rating/reviews count
    return (b.rating || 4.5) - (a.rating || 4.5) || b.id - a.id;
  });

  // --- Skeletons for Loading State ---
  const SkeletonCard = () => (
    <Card className="h-full border border-gray-100 shadow-sm rounded-lg overflow-hidden animate-pulse">
      <div className="bg-gray-100 aspect-video w-full" />
      <CardContent className="p-4 space-y-3">
        <div className="h-3 w-16 bg-gray-200 rounded" />
        <div className="h-4 w-5/6 bg-gray-200 rounded" />
        <div className="h-3 w-full bg-gray-100 rounded" />
        <div className="h-3 w-2/3 bg-gray-100 rounded" />
        <div className="flex gap-2 pt-2">
          <div className="h-6 w-12 bg-gray-200 rounded" />
          <div className="h-6 w-12 bg-gray-200 rounded" />
        </div>
        <div className="h-8 w-full bg-gray-200 rounded pt-4" />
      </CardContent>
    </Card>
  );

  // --- Sidebar Content Render (Reusable for desktop & mobile drawer) ---
  const renderSidebarContent = () => (
    <div className="space-y-6">
      {/* Search within projects */}
      <div>
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Search Catalog</h4>
        <form onSubmit={handleLocalSearchSubmit} className="relative">
          <input
            type="text"
            placeholder="Search within listing..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="w-full pl-3 pr-9 py-2 text-xs border border-gray-200 rounded-md focus:outline-none focus:border-[#003e8b] bg-gray-50 focus:bg-white transition-all text-gray-700"
          />
          <button type="submit" className="absolute right-2.5 top-2.5 text-gray-400 hover:text-[#003e8b]">
            <Search className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Category Accordion */}
      <div>
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Project Categories</h4>
        <div className="space-y-1.5 max-h-[350px] overflow-y-auto pr-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory?.id === cat.id;
            const isExpanded = expandedCategories.has(cat.id) || isSelected;
            const catSubs = subcategories.filter(sub => sub.categoryId === cat.id);

            return (
              <div key={cat.id} className="border border-gray-100 rounded-lg overflow-hidden bg-white">
                <button
                  onClick={() => handleCategoryClick(cat)}
                  className={`w-full flex items-center justify-between p-2.5 text-left text-xs font-semibold rounded-t-lg transition-all ${isSelected
                    ? "bg-blue-50 text-[#003e8b] border-l-4 border-[#003e8b]"
                    : "hover:bg-gray-50 text-gray-700"
                    }`}
                >
                  <div className="flex items-center space-x-2.5">
                    {getCategoryIcon(cat.name)}
                    <span className="truncate">{cat.name}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {catSubs.length > 0 && (
                      <span
                        onClick={(e) => toggleAccordion(cat.id, e)}
                        className="p-1 rounded hover:bg-gray-200/50 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                      >
                        {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                      </span>
                    )}
                  </div>
                </button>

                {/* Subcategories (only if expanded) */}
                {isExpanded && catSubs.length > 0 && (
                  <div className="p-3 bg-gray-50/50 border-t border-gray-50 space-y-2">
                    {catSubs.map((sub) => {
                      const isSubChecked = selectedSubcategories.has(sub.id);
                      return (
                        <label
                          key={sub.id}
                          className="flex items-center space-x-2.5 text-xs text-gray-600 hover:text-gray-900 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={isSubChecked}
                            onChange={() => handleSubcategoryToggle(sub.id)}
                            className="rounded border-gray-300 text-[#003e8b] focus:ring-[#003e8b] h-3.5 w-3.5"
                          />
                          <span className="truncate">{sub.name}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Price filter presets */}
      <div>
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Price Range</h4>
        <div className="space-y-2 bg-white p-3 border border-gray-100 rounded-lg">
          {PRICE_RANGES.map((range) => (
            <label
              key={range.id}
              className="flex items-center space-x-2.5 text-xs text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              <input
                type="radio"
                name="priceRange"
                checked={selectedPriceRange === range.id}
                onChange={() => setSelectedPriceRange(range.id)}
                className="text-[#003e8b] focus:ring-[#003e8b] h-3.5 w-3.5"
              />
              <span>{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Difficulty filters */}
      <div>
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Difficulty Level</h4>
        <div className="space-y-2 bg-white p-3 border border-gray-100 rounded-lg">
          {DIFFICULTIES.map((difficulty) => {
            const isChecked = selectedDifficulties.has(difficulty);
            return (
              <label
                key={difficulty}
                className="flex items-center space-x-2.5 text-xs text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleDifficultyToggle(difficulty)}
                  className="rounded border-gray-300 text-[#003e8b] focus:ring-[#003e8b] h-3.5 w-3.5"
                />
                <div className="flex items-center space-x-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${difficulty === "Beginner" ? "bg-green-500" :
                    difficulty === "Intermediate" ? "bg-blue-400" : "bg-red-500"
                    }`} />
                  <span>{difficulty}</span>
                </div>
              </label>
            );
          })}
        </div>
      </div>

      {/* Reset button */}
      <Button
        variant="outline"
        onClick={handleClearAllFilters}
        className="w-full flex items-center justify-center space-x-2 text-xs border-dashed border-gray-300 hover:border-red-500 hover:text-red-500 py-2 font-semibold cursor-pointer"
      >
        <RefreshCw className="w-3.5 h-3.5" />
        <span>Reset All Filters</span>
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafafa] pb-16 text-gray-800">

      {/* 🔹 1. Hero Header Banner (KitsIndia Tech Theme) */}
      <section className="relative bg-[#0f0f12] text-white py-10 px-4 overflow-hidden border-b border-gray-800">
        {/* Subtle grid and glows */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>
        <div className="absolute -top-1/2 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#003e8b] rounded-full blur-[120px] opacity-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 bg-gray-800/60 backdrop-blur border border-gray-700/80 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest text-[#003e8b] uppercase mb-4 shadow-sm animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            <span>KitsIndia Electronics & DIY Hub</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
            Engineering Project Kits
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto mb-6 font-medium leading-relaxed">
            Ready-to-build, pre-tested engineering solutions and DIY hobby kits, complete with source code, CAD models, circuit designs, and 24/7 expert support.
          </p>

          {/* Quick trust metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-4 border-t border-gray-800/80 text-left">
            <div className="flex items-center space-x-3 p-2 bg-gray-900/40 rounded-lg border border-gray-800/50">
              <Cpu className="w-6 h-6 text-[#003e8b] shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">500+ Project Kits</div>
                <div className="text-[9px] text-gray-500">In-stock & ready to ship</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-2 bg-gray-900/40 rounded-lg border border-gray-800/50">
              <BookOpen className="w-6 h-6 text-[#003e8b] shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">Full Documentation</div>
                <div className="text-[9px] text-gray-500">Code & circuit diagrams</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-2 bg-gray-900/40 rounded-lg border border-gray-800/50">
              <Star className="w-6 h-6 text-[#003e8b] shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">100% Tested Kits</div>
                <div className="text-[9px] text-gray-500">Guaranteed working hardware</div>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-2 bg-gray-900/40 rounded-lg border border-gray-800/50">
              <Bot className="w-6 h-6 text-[#003e8b] shrink-0" />
              <div>
                <div className="text-xs font-bold text-white">Expert Mentor Support</div>
                <div className="text-[9px] text-gray-500">24/7 technical WhatsApp assistance</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 🔹 2. Main Page Body (Sidebar + Listing Grid) */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          {/* 💻 Desktop Filter Sidebar */}
          <aside className="hidden lg:block lg:col-span-1 bg-white p-5 border border-gray-200/80 rounded-xl shadow-sm h-fit sticky top-24">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-5">
              <div className="flex items-center space-x-2 text-gray-800">
                <SlidersHorizontal className="w-4 h-4 text-[#003e8b]" />
                <h3 className="font-bold text-sm tracking-wide">Filter Products</h3>
              </div>
              {(selectedCategory || selectedSubcategories.size > 0 || selectedPriceRange !== "all" || selectedDifficulties.size > 0 || localSearch) && (
                <button
                  onClick={handleClearAllFilters}
                  className="text-[10px] font-bold text-red-500 hover:text-red-700 transition-colors uppercase cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>
            {renderSidebarContent()}
          </aside>

          {/* 📦 Products Grid Section */}
          <section className="lg:col-span-3 space-y-6">

            {/* Control Bar: Sorting, Active Chips, Layout toggles */}
            <div className="bg-white p-4 border border-gray-200/80 rounded-xl shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                {/* Result count */}
                <div className="text-sm font-semibold text-gray-700">
                  {loading ? (
                    <span className="inline-block w-24 h-4 bg-gray-100 rounded animate-pulse"></span>
                  ) : (
                    <span>Showing {sortedProjects.length} engineering project kits</span>
                  )}
                </div>

                {/* Display options & mobile filter button */}
                <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">

                  {/* Mobile filter sheet button */}
                  <div className="block lg:hidden">
                    <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
                      <SheetTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex items-center space-x-2 text-xs py-2 px-3 hover:text-[#003e8b] hover:border-[#003e8b] cursor-pointer"
                        >
                          <Filter className="w-3.5 h-3.5 text-[#003e8b]" />
                          <span>Filters ({selectedSubcategories.size + selectedDifficulties.size + (selectedCategory ? 1 : 0) + (selectedPriceRange !== "all" ? 1 : 0)})</span>
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="left" className="w-[300px] sm:w-[350px] p-6 bg-white overflow-y-auto">
                        <div className="pb-4 border-b border-gray-100 mb-5">
                          <h3 className="text-gray-800 font-bold flex items-center space-x-2 text-sm">
                            <SlidersHorizontal className="w-4 h-4 text-[#003e8b]" />
                            <span>Filters</span>
                          </h3>
                        </div>
                        {renderSidebarContent()}
                      </SheetContent>
                    </Sheet>
                  </div>

                  {/* Layout & Sort controls */}
                  <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                    {/* Sort Dropdown */}
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <ArrowUpDown className="w-3.5 h-3.5 text-gray-400" />
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-gray-50 border border-gray-200 rounded px-2.5 py-1.5 text-xs text-gray-700 font-semibold focus:outline-none focus:border-[#003e8b]"
                      >
                        <option value="popular">Popularity</option>
                        <option value="price-low-high">Price: Low to High</option>
                        <option value="price-high-low">Price: High to Low</option>
                        <option value="newest">Newest Launch</option>
                      </select>
                    </div>

                    {/* Grid/List View Toggles */}
                    <div className="hidden sm:flex items-center border border-gray-200 rounded overflow-hidden">
                      <button
                        onClick={() => setViewMode("grid")}
                        className={`p-1.5 hover:bg-gray-100 transition-colors ${viewMode === "grid" ? "bg-gray-100 text-[#003e8b]" : "text-gray-400"}`}
                      >
                        <Grid className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode("list")}
                        className={`p-1.5 hover:bg-gray-100 transition-colors ${viewMode === "list" ? "bg-gray-100 text-[#003e8b]" : "text-gray-400"}`}
                      >
                        <List className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              {/* Active Filter Chips */}
              {(selectedCategory || selectedSubcategories.size > 0 || selectedPriceRange !== "all" || selectedDifficulties.size > 0 || searchQuery) && (
                <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                  {/* Category chip */}
                  {selectedCategory && (
                    <Badge variant="outline" className="text-[10px] pl-2 pr-1 py-0.5 flex items-center bg-blue-50 border-[#003e8b]/30 text-[#003e8b]">
                      <span>Category: {selectedCategory.name}</span>
                      <button onClick={() => setSelectedCategory(null)} className="ml-1 hover:bg-blue-100 rounded-full p-0.5">
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </Badge>
                  )}

                  {/* Subcategories chips */}
                  {Array.from(selectedSubcategories).map((subId) => {
                    const subObj = subcategories.find(s => s.id === subId);
                    if (!subObj) return null;
                    return (
                      <Badge key={subId} variant="outline" className="text-[10px] pl-2 pr-1 py-0.5 flex items-center bg-gray-50 text-gray-700 border-gray-200">
                        <span>{subObj.name}</span>
                        <button onClick={() => handleSubcategoryToggle(subId)} className="ml-1 hover:bg-gray-200 rounded-full p-0.5">
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </Badge>
                    );
                  })}

                  {/* Price chip */}
                  {selectedPriceRange !== "all" && (
                    <Badge variant="outline" className="text-[10px] pl-2 pr-1 py-0.5 flex items-center bg-gray-50 text-gray-700 border-gray-200">
                      <span>Price: {PRICE_RANGES.find(r => r.id === selectedPriceRange)?.label}</span>
                      <button onClick={() => setSelectedPriceRange("all")} className="ml-1 hover:bg-gray-200 rounded-full p-0.5">
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </Badge>
                  )}

                  {/* Difficulty chips */}
                  {Array.from(selectedDifficulties).map((difficulty) => (
                    <Badge key={difficulty} variant="outline" className="text-[10px] pl-2 pr-1 py-0.5 flex items-center bg-gray-50 text-gray-700 border-gray-200">
                      <span>Difficulty: {difficulty}</span>
                      <button onClick={() => handleDifficultyToggle(difficulty)} className="ml-1 hover:bg-gray-200 rounded-full p-0.5">
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </Badge>
                  ))}

                  {/* Search query chip */}
                  {searchQuery && (
                    <Badge variant="outline" className="text-[10px] pl-2 pr-1 py-0.5 flex items-center bg-blue-50 text-blue-700 border-blue-200">
                      <span>Search: "{searchQuery}"</span>
                      <button onClick={() => {
                        setSearchQuery("");
                        setLocalSearch("");
                        navigate("/projects");
                      }} className="ml-1 hover:bg-blue-100 rounded-full p-0.5">
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </Badge>
                  )}

                  {/* Clear all chips */}
                  <button
                    onClick={handleClearAllFilters}
                    className="text-[9px] text-[#003e8b] hover:text-[#002e66] font-bold self-center transition-colors uppercase underline cursor-pointer"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3 text-red-700">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Failed to retrieve projects</h4>
                  <p className="text-xs text-red-600 mt-1">{error}</p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => fetchProjects(searchQuery)}
                    className="mt-3 text-xs bg-white text-red-700 border-red-300 hover:bg-red-50 cursor-pointer"
                  >
                    Retry Connection
                  </Button>
                </div>
              </div>
            )}

            {/* Product Display Board */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : sortedProjects.length > 0 ? (
              <>
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {sortedProjects.map((project) => (
                      <div key={project.id} className="transition-all duration-300 hover:-translate-y-1">
                        <ProductCard product={project} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sortedProjects.map((project) => {
                      const originalPrice = project.originalPrice || Math.round(project.price / 0.6);
                      const discountPercentage = Math.round(((originalPrice - project.price) / originalPrice) * 100);

                      return (
                        <Card key={project.id} className="group bg-white border border-gray-100 hover:border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col md:flex-row p-0">
                          {/* Image box */}
                          <div className="md:w-60 bg-gray-50 flex items-center justify-center p-4 border-b md:border-b-0 md:border-r border-gray-100 relative shrink-0">
                            <img
                              src={project.image || "/placeholder-image.jpg"}
                              alt={project.title}
                              className="h-36 object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                            {discountPercentage > 0 && (
                              <Badge className="absolute top-2.5 left-2.5 bg-red-500 text-white text-[10px] font-bold">
                                {discountPercentage}% OFF
                              </Badge>
                            )}
                            <Badge className="absolute top-2.5 right-2.5 bg-gray-800 text-white text-[10px]">
                              {project.difficulty || "Beginner"}
                            </Badge>
                          </div>

                          {/* Detail panel */}
                          <div className="flex-1 p-5 flex flex-col justify-between">
                            <div className="space-y-2.5">
                              <Link to={`/projects/${project.slug}`}>
                                <h3 className="font-bold text-base text-gray-800 group-hover:text-[#003e8b] transition-colors leading-snug">
                                  {project.title}
                                </h3>
                              </Link>

                              <div
                                className="text-gray-500 text-xs line-clamp-2 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: project.description }}
                              />

                              <div className="flex gap-2">
                                {Array.isArray(project.components) && project.components.slice(0, 4).map((c, i) => (
                                  <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-semibold">
                                    {c}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-4">
                              <div className="flex items-baseline space-x-2">
                                <span className="text-xl font-bold text-[#003e8b]">₹{project.price?.toLocaleString()}</span>
                                <span className="text-xs text-gray-400 line-through">₹{originalPrice.toLocaleString()}</span>
                              </div>
                              <div className="w-36">
                                <Link to={`/projects/${project.slug}`}>
                                  <Button className="w-full bg-[#003e8b] hover:bg-[#002e66] text-white py-2 text-xs font-bold rounded cursor-pointer border-0">
                                    View Details
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                )}

                {/* Paginated Load More triggers */}
                {!searchQuery && !selectedCategory && hasMore && (
                  <div className="flex justify-center pt-8">
                    <Button
                      onClick={async () => {
                        const nextPage = page + 1;
                        await fetchProjects("", { reset: false, page: nextPage, limit: 12 });
                        setPage(nextPage);
                      }}
                      disabled={loadingMore}
                      className="px-8 py-3 bg-white text-gray-700 hover:text-white border border-gray-200 hover:bg-[#003e8b] hover:border-[#003e8b] transition-all rounded-lg font-bold text-xs shadow-sm cursor-pointer"
                    >
                      {loadingMore ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                          <span>Loading More Kits...</span>
                        </div>
                      ) : (
                        <span>Load More Engineering Kits</span>
                      )}
                    </Button>
                  </div>
                )}
                <div ref={sentinelRef} className="h-4" />
              </>
            ) : (
              // Empty State
              <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white border border-gray-200/80 rounded-xl shadow-sm">
                <div className="w-20 h-20 text-gray-300 mb-5">
                  <AlertCircle className="w-full h-full stroke-1.5" />
                </div>
                <h3 className="text-lg font-bold text-gray-700 mb-2">No Matching Projects Found</h3>
                <p className="text-xs text-gray-500 max-w-sm mb-6 leading-relaxed">
                  We couldn't find any engineering project kits matching your filter criteria. Try clearing some filters or searching for another term.
                </p>
                <Button
                  onClick={handleClearAllFilters}
                  className="bg-[#003e8b] hover:bg-[#002e66] text-white font-bold px-6 py-2.5 text-xs rounded-md shadow-sm transition cursor-pointer border-0"
                >
                  Clear All Filters & Reset
                </Button>
              </div>
            )}

          </section>
        </div>
      </main>

    </div>
  );
};

export default ProjectList;