import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Heart, MessageCircle } from "lucide-react";
import Footer from "../components/Footer";
import { useTrendingArticlesQuery } from "../api/articleApi";
import { useAddLikeMutation } from "../api/likesAndCommentApi";
import { getCoverImage } from "../utils/getCoverImage";
import { getCloudinaryImage } from "../utils/cloudinaryUrl";
import { formatDistanceToNow } from "date-fns";
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

const HomePage: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const { data: trendingArticles } = useTrendingArticlesQuery({});
  const [addLike] = useAddLikeMutation();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (trendingArticles) {
      setArticles(trendingArticles.map((art: Article) => ({ ...art, isLiked: art.isLiked })));
    }
  }, [trendingArticles]);

  const toggleLike = async (articleId: string) => {
    try {
      await addLike({ articleId }).unwrap();
      setArticles(prevArticles =>
        prevArticles.map(a =>
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

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Decorative blur */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        <div className="mb-12 sm:mb-16 text-center max-w-3xl mx-auto">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-4 text-balance leading-tight">
            Share your{" "}
            <span className="bg-linear-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">stories</span>
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 mb-8 text-pretty max-w-xl mx-auto">
            Connect with a community of writers. Share knowledge. Build your audience. Write about what matters to you.
          </p>
          <Link
            to="/write"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:shadow-lg hover:shadow-blue-500/30 text-base"
          >
            <Plus className="w-5 h-5" />
            Start Writing
          </Link>
        </div>

        {/* Articles Grid */}
        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">Topics For You</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {articles?.map((article: Article) => (
            <article
              key={article._id}
              className="bg-slate-800/50 border border-slate-700 rounded-xl flex flex-col hover:border-blue-500 transition-all cursor-pointer"
              onClick={() => navigate(`/article/${article._id}`)}
            >
              <img
                src={getCoverImage(article.content)}
                alt={article.title}
                className="h-40 w-full object-cover rounded-t-xl"
                onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
              />
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <img
                    src={getCloudinaryImage(article.authorId.avatar)}
                    alt={article.authorId.name}
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">{article.authorId.name}</p>
                    <p className="text-xs text-slate-400">{formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}</p>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 hover:text-blue-400">{article.title}</h3>
                <p className="text-sm text-slate-400 mb-4 flex-1 line-clamp-3">{article.about}</p>
                <div className="flex justify-between text-xs text-slate-400 mb-4">
                  <span>{article.category}</span>
                  <span>{article.views} views</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(article._id);
                      }}
                      className="text-red-500 hover:text-red-600 transition-colors"
                      aria-label={article.isLiked ? "Unlike article" : "Like article"}
                    >
                      <Heart className="w-4 h-4" fill={article.isLiked ? "currentColor" : "none"} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/article/${article._id}`);
                      }}
                      className="text-slate-400 hover:text-blue-400 transition-colors"
                      aria-label="View comments"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Load More */}
        <div className="flex justify-center mb-12">
          <button
            onClick={() => navigate("/explore")}
            className="px-8 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold rounded-lg transition-all duration-300"
          >
            Load More Articles
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;