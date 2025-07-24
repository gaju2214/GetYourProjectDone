// import React, { useState, useRef, useEffect } from "react";
// // import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom"; // ✅ ADDED useNavigate
// import { Button } from "../components/ui/Botton";
// import { Badge } from "../components/ui/Badge";
// import { Sheet, SheetContent, SheetTrigger } from "../components/ui/Sheet";

// import { Menu, ShoppingCart, User, Search } from "lucide-react";
// import { useCart } from "../context/CartContext";


// import EngiProNetwork from "./EngiproNetwork";
// import { useAuth } from "../context/AuthContext";

// const Navigation = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [isNetworkOpen, setIsNetworkOpen] = useState(false);
//   const { state } = useCart();
//   const [activeNav, setActiveNav] = useState("");

//   const [searchQuery, setSearchQuery] = useState("");
//   const [showSearch, setShowSearch] = useState(false);

//   const searchRef = useRef();

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (searchRef.current && !searchRef.current.contains(event.target)) {
//         setShowSearch(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const { user, logout } = useAuth(); // ✅ useAuth
//   const navigate = useNavigate();     // ✅ useNavigate

//   const handleLogout = () => {
//     logout();
//     navigate("/auth/login");
//   };

//   return (
//     <>
//       <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
//         <div className="container mx-auto px-4">
//           <div className="flex h-16 items-center justify-between">
//             <button
//               onClick={() => setIsNetworkOpen(true)}
//               className="flex justify-start sm:justify-center items-center w-full sm:w-auto pl-2 sm:pl-0 hover:scale-105 transition-transform duration-200"
//             >
//               <div className="relative h-12 w-40 sm:h-13 sm:w-[200px] flex-shrink-0">
//                 <img
//                   src="/logo.png"
//                   alt="Get Your Project Done"
//                   className="h-full w-full object-contain group-hover:brightness-110 transition-all"
//                 />
//               </div>
//             </button>



//             {/* Desktop Navigation */}
//             <div className="hidden md:flex items-center space-x-8">
//               <Link to="/projectkits">
//                 <Button
//                   variant="ghost"
//                   onClick={() => setActiveNav("projectKits")}
//                   className={`whitespace-nowrap text-gray-700 hover:text-gray-900 ${activeNav === "projectKits" ? "font-semibold text-black-600" : ""
//                     }`}
//                 >
//                   Project Kits
//                 </Button>
//               </Link>

//               <Link
//                 to="/categories"
//                 onClick={() => setActiveNav("categories")}
//                 className={`text-gray-700 hover:text-gray-900 transition-colors ${activeNav === "categories"
//                   ? "font-semibold text-blue-600"
//                   : ""
//                   }`}
//               >
//                 Categories
//               </Link>



//               <div className="flex items-center space-x-2" ref={searchRef}>
//                 <Button
//                   variant="ghost"
//                   size="icon"
//                   onClick={() => setShowSearch(!showSearch)}
//                   aria-label="Toggle Search"
//                 >
//                   <Search className="h-5 w-5" />
//                 </Button>

//                 {showSearch && (
//                   <input
//                     type="text"
//                     placeholder="Search projects..."
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-sm text-gray-800 transition-all duration-200 w-64"
//                   />
//                 )}
//               </div>

//             </div>

//             {/* Right Side Actions */}
//             <div className="flex items-center gap-2 sm:gap-4 pr-2 sm:pr-0">
//               {/* Cart Button */}
//               <Link to="/cart">
//                 <Button variant="ghost" size="icon" className="relative">
//                   <ShoppingCart className="h-5 w-5" />
//                   {state.itemCount > 0 && (
//                     <Badge className="absolute -top-1 right-5 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
//                       <span className="text-white bg-black px-1 rounded-full">
//                         {state.itemCount}
//                       </span>
//                     </Badge>
//                   )}
//                 </Button>
//               </Link>

//               {/* If user is logged in */}
//               {user ? (
//                 <>
//                   <Link to="/account">
//                     <Button variant="ghost" size="icon" className="p-2">
//                       <User className="h-5 w-5" />
//                     </Button>
//                   </Link>
//                   <Button
//                     onClick={handleLogout}
//                     className="bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700"
//                   >
//                     Logout
//                   </Button>
//                 </>
//               ) : (
//                 <Link to="/auth/login">
//                   <Button variant="ghost" size="icon" className="p-2">
//                     <User className="h-5 w-5" />
//                   </Button>
//                 </Link>
//               )}

//               {/* Mobile Menu */}
//               <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
//                 <SheetTrigger asChild>
//                   <Button variant="ghost" size="icon" className="md:hidden">
//                     <Menu className="h-5 w-5" />
//                   </Button>
//                 </SheetTrigger>

//                 <SheetContent
//                   side="right"
//                   className="w-80 h-full bg-white p-6 shadow-lg overflow-y-auto"
//                 >
//                   <div className="flex flex-col space-y-6">
//                     <Link
//                       to="/categories/electronics"
//                       onClick={() => setIsMenuOpen(false)}
//                       className="text-gray-700 hover:text-blue-600 text-base font-medium"
//                     >
//                       Categories
//                     </Link>

//                     <Link
//                       to="/orders"
//                       onClick={() => setIsMenuOpen(false)}
//                       className="text-gray-700 hover:text-blue-600 text-base font-medium"
//                     >
//                       Orders
//                     </Link>

//                     <Link to="/cart">
//                       <Button variant="ghost" size="icon" className="relative">
//                         <ShoppingCart className="h-5 w-5" />
//                         {state.itemCount > 0 && (
//                           <Badge className="absolute -top-1 right-5 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
//                             <span className="text-white bg-black px-1 rounded-full">
//                               {state.itemCount}
//                             </span>
//                           </Badge>
//                         )}
//                       </Button>
//                     </Link>

//                     {user ? (
//                       <>
//                         <Link
//                           to="/account"
//                           onClick={() => setIsMenuOpen(false)}
//                           className="text-gray-700 hover:text-red-600 text-base font-medium"
//                         >
//                           Profile
//                         </Link>
//                         <button
//                           onClick={() => {
//                             handleLogout();
//                             setIsMenuOpen(false);
//                           }}
//                           className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
//                         >
//                           Logout
//                         </button>
//                       </>
//                     ) : (
//                       <Link
//                         to="/auth/login"
//                         onClick={() => setIsMenuOpen(false)}
//                         className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 text-center"
//                       >
//                         Login
//                       </Link>
//                     )}
//                   </div>
//                 </SheetContent>
//               </Sheet>

//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Network Modal */}
//       <EngiProNetwork
//         isOpen={isNetworkOpen}
//         onClose={() => setIsNetworkOpen(false)}
//       />
//     </>
//   );
// };

// export default Navigation;

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
          <div className="flex h-16 items-center justify-between">
            <button
              onClick={() => setIsNetworkOpen(true)}
              className="flex justify-start sm:justify-center items-center w-full sm:w-auto pl-2 sm:pl-0 hover:scale-105 transition-transform duration-200"
            >
              <div className="relative h-12 w-40 sm:h-13 sm:w-[200px] flex-shrink-0">
                <img
                  src="/logo.png"
                  alt="Get Your Project Done"
                  className="h-full w-full object-contain transition-transform duration-300 ease-in-out hover:scale-105"
                />
              </div>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/">
                <Button
                  variant="ghost"
                  onClick={() => setActiveNav("home")}
                  className={`text-gray-700 hover:text-gray-900 transition-transform duration-200 hover:scale-105 ${activeNav === "home" ? "font-semibold text-black-600" : ""}`}
                >
                  Home
                </Button>
              </Link>

              <Link to="/projectkits">
                <Button
                  variant="ghost"
                  onClick={() => setActiveNav("projectKits")}
                  className={`whitespace-nowrap text-gray-700 hover:text-gray-900 transition-transform duration-200 hover:scale-105 ${activeNav === "projectKits" ? "font-semibold text-black-600" : ""
                    }`}
                >
                  Project Kits
                </Button>
              </Link>

              <Link to="/categories">
                <Button
                  variant="ghost"
                  onClick={() => setActiveNav("categories")}
                  className={`text-gray-700 hover:text-gray-900 transition-transform duration-200 hover:scale-105 ${activeNav === "categories" ? "font-semibold text-blue-600" : ""
                    }`}
                >
                  Categories
                </Button>
              </Link>


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

            {/* Right Side */}
            <div className="flex items-center gap-1 sm:gap-2 md:gap-3 pr-1 sm:pr-2 flex-shrink-0">
              <Link to="/" className="block md:hidden">
                <Button variant="ghost" size="icon">
                  <Home className="h-5 w-5 transition-transform duration-300 hover:scale-110 hover:text-orange-500" />
                </Button>
              </Link>

              <Link to="/cart">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5 transition-transform duration-300 hover:scale-110 hover:text-orange-500" />
                  {state.itemCount > 0 && (
                    <Badge className="absolute -top-1 right-5 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-black text-white">
                      <span>{state.itemCount}</span>
                    </Badge>
                  )}
                </Button>
              </Link>

              {user ? (
                <>
                  <Link to="/account">
                    <Button variant="ghost" size="icon" className="p-2">
                      <User className="h-5 w-5 transition-transform duration-300 hover:scale-110 hover:text-orange-500" />
                    </Button>
                  </Link>
                  <Button
                    onClick={handleLogout}
                    className="hidden lg:inline-flex bg-red-600 text-white px-3 py-1 text-sm rounded hover:bg-red-700 transition-colors"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Link to="/auth/login">
                  <Button variant="ghost" size="icon" className="p-2">
                    <User className="h-5 w-5 transition-transform duration-300 hover:scale-110 hover:text-orange-500" />
                  </Button>
                </Link>
              )}

              <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5 transition-transform duration-300 hover:scale-110 hover:text-orange-500" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-80 h-full bg-white px-4 py-6 shadow-lg overflow-y-auto transition-all duration-300 ease-in-out"
                >
                  <div className="flex flex-col space-y-6">
                    <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-blue-600 text-base font-medium">
                      Home
                    </Link>
                    <Link to="/categories" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-blue-600 text-base font-medium">
                      Categories
                    </Link>
                    <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-blue-600 text-base font-medium">
                      Orders
                    </Link>
                    <Link to="/cart" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" size="icon" className="relative">
                        <ShoppingCart className="h-5 w-5" />
                        {state.itemCount > 0 && (
                          <Badge className="absolute -top-1 right-5 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-black text-white">
                            <span>{state.itemCount}</span>
                          </Badge>
                        )}
                      </Button>
                    </Link>
                    {user ? (
                      <>
                        <Link to="/account" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-red-600 text-base font-medium">
                          Profile
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsMenuOpen(false);
                          }}
                          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-center"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <Link to="/auth/login" onClick={() => setIsMenuOpen(false)} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-center">
                        Login
                      </Link>
                    )}
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
