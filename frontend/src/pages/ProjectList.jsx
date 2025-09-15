import React, { useEffect, useState } from "react";
import { ProductCard } from "../components/ProductCard";
import api from "../api";
import { useLocation } from "react-router-dom";

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const location = useLocation();

  // Extract 'q' from URL
  const getQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get("q") || "";
  };

  const fetchProjects = async (q = "") => {
    setLoading(true);
    setError("");
    try {
      const url = q ? `/api/projects/search?q=${encodeURIComponent(q)}` : "/api/projects";
      const res = await api.get(url);

      setProjects(res.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setProjects([]);
        setError(err.response.data.error);
      } else {
        console.error(err);
        setError("Failed to fetch projects");
        setProjects([]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    const q = getQuery();
    fetchProjects(q);
  };

  const handleClearSearch = () => {
    // Navigate to clear search - you might need to adjust this based on your routing setup
    window.location.href = window.location.pathname;
  };

  useEffect(() => {
    const q = getQuery();
    fetchProjects(q);
  }, [location.search]);

  // Enhanced No Data Found Component
  const NoDataFound = () => {
    const query = getQuery();
    const isSearching = Boolean(query);

    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-24 h-24 mb-6 text-gray-300">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="w-full h-full"
          >
            {isSearching ? (
              // Search icon for search results
              <>
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
                <path d="M16 8a8 8 0 1 0-8 8" />
              </>
            ) : (
              // Folder icon for general empty state
              <>
                <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
                <circle cx="12" cy="13" r="1" />
              </>
            )}
          </svg>
        </div>

        <h3 className="text-xl font-semibold text-gray-700 mb-2">
          {isSearching ? "No results found" : "No projects yet"}
        </h3>

        <p className="text-gray-500 mb-6 max-w-md">
          {isSearching
            ? `We couldn't find any projects matching "${query}". Try adjusting your search terms or browse all projects.`
            : "It looks like there are no projects available at the moment. Check back later or create your first project."}
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          {isSearching ? (
            <>
              <button
                onClick={handleClearSearch}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                Browse All Projects
              </button>
              <button
                onClick={handleRetry}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                Try Again
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleRetry}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                Refresh Projects
              </button>
              <button
                onClick={() => window.location.href = '/projects/new'} // Adjust URL as needed
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
              >
                Create Project
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  // Enhanced Error Component
  const ErrorState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-24 h-24 mb-6 text-red-300">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="w-full h-full"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>

      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        Something went wrong
      </h3>

      <p className="text-gray-500 mb-6 max-w-md">
        {error || "We encountered an error while loading the projects. Please try again."}
      </p>

      <button
        onClick={handleRetry}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
      >
        Try Again
      </button>
    </div>
  );

  // Enhanced Loading Component
  const LoadingState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-12 h-12 mb-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
      <p className="text-gray-600 font-medium">Loading projects...</p>
    </div>
  );

  return (
    <div className="p-4 min-h-screen">
      {loading ? (
        <LoadingState />
      ) : error ? (
        <ErrorState />
      ) : projects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {projects.map((project) => (
            <ProductCard key={project.id} product={project} />
          ))}
        </div>
      ) : (
        <NoDataFound />
      )}
    </div>
  );
};

export default ProjectList;