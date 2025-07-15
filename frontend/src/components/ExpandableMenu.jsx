import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { categories } from "../lib/mock-data"; // update path if needed
import { Button } from "../components/ui/Botton"; // update path if needed

const ExpandableMenu = () => {
  const [expandedCategories, setExpandedCategories] = useState([]);

  const toggleCategory = (category) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-lg mb-4">Engineering Categories</h3>

      {Object.entries(categories).map(([category, subcategories]) => (
        <div key={category} className="border rounded-lg">
          <Button
            variant="ghost"
            className="w-full justify-between p-4 h-auto"
            onClick={() => toggleCategory(category)}
          >
            <span className="font-medium">{category}</span>
            {expandedCategories.includes(category) ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>

          {expandedCategories.includes(category) && (
            <div className="px-4 pb-4 space-y-2">
              {Object.entries(subcategories).map(([subcategory, projects]) => (
                <div key={subcategory} className="ml-4">
                  <div className="font-medium text-sm text-gray-700 mb-1">
                    {subcategory}
                  </div>
                  <div className="ml-4 space-y-1">
                    {projects.map((project, index) => (
                      <div
                        key={index}
                        className="text-sm text-gray-600 hover:text-gray-900 cursor-pointer"
                      >
                        {project}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ExpandableMenu;
