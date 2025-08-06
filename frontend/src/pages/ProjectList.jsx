import React, { useEffect, useState } from "react";
import axios from "axios";
import { ProductCard } from "../components/ProductCard"; // adjust path if needed
import api from "../api"; // adjust path based on file location
import { useLocation } from "react-router-dom";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const name = queryParams.get("q");

  useEffect(() => {
    console.log(name);
    if (!name) {
      api
        .get("/api/projects")
        .then((res) => {
          const mappedProjects = res.data.map((project) => ({
            ...project,
            originalPrice: Math.floor(project.price * 1.5), // fake discount
            rating: 4.5,
            reviews: 12,
            difficulty: "Beginner", // optional
            components: ["Code", "Docs", "Support"], // optional
          }));
          setProjects(mappedProjects);
        })
        .catch((err) => {
          console.error("Error fetching projects:", err);
        });
    } else {
      api
        .get(`/api/projects/by-slug/${name}`)
        .then((res) => {
          const p = res.data.data; // <-- FIXED
          setProjects({
            ...p,
            originalPrice: Math.floor(p.price * 1.5),
            rating: 4.5,
            reviews: 12,
            difficulty: "Beginner", // optional
            components: ["Code", "Docs", "Support"], // optional
          });
        })
        .catch((err) => {
          console.error("Error fetching project:", err);
        });
    }
  }, []);

  // useEffect(() => {
  //   api
  //     .get(`/api/projects/by-slug/${name}`)
  //     .then((res) => {
  //       const p = res.data.data; // <-- FIXED
  //       setProjects({
  //         ...p,
  //         originalPrice: Math.floor(p.price * 1.5),
  //       });
  //     })
  //     .catch((err) => {
  //       console.error("Error fetching project:", err);
  //     });
  // }, [id]);

  return (
    <>
      {projects && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
          {projects?.map((project) => (
            <ProductCard key={project.id} product={project} />
          ))}
        </div>
      )}
    </>
  );
};

export default ProjectList;
