import React, { useState, useEffect } from 'react';
import axios from 'axios';

//const API_BASE = 'https://getyourprojectdone-backend.onrender.com';

 const API_BASE = 'http://localhost:5000'; // Use this for local development

const ProjectAdminPanel = () => {
  const [categoryName, setCategoryName] = useState('');
  const [subcategoryName, setSubcategoryName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [projectData, setProjectData] = useState({
    title: '',
    description: '',
    price: '',
    categoryId: '',
    subcategoryId: '',
  });

  // Fetch all categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const catRes = await axios.get(`${API_BASE}/api/categories/getallcategory`);
        setCategories(catRes.data);
      } catch (error) {
        console.error('Failed to load categories', error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch subcategories when selectedCategoryId changes
useEffect(() => {
  const fetchSubcategories = async () => {
    if (!projectData.categoryId) {
      setSubcategories([]);
      return;
    }

    try {
      const res = await axios.get(
        `${API_BASE}/api/subcategories/by-category/${projectData.categoryId}`
      );
      setSubcategories(res.data);
    } catch (error) {
      console.error('Failed to load subcategories', error);
    }
  };

  fetchSubcategories();
}, [projectData.categoryId]);


  const handleAddCategory = async () => {
    try {
      await axios.post(`${API_BASE}/api/categories/create-category`, {
        name: categoryName,
      });
      alert('Category added!');
      setCategoryName('');
    } catch (error) {
      console.error(error);
      alert('Error adding category');
    }
  };

  const handleAddSubcategory = async () => {
    try {
      await axios.post(`${API_BASE}/api/categories/create-subcategory`, {
        name: subcategoryName,
        categoryId: selectedCategoryId,
      });
      alert('Subcategory added!');
      setSubcategoryName('');
      setSelectedCategoryId('');
    } catch (error) {
      console.error(error);
      alert('Error adding subcategory');
    }
  };

  const handleAddProject = async () => {
    try {
      await axios.post(`${API_BASE}/api/projects/create-project`, projectData);
      alert('Project added!');
      setProjectData({
        title: '',
        description: '',
        price: '',
        categoryId: '',
        subcategoryId: '',
      });
    } catch (error) {
      console.error(error);
      alert('Error adding project');
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
          onChange={(e) => setProjectData({ ...projectData, title: e.target.value })}
        />
        <textarea
          className="border p-2 w-full mb-2"
          placeholder="Project Description"
          value={projectData.description}
          onChange={(e) =>
            setProjectData({ ...projectData, description: e.target.value })
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
        <select
          className="border p-2 w-full mb-2"
          value={projectData.categoryId}
          onChange={(e) =>
            setProjectData({
              ...projectData,
              categoryId: e.target.value,
              subcategoryId: '', // reset subcategory when category changes
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
