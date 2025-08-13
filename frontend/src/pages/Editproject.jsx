import { useState, useEffect } from "react";
import axios from "axios";

export default function EditSubcategory({ subcategoryId }) {
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    categoryId: ""
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch subcategory data on mount or when subcategoryId changes
  useEffect(() => {
    setLoading(true);
    setError(null);

    axios
      .get(`http://localhost:5000/api/projects/subcategory/${subcategoryId}`)
      .then((res) => {
        const { name, slug, categoryId } = res.data;
        setFormData({ name, slug, categoryId: categoryId.toString() });
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load subcategory");
        setLoading(false);
      });
  }, [subcategoryId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      await axios.put(`http://localhost:5000/api/projects/subcategory/${subcategoryId}`, {
        name: formData.name,
        slug: formData.slug,
        categoryId: Number(formData.categoryId)
      });
      alert("Subcategory updated successfully!");
    } catch {
      setError("Failed to update subcategory");
    }
  };

  if (loading) return <p>Loading subcategory data...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "auto" }}>
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
        style={{ width: "100%", marginBottom: 8 }}
        required
      />

      <input
        name="slug"
        value={formData.slug}
        onChange={handleChange}
        placeholder="Slug"
        style={{ width: "100%", marginBottom: 8 }}
        required
      />

      <input
        name="categoryId"
        type="number"
        value={formData.categoryId}
        onChange={handleChange}
        placeholder="Category ID"
        style={{ width: "100%", marginBottom: 8 }}
        required
      />

      <button type="submit" style={{ width: "100%", padding: "8px 0" }}>
        Update Subcategory
      </button>
    </form>
  );
}
