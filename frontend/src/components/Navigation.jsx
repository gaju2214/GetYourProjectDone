import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../components/ui/Botton";
import { Badge } from "../components/ui/Badge";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/Sheet";
import { Menu, ShoppingCart, User, Search, Home } from "lucide-react";
import EngiProNetwork from "./EngiproNetwork";
import api from '../api';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNetworkOpen, setIsNetworkOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [hasShadow, setHasShadow] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cartCount, setCartCount] = useState(0); // cart quantity state

  const searchRef = useRef();
  const searchRefDesktop = useRef();
  const searchRefMobile = useRef();
  const navigate = useNavigate();

  const userId = user?.userId;

  // Handle search Enter key
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/projects/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
    }
  };

  // Check auth and fetch cart
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/api/protected/checkAuth");
        if (res.data?.success === true && res.data?.status === 200) {
          setUser(res.data.user);
          setIsAuthenticated(true);

          // Fetch cart quantity for user
          const cartRes = await api.get(`/api/cart/${res.data.user.userId}`);
          const quantity = cartRes.data.reduce((sum, item) => sum + item.quantity, 0);
          setCartCount(quantity);

        } else {
          setUser(null);
          setIsAuthenticated(false);
          setCartCount(0);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setUser(null);
        setIsAuthenticated(false);
        setCartCount(0);
      }
    };
    checkAuth();
  }, []);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        searchRefDesktop.current &&
        !searchRefDesktop.current.contains(event.target) &&
        searchRefMobile.current &&
        !searchRefMobile.current.contains(event.target)
      ) {
        setShowSearch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Set active nav
  useEffect(() => {
    const path = window.location.pathname;
    if (path === "/") setActiveNav("home");
    else if (path.includes("/projectkits")) setActiveNav("projectKits");
    else if (path.includes("/categories")) setActiveNav("categories");
  }, []);

  // Add shadow on scroll
  useEffect(() => {
    const handleScroll = () => setHasShadow(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    // logout function (implement in your auth context)
    navigate("/auth/login");
  };

  return (
    <>
      <nav className={`sticky top-0 z-50 w-full bg-white/90 backdrop-blur transition-shadow duration-300 ${hasShadow ? "shadow-md" : ""}`}>
        <div className="flex items-center justify-between gap-y-2 h-auto py-2">
          <div className="flex items-center justify-between w-full">
            {/* Logo */}
            <button
              onClick={() => setIsNetworkOpen(true)}
              className="flex items-center justify-start sm:justify-center w-full sm:w-auto hover:scale-105 transition-transform duration-200"
            >
              <div className="relative h-10 w-32 xs:h-12 xs:w-36 sm:h-13 sm:w-[200px] flex-shrink-0">
                <img
                  src="/logo.png"
                  alt="Get Your Project Done"
                  className="h-full w-full object-contain transition-transform duration-300 ease-in-out hover:scale-105"
                />
              </div>
            </button>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              {[
                { label: "Home", to: "/", key: "home" },
                { label: "Project Kits", to: "/categories", key: "categories" },
                { label: "IoT Platform", to: "https://getyourprojectdone.in/iot_platform/", key: "projectKits" },
              ].map((item) => (
                <Link to={item.to} key={item.key}>
                  <Button
                    variant="ghost"
                    onClick={() => setActiveNav(item.key)}
                    className={`whitespace-nowrap min-w-[120px] text-center px-4 text-gray-700 hover:text-gray-900 hover:scale-105 transition-transform duration-200 ${activeNav === item.key ? "font-semibold text-black-600" : ""}`}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}

              {/* Desktop Search */}
              <div className="flex items-center space-x-2 relative" ref={searchRefDesktop}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSearch(!showSearch)}
                  aria-label="Toggle Search"
                  className="transition-transform duration-200 hover:scale-110"
                >
                  <Search className="h-5 w-5 hover:rotate-6 hover:text-orange-500" />
                </Button>

                {showSearch && (
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search projects..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                      className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-sm text-gray-800 w-64 pr-10"
                    />
                    <button
                      onClick={() => setShowSearch(false)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 text-lg font-semibold"
                      aria-label="Close search"
                    >
                      ×
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-1 sm:gap-2 px-2 py-1 flex-shrink-0 max-w-full overflow-hidden">
              <Link to="/" className="block md:hidden flex-shrink-0">
                <Button variant="ghost" size="icon" className="p-1 transition-colors duration-300 hover:text-orange-500">
                  <Home className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 hover:scale-110" />
                </Button>
              </Link>

              {/* Cart Badge */}
              <Link to="/cart" className="flex-shrink-0 relative">
                <Button variant="ghost" size="icon" className="p-1 transition-colors duration-300 hover:text-orange-500">
                  <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 hover:scale-110" />
                  {cartCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-medium bg-black text-white shadow-sm">
                      {cartCount}
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* User Icon */}
              <Link to={user ? "/account" : "/auth/login"} className="flex-shrink-0 md:ml-5">
                <Button variant="ghost" size="icon" className="p-1 transition-colors duration-300 hover:text-orange-500">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 hover:scale-110" />
                </Button>
              </Link>

              {/* Menu */}
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden flex-shrink-0 p-1 transition-colors duration-300 hover:text-orange-500">
                    <Menu className="h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-300 hover:scale-110" />
                  </Button>
                </SheetTrigger>

                <SheetContent side="right" className="w-64 h-full bg-white border-l border-orange-200 px-6 py-8 shadow-2xl rounded-l-3xl">
                  <motion.div initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.4, ease: "easeOut" }} className="h-full flex flex-col justify-between">
                    <div>
                      <div className="flex justify-center mb-6">
                        <div className="relative h-12 w-40 sm:h-13 sm:w-[200px]">
                          <img src="/logo.png" alt="Get Your Project Done" className="h-full w-full object-contain transition-transform duration-300 hover:scale-105" />
                        </div>
                      </div>

                      <div className="flex flex-col space-y-5 text-lg font-medium">
                        <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-gray-800 hover:text-orange-500 transition-colors duration-300">Home</Link>
                        <Link to="/categories" onClick={() => setIsMenuOpen(false)} className="text-gray-800 hover:text-orange-500 transition-colors duration-300">Project Kits</Link>
                        <Link to="/cart" onClick={() => setIsMenuOpen(false)} className="text-gray-800 hover:text-orange-500 transition-colors duration-300">Cart</Link>

                        {user ? (
                          <>
                            <Link to="/account" onClick={() => setIsMenuOpen(false)} className="text-gray-800 hover:text-orange-500 transition-colors duration-300">Profile</Link>
                            <button
                              onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                              className="w-full bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 text-white rounded-md py-2 transition-all duration-300 hover:from-orange-600 hover:to-pink-600 shadow-md"
                            >
                              Logout
                            </button>
                          </>
                        ) : (
                          <Link to="/auth/login" onClick={() => setIsMenuOpen(false)} className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-md py-2 text-center shadow-md transition-all duration-300">Login</Link>
                        )}
                      </div>
                    </div>
                    <div className="mt-10 text-sm text-gray-400 text-center">© 2025 GYPD. All rights reserved.</div>
                  </motion.div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Network Modal */}
      <EngiProNetwork isOpen={isNetworkOpen} onClose={() => setIsNetworkOpen(false)} />
    </>
  );
};

export default Navigation;
