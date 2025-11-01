import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/Botton";
import { Badge } from "../components/ui/Badge";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/Sheet";
import { Menu, ShoppingCart, User, Search, Home } from "lucide-react";
import EngiProNetwork from "./EngiproNetwork";
import api from "../api";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNetworkOpen, setIsNetworkOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [hasShadow, setHasShadow] = useState(false);
  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  const searchRef = useRef();
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/projects/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  // Auth check + cart count
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/api/protected/checkAuth");
        if (res.data?.success === true && res.data?.status === 200) {
          setUser(res.data.user);
          const cartRes = await api.get(`/api/cart/${res.data.user.userId}`);
          const quantity = cartRes.data.reduce((sum, item) => sum + item.quantity, 0);
          setCartCount(quantity);
        } else {
          setUser(null);
          setCartCount(0);
        }
      } catch {
        setUser(null);
        setCartCount(0);
      }
    };
    checkAuth();
  }, []);

  // Shadow on scroll
  useEffect(() => {
    const handleScroll = () => setHasShadow(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    navigate("/auth/login");
  };

  return (
    <>
      <nav
        className={`sticky top-0 z-50 w-full bg-white/90 backdrop-blur transition-shadow duration-300 ${
          hasShadow ? "shadow-md" : ""
        }`}
      >
        <div className="flex items-center justify-between gap-y-2 h-auto py-2 px-2 sm:px-4">
          {/* Logo */}
          <button
            onClick={() => setIsNetworkOpen(true)}
            className="flex items-center justify-start sm:justify-center w-auto hover:scale-105 transition-transform duration-200"
          >
            <div className="relative h-10 w-32 xs:h-12 xs:w-36 sm:h-13 sm:w-[200px]">
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
              {
                label: "IoT Platform",
                to: "https://getyourprojectdone.in/iot_platform/",
                key: "projectKits",
              },
            ].map((item) => (
              <Link to={item.to} key={item.key}>
                <Button
                  variant="ghost"
                  onClick={() => setActiveNav(item.key)}
                  className={`whitespace-nowrap min-w-[120px] text-center px-4 text-gray-700 hover:text-gray-900 hover:scale-105 transition-transform duration-200 ${
                    activeNav === item.key ? "font-semibold text-black-600" : ""
                  }`}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
              <div className="hidden md:flex items-center relative">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="px-4 py-2 w-60 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                onClick={handleSearch}
                className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-gray-600 hover:text-white hover:bg-orange-500 transition-colors"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Right Side (Search + Icons) */}
          <div className="flex items-center gap-2">
            {/* ✅ Desktop Search Bar */}
          

          
           
            {/* 🏠 Home (mobile) */}
            <Link to="/" className="block md:hidden">
              <Button variant="ghost" size="icon" className="p-1 hover:text-orange-500">
                <Home className="h-5 w-5" />
              </Button>
            </Link>
              {/* 🔍 Mobile Search Icon */}
             <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSearch(!showSearch)}
              className="block md:hidden p-1 hover:text-orange-500"
            >
              <Search className="h-5 w-5" />
            </Button>
            {/* 🛒 Cart */}
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon" className="p-1 hover:text-orange-500">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-medium bg-black text-white">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* 👤 User */}
            <Link to={user ? "/account" : "/auth/login"}>
              <Button variant="ghost" size="icon" className="p-1 hover:text-orange-500">
                <User className="h-5 w-5" />
              </Button>
            </Link>

            {/* ☰ Menu */}
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden p-1 hover:text-orange-500"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-64 h-full bg-white border-l border-orange-200 px-6 py-8 shadow-2xl rounded-l-3xl"
              >
                <motion.div
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="h-full flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-center mb-6">
                      <div className="relative h-12 w-40">
                        <img
                          src="/logo.png"
                          alt="Get Your Project Done"
                          className="h-full w-full object-contain"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col space-y-5 text-lg font-medium">
                      <Link
                        to="/"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-gray-800 hover:text-orange-500"
                      >
                        Home
                      </Link>
                      <Link
                        to="/categories"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-gray-800 hover:text-orange-500"
                      >
                        Project Kits
                      </Link>
                      <Link
                        to="/cart"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-gray-800 hover:text-orange-500"
                      >
                        Cart
                      </Link>

                      {user ? (
                        <>
                          <Link
                            to="/account"
                            onClick={() => setIsMenuOpen(false)}
                            className="text-gray-800 hover:text-orange-500"
                          >
                            Profile
                          </Link>
                          <button
                            onClick={() => {
                              handleLogout();
                              setIsMenuOpen(false);
                            }}
                            className="w-full bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 text-white rounded-md py-2 hover:from-orange-600 hover:to-pink-600"
                          >
                            Logout
                          </button>
                        </>
                      ) : (
                        <Link
                          to="/auth/login"
                          onClick={() => setIsMenuOpen(false)}
                          className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-md py-2 text-center"
                        >
                          Login
                        </Link>
                      )}
                    </div>
                  </div>
                  <div className="mt-10 text-sm text-gray-400 text-center">
                    © 2025 GYPD. All rights reserved.
                  </div>
                </motion.div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* 🔽 Mobile Search Bar (below navbar only for mobile) */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              ref={searchRef}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full bg-white border-t border-gray-200 px-4 pb-3 shadow-sm md:hidden"
            >
              <div className="relative mt-2">
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700 text-sm"
                />
                <button
                  onClick={handleSearch}
                  className="absolute right-9 top-1/2 -translate-y-1/2 text-gray-600 hover:text-orange-500"
                >
                  <Search className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setShowSearch(false)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 text-lg font-semibold"
                >
                  ×
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Network Modal */}
      <EngiProNetwork isOpen={isNetworkOpen} onClose={() => setIsNetworkOpen(false)} />
    </>
  );
};

export default Navigation;
