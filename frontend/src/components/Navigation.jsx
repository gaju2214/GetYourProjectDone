import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Botton";
import { Badge } from "../components/ui/Badge";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/Sheet";

import { Menu, ShoppingCart, User, Search } from "lucide-react";
import { useCart } from "../context/CartContext";

import ExpandableMenu from "./ExpandableMenu";
import EngiProNetwork from "./EngiproNetwork";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNetworkOpen, setIsNetworkOpen] = useState(false);
  const { state } = useCart();
  const [activeNav, setActiveNav] = useState("");

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo - Now clickable to show network */}
            <button
              onClick={() => setIsNetworkOpen(true)}
              className="flex items-center space-x-3 hover:scale-105 transition-transform duration-200 group"
            >
              <div className="relative">
                <img
                  src="/logo.png"
                  alt="Get Your Project Done"
                  width={200}
                  height={40}
                  className="h-13 w-auto group-hover:brightness-110 transition-all"
                />
              </div>
            </button>

            {/* Desktop Navigation */}
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    onClick={() => setActiveNav("projectKits")}
                    className={`text-gray-700 hover:text-gray-900 ${
                      activeNav === "projectKits"
                        ? "font-semibold text-black-600"
                        : ""
                    }`}
                  >
                    Project Kits
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <ExpandableMenu />
                </SheetContent>
              </Sheet>

              <Link
                to="/404"
                onClick={() => setActiveNav("categories")}
                className={`text-gray-700 hover:text-gray-900 transition-colors ${
                  activeNav === "categories"
                    ? "font-semibold text-blue-600"
                    : ""
                }`}
              >
                Categories
              </Link>

              <Link
                to="/Orders"
                onClick={() => setActiveNav("orders")}
                className={`text-gray-700 hover:text-gray-900 transition-colors ${
                  activeNav === "orders" ? "font-semibold text-blue-600" : ""
                }`}
              >
                Orders
              </Link>

              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              <Link to="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {state.itemCount > 0 && (
                    <Badge className="absolute -top-1 right-5 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                      <span className="text-white bg-black px-1 rounded-full">
                        {state.itemCount}
                      </span>
                    </Badge>
                  )}
                </Button>
              </Link>

              <Link to="/auth/login">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>

              {/* Mobile Menu */}
              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col space-y-4 mt-8">
                    <ExpandableMenu />
                    <Link
                      href="/categories/electronics"
                      className="text-gray-700 hover:text-gray-900 py-2"
                    >
                      Categories
                    </Link>
                    <Link
                      href="/orders"
                      className="text-gray-700 hover:text-gray-900 py-2"
                    >
                      Orders
                    </Link>
                    <Link
                      href="/cart"
                      className="text-gray-700 hover:text-gray-900 py-2"
                    >
                      Cart ({state.itemCount})
                    </Link>
                    <Link
                      href="/auth/login"
                      className="text-gray-700 hover:text-gray-900 py-2"
                    >
                      Profile
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Network Modal */}
      <EngiProNetwork
        isOpen={isNetworkOpen}
        onClose={() => setIsNetworkOpen(false)}
      />
    </>
  );
};

export default Navigation;
