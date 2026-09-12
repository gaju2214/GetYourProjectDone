import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Heart, MessageSquare, Eye, Calendar, Clock, ArrowLeft, Send, CheckCircle, Share2, Linkedin, Twitter, ExternalLink } from "lucide-react";
import * as blogService from "../services/blogService";
import api from "../api";

const BlogDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  // Like State
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  // Comment Form State
  const [commentForm, setCommentForm] = useState({ name: "", email: "", content: "" });
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentSuccess, setCommentSuccess] = useState(false);
  const [commentError, setCommentError] = useState("");

  // Check Authentication Status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await api.get("/api/protected/checkAuth");
        if (res.data?.success === true && res.data?.status === 200) {
          setIsAuthenticated(true);
          setUser(res.data.user);
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch {
        setIsAuthenticated(false);
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  // Fetch Blog Details
  useEffect(() => {
    const fetchBlogDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await blogService.getBlogBySlug(slug);
        if (data.success) {
          setBlog(data.blog);
          setRelatedBlogs(data.relatedBlogs || []);
          setLikesCount(data.blog.likesCount || 0);

          // Fetch Comments
          const commentsData = await blogService.getComments(data.blog.id);
          if (commentsData.success) {
            setComments(commentsData.comments || []);
          }

          // Check if current user liked it
          if (user) {
            try {
              // Wait, the API check if liked will be implicitly known by sending /like,
              // but we can query likes or just default isLiked to false until they click.
              // For simplicity, we toggle like state on click.
            } catch (e) {
              console.error(e);
            }
          }
        } else {
          setError("Article not found");
        }
      } catch (err) {
        console.error("Failed to load blog details:", err);
        setError("The article you are looking for does not exist or a server error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogDetails();
  }, [slug, user]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      alert("Please log in to like this article!");
      navigate("/auth/login");
      return;
    }

    try {
      const res = await blogService.likeBlog(blog.id);
      if (res.success) {
        setLikesCount(res.likes);
        setIsLiked(res.liked);
      }
    } catch (err) {
      console.error("Error liking blog:", err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentError("");
    setCommentSuccess(false);

    if (!commentForm.name.trim() || !commentForm.email.trim() || !commentForm.content.trim()) {
      setCommentError("All fields are required.");
      return;
    }

    setCommentLoading(true);
    try {
      const res = await blogService.postComment(blog.id, commentForm);
      if (res.success) {
        setCommentSuccess(true);
        setCommentForm({ name: "", email: "", content: "" });
      } else {
        setCommentError(res.message || "Failed to submit comment.");
      }
    } catch (err) {
      console.error("Error posting comment:", err);
      setCommentError(err.response?.data?.message || "Internal server error occurred.");
    } finally {
      setCommentLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Article link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#003e8b] mx-auto"></div>
          <p className="text-gray-500 font-medium">Loading technical article...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 py-20 px-4">
        <div className="max-w-md mx-auto bg-white border border-gray-200 rounded-2xl p-8 text-center shadow-sm">
          <span className="text-4xl">⚠️</span>
          <h2 className="text-xl font-black text-gray-900 mt-4">Article Not Found</h2>
          <p className="text-gray-500 text-xs mt-2 leading-relaxed">
            {error || "The article you're looking for doesn't exist."}
          </p>
          <div className="mt-6">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 bg-[#003e8b] text-white text-xs font-extrabold rounded-lg hover:bg-[#002e66] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Helper to render dynamic structured content blocks
  const renderContentBlock = (block, idx) => {
    switch (block.type) {
      case "heading":
        const HeadingTag = block.level === 3 ? "h3" : "h2";
        const headingId = block.text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        return (
          <HeadingTag
            key={idx}
            id={headingId}
            className={`${
              block.level === 3
                ? "text-base sm:text-lg font-black text-gray-800 mt-6 mb-2"
                : "text-lg sm:text-xl font-black text-gray-900 mt-8 mb-3 border-b border-gray-100 pb-2"
            } scroll-mt-20`}
          >
            {block.text}
          </HeadingTag>
        );

      case "paragraph":
        return (
          <p key={idx} className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-4">
            {block.text}
          </p>
        );

      case "image":
        return (
          <div key={idx} className="my-6 space-y-2">
            <img
              src={block.url}
              alt={block.alt || "Article graphic"}
              className="w-full rounded-xl border border-gray-200 shadow-sm object-cover max-h-96"
            />
            {block.alt && <p className="text-[10px] text-center text-gray-400 italic">{block.alt}</p>}
          </div>
        );

      case "code":
        return (
          <div key={idx} className="relative group my-6">
            <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(block.code);
                  alert("Code snippet copied!");
                }}
                className="bg-gray-800 text-white text-[10px] font-bold px-2 py-1 rounded hover:bg-gray-700"
              >
                Copy
              </button>
            </div>
            <span className="absolute left-4 top-[-10px] bg-gray-800 text-[9px] text-gray-300 font-extrabold px-2 py-0.5 rounded uppercase tracking-wider">
              {block.language || "code"}
            </span>
            <pre className="bg-gray-950 text-gray-100 text-xs font-mono p-4 rounded-xl overflow-x-auto border border-gray-800 shadow-inner leading-relaxed">
              <code>{block.code}</code>
            </pre>
          </div>
        );

      case "callout":
        const isTip = block.variant === "tip";
        return (
          <div
            key={idx}
            className={`my-6 p-4 rounded-r-xl border-l-4 ${
              isTip
                ? "bg-amber-50/50 border-amber-500 text-amber-900"
                : "bg-blue-50/50 border-blue-600 text-blue-900"
            } flex items-start gap-3`}
          >
            <span className="text-lg mt-0.5">{isTip ? "💡" : "ℹ️"}</span>
            <div>
              <h4 className="font-extrabold text-xs uppercase tracking-wider mb-1">
                {block.title || (isTip ? "Design Tip" : "Note")}
              </h4>
              <p className="text-xs leading-relaxed">{block.text}</p>
            </div>
          </div>
        );

      case "table":
        return (
          <div key={idx} className="overflow-x-auto my-6 border border-gray-200 rounded-xl shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {block.headers.map((h, hIdx) => (
                    <th
                      key={hIdx}
                      className="px-4 py-3 text-left text-[10px] font-black text-gray-700 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 text-xs">
                {block.rows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-gray-50/50 transition-colors">
                    {row.map((cell, cIdx) => (
                      <td key={cIdx} className="px-4 py-3 text-gray-600 font-medium">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case "quote":
        return (
          <blockquote
            key={idx}
            className="border-l-4 border-[#003e8b] pl-4 italic text-gray-600 text-sm my-6 bg-gray-50/70 py-3 rounded-r-xl"
          >
            "{block.text}"
          </blockquote>
        );

      case "list":
      case "bullet":
        return (
          <ul key={idx} className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-gray-700 mb-4 pl-4">
            {(block.items || []).map((item, iIdx) => (
              <li key={iIdx}>{item}</li>
            ))}
          </ul>
        );

      case "orderedlist":
      case "number":
        return (
          <ol key={idx} className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm text-gray-700 mb-4 pl-4">
            {(block.items || []).map((item, iIdx) => (
              <li key={iIdx}>{item}</li>
            ))}
          </ol>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 🔹 Hero Header Banner */}
      <header className="bg-gradient-to-br from-[#003e8b] to-[#002e66] text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-2 text-xs font-bold text-blue-200/80 mb-6 uppercase tracking-wider">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Technical Blog</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <span className="inline-block bg-[#fb7b02] text-white text-[9px] font-black uppercase px-3 py-1 rounded-full tracking-widest shadow-sm">
              {blog.category}
            </span>
            <h1 className="text-xl sm:text-3xl font-black leading-tight tracking-tight">
              {blog.title}
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-medium">
              {blog.excerpt}
            </p>

            {/* Meta Row */}
            <div className="pt-4 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-blue-100/80 font-semibold border-t border-white/10 mt-6">
              {blog.Author && (
                <div className="flex items-center gap-2">
                  <img
                    src={blog.Author.image || "https://via.placeholder.com/150"}
                    alt={blog.Author.name}
                    className="w-7 h-7 rounded-full border border-white/20 object-cover"
                  />
                  <span>By <strong className="text-white">{blog.Author.name}</strong></span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>
                  {blog.publishedAt
                    ? new Date(blog.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "Draft"}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{blog.readTime}</span>
              </div>
              <div className="flex items-center gap-1 ml-auto">
                <Eye className="w-3.5 h-3.5" />
                <span>{blog.views} Views</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 🔹 Main Grid Layout */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* 📄 Left Column: Article Content */}
          <article className="lg:col-span-8 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            
            {/* Featured Image */}
            {blog.featuredImage && (
              <div className="aspect-[16/9] w-full overflow-hidden rounded-xl border border-gray-150 shadow-inner">
                <img
                  src={blog.featuredImage}
                  alt={blog.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Key Takeaways */}
            {blog.keyTakeaways && blog.keyTakeaways.length > 0 && (
              <div className="bg-amber-50/40 border border-amber-200 rounded-xl p-5 space-y-3">
                <h3 className="text-xs font-black text-amber-800 uppercase tracking-widest flex items-center gap-1.5">
                  🔑 Key Takeaways
                </h3>
                <ul className="list-disc list-inside space-y-1.5 text-xs text-amber-900 leading-relaxed font-medium">
                  {blog.keyTakeaways.map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Article Structured Content */}
            <div className="prose max-w-none text-gray-800 mt-6">
              {(blog.content || []).map((block, idx) => renderContentBlock(block, idx))}
            </div>

            {/* Tags Row */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="pt-6 border-t border-gray-100 flex flex-wrap gap-2">
                {blog.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] bg-gray-100 text-gray-600 font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-gray-150"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Likes & Share Actions */}
            <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-xs font-extrabold transition-all duration-300 ${
                  isLiked
                    ? "bg-red-50 border-red-200 text-red-600"
                    : "bg-white border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-600"
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
                <span>{likesCount} Likes</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-extrabold text-gray-600 hover:border-blue-200 hover:text-[#003e8b] transition-all"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Article</span>
              </button>
            </div>

            {/* 💬 Comments moderation section */}
            <section className="pt-8 border-t border-gray-100 space-y-6">
              <h3 className="text-sm sm:text-base font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#003e8b]" />
                Comments ({comments.length})
              </h3>

              {/* Add Comment Form */}
              <form onSubmit={handleCommentSubmit} className="bg-gray-50/50 border border-gray-200 rounded-xl p-5 space-y-4">
                <h4 className="text-xs font-extrabold text-gray-700 uppercase tracking-wider">Leave a Comment</h4>
                
                {commentSuccess && (
                  <div className="bg-green-50 border border-green-200 text-green-800 p-3 rounded-lg flex items-center gap-2 text-xs font-semibold">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span>Comment submitted successfully! It is awaiting admin approval.</span>
                  </div>
                )}
                
                {commentError && (
                  <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded-lg text-xs font-semibold">
                    {commentError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Your Name</label>
                    <input
                      type="text"
                      placeholder="Er. John Doe"
                      className="w-full border border-gray-200 rounded-lg p-2.5 text-xs font-medium focus:border-[#003e8b] focus:ring-1 focus:ring-[#003e8b] outline-none"
                      value={commentForm.name}
                      onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Your Email</label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      className="w-full border border-gray-200 rounded-lg p-2.5 text-xs font-medium focus:border-[#003e8b] focus:ring-1 focus:ring-[#003e8b] outline-none"
                      value={commentForm.email}
                      onChange={(e) => setCommentForm({ ...commentForm, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">Message</label>
                  <textarea
                    rows={4}
                    placeholder="Write your technical comment or feedback here..."
                    className="w-full border border-gray-200 rounded-lg p-2.5 text-xs font-medium focus:border-[#003e8b] focus:ring-1 focus:ring-[#003e8b] outline-none resize-none"
                    value={commentForm.content}
                    onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={commentLoading}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-2.5 bg-[#003e8b] text-white text-xs font-extrabold rounded-lg hover:bg-[#002e66] transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  {commentLoading ? "Submitting..." : "Submit Comment"}
                </button>
              </form>

              {/* Comments list */}
              <div className="space-y-4">
                {comments.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">No approved comments yet. Be the first to leave a thought!</p>
                ) : (
                  comments.map((comm) => (
                    <div key={comm.id} className="border border-gray-150 bg-white rounded-xl p-4 flex gap-3 shadow-inner">
                      <div className="w-8 h-8 rounded-full bg-blue-50 text-[#003e8b] font-black text-xs flex items-center justify-center border border-blue-100 flex-shrink-0 uppercase">
                        {comm.name.substring(0, 2)}
                      </div>
                      <div className="space-y-1.5 flex-1">
                        <div className="flex justify-between items-center">
                          <h5 className="font-extrabold text-xs text-gray-800 leading-none">{comm.name}</h5>
                          <span className="text-[9px] text-gray-400 font-semibold uppercase">
                            {new Date(comm.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed font-medium">{comm.content}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </article>

          {/* 📋 Right Column: Sidebar (Table of Contents, Author Info, Related Blogs) */}
          <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            
            {/* Sticky Table of Contents */}
            {blog.tableOfContents && blog.tableOfContents.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-3">
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-2">
                  📝 Table of Contents
                </h3>
                <nav className="space-y-2">
                  {blog.tableOfContents.map((toc, idx) => (
                    <a
                      key={idx}
                      href={`#${toc.id}`}
                      className="block text-xs font-extrabold text-gray-500 hover:text-[#003e8b] transition-colors leading-relaxed"
                    >
                      {toc.text}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* Author Profile Bio Card */}
            {blog.Author && (
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-2">
                  ✍️ About The Author
                </h3>
                <div className="flex items-center gap-3">
                  <img
                    src={blog.Author.image || "https://via.placeholder.com/150"}
                    alt={blog.Author.name}
                    className="w-12 h-12 rounded-xl object-cover border border-gray-150 shadow-sm"
                  />
                  <div className="space-y-0.5">
                    <h4 className="font-black text-xs sm:text-sm text-gray-800 leading-tight">{blog.Author.name}</h4>
                    <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wide block">
                      {blog.Author.designation}
                    </span>
                  </div>
                </div>
                {blog.Author.bio && (
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">
                    {blog.Author.bio}
                  </p>
                )}
                {/* Author Social links */}
                {blog.Author.socialLinks && Object.keys(blog.Author.socialLinks).length > 0 && (
                  <div className="pt-3 border-t border-gray-100 flex items-center gap-3">
                    {blog.Author.socialLinks.linkedin && (
                      <a
                        href={blog.Author.socialLinks.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-400 hover:text-[#003e8b] transition-colors"
                      >
                        <Linkedin className="w-4 h-4" />
                      </a>
                    )}
                    {blog.Author.socialLinks.twitter && (
                      <a
                        href={blog.Author.socialLinks.twitter}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-400 hover:text-blue-400 transition-colors"
                      >
                        <Twitter className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Related Blogs Column */}
            {relatedBlogs.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-2">
                  🔗 Related Articles
                </h3>
                <div className="space-y-4">
                  {relatedBlogs.map((rel, idx) => (
                    <Link
                      key={idx}
                      to={`/blogs/${rel.slug}`}
                      className="group flex gap-3 items-start hover:bg-gray-50/50 p-1.5 rounded-lg transition-colors"
                    >
                      <div className="w-14 h-10 overflow-hidden rounded-md border border-gray-150 flex-shrink-0">
                        <img
                          src={rel.featuredImage || "https://via.placeholder.com/150"}
                          alt={rel.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-[11px] text-gray-800 leading-snug group-hover:text-[#003e8b] transition-colors line-clamp-2">
                          {rel.title}
                        </h4>
                        <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider block">
                          {rel.category}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </aside>

        </div>
      </main>
    </div>
  );
};

export default BlogDetails;
