import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Pencil } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getCoverImage } from "../utils/getCoverImage";
import { getCloudinaryImage } from "../utils/cloudinaryUrl";

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

interface ArticleCardProps {
  article: Article;
  onToggleLike: (articleId: string) => void;
  dateFormat?: "relative" | "absolute";
}

const AvatarFallback: React.FC<{ name: string }> = ({ name }) => {
  const getInitials = (name: string) => {
    const words = name.trim().split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center border border-slate-600">
      <span className="text-white font-semibold text-sm">{getInitials(name)}</span>
    </div>
  );
};

const CoverImageFallback: React.FC = () => {
  return (
    <div className="h-48 w-full bg-linear-to-br from-slate-700 to-slate-800 rounded-t-xl flex flex-col items-center justify-center">
      <Pencil className="w-12 h-12 text-slate-500 mb-2" strokeWidth={1.5} />
      <p className="text-slate-400 text-sm font-medium">No Cover Image</p>
    </div>
  );
};

const ArticleCard: React.FC<ArticleCardProps> = ({ 
  article, 
  onToggleLike, 
  dateFormat = "relative" 
}) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const coverImage = getCoverImage(article.content);
  const avatarUrl = getCloudinaryImage(article.authorId?.avatar);

  const formattedDate = dateFormat === "relative" 
    ? formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })
    : new Date(article.createdAt).toLocaleDateString();

  return (
    <article
      className="bg-slate-800/70 border border-slate-700 rounded-xl flex flex-col hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={() => navigate(`/article/${article._id}`)}
    >
      {/* Cover Image with Fallback */}
      {!imageError && coverImage ? (
        <img
          src={coverImage}
          alt={article.title}
          className="h-48 w-full object-cover rounded-t-xl"
          onError={() => setImageError(true)}
        />
      ) : (
        <CoverImageFallback />
      )}

      <div className="p-4 sm:p-6 flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-4">
          {/* Avatar with Fallback */}
          {!avatarError && avatarUrl ? (
            <img
              src={avatarUrl}
              alt={article.authorId.name}
              className="w-10 h-10 rounded-full object-cover border border-slate-600 shrink-0"
              onError={() => setAvatarError(true)}
            />
          ) : (
            <AvatarFallback name={article.authorId.name} />
          )}

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-white truncate">
              {article.authorId.name}
            </p>
            <p className="text-xs text-slate-400">{formattedDate}</p>
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-white mb-2 hover:text-blue-400 transition-colors line-clamp-2">
          {article.title}
        </h3>
        <p className="text-sm text-slate-400 mb-4 flex-1 line-clamp-3">
          {article.about}
        </p>

        <div className="flex justify-between text-xs text-slate-400 mb-4">
          <span className="capitalize truncate">{article.category}</span>
          <span className="shrink-0">{article.views} views</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleLike(article._id);
              }}
              className="text-red-500 hover:text-red-600 transition-colors shrink-0"
              aria-label={article.isLiked ? "Unlike article" : "Like article"}
            >
              <Heart 
                className="w-5 h-5" 
                fill={article.isLiked ? "currentColor" : "none"} 
              />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/article/${article._id}`);
              }}
              className="text-slate-400 hover:text-blue-400 transition-colors shrink-0"
              aria-label="View comments"
            >
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ArticleCard;