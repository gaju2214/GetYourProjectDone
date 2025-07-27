import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Botton";
import { Badge } from "../components/ui/Badge";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/Sheet";
import { Menu, ShoppingCart, User, Search, Home } from "lucide-react";
import { useCart } from "../context/CartContext";
import EngiProNetwork from "./EngiproNetwork";
import { useAuth } from "../context/AuthContext";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNetworkOpen, setIsNetworkOpen] = useState(false);
  const { state } = useCart();
  const [activeNav, setActiveNav] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [hasShadow, setHasShadow] = useState(false);
  const searchRef = useRef();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const path = window.location.pathname;
    if (path === "/") setActiveNav("home");
    else if (path.includes("/projectkits")) setActiveNav("projectKits");
    else if (path.includes("/categories")) setActiveNav("categories");
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setHasShadow(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  return (
    <>
      <nav className={`sticky top-0 z-50 w-full bg-white/90 backdrop-blur transition-shadow duration-300 ${hasShadow ? "shadow-md" : ""}`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-y-2 h-auto py-2">

            {/* Logo */}
            <button
              onClick={() => setIsNetworkOpen(true)}
              className="flex items-center justify-center w-full sm:justify-start sm:w-auto hover:scale-105 transition-transform duration-200"
            >
              <div className="relative h-10 w-32 xs:h-12 xs:w-36 sm:h-13 sm:w-[200px] flex-shrink-0 mx-auto sm:mx-0">
                <img
                  src="/logo.png"
                  alt="Get Your Project Done"
                  className="h-full w-full object-contain transition-transform duration-300 ease-in-out hover:scale-105"
                />
              </div>
            </button>

            {/* Desktop Nav Items */}
            <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
              {[
                { label: "Home", to: "/", key: "home" },
                { label: "Project Kits", to: "/projectkits", key: "projectKits" },
                { label: "Categories", to: "/categories", key: "categories" },
              ].map((item) => (
                <Link to={item.to} key={item.key}>
                  <Button
                    variant="ghost"
                    onClick={() => setActiveNav(item.key)}
                    className={`text-gray-700 hover:text-gray-900 hover:scale-105 transition-transform duration-200 ${activeNav === item.key ? "font-semibold text-black-600" : ""
                      }`}
                  >
                    {item.label}
                  </Button>
                </Link>
              ))}

              {/* Search Box */}
              <div className="flex items-center space-x-2" ref={searchRef}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSearch(!showSearch)}
                  aria-label="Toggle Search"
                  className="transition-transform duration-200 hover:scale-110"
                >
                  <Search className="h-5 w-5 transition-transform duration-300 hover:rotate-6 hover:text-orange-500" />
                </Button>

                {showSearch && (
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-sm text-gray-800 transition-all duration-300 ease-in-out w-64"
                  />
                )}
              </div>
            </div>

            {/* Right Side Buttons (Icons) */}
            <div className="flex items-center gap-8 sm:gap-2 md:gap-3 pr-1 sm:pr-2 flex-shrink-0 flex-nowrap overflow-x-auto max-w-full">

              {/* Home Icon for Mobile */}
              <Link to="/" className="block md:hidden flex-shrink-0">
                <Button variant="ghost" size="icon">
                  <Home className="h-5 w-5 hover:scale-110 hover:text-orange-500 transition-transform duration-300" />
                </Button>
              </Link>

              {/* Cart Icon */}
              <Link to="/cart" className="flex-shrink-0">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5 hover:scale-110 hover:text-orange-500 transition-transform duration-300" />
                  {state.itemCount > 0 && (
                    <Badge className="absolute top-0 right-5 h-5 w-5 rounded-full flex items-center justify-center text-[10px] bg-black text-white shadow-md">
                      {state.itemCount}
                    </Badge>
                  )}

                </Button>
              </Link>

              {/* User / Auth Buttons */}
              {user ? (
                <>
                  <Link to="/account" className="flex-shrink-0">
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5 hover:scale-110 hover:text-orange-500 transition-transform duration-300" />
                    </Button>
                  </Link>
                  <Button
                    onClick={handleLogout}
                    className="hidden lg:inline-flex bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700 transition-colors flex-shrink-0"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Link to="/auth/login" className="flex-shrink-0">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5 hover:scale-110 hover:text-orange-500 transition-transform duration-300" />
                  </Button>
                </Link>
              )}

              {/* Mobile Sheet Menu */}
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden flex-shrink-0">
                    <Menu className="h-6 w-6 hover:scale-110 hover:text-orange-500 transition-transform duration-300" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-80 h-full bg-white px-6 py-8 shadow-xl overflow-y-auto rounded-l-xl"
                >
                  {/* Mobile Sheet Content */}
                  <div className="flex justify-center mb-6">
                    <div className="relative h-12 w-40 sm:h-13 sm:w-[200px]">
                      <img
                        src="/logo.png"
                        alt="Get Your Project Done"
                        className="h-full w-full object-contain transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-5 text-lg font-medium">
                    <Link
                      to="/"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-gray-800 hover:text-orange-500 transition-colors duration-300"
                    >
                      Home
                    </Link>
                    <Link
                      to="/categories"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-gray-800 hover:text-orange-500 transition-colors duration-300"
                    >
                      Categories
                    </Link>
                    <Link
                      to="/cart"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-gray-800 hover:text-orange-500 transition-colors duration-300"
                    >
                      Cart
                    </Link>

                    {user ? (
                      <>
                        <Link
                          to="/account"
                          onClick={() => setIsMenuOpen(false)}
                          className="text-gray-800 hover:text-orange-500 transition-colors duration-300"
                        >
                          Profile
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsMenuOpen(false);
                          }}
                          className="w-full bg-gradient-to-r from-orange-500 via-rose-500 to-pink-500 text-white rounded-md py-2 transition-all duration-300 hover:from-orange-600 hover:to-pink-600 shadow-md"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <Link
                        to="/auth/login"
                        onClick={() => setIsMenuOpen(false)}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-md py-2 text-center shadow-md transition-all duration-300"
                      >
                        Login
                      </Link>
                    )}
                  </div>

                  <div className="mt-10 text-sm text-gray-400 text-center">
                    © 2025 GYPD. All rights reserved.
                  </div>
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
