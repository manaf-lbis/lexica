import { Heart, MessageCircle } from "lucide-react";
import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Article {
  _id: string;
  title: string;
  about: string;
  content: string;
  author: string;
  avatar?: string;
  coverImage?: string;
  date: string;
  category: string;
  views: number;
  isLiked: boolean;
}

interface ArticleCardProps {
  article: Article;
  isLiked: boolean;
  toggleLike: (id: string) => void;
  className?: string;
  onClick?: () => void;
}

const ArticleCard = ({ article, isLiked, toggleLike, className = "", onClick }: ArticleCardProps) => {
  const [isAvatarError, setIsAvatarError] = useState(false);
  const navigate = useNavigate();

  const getInitials = (name: string) =>
    name
      ? name
          .split(" ")
          .slice(0, 2)
          .map((word) => word.charAt(0).toUpperCase())
          .join("")
      : "AN";

  return (
    <article
      className={`bg-slate-800/50 border border-slate-700 rounded-xl flex flex-col hover:border-blue-500 transition-all cursor-pointer ${className}`}
      role="article"
      aria-labelledby={`article-title-${article._id}`}
      onClick={() => onClick?.() || navigate(`/article/${article._id}`)}
    >
      <img
        src={article.coverImage}
        alt={article.title}
        className="h-40 w-full object-cover rounded-t-xl"
        onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
      />
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-4">
          {article.avatar && !isAvatarError ? (
            <img
              src={article.avatar}
              alt={`${article.author}'s avatar`}
              className="w-8 h-8 rounded-full object-cover"
              onError={() => setIsAvatarError(true)}
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-600 to-slate-700 flex items-center justify-center text-white text-xs font-semibold">
              {getInitials(article.author)}
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-white">{article.author}</p>
            <p className="text-xs text-slate-400">{article.date}</p>
          </div>
        </div>
        <h3
          id={`article-title-${article._id}`}
          className="text-lg font-bold text-white mb-2 hover:text-blue-400"
        >
          {article.title}
        </h3>
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
            >
              <Heart className="w-4 h-4" fill={isLiked ? "currentColor" : "none"} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/article/${article._id}`);
              }}
              className="text-slate-400 hover:text-blue-400 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default memo(ArticleCard);