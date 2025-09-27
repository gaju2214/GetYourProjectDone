import React, { useState, useRef, useEffect } from "react";
import { Save, FolderEdit, Upload, Edit, X, Loader2, Image as ImageIcon } from "lucide-react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import api from "../api";

export default function EditProject() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({
    title: "",
    description: "",
    fullDetails: "",
    components: "",
    categoryId: "",
    subcategoryId: "",
    price: "",
    // Image URLs for display
    projectImageUrl: "",
    blockDiagramUrl: "",
    abstractFileUrl: ""
  });
  const [imageFiles, setImageFiles] = useState({
    projectImage: null,
    blockDiagram: null,
    abstractFile: null
  });
  const [imagePreviews, setImagePreviews] = useState({
    projectImage: "",
    blockDiagram: "",
    abstractFile: ""
  });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // File input refs
  const projectImageRef = useRef(null);
  const blockDiagramRef = useRef(null);
  const abstractFileRef = useRef(null);


  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [projectsRes, categoriesRes, subcategoriesRes] = await Promise.all([
        api.get("/api/projects"),
        api.get("/api/categories/getallcategory"),
        api.get("/api/categories/getallsubcategory")
      ]);

      console.log("Projects response:", projectsRes.data);
      console.log("Categories response:", categoriesRes.data);
      console.log("Subcategories response:", subcategoriesRes.data);
      
      setProjects(projectsRes.data);
      setCategories(categoriesRes.data);
      setSubcategories(subcategoriesRes.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      alert("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  // Upload helper (Hostinger)
  const uploadToHostinger = async (file) => {
    const data = new FormData();
    data.append("file", file);
    try {
      const res = await fetch("https://myuploads.getyourprojectdone.in/upload.php", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      if (result.url) return result.url;
      throw new Error("Upload failed");
    } catch (err) {
      console.error("Upload error:", err);
      return null;
    }
  };

  // Helper functions to handle category-subcategory relationships
  const getCategoryIdFromSubcategory = (subcategoryId) => {
    if (!subcategoryId) return "";
    const subcategory = subcategories.find(sub => String(sub.id) === String(subcategoryId));
    return subcategory ? String(subcategory.categoryId) : "";
  };

  const getCategoryName = (categoryId) => {
    if (!categoryId) return 'Unknown Category';
    const category = categories.find(cat => String(cat.id) === String(categoryId));
    return category ? category.name : 'Unknown Category';
  };

  const getSubcategoryName = (subcategoryId) => {
    if (!subcategoryId) return 'Unknown Subcategory';
    const subcategory = subcategories.find(sub => String(sub.id) === String(subcategoryId));
    return subcategory ? subcategory.name : 'Unknown Subcategory';
  };

  const getFilteredSubcategories = () => {
    return subcategories.filter(sub => String(sub.categoryId) === String(editValues.categoryId));
  };

  // Convert components to string for display
  const formatComponentsForDisplay = (components) => {
    if (!components) return "";
    if (Array.isArray(components)) {
      return components.join(", ");
    }
    return String(components);
  };

  // Updated startEdit function
const startEdit = (project) => {
  console.log("Starting edit for project:", project);
  
  setEditingId(project.id);
  
  // Find categoryId from subcategoryId
  const foundCategoryId = getCategoryIdFromSubcategory(project.subcategoryId);
  
  setEditValues({
    title: project.title || "",
    description: project.description || "",
    fullDetails: project.fullDetails || project.details || "",
    components: formatComponentsForDisplay(project.components),
    categoryId: foundCategoryId,
    subcategoryId: String(project.subcategoryId) || "",
    price: project.price || "",
    // ✅ Handle both field name variations
    projectImageUrl: project.image || project.projectImage || "",
    blockDiagramUrl: project.block_diagram || project.blockDiagram || "",
    abstractFileUrl: project.abstract_file || project.abstractFile || ""
  });

  // Set image previews
  setImagePreviews({
    projectImage: project.image || project.projectImage || "",
    blockDiagram: project.block_diagram || project.blockDiagram || "",
    abstractFile: project.abstract_file || project.abstractFile || ""
  });

  // Reset file inputs
  setImageFiles({
    projectImage: null,
    blockDiagram: null,
    abstractFile: null
  });

  console.log("Edit values set with correct field mapping");
};



  const cancelEdit = () => {
    setEditingId(null);
    setEditValues({
      title: "",
      description: "",
      fullDetails: "",
      components: "",
      categoryId: "",
      subcategoryId: "",
      price: "",
      projectImageUrl: "",
      blockDiagramUrl: "",
      abstractFileUrl: ""
    });
    setImageFiles({
      projectImage: null,
      blockDiagram: null,
      abstractFile: null
    });
    setImagePreviews({
      projectImage: "",
      blockDiagram: "",
      abstractFile: ""
    });

    // Reset file inputs
    if (projectImageRef.current) projectImageRef.current.value = "";
    if (blockDiagramRef.current) blockDiagramRef.current.value = "";
    if (abstractFileRef.current) abstractFileRef.current.value = "";
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      setImageFiles(prev => ({
        ...prev,
        [type]: file
      }));

      const previewUrl = URL.createObjectURL(file);
      setImagePreviews(prev => ({
        ...prev,
        [type]: previewUrl
      }));
    }
  };

  const removeImage = (type) => {
    setImageFiles(prev => ({
      ...prev,
      [type]: null
    }));
    setImagePreviews(prev => ({
      ...prev,
      [type]: ""
    }));

    const refs = {
      projectImage: projectImageRef,
      blockDiagram: blockDiagramRef,
      abstractFile: abstractFileRef
    };
    if (refs[type].current) {
      refs[type].current.value = "";
    }

    const urlFields = {
      projectImage: 'projectImageUrl',
      blockDiagram: 'blockDiagramUrl',
      abstractFile: 'abstractFileUrl'
    };
    setEditValues(prev => ({
      ...prev,
      [urlFields[type]]: ""
    }));
  };

// Add this helper function at the top of your component
const addTimestampToUrl = (url) => {
  if (!url) return url;
  const timestamp = Date.now();
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}t=${timestamp}`;
};

const saveEdit = async (id) => {
  if (!id) {
    console.error("No ID provided for update");
    return;
  }

  if (!editValues.title.trim()) {
    alert("Project title cannot be empty");
    return;
  }

  if (!editValues.categoryId) {
    alert("Please select a category");
    return;
  }

  if (!editValues.subcategoryId) {
    alert("Please select a subcategory");
    return;
  }

  if (!editValues.price || editValues.price <= 0) {
    alert("Please enter a valid price");
    return;
  }

  try {
    setUpdating(true);
    
    // Upload new images to Hostinger if selected
    let projectImageUrl = editValues.projectImageUrl;
    let blockDiagramUrl = editValues.blockDiagramUrl;
    let abstractFileUrl = editValues.abstractFileUrl;

    if (imageFiles.projectImage) {
      console.log("Uploading new project image...");
      const uploadedUrl = await uploadToHostinger(imageFiles.projectImage);
      if (uploadedUrl) projectImageUrl = uploadedUrl;
    }

    if (imageFiles.blockDiagram) {
      console.log("Uploading new block diagram...");
      const uploadedUrl = await uploadToHostinger(imageFiles.blockDiagram);
      if (uploadedUrl) blockDiagramUrl = uploadedUrl;
    }

    if (imageFiles.abstractFile) {
      console.log("Uploading new abstract file...");
      const uploadedUrl = await uploadToHostinger(imageFiles.abstractFile);
      if (uploadedUrl) abstractFileUrl = uploadedUrl;
    }

    // Handle components
    let componentsToSend;
    if (editValues.components && typeof editValues.components === 'string') {
      componentsToSend = editValues.components
        .split(',')
        .map(comp => comp.trim())
        .filter(comp => comp);
    } else if (Array.isArray(editValues.components)) {
      componentsToSend = editValues.components;
    } else {
      componentsToSend = [];
    }

    // ✅ FIXED: Use correct field names that match backend expectations
    const payload = {
      title: editValues.title.trim(),
      description: editValues.description,
      fullDetails: editValues.fullDetails,
      components: componentsToSend,
      subcategoryId: parseInt(editValues.subcategoryId),
      price: parseFloat(editValues.price),
      image: projectImageUrl,           // ✅ Changed from projectImage
      block_diagram: blockDiagramUrl,   // ✅ Changed from blockDiagram  
      abstract_file: abstractFileUrl    // ✅ Changed from abstractFile
    };

    console.log("Payload being sent:", payload);
    const response = await api.put(`/api/projects/${id}`, payload);

    // Update projects state with response data
    setProjects((prev) =>
      prev.map((project) =>
        project.id === id
          ? { 
              ...project, 
              ...response.data.project, // Use response data to get updated values
              subcategory: subcategories.find(sub => sub.id === parseInt(editValues.subcategoryId))
            }
          : project
      )
    );
    
    cancelEdit();
    alert("Project updated successfully!");
  } catch (err) {
    console.error("Error updating project:", err);
    alert(err.response?.data?.message || "Failed to update project. Please try again.");
  } finally {
    setUpdating(false);
  }
};


  const handleDelete = async (id) => {
    if (!id) {
      console.error("No ID provided for delete");
      return;
    }

    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      try {
        await api.delete(`/api/projects/${id}`);
        setProjects((prev) => prev.filter((project) => project.id !== id));
        alert("Project deleted successfully!");
      } catch (err) {
        console.error("Error deleting project:", err);
        alert(err.response?.data?.message || "Failed to delete project. Please try again.");
      }
    }
  };

  const handleEditorChange = (field, event, editor) => {
    const data = editor.getData();
    setEditValues(prev => ({
      ...prev,
      [field]: data
    }));
  };

  const ImageUploadField = ({ type, label, fileRef, accept = "image/*" }) => {
    const hasFile = imagePreviews[type] || editValues[`${type}Url`];
    const displayFile = imagePreviews[type] || editValues[`${type}Url`];

    // Helper to check if file is image
    const isImageFile = (url) => {
      if (!url) return false;
      // Check extension or mime type
      return (
        url.match(/\.(jpeg|jpg|png|gif|bmp|webp)$/i) ||
        url.startsWith('data:image')
      );
    };

    // Helper to get filename from URL
    const getFilename = (url) => {
      if (!url) return '';
      try {
        return decodeURIComponent(url.split('/').pop().split('?')[0]);
      } catch {
        return url;
      }
    };

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
        <div className="space-y-3">
          {hasFile ? (
            <div className="relative inline-block">
              {type === "abstractFile" && !isImageFile(displayFile) ? (
                <div className="w-32 h-32 bg-gray-100 rounded-lg border border-gray-300 flex flex-col items-center justify-center">
                  <span className="text-xs text-gray-500 text-center mb-2">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                  </span>
                  <span className="text-xs text-gray-700 text-center break-all">
                    {getFilename(displayFile) || "Abstract File"}
                  </span>
                </div>
              ) : (
                <img
                  src={displayFile}
                  alt={label}
                  className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                  key={displayFile}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              )}
              <div className="w-32 h-32 bg-gray-100 rounded-lg border border-gray-300 flex items-center justify-center" style={{display: 'none'}}>
                <span className="text-xs text-gray-500 text-center">
                  File not found
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeImage(type)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                disabled={updating}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-gray-400" />
            </div>
          )}

          <div>
            <input
              type="file"
              ref={fileRef}
              onChange={(e) => handleFileChange(e, type)}
              accept={accept}
              className="hidden"
              disabled={updating}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              disabled={updating}
            >
              <Upload className="w-4 h-4" />
              <span>{hasFile ? 'Change' : 'Upload'} {label}</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Loading projects...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <FolderEdit className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Edit Projects</h1>
        </div>

        <div className="space-y-4">
          {projects.length > 0 ? (
            projects.map((project) => (
              <div key={project.id} className="border border-gray-200 rounded-lg overflow-hidden">
                {editingId === project.id ? (
                  <div className="p-6 bg-gray-50">
                    <div className="space-y-6">
                      {/* Project Title, Category, Subcategory, Price */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Project Title *
                          </label>
                          <input
                            type="text"
                            name="title"
                            value={editValues.title}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                            disabled={updating}
                            placeholder="Enter project title"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category *
                          </label>
                          <select
                            name="categoryId"
                            value={editValues.categoryId}
                            onChange={(e) => {
                              setEditValues(prev => ({ 
                                ...prev, 
                                categoryId: e.target.value,
                                subcategoryId: ""
                              }));
                            }}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                            disabled={updating}
                          >
                            <option value="">Select category</option>
                            {categories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Subcategory *
                          </label>
                          <select
                            name="subcategoryId"
                            value={editValues.subcategoryId}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
                            disabled={updating || !editValues.categoryId}
                          >
                            <option value="">Select subcategory</option>
                            {getFilteredSubcategories().map((subcategory) => (
                              <option key={subcategory.id} value={subcategory.id}>
                                {subcategory.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                            Price *
                          </label>
                          <input
                            type="number"
                            id="price"
                            name="price"
                            value={editValues.price}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={updating}
                            placeholder="Enter price"
                            required
                          />
                        </div>
                      </div>

                      {/* Image Upload Fields */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <ImageUploadField
                          type="projectImage"
                          label="Project Image"
                          fileRef={projectImageRef}
                          accept="image/*"
                        />
                        <ImageUploadField
                          type="blockDiagram"
                          label="Block Diagram"
                          fileRef={blockDiagramRef}
                          accept="image/*"
                        />
                        <ImageUploadField
                          type="abstractFile"
                          label="Abstract File"
                          fileRef={abstractFileRef}
                          accept=".pdf,.doc,.docx"
                        />
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description
                        </label>
                        <CKEditor
                          editor={ClassicEditor}
                          data={editValues.description}
                          onChange={(event, editor) =>
                            handleEditorChange("description", event, editor)
                          }
                          disabled={updating}
                          key={`description-${editingId}`}
                        />
                      </div>

                      {/* Full Details */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Details
                        </label>
                        <CKEditor
                          editor={ClassicEditor}
                          data={editValues.fullDetails}
                          onChange={(event, editor) =>
                            handleEditorChange("fullDetails", event, editor)
                          }
                          disabled={updating}
                          key={`fullDetails-${editingId}`}
                        />
                      </div>

                      {/* Components - Simple Textarea */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Components
                        </label>
                        <textarea
                          name="components"
                          value={editValues.components || ""}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all resize-vertical"
                          disabled={updating}
                          placeholder="Enter components (e.g., Arduino Uno, LED, Resistor 220Ω, Breadboard)"
                          rows={4}
                        />
                        <p className="text-sm text-gray-500 mt-1">
                          💡 List all components needed for this project (comma separated)
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => saveEdit(project.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl font-semibold disabled:opacity-50 transition-colors flex items-center space-x-2"
                          disabled={updating}
                        >
                          {updating ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Save className="w-5 h-5" />
                          )}
                          <span>Save Changes</span>
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-xl font-semibold disabled:opacity-50 transition-colors flex items-center space-x-2"
                          disabled={updating}
                        >
                          <X className="w-5 h-5" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {project.title}
                          </h3>
                          {project.price && (
                            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                              ₹{project.price}
                            </span>
                          )}
                        </div>
                        
                        {/* Show project images in card view */}
                        {(project.projectImage || project.image || project.blockDiagram || project.block_diagram || project.abstractFile || project.abstract_file) && (
                          <div className="flex space-x-2 mb-3">
                            {(project.projectImage || project.image) && (
                              <img src={project.projectImage || project.image} alt="Project" className="w-16 h-16 object-cover rounded border" />
                            )}
                            {(project.blockDiagram || project.block_diagram) && (
                              <img src={project.blockDiagram || project.block_diagram} alt="Block Diagram" className="w-16 h-16 object-cover rounded border" />
                            )}
                            {(project.abstractFile || project.abstract_file) && (project.abstractFile || project.abstract_file).includes('image') && (
                              <img src={project.abstractFile || project.abstract_file} alt="Abstract" className="w-16 h-16 object-cover rounded border" />
                            )}
                          </div>
                        )}

                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                          <div>
                            <span className="font-medium">Category:</span>{" "}
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {getCategoryName(getCategoryIdFromSubcategory(project.subcategoryId))}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Subcategory:</span>{" "}
                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">
                              {getSubcategoryName(project.subcategoryId)}
                            </span>
                          </div>
                        </div>
                        {project.description && (
                          <div className="text-gray-600 text-sm">
                            <div dangerouslySetInnerHTML={{ __html: project.description?.substring(0, 150) + '...' }} />
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => startEdit(project)}
                          className="text-blue-500 hover:text-blue-700 transition-colors p-2 rounded-lg hover:bg-blue-50"
                          title="Edit project"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(project.id)}
                          className="text-red-500 hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50"
                          title="Delete project"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FolderEdit className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">No projects found</h3>
              <p>Add some projects to get started</p>
            </div>
          )}
        </div>

        {projects.length > 0 && (
          <div className="mt-6 text-sm text-gray-500 text-center">
            <p>💡 <strong>Tip:</strong> Click the edit icon to modify project details or the delete icon to remove projects</p>
          </div>
        )}
      </div>
    </div>
  );
}
