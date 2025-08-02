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
  const [projectData, setProjectData] = useState({
    title: "",
    description: "",
    price: "",
    categoryId: "",
    subcategoryId: "",
    components: [], // array of strings
    details: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [blockDiagramFile, setBlockDiagramFile] = useState(null);
  const [abstractFile, setAbstractFile] = useState(null);


  const navigate = useNavigate();

  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/api/protected/checkAuth"); // token is in cookie

        // if (res.data.message === 'authenticated' && res.data.success===true) {
        //   setIsAuthenticated(true);

        if (res.data.status === 200 && res.data.success === true) {
          setIsAuthenticated(true);
        } else {
          console.log("Auth failed: Unexpected response", res.data);
          navigate("/auth/login");
        }
      } catch (err) {
        console.error("User not authenticated:", err);
        navigate("/auth/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

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

  if (!isAuthenticated) {
    return <p>Redirecting to login...</p>;
  }

  const handleAddCategory = async () => {
    try {
      await api.post("/api/categories/create-category", {
        name: categoryName,
      });
      alert("Category added!");
      setCategoryName("");
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
    } catch (error) {
      console.error(error);
      alert("Error adding subcategory");
    }
  };

  const uploadToHostinger = async (file) => {
    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("https://myuploads.getyourprojectdone.in/upload.php", {
        method: "POST",
        body: data,
      });

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
    try {
      let imageUrl = null;
      let blockDiagramUrl = null;
      let abstractUrl = null;

      if (imageFile) {
        imageUrl = await uploadToHostinger(imageFile);
      }

      if (blockDiagramFile) {
        blockDiagramUrl = await uploadToHostinger(blockDiagramFile);
      }

      if (abstractFile) {
        abstractUrl = await uploadToHostinger(abstractFile);
      }

      const payload = {
        ...projectData,
        components: JSON.stringify(projectData.components),
        image: imageUrl,
        block_diagram: blockDiagramUrl,
        abstract_file: abstractUrl,
      };

      await api.post("/api/projects/create-project", payload);

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
    } catch (error) {
      console.error(error);
      alert("Error adding project");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold">Project Admin Panel</h1>

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
        {/* Project Details */}
        <textarea
          className="border p-2 w-full mb-2"
          placeholder="Project Details"
          value={projectData.details}
          onChange={(e) =>
            setProjectData({ ...projectData, details: e.target.value })
          }
        />

        {/* Components (comma separated) */}
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
        >
          Add Project
        </button>
      </div>
    </div>
  );
};

export default ProjectAdminPanel;


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import api from "./api"; // Adjust the path based on your file structure
// //const VITE_BACKEND_URL= 'https://pretty-adventure-production.up.railway.app';

// //const API_BASE = 'http://localhost:5000'; // Use this for local development

// const ProjectAdminPanel = () => {
//   const [categoryName, setCategoryName] = useState("");
//   const [subcategoryName, setSubcategoryName] = useState("");
//   const [selectedCategoryId, setSelectedCategoryId] = useState("");
//   const [categories, setCategories] = useState([]);
//   const [subcategories, setSubcategories] = useState([]);

//   const [projectData, setProjectData] = useState({
//     title: "",
//     description: "",
//     price: "",
//     categoryId: "",
//     subcategoryId: "",
//     components: [], // array of strings
//   });

//   // Fetch all categories on mount
//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const catRes = await api.get("/api/categories/getallcategory");
//         setCategories(catRes.data);
//       } catch (error) {
//         console.error("Failed to load categories", error);
//       }
//     };

//     fetchCategories();
//   }, []);

//   // Fetch subcategories when selectedCategoryId changes
//   useEffect(() => {
//     const fetchSubcategories = async () => {
//       if (!projectData.categoryId) {
//         setSubcategories([]);
//         return;
//       }

//       try {
//         const res = await api.get(
//           `/api/subcategories/by-category/${projectData.categoryId}`
//         );
//         setSubcategories(res.data);
//       } catch (error) {
//         console.error("Failed to load subcategories", error);
//       }
//     };

//     fetchSubcategories();
//   }, [projectData.categoryId]);

//   const handleAddCategory = async () => {
//     try {
//       await api.post("/api/categories/create-category", {
//         name: categoryName,
//       });
//       alert("Category added!");
//       setCategoryName("");
//     } catch (error) {
//       console.error(error);
//       alert("Error adding category");
//     }
//   };

//   const handleAddSubcategory = async () => {
//     try {
//       await api.post("/api/categories/create-subcategory", {
//         name: subcategoryName,
//         categoryId: selectedCategoryId,
//       });
//       alert("Subcategory added!");
//       setSubcategoryName("");
//       setSelectedCategoryId("");
//     } catch (error) {
//       console.error(error);
//       alert("Error adding subcategory");
//     }
//   };

//   const [imageFile, setImageFile] = useState(null);
//   const [blockDiagramFile, setBlockDiagramFile] = useState(null);

//   const uploadToCloudinary = async (file) => {
//     const data = new FormData();
//     data.append("file", file);
//     data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);
//     data.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

//     try {
//       const res = await fetch(
//         `https://api.cloudinary.com/v1_1/${
//           import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
//         }/upload`,
//         {
//           method: "POST",
//           body: data,
//         }
//       );

//       const result = await res.json();
//       return result.secure_url; // Returns the uploaded file's URL
//     } catch (err) {
//       console.error("Cloudinary upload failed:", err);
//       return null;
//     }
//   };

//   const handleAddProject = async () => {
//     try {
//       let imageUrl = null;
//       let blockDiagramUrl = null;

//       if (imageFile) {
//         imageUrl = await uploadToCloudinary(imageFile);
//       }

//       if (blockDiagramFile) {
//         blockDiagramUrl = await uploadToCloudinary(blockDiagramFile);
//       }

//       const payload = {
//         ...projectData,
//         components: JSON.stringify(projectData.components),
//         image: imageUrl,
//         block_diagram: blockDiagramUrl,
//       };

//       await api.post("/api/projects/create-project", payload);

//       alert("Project added!");
//       setProjectData({
//         title: "",
//         description: "",
//         price: "",
//         categoryId: "",
//         subcategoryId: "",
//       });
//       setImageFile(null);
//       setBlockDiagramFile(null);
//     } catch (error) {
//       console.error(error);
//       alert("Error adding project");
//     }
//   };

//   return (
//     <div className="p-6 max-w-3xl mx-auto space-y-8">
//       <h1 className="text-2xl font-bold">Project Admin Panel</h1>

//       {/* Add Category */}
//       <div className="border p-4 rounded">
//         <h2 className="font-semibold mb-2">Add Category</h2>
//         <input
//           className="border p-2 w-full mb-2"
//           type="text"
//           placeholder="Category Name"
//           value={categoryName}
//           onChange={(e) => setCategoryName(e.target.value)}
//         />
//         <button
//           className="bg-blue-500 text-white px-4 py-2 rounded"
//           onClick={handleAddCategory}
//         >
//           Add Category
//         </button>
//       </div>

//       {/* Add Subcategory */}
//       <div className="border p-4 rounded">
//         <h2 className="font-semibold mb-2">Add Subcategory</h2>
//         <input
//           className="border p-2 w-full mb-2"
//           type="text"
//           placeholder="Subcategory Name"
//           value={subcategoryName}
//           onChange={(e) => setSubcategoryName(e.target.value)}
//         />
//         <select
//           className="border p-2 w-full mb-2"
//           value={selectedCategoryId}
//           onChange={(e) => setSelectedCategoryId(e.target.value)}
//         >
//           <option value="">Select Category</option>
//           {categories.map((cat) => (
//             <option key={cat.id} value={cat.id}>
//               {cat.name}
//             </option>
//           ))}
//         </select>
//         <button
//           className="bg-green-500 text-white px-4 py-2 rounded"
//           onClick={handleAddSubcategory}
//         >
//           Add Subcategory
//         </button>
//       </div>

//       {/* Add Project */}
//       <div className="border p-4 rounded">
//         <h2 className="font-semibold mb-2">Add Project</h2>
//         <input
//           className="border p-2 w-full mb-2"
//           type="text"
//           placeholder="Project Title"
//           value={projectData.title}
//           onChange={(e) =>
//             setProjectData({ ...projectData, title: e.target.value })
//           }
//         />
//         <textarea
//           className="border p-2 w-full mb-2"
//           placeholder="Project Description"
//           value={projectData.description}
//           onChange={(e) =>
//             setProjectData({ ...projectData, description: e.target.value })
//           }
//         />
//         {/* Project Details */}
//         <textarea
//           className="border p-2 w-full mb-2"
//           placeholder="Project Details"
//           value={projectData.details}
//           onChange={(e) =>
//             setProjectData({ ...projectData, details: e.target.value })
//           }
//         />

//         {/* Components (comma separated) */}
//         <input
//           className="border p-2 w-full mb-2"
//           type="text"
//           placeholder="Project Components (comma separated)"
//           onChange={(e) =>
//             setProjectData({
//               ...projectData,
//               components: e.target.value.split(",").map((c) => c.trim()),
//             })
//           }
//         />
//         <input
//           className="border p-2 w-full mb-2"
//           type="number"
//           placeholder="Project Price"
//           value={projectData.price}
//           onChange={(e) =>
//             setProjectData({ ...projectData, price: e.target.value })
//           }
//         />
//          <h2 className="font-semibold mb-2"> Add Project Image</h2>
//         <input
//           type="file"
//           className="border p-2 w-full mb-2"
//           onChange={(e) => setImageFile(e.target.files[0])}
//         />
//          <h2 className="font-semibold mb-2">Add Block Diagram</h2>
//         <input
//           type="file"
//           className="border p-2 w-full mb-2"
//           onChange={(e) => setBlockDiagramFile(e.target.files[0])}
//         />

//         <select
//           className="border p-2 w-full mb-2"
//           value={projectData.categoryId}
//           onChange={(e) =>
//             setProjectData({
//               ...projectData,
//               categoryId: e.target.value,
//               subcategoryId: "", // reset subcategory when category changes
//             })
//           }
//         >
//           <option value="">Select Category</option>
//           {categories.map((cat) => (
//             <option key={cat.id} value={cat.id}>
//               {cat.name}
//             </option>
//           ))}
//         </select>
//         <select
//           className="border p-2 w-full mb-2"
//           value={projectData.subcategoryId}
//           onChange={(e) =>
//             setProjectData({ ...projectData, subcategoryId: e.target.value })
//           }
//         >
//           <option value="">Select Subcategory</option>
//           {subcategories.map((sub) => (
//             <option key={sub.id} value={sub.id}>
//               {sub.name}
//             </option>
//           ))}
//         </select>
//         <button
//           className="bg-purple-500 text-white px-4 py-2 rounded"
//           onClick={handleAddProject}
//         >
//           Add Project
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProjectAdminPanel;
