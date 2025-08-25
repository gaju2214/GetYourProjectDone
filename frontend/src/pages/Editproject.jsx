import { useState } from "react";

import api from '../api';
export default function DeleteProject({Id }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this ?")) return;

    setLoading(true);
    setError(null);

    try {
      api.delete(`/api/projects/subcategory/${Id}`);
      alert(" deleted successfully!");
    } catch {
      setError("Failed to delete ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: 20 }}>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button
        onClick={handleDelete}
        disabled={loading}
        style={{ padding: "8px 16px", background: "red", color: "white", border: "none", cursor: "pointer" }}
      >
        {loading ? "Deleting..." : "Delete Project"}
      </button>
    </div>
  );
}
