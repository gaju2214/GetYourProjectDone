import api from "../api";

// -------------------- PUBLIC BLOG APIS --------------------

export const getBlogs = async (params = {}) => {
  const response = await api.get("/api/blogs", { params });
  return response.data;
};

export const getFeaturedBlogs = async () => {
  const response = await api.get("/api/blogs/featured");
  return response.data;
};

export const getBlogBySlug = async (slug) => {
  const response = await api.get(`/api/blogs/${slug}`);
  return response.data;
};

export const getRelatedBlogs = async (slug) => {
  const response = await api.get(`/api/blogs/${slug}/related`);
  return response.data;
};

export const getComments = async (blogId) => {
  const response = await api.get(`/api/blogs/${blogId}/comments`);
  return response.data;
};

export const postComment = async (blogId, commentData) => {
  const response = await api.post(`/api/blogs/${blogId}/comments`, commentData);
  return response.data;
};

export const likeBlog = async (blogId) => {
  const response = await api.post(`/api/blogs/${blogId}/like`);
  return response.data;
};

// -------------------- ADMIN BLOG APIS --------------------

export const adminGetBlogs = async () => {
  const response = await api.get("/api/admin/blogs");
  return response.data;
};

export const adminCreateBlog = async (data) => {
  const response = await api.post("/api/admin/blogs", data);
  return response.data;
};

export const adminUpdateBlog = async (id, data) => {
  const response = await api.put(`/api/admin/blogs/${id}`, data);
  return response.data;
};

export const adminDeleteBlog = async (id) => {
  const response = await api.delete(`/api/admin/blogs/${id}`);
  return response.data;
};

export const adminPublishBlog = async (id) => {
  const response = await api.patch(`/api/admin/blogs/${id}/publish`);
  return response.data;
};

export const adminArchiveBlog = async (id) => {
  const response = await api.patch(`/api/admin/blogs/${id}/archive`);
  return response.data;
};

export const adminToggleFeaturedBlog = async (id) => {
  const response = await api.patch(`/api/admin/blogs/${id}/featured`);
  return response.data;
};

// -------------------- ADMIN AUTHOR APIS --------------------

export const adminGetAuthors = async () => {
  const response = await api.get("/api/admin/blogs/authors");
  return response.data;
};

export const adminCreateAuthor = async (data) => {
  const response = await api.post("/api/admin/blogs/authors", data);
  return response.data;
};

export const adminUpdateAuthor = async (id, data) => {
  const response = await api.put(`/api/admin/blogs/authors/${id}`, data);
  return response.data;
};

export const adminDeleteAuthor = async (id) => {
  const response = await api.delete(`/api/admin/blogs/authors/${id}`);
  return response.data;
};

// -------------------- ADMIN COMMENT APIS --------------------

export const adminGetComments = async () => {
  const response = await api.get("/api/admin/blogs/comments");
  return response.data;
};

export const adminApproveComment = async (id) => {
  const response = await api.patch(`/api/admin/blogs/comments/${id}/approve`);
  return response.data;
};

export const adminRejectComment = async (id) => {
  const response = await api.patch(`/api/admin/blogs/comments/${id}/reject`);
  return response.data;
};

export const adminDeleteComment = async (id) => {
  const response = await api.delete(`/api/admin/blogs/comments/${id}`);
  return response.data;
};
