import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useArticleVisiblityMutation, useMyArticlesQuery } from "../api/articleApi";



export default function MyArticles() {
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const { data, isLoading, error } = useMyArticlesQuery({ page: currentPage, limit: 12 });
  const [articleVisiblity, { isLoading: isVisiblityLoading }] = useArticleVisiblityMutation();

  const articles = data?.articles || [];
  const totalPages = Math.ceil((data?.stats.totalArticles || 0) / (data?.itemsPerPage || 12));
  const startIndex = (currentPage - 1) * (data?.itemsPerPage || 12);
  const endIndex = startIndex + (data?.itemsPerPage || 12);

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  const handleBlock = async (id: string, currentVisibility: boolean) => {
    try {
      await articleVisiblity({ _id: id, visibility: !currentVisibility }).unwrap();
    } catch (err) {
      console.error("Failed to toggle visibility:", err);
      alert("Failed to update article visibility");
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/edit-article/${id}`);
  };

  const handleView = (id: string) => {
    navigate(`/article/${id}`);
  };

  if (isLoading) return <div className="min-h-screen bg-slate-950 text-slate-50 p-6 md:p-12">Loading...</div>;
  if (error) return <div className="min-h-screen bg-slate-950 text-slate-50 p-6 md:p-12">Error loading articles</div>;

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto mb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Articles</h1>
            <p className="text-slate-400">Manage and organize your content</p>
          </div>
          <button
            onClick={() => navigate("/write")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            New Article
          </button>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-12">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <p className="text-slate-400 text-sm mb-1">Total Articles</p>
            <p className="text-3xl font-bold">{data?.stats.totalArticles || 0}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <p className="text-slate-400 text-sm mb-1">Total Views</p>
            <p className="text-3xl font-bold">{(data?.stats.totalViews || 0).toLocaleString()}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <p className="text-slate-400 text-sm mb-1">Blocked</p>
            <p className="text-3xl font-bold">{data?.stats.blockedCount || 0}</p>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-3 mb-8">
          {articles.map((article:any) => (
            <div
              key={article._id}
              className={`group border rounded-lg p-5 transition-all hover:border-slate-600 ${
                article.isBlocked
                  ? "bg-slate-900/50 border-slate-800 opacity-60"
                  : "bg-slate-900 border-slate-800 hover:bg-slate-800"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-slate-50 truncate">{article.title}</h3>
                    {article.isBlocked && (
                      <span className="text-xs px-2 py-1 bg-red-900/30 text-red-300 rounded whitespace-nowrap">
                        Blocked
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                    <span className="px-2 py-1 bg-slate-800 rounded text-slate-300">{article.category}</span>
                    <span>{formatDate(article.createdAt)}</span>
                    <span className="flex items-center gap-1">{article.views.toLocaleString()} views</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleView(article._id)}
                    className="px-3 py-1.5 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors"
                    title="View article"
                    aria-label="View article"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(article._id)}
                    className="px-3 py-1.5 text-sm bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded transition-colors"
                    title="Edit article"
                    aria-label="Edit article"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleBlock(article._id, article.isBlocked)}
                    disabled={isVisiblityLoading}
                    className={`px-3 py-1.5 text-sm rounded transition-colors ${
                      article.isBlocked
                        ? "bg-green-600/20 hover:bg-green-600/30 text-green-400"
                        : "bg-red-600/20 hover:bg-red-600/30 text-red-400"
                    } ${isVisiblityLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                    title={article.isBlocked ? "Unblock article" : "Block article"}
                    aria-label={article.isBlocked ? "Unblock article" : "Block article"}
                  >
                    {isVisiblityLoading ? "..." : article.isBlocked ? "Unblock" : "Block"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        {articles.length > 0 && (
          <div className="flex items-center justify-between border-t border-slate-800 pt-6" role="navigation" aria-label="Pagination">
            <div className="text-sm text-slate-400">
              Showing <span className="font-semibold">{startIndex + 1}</span> to{" "}
              <span className="font-semibold">{Math.min(endIndex, data?.stats.totalArticles || 0)}</span> of{" "}
              <span className="font-semibold">{data?.stats.totalArticles || 0}</span> articles
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 text-sm bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 disabled:text-slate-600 text-slate-300 rounded transition-colors"
                aria-label="Previous page"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 text-sm rounded transition-colors ${
                      currentPage === page
                        ? "bg-blue-600 text-white font-semibold"
                        : "bg-slate-800 hover:bg-slate-700 text-slate-300"
                    }`}
                    aria-label={`Page ${page}`}
                    aria-current={currentPage === page ? "page" : undefined}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 text-sm bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 disabled:text-slate-600 text-slate-300 rounded transition-colors"
                aria-label="Next page"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}