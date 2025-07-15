import React, { useEffect, useState } from "react";
import axios from "axios";
import { ProductCard } from "../components/ProductCard"; // adjust path if needed
import api from '../api'; // adjust path based on file location

const ProjectList = () => {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    api.get('/api/projects')
      .then((res) => {
        const mappedProjects = res.data.map(project => ({
          ...project,
          originalPrice: Math.floor(project.price * 1.5), // fake discount
          rating: 4.5, // optional
          reviews: 12, // optional
          difficulty: "Beginner", // optional
          components: ["Code", "Docs", "Support"], // optional
        }));
        setProjects(mappedProjects);
      })
      .catch(err => {
        console.error("Error fetching projects:", err);
      });
  }, []);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {projects.map((project) => (
        <ProductCard key={project.id} product={project} />
      ))}
    </div>
  );
};

export default ProjectList;
