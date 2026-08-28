import React, { useState, useEffect } from "react";
import api from "./api";
import { useNavigate } from "react-router-dom";
import * as blogService from "./services/blogService";
import { Check, X, Trash2, Edit2, Plus, ArrowUp, ArrowDown, ExternalLink } from "lucide-react";

const ProjectAdminPanel = () => {
  // -------------------- Navigation Tabs --------------------
  const [activeTab, setActiveTab] = useState("projects");

  // -------------------- Existing Shop States --------------------
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
  const [isAddingProject, setIsAddingProject] = useState(false);

  const navigate = useNavigate();

  // -------------------- New Blog States --------------------
  const [blogs, setBlogs] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [comments, setComments] = useState([]);

  // Blog Editor & Form States
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [blogFormData, setBlogFormData] = useState({
    title: "",
    category: "IoT & Wireless",
    excerpt: "",
    featuredImage: "",
    authorId: "",
    readTime: "5 min read",
    tags: "",
    status: "draft",
    isFeatured: false,
    tableOfContents: [],
    keyTakeaways: [],
    content: [],
  });

  // Dynamic Section Add States
  const [currentBlockType, setCurrentBlockType] = useState("paragraph");
  const [blockHeadingText, setBlockHeadingText] = useState("");
  const [blockHeadingLevel, setBlockHeadingLevel] = useState(2);
  const [blockParagraphText, setBlockParagraphText] = useState("");
  const [blockImageUrl, setBlockImageUrl] = useState("");
  const [blockImageAlt, setBlockImageAlt] = useState("");
  const [blockCode, setBlockCode] = useState("");
  const [blockCodeLanguage, setBlockCodeLanguage] = useState("cpp");
  const [blockCalloutVariant, setBlockCalloutVariant] = useState("tip");
  const [blockCalloutTitle, setBlockCalloutTitle] = useState("");
  const [blockCalloutText, setBlockCalloutText] = useState("");
  const [blockTableHeaders, setBlockTableHeaders] = useState("");
  const [blockTableRows, setBlockTableRows] = useState("");
  const [blockQuoteText, setBlockQuoteText] = useState("");
  const [blockListItems, setBlockListItems] = useState("");

  // TOC and Takeaway Add States
  const [tocText, setTocText] = useState("");
  const [tocId, setTocId] = useState("");
  const [takeawayText, setTakeawayText] = useState("");

  // Author Management states
  const [showAuthorForm, setShowAuthorForm] = useState(false);
  const [editingAuthorId, setEditingAuthorId] = useState(null);
  const [authorFormData, setAuthorFormData] = useState({
    name: "",
    designation: "",
    bio: "",
    image: "",
    linkedin: "",
    twitter: "",
  });

  // -------------------- Existing Authentication --------------------
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/api/admin/checkAdmin");
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

  // -------------------- Fetch Shop Categories --------------------
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

  // -------------------- Fetch Shop Subcategories --------------------
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

  // -------------------- Fetch Blog lists --------------------
  useEffect(() => {
    if (!isAuthenticated || activeTab !== "blogs") return;

    fetchBlogDashboardData();
  }, [activeTab, isAuthenticated]);

  const fetchBlogDashboardData = async () => {
    try {
      const bRes = await blogService.adminGetBlogs();
      if (bRes.success) setBlogs(bRes.blogs || []);

      const aRes = await blogService.adminGetAuthors();
      if (aRes.success) setAuthors(aRes.authors || []);

      const cRes = await blogService.adminGetComments();
      if (cRes.success) setComments(cRes.comments || []);
    } catch (err) {
      console.error("Failed to load blog dashboard data:", err);
    }
  };

  // -------------------- Logout --------------------
  const handleLogout = async () => {
    try {
      const res = await api.post("/api/admin/logout", {}, { withCredentials: true });
      if (res.status === 200) {
        localStorage.removeItem("adminToken");
        alert("Logged out successfully");
        navigate("/adlogin");
      } else {
        alert("Logout failed");
      }
    } catch (err) {
      console.error("Logout error:", err);
      alert("An error occurred during logout");
    }
  };

  // -------------------- Existing Add Category --------------------
  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      alert("Please enter category name");
      return;
    }
    try {
      const res = await api.post("/api/categories/create-category", {
        name: categoryName,
      });
      setCategories((prev) => [...prev, res.data]);
      setCategoryName("");
      alert("Category added successfully!");
    } catch (error) {
      console.error("Error adding category:", error);
      alert("Error adding category: " + (error.response?.data?.error || error.message));
    }
  };

  // -------------------- Existing Add Subcategory --------------------
  const handleAddSubcategory = async () => {
    if (!subcategoryName.trim() || !selectedCategoryId) {
      alert("Please enter subcategory name and select a category");
      return;
    }
    try {
      const res = await api.post("/api/categories/create-subcategory", {
        name: subcategoryName,
        categoryId: selectedCategoryId,
      });
      setSubcategories((prev) => [...prev, res.data]);
      setSubcategoryName("");
      setSelectedCategoryId("");
      alert("Subcategory added successfully!");
    } catch (error) {
      console.error("Error adding subcategory:", error);
      alert("Error adding subcategory: " + (error.response?.data?.error || error.message));
    }
  };

  // -------------------- Existing Upload --------------------
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
      console.error("Hostinger upload failed:", err);
      return null;
    }
  };

  // -------------------- Existing Add Project --------------------
  const handleAddProject = async () => {
    setIsAddingProject(true);
    try {
      let imageUrl = imageFile ? await uploadToHostinger(imageFile) : null;
      let blockDiagramUrl = blockDiagramFile ? await uploadToHostinger(blockDiagramFile) : null;
      let abstractUrl = abstractFile ? await uploadToHostinger(abstractFile) : null;

      const payload = {
        ...projectData,
        components: JSON.stringify(projectData.components),
        image: imageUrl,
        block_diagram: blockDiagramUrl,
        abstract_file: abstractUrl,
      };

      await api.post("/api/projects/create-project", payload);
      alert("Project added successfully!");

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
      console.error("Error adding project:", error);
      alert("Error adding project: " + (error.message || error));
    } finally {
      setIsAddingProject(false);
    }
  };

  // -------------------- NEW Blog Content Section Handlers --------------------
  const handleAddContentBlock = () => {
    let block = {};
    switch (currentBlockType) {
      case "heading":
        if (!blockHeadingText.trim()) return;
        block = { type: "heading", level: parseInt(blockHeadingLevel), text: blockHeadingText.trim() };
        setBlockHeadingText("");
        break;
      case "paragraph":
        if (!blockParagraphText.trim()) return;
        block = { type: "paragraph", text: blockParagraphText.trim() };
        setBlockParagraphText("");
        break;
      case "image":
        if (!blockImageUrl.trim()) return;
        block = { type: "image", url: blockImageUrl.trim(), alt: blockImageAlt.trim() };
        setBlockImageUrl("");
        setBlockImageAlt("");
        break;
      case "code":
        if (!blockCode.trim()) return;
        block = { type: "code", language: blockCodeLanguage, code: blockCode };
        setBlockCode("");
        break;
      case "callout":
        if (!blockCalloutText.trim()) return;
        block = {
          type: "callout",
          variant: blockCalloutVariant,
          title: blockCalloutTitle.trim() || (blockCalloutVariant === "tip" ? "Design Tip" : "Note"),
          text: blockCalloutText.trim(),
        };
        setBlockCalloutTitle("");
        setBlockCalloutText("");
        break;
      case "table":
        if (!blockTableHeaders.trim() || !blockTableRows.trim()) return;
        block = {
          type: "table",
          headers: blockTableHeaders.split(",").map((h) => h.trim()),
          rows: blockTableRows
            .split("\n")
            .map((row) => row.split(",").map((cell) => cell.trim()))
            .filter((row) => row.length > 0 && row[0] !== ""),
        };
        setBlockTableHeaders("");
        setBlockTableRows("");
        break;
      case "quote":
        if (!blockQuoteText.trim()) return;
        block = { type: "quote", text: blockQuoteText.trim() };
        setBlockQuoteText("");
        break;
      case "list":
      case "orderedlist":
        if (!blockListItems.trim()) return;
        block = {
          type: currentBlockType,
          items: blockListItems
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean),
        };
        setBlockListItems("");
        break;
      default:
        return;
    }

    setBlogFormData((prev) => ({
      ...prev,
      content: [...prev.content, block],
    }));
  };

  const handleRemoveContentBlock = (idx) => {
    setBlogFormData((prev) => ({
      ...prev,
      content: prev.content.filter((_, i) => i !== idx),
    }));
  };

  const handleMoveBlock = (idx, direction) => {
    const nextIdx = idx + direction;
    if (nextIdx < 0 || nextIdx >= blogFormData.content.length) return;

    setBlogFormData((prev) => {
      const list = [...prev.content];
      const temp = list[idx];
      list[idx] = list[nextIdx];
      list[nextIdx] = temp;
      return { ...prev, content: list };
    });
  };

  // TOC Handlers
  const handleAddToc = () => {
    if (!tocText.trim() || !tocId.trim()) return;
    setBlogFormData((prev) => ({
      ...prev,
      tableOfContents: [...prev.tableOfContents, { id: tocId.trim(), text: tocText.trim() }],
    }));
    setTocText("");
    setTocId("");
  };

  const handleRemoveToc = (idx) => {
    setBlogFormData((prev) => ({
      ...prev,
      tableOfContents: prev.tableOfContents.filter((_, i) => i !== idx),
    }));
  };

  // Takeaway Handlers
  const handleAddTakeaway = () => {
    if (!takeawayText.trim()) return;
    setBlogFormData((prev) => ({
      ...prev,
      keyTakeaways: [...prev.keyTakeaways, takeawayText.trim()],
    }));
    setTakeawayText("");
  };

  const handleRemoveTakeaway = (idx) => {
    setBlogFormData((prev) => ({
      ...prev,
      keyTakeaways: prev.keyTakeaways.filter((_, i) => i !== idx),
    }));
  };

  // -------------------- NEW Blog Form Submit CRUD --------------------
  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    if (!blogFormData.title.trim() || !blogFormData.excerpt.trim()) {
      alert("Please fill out Title and Excerpt.");
      return;
    }

    try {
      const payload = {
        ...blogFormData,
        tags: blogFormData.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      };

      if (editingBlogId) {
        await blogService.adminUpdateBlog(editingBlogId, payload);
        alert("Blog post updated successfully!");
      } else {
        await blogService.adminCreateBlog(payload);
        alert("Blog post created successfully!");
      }

      setShowBlogForm(false);
      setEditingBlogId(null);
      resetBlogForm();
      fetchBlogDashboardData();
    } catch (err) {
      console.error("Error saving blog:", err);
      alert("Failed to save blog post: " + (err.response?.data?.message || err.message));
    }
  };

  const resetBlogForm = () => {
    setBlogFormData({
      title: "",
      category: "IoT & Wireless",
      excerpt: "",
      featuredImage: "",
      authorId: "",
      readTime: "5 min read",
      tags: "",
      status: "draft",
      isFeatured: false,
      tableOfContents: [],
      keyTakeaways: [],
      content: [],
    });
  };

  const handleEditBlogClick = (blog) => {
    setEditingBlogId(blog.id);
    setBlogFormData({
      title: blog.title,
      category: blog.category,
      excerpt: blog.excerpt,
      featuredImage: blog.featuredImage || "",
      authorId: blog.authorId || "",
      readTime: blog.readTime || "5 min read",
      tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : "",
      status: blog.status,
      isFeatured: blog.isFeatured,
      tableOfContents: blog.tableOfContents || [],
      keyTakeaways: blog.keyTakeaways || [],
      content: blog.content || [],
    });
    setShowBlogForm(true);
  };

  const handleDeleteBlog = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog post?")) return;
    try {
      await blogService.adminDeleteBlog(id);
      alert("Blog deleted.");
      fetchBlogDashboardData();
    } catch (err) {
      console.error(err);
      alert("Failed to delete blog.");
    }
  };

  const handleStatusChange = async (id, action) => {
    try {
      if (action === "publish") {
        await blogService.adminPublishBlog(id);
      } else if (action === "archive") {
        await blogService.adminArchiveBlog(id);
      }
      fetchBlogDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      await blogService.adminToggleFeaturedBlog(id);
      fetchBlogDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  // -------------------- NEW Author Form Submit CRUD --------------------
  const handleAuthorSubmit = async (e) => {
    e.preventDefault();
    if (!authorFormData.name.trim()) return;

    try {
      const payload = {
        name: authorFormData.name.trim(),
        designation: authorFormData.designation.trim(),
        bio: authorFormData.bio.trim(),
        image: authorFormData.image,
        socialLinks: {
          linkedin: authorFormData.linkedin.trim(),
          twitter: authorFormData.twitter.trim(),
        },
      };

      if (editingAuthorId) {
        await blogService.adminUpdateAuthor(editingAuthorId, payload);
        alert("Author profile updated!");
      } else {
        await blogService.adminCreateAuthor(payload);
        alert("Author profile created!");
      }

      setShowAuthorForm(false);
      setEditingAuthorId(null);
      setAuthorFormData({ name: "", designation: "", bio: "", image: "", linkedin: "", twitter: "" });
      fetchBlogDashboardData();
    } catch (err) {
      console.error(err);
      alert("Failed to save author.");
    }
  };

  const handleEditAuthorClick = (author) => {
    setEditingAuthorId(author.id);
    setAuthorFormData({
      name: author.name,
      designation: author.designation || "",
      bio: author.bio || "",
      image: author.image || "",
      linkedin: author.socialLinks?.linkedin || "",
      twitter: author.socialLinks?.twitter || "",
    });
    setShowAuthorForm(true);
  };

  const handleDeleteAuthor = async (id) => {
    if (!window.confirm("Are you sure you want to delete this author?")) return;
    try {
      await blogService.adminDeleteAuthor(id);
      fetchBlogDashboardData();
    } catch (err) {
      console.error(err);
      alert("Failed to delete author.");
    }
  };

  // -------------------- NEW Comment Moderation --------------------
  const handleCommentStatus = async (id, action) => {
    try {
      if (action === "approve") {
        await blogService.adminApproveComment(id);
      } else if (action === "reject") {
        await blogService.adminRejectComment(id);
      } else if (action === "delete") {
        if (!window.confirm("Delete this comment permanently?")) return;
        await blogService.adminDeleteComment(id);
      }
      fetchBlogDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  if (isLoading) return <p className="p-6 text-center text-gray-500 font-semibold">Checking admin authentication status...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 bg-gray-50/50 min-h-screen">
      {/* 🔹 Tab Navigation Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight uppercase">KitsIndia Dashboard</h1>
          <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-0.5">Control Center & Database Manager</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab("projects")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors border ${
              activeTab === "projects"
                ? "bg-[#003e8b] text-white border-[#003e8b]"
                : "bg-white text-gray-600 hover:bg-gray-100 border-gray-200"
            }`}
          >
            Manage Shop & Projects
          </button>
          <button
            onClick={() => setActiveTab("blogs")}
            className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors border ${
              activeTab === "blogs"
                ? "bg-[#003e8b] text-white border-[#003e8b]"
                : "bg-white text-gray-600 hover:bg-gray-100 border-gray-200"
            }`}
          >
            Manage Technical Blogs
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* -------------------- SHOP MANAGEMENT TAB -------------------- */}
      {activeTab === "projects" && (
        <div className="space-y-8 max-w-3xl">
          {/* Add Category */}
          <div className="border border-gray-200 bg-white p-5 rounded-2xl shadow-sm">
            <h2 className="text-sm font-black text-gray-800 uppercase tracking-wider mb-3">Add Category</h2>
            <div className="flex gap-2">
              <input
                className="border border-gray-200 rounded-lg p-2.5 text-xs font-medium focus:border-[#003e8b] outline-none flex-1"
                type="text"
                placeholder="Category Name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
              <button
                className="bg-[#003e8b] text-white px-5 py-2.5 text-xs font-bold rounded-lg hover:bg-[#002e66]"
                onClick={handleAddCategory}
              >
                Add
              </button>
            </div>
          </div>

          {/* Add Subcategory */}
          <div className="border border-gray-200 bg-white p-5 rounded-2xl shadow-sm space-y-3">
            <h2 className="text-sm font-black text-gray-800 uppercase tracking-wider">Add Subcategory</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                className="border border-gray-200 rounded-lg p-2.5 text-xs font-medium focus:border-[#003e8b] outline-none"
                type="text"
                placeholder="Subcategory Name"
                value={subcategoryName}
                onChange={(e) => setSubcategoryName(e.target.value)}
              />
              <select
                className="border border-gray-200 rounded-lg p-2.5 text-xs font-medium focus:border-[#003e8b] outline-none"
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
            </div>
            <button
              className="bg-green-600 text-white px-5 py-2.5 text-xs font-bold rounded-lg hover:bg-green-700"
              onClick={handleAddSubcategory}
            >
              Add Subcategory
            </button>
          </div>

          {/* Add Project */}
          <div className="border border-gray-200 bg-white p-5 rounded-2xl shadow-sm space-y-4">
            <h2 className="text-sm font-black text-gray-800 uppercase tracking-wider mb-2">Add Project</h2>
            <input
              className="border border-gray-200 rounded-lg p-2.5 w-full text-xs font-medium focus:border-[#003e8b] outline-none"
              type="text"
              placeholder="Project Title"
              value={projectData.title}
              onChange={(e) => setProjectData({ ...projectData, title: e.target.value })}
            />
            <textarea
              className="border border-gray-200 rounded-lg p-2.5 w-full text-xs font-medium focus:border-[#003e8b] outline-none h-20 resize-none"
              placeholder="Project Description"
              value={projectData.description}
              onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
            />
            <textarea
              className="border border-gray-200 rounded-lg p-2.5 w-full text-xs font-medium focus:border-[#003e8b] outline-none h-28 resize-none"
              placeholder="Project Details"
              value={projectData.details}
              onChange={(e) => setProjectData({ ...projectData, details: e.target.value })}
            />
            <input
              className="border border-gray-200 rounded-lg p-2.5 w-full text-xs font-medium focus:border-[#003e8b] outline-none"
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
              className="border border-gray-200 rounded-lg p-2.5 w-full text-xs font-medium focus:border-[#003e8b] outline-none"
              type="number"
              placeholder="Project Price"
              value={projectData.price}
              onChange={(e) => setProjectData({ ...projectData, price: e.target.value })}
            />

            <div>
              <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-1">Project Image</h3>
              <input
                type="file"
                accept="image/*"
                className="border border-gray-200 rounded-lg p-2 w-full text-xs outline-none bg-gray-50 cursor-pointer"
                onChange={(e) => setImageFile(e.target.files[0])}
              />
            </div>

            <div>
              <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-1">Block Diagram</h3>
              <input
                type="file"
                accept="image/*"
                className="border border-gray-200 rounded-lg p-2 w-full text-xs outline-none bg-gray-50 cursor-pointer"
                onChange={(e) => setBlockDiagramFile(e.target.files[0])}
              />
            </div>

            <div>
              <h3 className="text-xs font-extrabold text-gray-500 uppercase tracking-wider mb-1">Project Abstract (PDF)</h3>
              <input
                type="file"
                accept=".pdf"
                className="border border-gray-200 rounded-lg p-2 w-full text-xs outline-none bg-gray-50 cursor-pointer"
                onChange={(e) => setAbstractFile(e.target.files[0])}
              />
              {abstractFile && (
                <p className="text-[10px] text-gray-400 mt-1 font-bold">
                  Selected File: {abstractFile.name}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                className="border border-gray-200 rounded-lg p-2.5 text-xs font-medium focus:border-[#003e8b] outline-none"
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
                className="border border-gray-200 rounded-lg p-2.5 text-xs font-medium focus:border-[#003e8b] outline-none"
                value={projectData.subcategoryId}
                onChange={(e) => setProjectData({ ...projectData, subcategoryId: e.target.value })}
                disabled={!projectData.categoryId}
              >
                <option value="">Select Subcategory</option>
                {subcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="bg-purple-600 text-white px-6 py-3 text-xs font-bold rounded-lg hover:bg-purple-750 disabled:opacity-50 flex items-center justify-center gap-1.5"
              onClick={handleAddProject}
              disabled={isAddingProject}
            >
              {isAddingProject ? "Adding Project..." : "Add Project"}
            </button>
          </div>
        </div>
      )}

      {/* -------------------- BLOGS MANAGEMENT TAB -------------------- */}
      {activeTab === "blogs" && (
        <div className="space-y-8">
          
          {/* Author Form Overlay */}
          {showAuthorForm && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-md w-full space-y-4 shadow-xl">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="font-black text-sm text-gray-800 uppercase tracking-wider">
                    {editingAuthorId ? "Edit Author Profile" : "Create Author Profile"}
                  </h3>
                  <button onClick={() => setShowAuthorForm(false)} className="text-gray-400 hover:text-gray-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form onSubmit={handleAuthorSubmit} className="space-y-3">
                  <div>
                    <label className="text-[9px] font-extrabold text-gray-500 uppercase block mb-1">Author Name</label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded-lg p-2.5 text-xs outline-none focus:border-[#003e8b]"
                      placeholder="Er. Amit Sharma"
                      value={authorFormData.name}
                      onChange={(e) => setAuthorFormData({ ...authorFormData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-extrabold text-gray-500 uppercase block mb-1">Designation</label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded-lg p-2.5 text-xs outline-none focus:border-[#003e8b]"
                      placeholder="Embedded Systems Specialist"
                      value={authorFormData.designation}
                      onChange={(e) => setAuthorFormData({ ...authorFormData, designation: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-extrabold text-gray-500 uppercase block mb-1">Bio Description</label>
                    <textarea
                      className="w-full border border-gray-200 rounded-lg p-2.5 text-xs outline-none focus:border-[#003e8b] h-20 resize-none"
                      placeholder="Bio description here..."
                      value={authorFormData.bio}
                      onChange={(e) => setAuthorFormData({ ...authorFormData, bio: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-extrabold text-gray-500 uppercase block mb-1">Profile Image URL</label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded-lg p-2.5 text-xs outline-none focus:border-[#003e8b]"
                      placeholder="https://images.unsplash.com/..."
                      value={authorFormData.image}
                      onChange={(e) => setAuthorFormData({ ...authorFormData, image: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] font-extrabold text-gray-500 uppercase block mb-1">LinkedIn Link</label>
                      <input
                        type="text"
                        className="w-full border border-gray-200 rounded-lg p-2.5 text-xs outline-none focus:border-[#003e8b]"
                        placeholder="URL..."
                        value={authorFormData.linkedin}
                        onChange={(e) => setAuthorFormData({ ...authorFormData, linkedin: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="text-[9px] font-extrabold text-gray-500 uppercase block mb-1">Twitter Link</label>
                      <input
                        type="text"
                        className="w-full border border-gray-200 rounded-lg p-2.5 text-xs outline-none focus:border-[#003e8b]"
                        placeholder="URL..."
                        value={authorFormData.twitter}
                        onChange={(e) => setAuthorFormData({ ...authorFormData, twitter: e.target.value })}
                      />
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-[#003e8b] text-white text-xs font-bold py-2.5 rounded-lg">
                    {editingAuthorId ? "Update Author" : "Create Author"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Blog Editor Overlay / Form */}
          {showBlogForm ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-6">
              <div className="flex justify-between items-center border-b pb-3">
                <h2 className="text-sm font-black text-gray-800 uppercase tracking-wider">
                  {editingBlogId ? "Edit Technical Blog Post" : "Create Technical Blog Post"}
                </h2>
                <button
                  onClick={() => {
                    setShowBlogForm(false);
                    setEditingBlogId(null);
                    resetBlogForm();
                  }}
                  className="px-4 py-2 border border-gray-200 text-xs font-bold rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleBlogSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Article Title</label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded-lg p-2.5 text-xs outline-none focus:border-[#003e8b]"
                      placeholder="Top 5 Microcontrollers for IoT Projects in 2026"
                      value={blogFormData.title}
                      onChange={(e) => setBlogFormData({ ...blogFormData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Category</label>
                    <select
                      className="w-full border border-gray-200 rounded-lg p-2.5 text-xs outline-none focus:border-[#003e8b]"
                      value={blogFormData.category}
                      onChange={(e) => setBlogFormData({ ...blogFormData, category: e.target.value })}
                    >
                      <option value="IoT & Wireless">IoT & Wireless</option>
                      <option value="Hardware Design">Hardware Design</option>
                      <option value="Robotics">Robotics</option>
                      <option value="Embedded Systems">Embedded Systems</option>
                      <option value="PCB Design">PCB Design</option>
                      <option value="Artificial Intelligence">Artificial Intelligence</option>
                      <option value="Programming">Programming</option>
                      <option value="Engineering">Engineering</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Short Excerpt / Intro Summary</label>
                  <textarea
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-xs outline-none focus:border-[#003e8b] h-16 resize-none"
                    placeholder="Provide a brief summary of the article..."
                    value={blogFormData.excerpt}
                    onChange={(e) => setBlogFormData({ ...blogFormData, excerpt: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Featured Image URL</label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded-lg p-2.5 text-xs outline-none focus:border-[#003e8b]"
                      placeholder="https://images.unsplash.com/..."
                      value={blogFormData.featuredImage}
                      onChange={(e) => setBlogFormData({ ...blogFormData, featuredImage: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Select Author</label>
                    <select
                      className="w-full border border-gray-200 rounded-lg p-2.5 text-xs outline-none focus:border-[#003e8b]"
                      value={blogFormData.authorId}
                      onChange={(e) => setBlogFormData({ ...blogFormData, authorId: e.target.value })}
                    >
                      <option value="">No Author selected</option>
                      {authors.map((auth) => (
                        <option key={auth.id} value={auth.id}>
                          {auth.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Reading Time</label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded-lg p-2.5 text-xs outline-none focus:border-[#003e8b]"
                      placeholder="5 min read"
                      value={blogFormData.readTime}
                      onChange={(e) => setBlogFormData({ ...blogFormData, readTime: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1 col-span-2">
                    <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Tags (comma separated)</label>
                    <input
                      type="text"
                      className="w-full border border-gray-200 rounded-lg p-2.5 text-xs outline-none focus:border-[#003e8b]"
                      placeholder="IoT, ESP32, Arduino, Microcontrollers"
                      value={blogFormData.tags}
                      onChange={(e) => setBlogFormData({ ...blogFormData, tags: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Status</label>
                    <select
                      className="w-full border border-gray-200 rounded-lg p-2.5 text-xs outline-none focus:border-[#003e8b]"
                      value={blogFormData.status}
                      onChange={(e) => setBlogFormData({ ...blogFormData, status: e.target.value })}
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                {/* Table of Contents Section Builder */}
                <div className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50/50">
                  <h3 className="text-xs font-black text-gray-700 uppercase tracking-wider">Table of Contents</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="TOC Heading (e.g. Introduction)"
                      className="border border-gray-200 rounded-lg p-2 text-xs flex-1 outline-none"
                      value={tocText}
                      onChange={(e) => setTocText(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Anchor ID (e.g. intro)"
                      className="border border-gray-200 rounded-lg p-2 text-xs flex-1 outline-none"
                      value={tocId}
                      onChange={(e) => setTocId(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={handleAddToc}
                      className="bg-gray-800 text-white px-4 py-2 text-xs font-bold rounded-lg"
                    >
                      Add
                    </button>
                  </div>
                  {blogFormData.tableOfContents.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {blogFormData.tableOfContents.map((toc, idx) => (
                        <span key={idx} className="bg-white border text-[10px] font-bold px-2 py-1 rounded flex items-center gap-1.5">
                          {toc.text} ({toc.id})
                          <button type="button" onClick={() => handleRemoveToc(idx)} className="text-red-500 hover:text-red-700 font-extrabold text-[8px]">✕</button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Key Takeaways Builder */}
                <div className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50/50">
                  <h3 className="text-xs font-black text-gray-700 uppercase tracking-wider">Key Takeaways</h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Key point bullet..."
                      className="border border-gray-200 rounded-lg p-2 text-xs flex-1 outline-none"
                      value={takeawayText}
                      onChange={(e) => setTakeawayText(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={handleAddTakeaway}
                      className="bg-gray-800 text-white px-4 py-2 text-xs font-bold rounded-lg"
                    >
                      Add
                    </button>
                  </div>
                  {blogFormData.keyTakeaways.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 pt-2">
                      {blogFormData.keyTakeaways.map((point, idx) => (
                        <li key={idx} className="text-xs text-gray-600 flex justify-between items-center bg-white p-2 border rounded">
                          <span>{point}</span>
                          <button type="button" onClick={() => handleRemoveTakeaway(idx)} className="text-red-500 text-[10px] font-bold">Delete</button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* 🔹 DYNAMIC ARTICLE CONTENT SECTION BUILDER 🔹 */}
                <div className="border border-gray-200 rounded-xl p-4 space-y-4 bg-gray-50/50">
                  <h3 className="text-xs font-black text-gray-700 uppercase tracking-wider border-b pb-2">Article Dynamic Sections Builder</h3>
                  
                  <div className="space-y-3 bg-white p-4 rounded-xl border border-gray-150">
                    <div className="flex gap-4 items-center">
                      <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Choose Block Type</label>
                      <select
                        className="border border-gray-200 rounded-lg p-2 text-xs outline-none"
                        value={currentBlockType}
                        onChange={(e) => setCurrentBlockType(e.target.value)}
                      >
                        <option value="heading">Heading</option>
                        <option value="paragraph">Paragraph</option>
                        <option value="image">Image</option>
                        <option value="code">Code Snippet</option>
                        <option value="callout">Callout Banner</option>
                        <option value="table">Table data</option>
                        <option value="list">Bullet List</option>
                        <option value="orderedlist">Numbered List</option>
                        <option value="quote">Quote Block</option>
                      </select>
                    </div>

                    {/* Conditional Block input fields */}
                    {currentBlockType === "heading" && (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Heading text..."
                          className="border border-gray-200 rounded-lg p-2 text-xs flex-1 outline-none"
                          value={blockHeadingText}
                          onChange={(e) => setBlockHeadingText(e.target.value)}
                        />
                        <select
                          className="border border-gray-200 rounded-lg p-2 text-xs outline-none"
                          value={blockHeadingLevel}
                          onChange={(e) => setBlockHeadingLevel(e.target.value)}
                        >
                          <option value={2}>H2 (Section)</option>
                          <option value={3}>H3 (Sub-section)</option>
                        </select>
                      </div>
                    )}

                    {currentBlockType === "paragraph" && (
                      <textarea
                        placeholder="Write paragraph content here..."
                        className="w-full border border-gray-200 rounded-lg p-2 text-xs outline-none h-20 resize-none"
                        value={blockParagraphText}
                        onChange={(e) => setBlockParagraphText(e.target.value)}
                      />
                    )}

                    {currentBlockType === "image" && (
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="Image URL..."
                          className="border border-gray-200 rounded-lg p-2 text-xs outline-none"
                          value={blockImageUrl}
                          onChange={(e) => setBlockImageUrl(e.target.value)}
                        />
                        <input
                          type="text"
                          placeholder="Caption / Alt text..."
                          className="border border-gray-200 rounded-lg p-2 text-xs outline-none"
                          value={blockImageAlt}
                          onChange={(e) => setBlockImageAlt(e.target.value)}
                        />
                      </div>
                    )}

                    {currentBlockType === "code" && (
                      <div className="space-y-2">
                        <select
                          className="border border-gray-200 rounded-lg p-2 text-xs outline-none"
                          value={blockCodeLanguage}
                          onChange={(e) => setBlockCodeLanguage(e.target.value)}
                        >
                          <option value="cpp">C++ (Arduino)</option>
                          <option value="python">Python</option>
                          <option value="javascript">JavaScript</option>
                          <option value="html">HTML</option>
                          <option value="css">CSS</option>
                          <option value="bash">Bash Terminal</option>
                        </select>
                        <textarea
                          placeholder="Paste source code here..."
                          className="w-full border border-gray-200 rounded-lg p-2 text-xs font-mono outline-none h-32"
                          value={blockCode}
                          onChange={(e) => setBlockCode(e.target.value)}
                        />
                      </div>
                    )}

                    {currentBlockType === "callout" && (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <select
                            className="border border-gray-200 rounded-lg p-2 text-xs outline-none"
                            value={blockCalloutVariant}
                            onChange={(e) => setBlockCalloutVariant(e.target.value)}
                          >
                            <option value="tip">Tip Variant</option>
                            <option value="note">Note Variant</option>
                          </select>
                          <input
                            type="text"
                            placeholder="Callout Banner Title (e.g. TIP)"
                            className="border border-gray-200 rounded-lg p-2 text-xs flex-1 outline-none"
                            value={blockCalloutTitle}
                            onChange={(e) => setBlockCalloutTitle(e.target.value)}
                          />
                        </div>
                        <textarea
                          placeholder="Write callout banner body description..."
                          className="w-full border border-gray-200 rounded-lg p-2 text-xs outline-none h-16"
                          value={blockCalloutText}
                          onChange={(e) => setBlockCalloutText(e.target.value)}
                        />
                      </div>
                    )}

                    {currentBlockType === "table" && (
                      <div className="space-y-2">
                        <input
                          type="text"
                          placeholder="Table Headers (comma separated: Header1, Header2, ...)"
                          className="w-full border border-gray-200 rounded-lg p-2 text-xs outline-none"
                          value={blockTableHeaders}
                          onChange={(e) => setBlockTableHeaders(e.target.value)}
                        />
                        <textarea
                          placeholder="Table Rows (comma separated per cell, each row on new line)&#10;Row1Cell1, Row1Cell2&#10;Row2Cell1, Row2Cell2"
                          className="w-full border border-gray-200 rounded-lg p-2 text-xs outline-none h-20"
                          value={blockTableRows}
                          onChange={(e) => setBlockTableRows(e.target.value)}
                        />
                      </div>
                    )}

                    {currentBlockType === "quote" && (
                      <textarea
                        placeholder="Paste quote text here..."
                        className="w-full border border-gray-200 rounded-lg p-2 text-xs italic outline-none h-16"
                        value={blockQuoteText}
                        onChange={(e) => setBlockQuoteText(e.target.value)}
                      />
                    )}

                    {(currentBlockType === "list" || currentBlockType === "orderedlist") && (
                      <textarea
                        placeholder="Enter list items (one item per line)..."
                        className="w-full border border-gray-200 rounded-lg p-2 text-xs outline-none h-20"
                        value={blockListItems}
                        onChange={(e) => setBlockListItems(e.target.value)}
                      />
                    )}

                    <button
                      type="button"
                      onClick={handleAddContentBlock}
                      className="bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" /> Push Block Into Article
                    </button>
                  </div>

                  {/* Section blocks preview */}
                  <div className="space-y-2 pt-2">
                    <h4 className="text-[10px] font-extrabold text-gray-500 uppercase">Article Blocks Preview List ({blogFormData.content.length} blocks)</h4>
                    {blogFormData.content.length === 0 ? (
                      <p className="text-xs text-gray-400 italic">No section blocks added yet.</p>
                    ) : (
                      <div className="space-y-2">
                        {blogFormData.content.map((block, idx) => (
                          <div key={idx} className="bg-white border rounded-xl p-3 flex justify-between items-center shadow-sm">
                            <div className="space-y-0.5">
                              <span className="text-[9px] bg-gray-100 text-gray-600 font-extrabold px-2 py-0.5 rounded uppercase">
                                {block.type}
                              </span>
                              <p className="text-xs text-gray-700 font-medium line-clamp-1">
                                {block.text || block.url || block.code || (block.items && block.items.join(", ")) || "Complex Block"}
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleMoveBlock(idx, -1)}
                                disabled={idx === 0}
                                className="text-gray-400 hover:text-gray-700 disabled:opacity-30"
                              >
                                <ArrowUp className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoveBlock(idx, 1)}
                                disabled={idx === blogFormData.content.length - 1}
                                className="text-gray-400 hover:text-gray-700 disabled:opacity-30"
                              >
                                <ArrowDown className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleRemoveContentBlock(idx)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <button type="submit" className="bg-[#003e8b] text-white text-xs font-bold px-6 py-3 rounded-lg flex items-center gap-1.5">
                    <Check className="w-4 h-4" /> Save Article Post
                  </button>
                </div>
              </form>
            </div>
          ) : (
            // 🔹 Blogs Lists, Authors, Comments Main Dashboard grid
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
              
              {/* Left Side: Blogs Table */}
              <div className="xl:col-span-8 space-y-6">
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-sm font-black text-gray-800 uppercase tracking-wider">Published & Draft Blogs</h2>
                    <button
                      onClick={() => setShowBlogForm(true)}
                      className="bg-[#003e8b] text-white px-4 py-2 text-xs font-bold rounded-lg hover:bg-[#002e66] flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Create Blog Post
                    </button>
                  </div>

                  <div className="overflow-x-auto border border-gray-150 rounded-xl">
                    <table className="min-w-full divide-y divide-gray-200 text-xs">
                      <thead className="bg-gray-50 text-gray-700 font-extrabold uppercase">
                        <tr>
                          <th className="px-4 py-3 text-left">Title</th>
                          <th className="px-4 py-3 text-left">Category</th>
                          <th className="px-4 py-3 text-center">Status</th>
                          <th className="px-4 py-3 className='text-center'">Featured</th>
                          <th className="px-4 py-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200 font-medium text-gray-600">
                        {blogs.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="text-center py-10 text-gray-400 italic">No blogs registered yet.</td>
                          </tr>
                        ) : (
                          blogs.map((b) => (
                            <tr key={b.id} className="hover:bg-gray-50/50">
                              <td className="px-4 py-3">
                                <div className="space-y-0.5">
                                  <div className="font-extrabold text-gray-800 line-clamp-1">{b.title}</div>
                                  <div className="text-[10px] text-gray-400 font-semibold uppercase flex items-center gap-2">
                                    <span>By {b.Author?.name || "Author"}</span>
                                    <span>•</span>
                                    <span>{b.views} views</span>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 font-bold text-gray-500 uppercase text-[10px]">{b.category}</td>
                              <td className="px-4 py-3 text-center">
                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                                  b.status === "published"
                                    ? "bg-green-50 border-green-200 text-green-700"
                                    : b.status === "archived"
                                    ? "bg-gray-50 border-gray-200 text-gray-500"
                                    : "bg-amber-50 border-amber-200 text-amber-600"
                                }`}>
                                  {b.status}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-center">
                                <button
                                  onClick={() => handleToggleFeatured(b.id)}
                                  className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border ${
                                    b.isFeatured
                                      ? "bg-yellow-50 border-yellow-200 text-yellow-700"
                                      : "bg-white border-gray-200 text-gray-400"
                                  }`}
                                >
                                  {b.isFeatured ? "Featured" : "Standard"}
                                </button>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  {b.status === "draft" && (
                                    <button
                                      onClick={() => handleStatusChange(b.id, "publish")}
                                      className="text-xs font-bold text-green-600 hover:text-green-800"
                                    >
                                      Publish
                                    </button>
                                  )}
                                  {b.status === "published" && (
                                    <button
                                      onClick={() => handleStatusChange(b.id, "archive")}
                                      className="text-xs font-bold text-gray-500 hover:text-gray-700"
                                    >
                                      Archive
                                    </button>
                                  )}
                                  <button onClick={() => handleEditBlogClick(b)} className="text-blue-600 hover:text-blue-800">
                                    <Edit2 className="w-4 h-4" />
                                  </button>
                                  <button onClick={() => handleDeleteBlog(b.id)} className="text-red-500 hover:text-red-700">
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Moderating Comments Section */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
                  <h2 className="text-sm font-black text-gray-800 uppercase tracking-wider">Comments Moderation Queue</h2>
                  <div className="space-y-4">
                    {comments.length === 0 ? (
                      <p className="text-xs text-gray-400 italic py-4">No comments inside moderation queue.</p>
                    ) : (
                      comments.map((comm) => (
                        <div key={comm.id} className="border border-gray-250 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white shadow-inner">
                          <div className="space-y-1.5 flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-extrabold text-xs text-gray-800 leading-none">{comm.name}</h4>
                              <span className="text-[9px] text-gray-400 font-semibold">{comm.email}</span>
                              <span className={`text-[8px] font-black uppercase px-1.5 py-0.25 rounded border ${
                                comm.status === "approved"
                                  ? "bg-green-50 border-green-200 text-green-700"
                                  : comm.status === "rejected"
                                  ? "bg-red-50 border-red-200 text-red-700"
                                  : "bg-amber-50 border-amber-200 text-amber-600"
                              }`}>
                                {comm.status}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed font-medium">{comm.content}</p>
                            <div className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                              On Article: <span className="text-gray-600">{comm.Blog?.title}</span>
                            </div>
                          </div>

                          <div className="flex gap-2 items-center justify-end">
                            {comm.status !== "approved" && (
                              <button
                                onClick={() => handleCommentStatus(comm.id, "approve")}
                                className="px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 text-[10px] font-bold rounded-lg"
                              >
                                Approve
                              </button>
                            )}
                            {comm.status !== "rejected" && (
                              <button
                                onClick={() => handleCommentStatus(comm.id, "reject")}
                                className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-[10px] font-bold rounded-lg"
                              >
                                Reject
                              </button>
                            )}
                            <button
                              onClick={() => handleCommentStatus(comm.id, "delete")}
                              className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-red-500 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Right Side: Authors List */}
              <div className="xl:col-span-4 space-y-6">
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h2 className="text-xs font-black text-gray-800 uppercase tracking-wider">Blog Authors ({authors.length})</h2>
                    <button
                      onClick={() => {
                        setEditingAuthorId(null);
                        setAuthorFormData({ name: "", designation: "", bio: "", image: "", linkedin: "", twitter: "" });
                        setShowAuthorForm(true);
                      }}
                      className="text-[#003e8b] hover:text-[#002e66] text-xs font-bold flex items-center gap-0.5"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add
                    </button>
                  </div>

                  <div className="space-y-4">
                    {authors.length === 0 ? (
                      <p className="text-xs text-gray-400 italic py-4">No authors profiles created yet.</p>
                    ) : (
                      authors.map((auth) => (
                        <div key={auth.id} className="flex items-start justify-between border-b border-gray-100 pb-3 gap-3">
                          <div className="flex gap-2.5 items-start">
                            <img
                              src={auth.image || "https://via.placeholder.com/150"}
                              alt={auth.name}
                              className="w-10 h-10 rounded-lg object-cover border"
                            />
                            <div className="space-y-0.5">
                              <h4 className="font-extrabold text-xs text-gray-800 leading-none">{auth.name}</h4>
                              <span className="text-[9px] text-gray-400 font-bold block">{auth.designation}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleEditAuthorClick(auth)} className="p-1 hover:bg-gray-50 text-blue-600 rounded">
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleDeleteAuthor(auth.id)} className="p-1 hover:bg-gray-50 text-red-500 rounded">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>
      )}
    </div>
  );
};

export default ProjectAdminPanel;
