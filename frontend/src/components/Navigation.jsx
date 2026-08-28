import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../components/ui/Botton";
import { Badge } from "../components/ui/Badge";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/Sheet";
import { Menu, ShoppingCart, User, Search, Home, MessageCircle, Layers, Cpu, Hammer, Wifi } from "lucide-react";
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

  const handleLogout = async () => {
    try {
      await api.post('/api/auth/logout', {});
    } catch (err) {
      // ignore errors during logout request
    }
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (e) { }
    setUser(null);
    setCartCount(0);
    navigate('/auth/login');
  };

  return (
    <>
      {/* 1. Top Utility Bar (scrolls away) */}
      <div className="bg-[#1c1c1c] text-gray-300 text-[10px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-4 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex flex-row items-center justify-between gap-2 overflow-x-auto scrollbar-none whitespace-nowrap">
          {/* Support / WhatsApp Column */}
          <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
            <span className="hidden md:inline text-gray-400">📞 Support: +91 70300 23573</span>
            <a 
              href="https://wa.me/917030023573" 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-1 hover:text-[#fb7b02] transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-green-500 fill-green-500/10 shrink-0" />
              <span className="inline sm:hidden">WhatsApp</span>
              <span className="hidden sm:inline">Chat on WhatsApp</span>
            </a>
          </div>

          {/* Separator on desktop, hidden on mobile */}
          <span className="hidden sm:inline text-gray-700">|</span>

          {/* Quick Links Column */}
          <div className="flex items-center space-x-2 sm:space-x-4 shrink-0">
            <Link to="/categories" className="flex items-center gap-1 hover:text-[#fb7b02] transition-colors">
              <Layers className="w-3 h-3 text-[#fb7b02] shrink-0" />
              <span className="inline sm:hidden">Kits</span>
              <span className="hidden sm:inline">Project Kits</span>
            </Link>
            
            <span className="text-gray-800">|</span>
            
            <Link to="/engineering-kit" className="flex items-center gap-1 hover:text-[#fb7b02] transition-colors">
              <Cpu className="w-3 h-3 text-cyan-400 shrink-0" />
              <span className="inline sm:hidden">Engineering</span>
              <span className="hidden sm:inline">Engineering Kit</span>
            </Link>
            
            <span className="text-gray-800">|</span>
            
            <Link to="/diy-project-kits" className="flex items-center gap-1 hover:text-[#fb7b02] transition-colors">
              <Hammer className="w-3 h-3 text-orange-400 shrink-0" />
              <span className="inline sm:hidden">DIY</span>
              <span className="hidden sm:inline">DIY Project Kits</span>
            </Link>
            
            <span className="text-gray-800">|</span>
            
            <a 
              href="https://getyourprojectdone.in/iot_platform/" 
              target="_blank" 
              rel="noreferrer" 
              className="flex items-center gap-1 hover:text-[#fb7b02] transition-colors"
            >
              <Wifi className="w-3 h-3 text-blue-400 shrink-0" />
              <span className="inline sm:hidden">IoT</span>
              <span className="hidden sm:inline">Free IoT Platform</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Header (Sticky) */}
      <nav
        className={`sticky top-0 z-50 w-full bg-white border-b border-gray-100 transition-shadow duration-300 ${hasShadow ? "shadow-md" : ""
          }`}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            {/* Logo */}
            <button
              onClick={() => setIsNetworkOpen(true)}
              className="flex items-center shrink-0 hover:opacity-90 transition-opacity"
            >
              <img
                src="/logo-kitsindia.png"
                alt="KitsIndia"
                className="h-8 sm:h-12 w-auto object-contain"
              />
            </button>

            {/* Desktop Center Search Bar (Robu style: large with orange search button) */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8 relative items-center">
              <div className="flex w-full border-2 border-gray-200 focus-within:border-[#003e8b] rounded-lg overflow-hidden transition-colors">
                <input
                  type="text"
                  placeholder="Search over 500+ engineering project kits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  className="flex-1 px-4 py-2 text-sm text-gray-700 bg-white focus:outline-none placeholder-gray-400"
                />
                <button
                  onClick={handleSearch}
                  className="bg-[#003e8b] hover:bg-[#002e66] px-6 text-white flex items-center justify-center transition-colors border-l border-gray-200 cursor-pointer"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Right-side Icons */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Home Icon */}
              <Link
                to="/"
                className="p-2 text-gray-700 hover:text-[#003e8b] hover:bg-gray-50 rounded-full transition-all"
              >
                <Home className="h-6 w-6" />
              </Link>

              {/* Mobile Search Toggle */}
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="block md:hidden p-2 text-gray-600 hover:text-[#003e8b] hover:bg-gray-50 rounded-full transition-all"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Cart Icon */}
              <Link to="/cart" className="relative p-2 text-gray-700 hover:text-[#003e8b] hover:bg-gray-50 rounded-full transition-all">
                <ShoppingCart className="h-6 w-6" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold bg-[#003e8b] text-white border-2 border-white shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Account / Profile */}
              <Link
                to={user ? "/account" : "/auth/login"}
                className="flex items-center space-x-1 p-2 text-gray-700 hover:text-[#003e8b] hover:bg-gray-50 rounded-full transition-all"
              >
                <User className="h-6 w-6" />
                {user && (
                  <span className="hidden lg:inline text-xs font-semibold text-gray-600 max-w-[80px] truncate">
                    {user.name || "Account"}
                  </span>
                )}
              </Link>

              {/* Menu Hamburger */}
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <button className="md:hidden p-2 text-gray-700 hover:text-[#003e8b] hover:bg-gray-50 rounded-full transition-all">
                    <Menu className="h-6 w-6" />
                  </button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-72 h-full bg-white border-l border-gray-100 p-0 shadow-2xl flex flex-col justify-between"
                >
                  <motion.div
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="h-full flex flex-col justify-between"
                  >
                    <div>
                      {/* Logo header inside mobile menu */}
                      <div className="flex items-center justify-center p-6 border-b border-gray-50">
                        <img
                          src="/logo-kitsindia.png"
                          alt="KitsIndia"
                          className="h-10 w-auto object-contain"
                        />
                      </div>

                      {/* Navigation links */}
                      <div className="flex flex-col p-6 space-y-4 text-sm font-semibold text-gray-800">
                        <Link
                          to="/"
                          onClick={() => setIsMenuOpen(false)}
                          className="hover:text-[#003e8b] transition-colors py-2 border-b border-gray-50"
                        >
                          Home
                        </Link>
                        <Link
                          to="/categories"
                          onClick={() => setIsMenuOpen(false)}
                          className="hover:text-[#003e8b] transition-colors py-2 border-b border-gray-50"
                        >
                          Project Kits
                        </Link>
                        <Link
                          to="/engineering-kit"
                          onClick={() => setIsMenuOpen(false)}
                          className="hover:text-[#003e8b] transition-colors py-2 border-b border-gray-50"
                        >
                          Engineering Kit
                        </Link>
                        <Link
                          to="/diy-project-kits"
                          onClick={() => setIsMenuOpen(false)}
                          className="hover:text-[#003e8b] transition-colors py-2 border-b border-gray-50"
                        >
                          DIY Project Kits
                        </Link>
                        <Link
                          to="/cart"
                          onClick={() => setIsMenuOpen(false)}
                          className="hover:text-[#003e8b] transition-colors py-2 border-b border-gray-50"
                        >
                          Cart
                        </Link>
                        <a
                          href="https://getyourprojectdone.in/iot_platform/"
                          onClick={() => setIsMenuOpen(false)}
                          className="hover:text-[#003e8b] transition-colors py-2 border-b border-gray-50"
                        >
                          Free IoT Platform
                        </a>
                        {user ? (
                          <>
                            <Link
                              to="/account"
                              onClick={() => setIsMenuOpen(false)}
                              className="hover:text-[#003e8b] transition-colors py-2 border-b border-gray-50"
                            >
                              My Account
                            </Link>
                            <button
                              onClick={() => {
                                handleLogout();
                                setIsMenuOpen(false);
                              }}
                              className="w-full mt-4 bg-[#003e8b] hover:bg-[#002e66] text-white rounded-lg py-2.5 transition-colors font-bold shadow-sm cursor-pointer"
                            >
                              Logout
                            </button>
                          </>
                        ) : (
                          <Link
                            to="/auth/login"
                            onClick={() => setIsMenuOpen(false)}
                            className="w-full mt-4 bg-[#003e8b] hover:bg-[#002e66] text-white rounded-lg py-2.5 text-center transition-colors font-bold shadow-sm"
                          >
                            Login / Register
                          </Link>
                        )}
                      </div>
                    </div>
                    <div className="p-6 text-xs text-gray-400 text-center border-t border-gray-50">
                      © 2026 GYPD. All rights reserved.
                    </div>
                  </motion.div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        {/* 3. Lower Desktop Navbar (Robu Categories / Links) */}
        <div className="hidden md:block bg-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-10 text-sm font-semibold text-gray-700">
            <div className="flex items-center space-x-8">
              <Link to="/" className="hover:text-[#003e8b] py-2 transition-colors flex items-center gap-1.5">
                <Home className="h-4 w-4" /> Home
              </Link>
              <Link to="/categories" className="hover:text-[#003e8b] py-2 transition-colors">
                Project Kits / Categories
              </Link>
              <Link to="/engineering-kit" className="hover:text-[#003e8b] py-2 transition-colors">
                Engineering Kits
              </Link>
              <Link to="/diy-project-kits" className="hover:text-[#003e8b] py-2 transition-colors">
                DIY Project Kits
              </Link>
              <a
                href="https://getyourprojectdone.in/iot_platform/"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#003e8b] py-2 transition-colors"
              >
                IoT Platform
              </a>
            </div>
            <div className="text-gray-500 text-xs">
              ⚡ India's Trusted Ready-To-Use Engineering Kits
            </div>
          </div>
        </div>

        {/* Mobile Search Bar Expansion */}
        <AnimatePresence>
          {showSearch && (
            <motion.div
              ref={searchRef}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full bg-white border-t border-gray-100 px-4 py-3 shadow-inner md:hidden"
            >
              <div className="relative flex">
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  className="w-full px-4 py-2 border border-gray-200 rounded-l-md focus:outline-none focus:border-[#003e8b] text-gray-700 text-sm bg-gray-50"
                />
                <button
                  onClick={handleSearch}
                  className="bg-[#003e8b] px-4 rounded-r-md text-white flex items-center justify-center cursor-pointer"
                >
                  <Search className="h-4 w-4" />
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
