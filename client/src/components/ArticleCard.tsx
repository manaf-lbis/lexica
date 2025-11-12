import type React from "react"
import { useState } from "react"
import { Link } from "react-router-dom"
import { Heart, MessageCircle, Pencil } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { getCoverImage } from "../utils/getCoverImage"
import { getCloudinaryImage } from "../utils/cloudinaryUrl"

interface Article {
  _id: string
  title: string
  about: string
  content: string
  category: string
  authorId: { name: string; avatar: string }
  views: number
  createdAt: string
  isLiked: boolean
}

interface ArticleCardProps {
  article: Article
  onToggleLike?: (articleId: string) => void
  dateFormat?: "relative" | "absolute"
}

const AvatarFallback: React.FC<{ name: string }> = ({ name }) => {
  const getInitials = (name: string) => {
    const words = name.trim().split(" ")
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  return (
    <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center border border-slate-600 shadow-md">
      <span className="text-white font-semibold text-sm">{getInitials(name)}</span>
    </div>
  )
}

const CoverImageFallback: React.FC = () => {
  return (
    <div className="h-40 sm:h-48 w-full bg-linear-to-br from-slate-700 to-slate-800 rounded-t-2xl flex flex-col items-center justify-center overflow-hidden">
      <Pencil className="w-10 sm:w-12 h-10 sm:h-12 text-slate-500 mb-2" strokeWidth={1.5} />
      <p className="text-slate-400 text-xs sm:text-sm font-medium">No Cover Image</p>
    </div>
  )
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article, onToggleLike, dateFormat = "relative" }) => {
  const [imageError, setImageError] = useState(false)
  const [avatarError, setAvatarError] = useState(false)

  const coverImage = getCoverImage(article.content)
  const avatarUrl = getCloudinaryImage(article.authorId?.avatar)

  const formattedDate =
    dateFormat === "relative"
      ? formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })
      : new Date(article.createdAt).toLocaleDateString()

  return (
    <Link to={`/article/${article._id}`}>
      {/* Cover Image Container with Zoom Effect */}
      <article className="group bg-slate-800/50 backdrop-blur-sm border-2 border-slate-700/50 rounded-2xl flex flex-col hover:border-blue-500 hover:bg-slate-800/70 transition-all duration-300 cursor-pointer overflow-hidden shadow-sm hover:shadow-xl h-full">
        <div className="relative h-40 sm:h-48 overflow-hidden rounded-t-2xl bg-slate-900">
          {!imageError && coverImage ? (
            <img
              src={coverImage || "/placeholder.svg"}
              alt={article.title}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
              onError={() => setImageError(true)}
            />
          ) : (
            <CoverImageFallback />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-4 sm:p-5 flex flex-col flex-1">
          {/* Author Section */}
          <div className="flex items-center gap-3 mb-4">
            {!avatarError && avatarUrl ? (
              <img
                src={avatarUrl || "/placeholder.svg"}
                alt={article.authorId.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-600 shrink-0 shadow-md"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <AvatarFallback name={article.authorId.name} />
            )}

            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm font-semibold text-white truncate leading-tight">
                {article.authorId.name}
              </p>
              <p className="text-xs text-slate-400 leading-tight">{formattedDate}</p>
            </div>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-white mb-2 group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
            {article.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mb-4 flex-1 line-clamp-2 sm:line-clamp-3 leading-relaxed">
            {article.about}
          </p>

          {/* Meta Info */}
          <div className="flex justify-between text-xs text-slate-500 mb-4 pb-3 border-b border-slate-700/50">
            <span className="capitalize truncate font-medium text-slate-400">{article.category}</span>
            <span className="shrink-0">{article.views} views</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <button
                onClick={(e) => {
                  e.preventDefault()
                  onToggleLike?.(article._id)
                }}
                className="text-slate-400 hover:text-red-500 transition-all duration-200 shrink-0 hover:scale-110"
                aria-label={article.isLiked ? "Unlike article" : "Like article"}
              >
                <Heart
                  className="w-5 h-5"
                  fill={article.isLiked ? "#ef4444" : "none"}
                  stroke={article.isLiked ? "#ef4444" : "currentColor"}
                  strokeWidth={article.isLiked ? 0 : 2}
                />
              </button>
              <button
                onClick={(e) => {
                  e.preventDefault()
                }}
                className="text-slate-400 hover:text-blue-400 transition-all duration-200 shrink-0 hover:scale-110"
                aria-label="View comments"
              >
                <MessageCircle className="w-5 h-5" strokeWidth={2} />
              </button>
            </div>
            <span className="text-xs text-slate-500 font-medium">Read more</span>
          </div>
        </div>
      </article>
    </Link>
  )
}

export default ArticleCard
