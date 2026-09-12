import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Facebook,
  Youtube,
  Linkedin,
  Instagram,
  Phone,
  Mail,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
  Truck,
  Cpu,
  RefreshCcw,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email format.");
      return;
    }
    setError("");
    setSubscribed(true);
    setEmail("");
    setTimeout(() => {
      setSubscribed(false);
    }, 5000);
  };

  const projectCategories = [
    { name: "Electronics Projects", path: "/categories/electronics" },
    { name: "Robotics & Automation", path: "/categories/robotics" },
    { name: "IoT & Wireless", path: "/categories/iot" },
    { name: "Electrical Projects", path: "/categories/electrical" },
    { name: "Computer Science", path: "/categories/computer" },
    { name: "Mechanical Projects", path: "/categories/mechanical" }
  ];

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "All Project Kits", path: "/projects" },
    { name: "Product Categories", path: "/categories" },
    { name: "My Cart", path: "/cart" },
    { name: "Profile & Account", path: "/account" },
    { name: "Free IoT Platform", path: "https://getyourprojectdone.in/iot_platform/", external: true }
  ];

  return (
    <footer className="bg-[#121212] text-gray-400 font-sans border-t border-gray-800">

      {/* 🔹 Trust / Value Propositions Section */}
      <div className="bg-[#1c1c1c] py-10 border-b border-gray-850">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="p-3 bg-[#fb7b02]/10 rounded-xl text-[#fb7b02] shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Pan India Shipping</h4>
              <p className="text-xs text-gray-500 mt-0.5">Reliable delivery with real-time tracking.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="p-3 bg-[#fb7b02]/10 rounded-xl text-[#fb7b02] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">100% Secure Checkout</h4>
              <p className="text-xs text-gray-500 mt-0.5">SSL encrypted transactions via top gateways.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="p-3 bg-[#fb7b02]/10 rounded-xl text-[#fb7b02] shrink-0">
              <RefreshCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Verified Output</h4>
              <p className="text-xs text-gray-500 mt-0.5">Pre-tested working codes & circuit layouts.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left space-y-3 sm:space-y-0 sm:space-x-4">
            <div className="p-3 bg-[#fb7b02]/10 rounded-xl text-[#fb7b02] shrink-0">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Expert Guidance</h4>
              <p className="text-xs text-gray-500 mt-0.5">24/7 dedicated engineering support helpdesk.</p>
            </div>
          </div>

        </div>
      </div>

      {/* 🔹 Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-8 lg:px-12 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">

        {/* Column 1: Brand Info */}
        <div className="space-y-6 flex flex-col items-center text-center">
          <div className="flex justify-center items-center shrink-0">
            <img
              src="/logo-kitsindia.png"
              alt="KitsIndia Logo"
              className="h-12 w-auto object-contain bg-white p-1.5 rounded-lg"
            />
          </div>
          <p className="text-sm text-gray-400 leading-relaxed max-w-sm mx-auto text-center">
            KitsIndia is India's leading destination for pre-built and custom engineering projects, hardware kits, and IoT platform integration. We empower students and innovators to build real-world systems easily.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-3 pt-2">
            {[
              { icon: <Facebook className="w-4 h-4" />, href: "https://facebook.com", color: "hover:bg-blue-650" },
              { icon: <Youtube className="w-4 h-4" />, href: "https://youtube.com", color: "hover:bg-red-650" },
              { icon: <Linkedin className="w-4 h-4" />, href: "https://linkedin.com", color: "hover:bg-blue-550" },
              { icon: <Instagram className="w-4 h-4" />, href: "https://instagram.com", color: "hover:bg-pink-650" },
              { icon: <MessageCircle className="w-4 h-4" />, href: "https://wa.me/917030023573", color: "hover:bg-green-550" }
            ].map((social, idx) => (
              <motion.a
                key={idx}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -3, scale: 1.05 }}
                className={`w-9 h-9 rounded-full bg-[#1c1c1c] border border-gray-800 flex items-center justify-center text-gray-400 hover:text-white ${social.color} transition-all duration-300`}
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
        </div>

        {/* Column 2: Explore Categories */}
        <div className="space-y-5 flex flex-col items-center text-center">
          <h3 className="text-white font-bold text-sm tracking-wider uppercase border-b border-gray-800 pb-2 w-full text-center">
            Project Categories
          </h3>
          <ul className="space-y-3 text-sm flex flex-col items-center">
            {projectCategories.map((item, idx) => (
              <li key={idx} className="text-center">
                <Link
                  to={item.path}
                  className="hover:text-[#fb7b02] transition-all duration-200 block text-gray-400 text-center"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Quick Navigation */}
        <div className="space-y-5 flex flex-col items-center text-center">
          <h3 className="text-white font-bold text-sm tracking-wider uppercase border-b border-gray-800 pb-2 w-full text-center">
            Quick Links
          </h3>
          <ul className="space-y-3 text-sm flex flex-col items-center">
            {quickLinks.map((item, idx) => (
              <li key={idx} className="text-center">
                {item.external ? (
                  <a
                    href={item.path}
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-[#fb7b02] transition-all duration-200 block text-gray-400 text-center"
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    to={item.path}
                    className="hover:text-[#fb7b02] transition-all duration-200 block text-gray-400 text-center"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Support & Newsletter */}
        <div className="space-y-6 flex flex-col items-center lg:items-start text-center lg:text-left w-full">
          <div className="space-y-4 w-full flex flex-col items-center lg:items-start">
            <h3 className="text-white font-bold text-sm tracking-wider uppercase border-b border-gray-800 pb-2 w-full text-center lg:text-left">
              Contact & Support
            </h3>
            <ul className="space-y-3.5 text-sm w-full flex flex-col items-center lg:items-start">
              <li className="flex justify-center lg:justify-start items-center space-x-3">
                <Phone className="w-4 h-4 text-[#fb7b02] shrink-0" />
                <a href="tel:+917030023573" className="hover:text-white transition-colors">
                  +91 70300 23573
                </a>
              </li>
              <li className="flex justify-center lg:justify-start items-center space-x-3">
                <MessageCircle className="w-4 h-4 text-[#fb7b02] shrink-0" />
                <a href="https://wa.me/917030023573" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                  WhatsApp Direct Support
                </a>
              </li>
              <li className="flex justify-center lg:justify-start items-center space-x-3">
                <Mail className="w-4 h-4 text-[#fb7b02] shrink-0" />
                <a href="mailto:support@getyourprojectdone.com" className="hover:text-white transition-colors">
                  support@getyourprojectdone.com
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-3 w-full max-w-sm mx-auto lg:mx-0 flex flex-col items-center lg:items-start">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider text-center lg:text-left w-full">
              Subscribe to Newsletter
            </h4>
            <form onSubmit={handleSubscribe} className="relative flex items-center w-full">
              <input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
                className="w-full bg-[#1c1c1c] border border-gray-800 text-white rounded-lg pl-3 pr-10 py-2.5 text-xs focus:outline-none focus:border-[#fb7b02] transition-colors placeholder-gray-500"
              />
              <button
                type="submit"
                className="absolute right-1 bg-[#fb7b02] hover:bg-[#d46802] text-white p-1.5 rounded-md transition-colors cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
            {error && (
              <p className="text-red-500 text-[10px] flex items-center gap-1 mt-1 animate-pulse justify-center lg:justify-start w-full">
                <AlertCircle className="w-3 h-3" /> {error}
              </p>
            )}
            {subscribed && (
              <p className="text-green-500 text-[10px] flex items-center gap-1 mt-1 justify-center lg:justify-start w-full">
                <CheckCircle className="w-3 h-3" /> Subscribed successfully!
              </p>
            )}
          </div>
        </div>

      </div>

      {/* 🔹 Bottom Section */}
      <div className="bg-[#0b0b0b] border-t border-gray-850 py-8 px-6 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-center md:text-left text-gray-500">
              &copy; {new Date().getFullYear()} KitsIndia. All rights reserved.
              <span className="ml-2 text-gray-600">Built for student innovators.</span>
            </p>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-4 sm:gap-6 text-[10px] font-bold text-gray-600 uppercase tracking-widest">
            <span className="flex items-center gap-1">
              🛡️ SSL Encrypted
            </span>
            <span className="flex items-center gap-1">
              ⚡ Secure Gateway
            </span>
            <span className="flex items-center gap-1">
              🇮🇳 Made in India
            </span>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;
