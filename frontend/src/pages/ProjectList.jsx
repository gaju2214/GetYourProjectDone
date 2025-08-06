import React, { useEffect, useState } from "react";
import axios from "axios";
import { ProductCard } from "../components/ProductCard"; // adjust path if needed
import api from "../api"; // adjust path based on file location
import { useLocation } from "react-router-dom";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const location = useLocation();

  // Extract query parameter
  const queryParams = new URLSearchParams(location.search);
  const searchTerm = queryParams.get("q");

  useEffect(() => {
    if (!searchTerm || searchTerm.trim() === "") {
      // If no search query, fetch all projects
      api
        .get("/api/projects")
        .then((res) => {
          const projects = res.data.map((project) => ({
            ...project,
            originalPrice: Math.floor(project.price * 1.5),
            rating: 4.5,
            reviews: 12,
            difficulty: "Beginner",
            components: ["Code", "Docs", "Support"],
          }));
          setProjects(projects);
        })
        .catch((err) => console.error("Error fetching all projects:", err));
    } else {
      // If search term present, fetch filtered
      api
        .get(`/api/projects?q=${encodeURIComponent(searchTerm)}`)
        .then((res) => {
          const filtered = res.data.map((project) => ({
            ...project,
            originalPrice: Math.floor(project.price * 1.5),
            rating: 4.5,
            reviews: 12,
            difficulty: "Beginner",
            components: ["Code", "Docs", "Support"],
          }));
          setProjects(filtered);
        })
        .catch((err) =>
          console.error("Error fetching filtered projects:", err)
        );
    }
  }, [searchTerm]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {projects.map((project) => (
        <ProductCard key={project.id} product={project} />
      ))}
    </div>
  );
};

export default ProjectList;
