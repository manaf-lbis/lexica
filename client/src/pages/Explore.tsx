import React, { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { Heart, MessageCircle, ArrowLeft, ChevronLeft, ChevronRight, X } from "lucide-react";
import Footer from "../components/Footer";
import { useGetCategoriesQuery, useSearchArticlesQuery } from "../api/articleApi";
import { useAddLikeMutation } from "../api/likesAndCommentApi";
import { toast } from "sonner";

interface Article {
  _id: string;
  title: string;
  about: string;
  content: string;
  category: string;
  authorId: { name: string; avatar: string };
  views: number;
  createdAt: string;
  isLiked: boolean;
}


const getCoverImage = (content: string): string => {
  const imgMatch = content.match(/<img[^>]+src=["'](.*?)["']/i);
  return imgMatch ? imgMatch[1] : "/placeholder.svg";
};

const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [currentPage, setCurrentPage] = useState(1);
  const searchQuery = searchParams.get("search") || "";
  const [articles, setArticles] = useState<Article[]>([]);
  const [totalArticles, setTotalArticles] = useState(0);
  const itemsPerPage = 12;

  const { data: categoriesData, isLoading: isCategoriesLoading } = useGetCategoriesQuery({});
  const categories = categoriesData ? ["All", ...categoriesData] : ["All"];

  const { data, isLoading } = useSearchArticlesQuery(
    {
      query: searchQuery,
      page: currentPage,
      category: selectedCategory !== "All" ? selectedCategory : undefined,
    },
    { skip: isCategoriesLoading }
  );

  const [addLike] = useAddLikeMutation();

  useEffect(() => {
    if (data) {
      setArticles(data.articles.map((art: Article) => ({ ...art, isLiked: art.isLiked })));
      setTotalArticles(data.totalArticles);
      setCurrentPage(data.currentPage);
    }
  }, [data]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const clearSearch = () => {
    setSearchParams({}, { replace: true });
    setCurrentPage(1);
  };

  const toggleLike = async (articleId: string) => {
    try {
      await addLike({ articleId }).unwrap();
      setArticles(prev =>
        prev.map(a =>
          a._id === articleId ? { ...a, isLiked: !a.isLiked } : a
        )
      );
      toast.success(`Article ${articles.find(a => a._id === articleId)?.isLiked ? "unliked" : "liked"}!`);
    } catch (error: any) {

      if (error.status === 401) {
        toast('Login to like article', {
          action: {
            label: 'Login',
            onClick: () => navigate('/login'),
          },
        });
      } else {
        toast.error(error.data?.message || "Failed to toggle like");
      }
    }
  };

  const totalPages = Math.ceil(totalArticles / itemsPerPage);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      <main className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              {searchQuery ? `Search: "${searchQuery}"` : "Explore Articles"}
            </h1>
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-all"
                aria-label="Clear search query"
              >
                <X className="w-4 h-4" />
                Clear Search
              </button>
            )}
          </div>
          <p className="text-slate-400 text-sm">{totalArticles} articles found</p>
        </div>

        <div className="mb-8 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 whitespace-nowrap pb-2">
            {isCategoriesLoading ? (
              <p className="text-slate-400">Loading categories...</p>
            ) : (
              categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`px-4 py-2 rounded-full font-medium text-sm transition-all duration-200 ${cat === selectedCategory
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                    }`}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Articles Grid */}
        {isLoading ? (
          <div className="text-white text-center py-8 flex items-center justify-center">
            <svg className="animate-spin h-8 w-8 text-blue-500 mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Loading articles...
          </div>
        ) : articles.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {articles.map(article => (
                <article
                  key={article._id}
                  className="bg-slate-800/70 border border-slate-700 rounded-xl flex flex-col hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer"
                  onClick={() => navigate(`/article/${article._id}`)}
                >
                  <img
                    src={getCoverImage(article.content)}
                    alt={article.title}
                    className="h-48 w-full object-cover rounded-t-xl"
                    onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
                  />
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={`https://res.cloudinary.com/lexica/image/upload/${article.authorId.avatar}`}
                        alt={article.authorId.name}
                        className="w-10 h-10 rounded-full object-cover border border-slate-600"
                        onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
                      />
                      <div>
                        <p className="text-sm font-semibold text-white">{article.authorId.name}</p>
                        <p className="text-xs text-slate-400">{new Date(article.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 hover:text-blue-400 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-slate-400 mb-4 flex-1 line-clamp-3">{article.about}</p>
                    <div className="flex justify-between text-xs text-slate-400 mb-4">
                      <span className="capitalize">{article.category}</span>
                      <span>{article.views} views</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(article._id);
                          }}
                          className="text-red-500 hover:text-red-600 transition-colors"
                          aria-label={article.isLiked ? "Unlike article" : "Like article"}
                        >
                          <Heart className="w-5 h-5" fill={article.isLiked ? "currentColor" : "none"} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/article/${article._id}`);
                          }}
                          className="text-slate-400 hover:text-blue-400 transition-colors"
                          aria-label="View comments"
                        >
                          <MessageCircle className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mb-12">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-3 rounded-full bg-slate-800 disabled:opacity-50 hover:bg-blue-600 text-white transition-all"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${page === currentPage
                        ? "bg-blue-600 text-white"
                        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                        }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-3 rounded-full bg-slate-800 disabled:opacity-50 hover:bg-blue-600 text-white transition-all"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-white mb-2">No articles found</h2>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Home
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default ExplorePage;