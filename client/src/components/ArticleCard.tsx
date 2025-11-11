import { Bookmark, Heart, MessageCircle } from "lucide-react";
import { memo, useState } from "react";

interface Article {
    _id: string;
    title: string;
    about: string;
    author: string;
    avatar?: string;
    coverImage?: string;
    date: string;
    category: string;
    likes: number;
}

interface ArticleCardProps {
    article: Article;
    isLiked: boolean;
    isBookmarkedArticles: boolean;
    toggleLike: (id: string) => void;
    toggleBookmark: (id: string) => void;
    onCommentClick?: (id: string) => void;
    className?: string;
    onClick?: () => void;
}

const ArticleCard = ({
    article,
    isLiked,
    isBookmarkedArticles,
    toggleLike,
    toggleBookmark,
    onCommentClick,
    className = "",
    onClick
}: ArticleCardProps) => {
    const [isAvatarError, setIsAvatarError] = useState(false);

    // Get first two letters of author's name in uppercase
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
            className={`group bg-slate-800/50 cursor-pointer backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 flex flex-col ${className}`}
            role="article"
            aria-labelledby={`article-title-${article._id}`}
            onClick={() => onClick?.()}
        >
            <div className="h-40 relative overflow-hidden rounded-t-xl">
                {article.coverImage ? (
                    <img
                        src={article.coverImage}
                        alt={article.title || "Article cover"}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                            const target = e.currentTarget;
                            target.onerror = null;
                            target.src = "/placeholder.svg";
                        }}
                    />
                ) : (
                    <div className="h-full w-full bg-linear-to-br from-blue-600/20 to-slate-700 flex items-center justify-center">
                        <div className="text-4xl opacity-20 group-hover:opacity-30 transition-opacity">✎</div>
                    </div>
                )}
            </div>

            <div className="p-4 sm:p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                    {article.avatar && !isAvatarError ? (
                        <img
                            src={article.avatar}
                            alt={`${article.author}'s avatar`}
                            className="w-8 h-8 rounded-full bg-slate-700 object-cover"
                            onError={() => setIsAvatarError(true)}
                        />
                    ) : (
                        <div
                            className="w-8 h-8 rounded-full bg-linear-to-br from-blue-600 to-slate-700 flex items-center justify-center text-white text-xs font-semibold"
                            aria-label={`${article.author}'s avatar initials`}
                        >
                            {getInitials(article.author)}
                        </div>
                    )}
                    <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-white truncate">
                            {article.author || "Anonymous"}
                        </p>
                        <p className="text-xs text-slate-400">{article.date || "Unknown date"}</p>
                    </div>
                </div>

                <h3
                    id={`article-title-${article._id}`}
                    className="text-base sm:text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors"
                >
                    {article.title || "Untitled Article"}
                </h3>

                <p className="text-sm text-slate-400 mb-4 line-clamp-2 flex-1">
                    {article.about || "No description available"}
                </p>

                <div className="flex items-center justify-between text-xs text-slate-400 mb-4 pb-4 border-b border-slate-700/50">
                    <span>{article.category || "Uncategorized"}</span>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleLike(article._id);
                            }}
                            className="flex items-center gap-1 text-slate-400 hover:text-red-400 transition-colors"
                            aria-label={isLiked ? "Unlike article" : "Like article"}
                        >
                            <Heart className="w-4 h-4" fill={isLiked ? "currentColor" : "none"} />
                            <span className="text-xs">{article.likes || 0}</span>
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                onCommentClick?.(article._id)
                            }}
                            className="text-slate-400 hover:text-blue-400 transition-colors"
                            aria-label="Comment on article"
                            disabled={!onCommentClick}
                        >
                            <MessageCircle className="w-4 h-4" />
                        </button>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            toggleBookmark(article._id)
                        }}
                        className="text-slate-400 hover:text-blue-400 transition-colors"
                        aria-label={isBookmarkedArticles ? "Remove bookmark" : "Bookmark article"}
                    >
                        <Bookmark
                            className="w-4 h-4"
                            fill={isBookmarkedArticles ? "currentColor" : "none"}
                        />
                    </button>
                </div>
            </div>
        </article >
    );
};

export default memo(ArticleCard);