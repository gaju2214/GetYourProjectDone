import React, { useState, useEffect } from "react";
import api from "./api";
import { useNavigate } from "react-router-dom";

const ProjectAdminPanel = () => {
  const [categoryName, setCategoryName] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
    price: "",
    categoryId: "",
    subcategoryId: "",
    components: [],
    details: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [blockDiagramFile, setBlockDiagramFile] = useState(null);
  const [abstractFile, setAbstractFile] = useState(null);

  const [isAddingProject, setIsAddingProject] = useState(false);  // NEW: loading spinner state

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/api/admin/checkAdmin"); // token in cookie
        if (res.data.status === 200 && res.data.admin.role === "admin") {
          setIsAuthenticated(true);
          setShowLoginPrompt(false);
        } else {
          setIsAuthenticated(false);
          setShowLoginPrompt(true);
        }
      } catch (err) {
        console.error("User not authenticated:", err);
        setIsAuthenticated(false);
        setShowLoginPrompt(true);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchCategories = async () => {
      try {
        const catRes = await api.get("/api/categories/getallcategory");
        setCategories(catRes.data);
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };

    fetchCategories();
  }, [isAuthenticated]);

  const handleLogout = async () => {
    try {
      const res = await api.post("/api/admin/logout", {}, { withCredentials: true });

      if (res.status === 200) {
        alert("Logged out successfully");
        navigate("/adlogin");
      } else {
        const data = await res.json();
        alert(data.message || "Logout failed");
      }
    } catch (err) {
      console.error("Logout error:", err);
      alert("An error occurred during logout");
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !projectData.categoryId) {
      setSubcategories([]);
      return;
    }

    const fetchSubcategories = async () => {
      try {
        const res = await api.get(
          `/api/subcategories/by-category/${projectData.categoryId}`
        );
        setSubcategories(res.data);
      } catch (error) {
        console.error("Failed to load subcategories:", error);
      }
    };

    fetchSubcategories();
  }, [projectData.categoryId, isAuthenticated]);

  if (isLoading) {
    return <p>Checking authentication...</p>;
  }

  if (!isAuthenticated && showLoginPrompt) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow-md rounded text-center">
        <p className="mb-4 text-red-600 font-semibold">
          You are not logged in..!
        </p>
        <button
          onClick={() => navigate("/adlogin")}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Go to Login
        </button>
      </div>
    );
  }

  const handleAddCategory = async () => {
    try {
      await api.post("/api/categories/create-category", {
        name: categoryName,
      });
      alert("Category added!");
      setCategoryName("");
      window.location.reload();  // Reload page here
    } catch (error) {
      console.error(error);
      alert("Error adding category");
    }
  };

  const handleAddSubcategory = async () => {
    try {
      await api.post("/api/categories/create-subcategory", {
        name: subcategoryName,
        categoryId: selectedCategoryId,
      });
      alert("Subcategory added!");
      setSubcategoryName("");
      setSelectedCategoryId("");
      window.location.reload();  // Reload page here
    } catch (error) {
      console.error(error);
      alert("Error adding subcategory");
    }
  };

  const uploadToHostinger = async (file) => {
    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch(
        "https://myuploads.getyourprojectdone.in/upload.php",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await res.json();

      if (result.url) {
        return result.url;
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      console.error("Hostinger upload failed:", err);
      return null;
    }
  };

const handleAddProject = async () => {
  setIsAddingProject(true);
  try {
    console.log("Starting project upload...");

    let imageUrl = null;
    let blockDiagramUrl = null;
    let abstractUrl = null;

    if (imageFile) {
      console.log("Uploading image file...");
      imageUrl = await uploadToHostinger(imageFile);
      console.log("Image URL:", imageUrl);
      if (!imageUrl) throw new Error("Image upload failed");
    }

    if (blockDiagramFile) {
      console.log("Uploading block diagram file...");
      blockDiagramUrl = await uploadToHostinger(blockDiagramFile);
      console.log("Block diagram URL:", blockDiagramUrl);
      if (!blockDiagramUrl) throw new Error("Block diagram upload failed");
    }

    if (abstractFile) {
      console.log("Uploading abstract file...");
      abstractUrl = await uploadToHostinger(abstractFile);
      console.log("Abstract URL:", abstractUrl);
      if (!abstractUrl) throw new Error("Abstract upload failed");
    }

    const payload = {
      ...projectData,
      components: JSON.stringify(projectData.components),
      image: imageUrl,
      block_diagram: blockDiagramUrl,
      abstract_file: abstractUrl,
    };

    console.log("Sending project create request...", payload);
    const response = await api.post("/api/projects/create-project", payload);
    console.log("Project create response:", response);

    alert("Project added!");

    setProjectData({
      title: "",
      description: "",
      price: "",
      categoryId: "",
      subcategoryId: "",
      components: [],
      details: "",
    });

    setImageFile(null);
    setBlockDiagramFile(null);
    setAbstractFile(null);
    window.location.reload();
  } catch (error) {
    console.error("Error adding project:", error);
    alert("Error adding project: " + (error.message || error));
  } finally {
    setIsAddingProject(false);
  }
};


  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Project Admin Panel</h1>
      <button
        onClick={handleLogout}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Logout
      </button>

      {/* Add Category */}
      <div className="border p-4 rounded">
        <h2 className="font-semibold mb-2">Add Category</h2>
        <input
          className="border p-2 w-full mb-2"
          type="text"
          placeholder="Category Name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={handleAddCategory}
        >
          Add Category
        </button>
      </div>

      {/* Add Subcategory */}
      <div className="border p-4 rounded">
        <h2 className="font-semibold mb-2">Add Subcategory</h2>
        <input
          className="border p-2 w-full mb-2"
          type="text"
          placeholder="Subcategory Name"
          value={subcategoryName}
          onChange={(e) => setSubcategoryName(e.target.value)}
        />
        <select
          className="border p-2 w-full mb-2"
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={handleAddSubcategory}
        >
          Add Subcategory
        </button>
      </div>

      {/* Add Project */}
      <div className="border p-4 rounded">
        <h2 className="font-semibold mb-2">Add Project</h2>
        <input
          className="border p-2 w-full mb-2"
          type="text"
          placeholder="Project Title"
          value={projectData.title}
          onChange={(e) =>
            setProjectData({ ...projectData, title: e.target.value })
          }
        />
        <textarea
          className="border p-2 w-full mb-2"
          placeholder="Project Description"
          value={projectData.description}
          onChange={(e) =>
            setProjectData({ ...projectData, description: e.target.value })
          }
        />
        <textarea
          className="border p-2 w-full mb-2"
          placeholder="Project Details"
          value={projectData.details}
          onChange={(e) =>
            setProjectData({ ...projectData, details: e.target.value })
          }
        />

        <input
          className="border p-2 w-full mb-2"
          type="text"
          placeholder="Project Components (comma separated)"
          onChange={(e) =>
            setProjectData({
              ...projectData,
              components: e.target.value.split(",").map((c) => c.trim()),
            })
          }
        />
        <input
          className="border p-2 w-full mb-2"
          type="number"
          placeholder="Project Price"
          value={projectData.price}
          onChange={(e) =>
            setProjectData({ ...projectData, price: e.target.value })
          }
        />

        <h3 className="font-semibold mb-2">Add Project Image</h3>
        <input
          type="file"
          accept="image/*"
          className="border p-2 w-full mb-2"
          onChange={(e) => setImageFile(e.target.files[0])}
        />

        <h3 className="font-semibold mb-2">Add Block Diagram</h3>
        <input
          type="file"
          accept="image/*"
          className="border p-2 w-full mb-2"
          onChange={(e) => setBlockDiagramFile(e.target.files[0])}
        />

        <h3 className="font-semibold mb-2">Add Project Abstract File (PDF)</h3>
        <input
          type="file"
          accept=".pdf"
          className="border p-2 w-full mb-2"
          onChange={(e) => setAbstractFile(e.target.files[0])}
        />
        {abstractFile && (
          <p className="text-sm text-gray-600 mb-2">
            Selected Abstract File: {abstractFile.name}
          </p>
        )}

        <select
          className="border p-2 w-full mb-2"
          value={projectData.categoryId}
          onChange={(e) =>
            setProjectData({
              ...projectData,
              categoryId: e.target.value,
              subcategoryId: "",
            })
          }
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <select
          className="border p-2 w-full mb-2"
          value={projectData.subcategoryId}
          onChange={(e) =>
            setProjectData({ ...projectData, subcategoryId: e.target.value })
          }
        >
          <option value="">Select Subcategory</option>
          {subcategories.map((sub) => (
            <option key={sub.id} value={sub.id}>
              {sub.name}
            </option>
          ))}
        </select>
        <button
          className="bg-purple-500 text-white px-4 py-2 rounded"
          onClick={handleAddProject}
          disabled={isAddingProject}
        >
          {isAddingProject ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-2 inline-block text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 01-8 8z"
                ></path>
              </svg>
              Adding...
            </>
          ) : (
            "Add Project"
          )}
        </button>
      </div>
    </div>
  );
};

export default ProjectAdminPanel;
