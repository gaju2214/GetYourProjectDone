import React, { useState } from "react";
import ProductCard from "./ProductCard";
import allProducts from "../lib/mock-data";

export default function AllProjectsSection() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = allProducts.filter(
    (product) =>
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="py-16 bg-gray-50" id="all-projects">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            All Engineering Project Kits
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            Explore a wide range of innovative and tested project kits built for
            Electrical, Mechanical, IoT, Robotics, and Mechatronics domains.
          </p>

          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full sm:w-1/2 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No matching projects found.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
