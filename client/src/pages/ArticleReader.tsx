import type React from "react"
import { useState, useEffect, useRef } from "react"
import { ChevronRight, Heart, Loader2, MessageSquare, MoveLeft, Send, View, X } from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useGetArticleByIdQuery } from "../api/articleApi"
import { getCloudinaryImage } from "../utils/cloudinaryUrl"
import { formatDistanceToNow } from "date-fns"
import NotFound from "./PagenNotFound"
import { useAddCommentMutation, useViewCommentsQuery,useAddLikeMutation } from "../api/likesAndCommentApi"
import { toast } from "sonner"

interface Author {
  _id: string
  name: string
  avatar: string
}
interface Article {
  _id: string
  title: string
  about: string
  category: string
  content: string
  authorId: Author
  views: number
  createdAt: string
}
interface Comment {
  _id: string
  userId: {
    name: string,
    avatar: string
  },
  comment: string
  createdAt: string
  isLiked: boolean
}
interface ArticleResponse {
  article: Article
  recomendations: Article[]
}

interface CommentsContentProps {
  newComment: string
  setNewComment: (value: string) => void
  comments: Comment[]
  handlePostComment: () => void
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  textareaRef: React.RefObject<HTMLTextAreaElement>
  isPostingComment: boolean
}

const CommentsContent = ({
  newComment,
  setNewComment,
  comments,
  handlePostComment,
  handleKeyDown,
  textareaRef,
  isPostingComment,
}: CommentsContentProps) => (
  <div className="flex flex-col gap-4">
    <div className="flex items-start gap-3 bg-slate-900 p-4 rounded-lg border border-slate-700">
      <textarea
        ref={textareaRef}
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        onKeyDown={handleKeyDown}
        maxLength={130}
        placeholder="Add a comment (max 130 chars)..."
        className="w-full h-20 p-3 bg-slate-800 text-slate-200 rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        aria-label="Comment input"
      />
      <button
        onClick={handlePostComment}
        disabled={!newComment.trim() || newComment.length > 130 || isPostingComment}
        className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-slate-700 disabled:text-slate-400 transition-colors mt-2"
        aria-label="Send comment"
      >
        {isPostingComment ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
      </button>
    </div>
    {comments.length > 0 ? (
      comments.map((comment: Comment) => <CommentCard key={comment._id} comment={comment} />)
    ) : (
      <p className="text-sm text-slate-400 text-center py-8">No comments yet. Be the first!</p>
    )}
  </div>
)

const CommentCard = ({ comment }: { comment: Comment }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const isLongComment = comment.comment.length > 100
  const displayContent = isLongComment && !isExpanded ? `${comment.comment.slice(0, 100)}...` : comment.comment

  return (
    <div className="p-4 rounded-lg border border-slate-700 bg-slate-800/50 hover:bg-slate-800/70 transition-all duration-200">
      <div className="flex items-center gap-3 mb-2">
        <div
          className="w-8 h-8 rounded-full bg-linear-to-br from-blue-600 to-slate-700 flex items-center justify-center text-white text-xs font-semibold"
          aria-label={`${comment.userId.name}'s avatar initials`}
        >
          {comment.userId.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{comment.userId.name}</p>
          <p className="text-xs text-slate-400">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </p>
        </div>
      </div>
      <p className="text-sm text-slate-300 leading-relaxed">
        {displayContent}
        {isLongComment && (
          <button onClick={() => setIsExpanded(!isExpanded)} className="text-blue-400 text-xs font-medium ml-2">
            {isExpanded ? "Show Less" : "Read More"}
          </button>
        )}
      </p>
    </div>
  )
}

export default function ArticleReader() {
  const params = useParams<{ id: string }>()
  const [commentsOpen, setCommentsOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [newComment, setNewComment] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null!)
  const [isPostingComment, setIsPostingComment] = useState(false);
  const [addLike] = useAddLikeMutation()

  const { data, isLoading, error ,refetch} = useGetArticleByIdQuery(params.id || "")
  const { article, recomendations } = (data || {}) as ArticleResponse
  const { data: comments, isLoading: commentsLoading } = useViewCommentsQuery({ articleId: params.id || "" })
  const [addComment] = useAddCommentMutation();
  
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  


  const getInitials = (name: string) =>
    name
      ? name
          .split(" ")
          .slice(0, 2)
          .map((word) => word.charAt(0).toUpperCase())
          .join("")
      : "AN"

  const handlePostComment = async () => {
    if (!newComment.trim() || newComment.length > 130) return
    try {
      setIsPostingComment(true)
      await addComment({ articleId: params.id || "", comment: newComment }).unwrap()
      setNewComment("")
      textareaRef.current?.focus()
    } catch (error) {
      console.error("Failed to post comment:", error)
    } finally {
      setIsPostingComment(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handlePostComment()
    }
  }

  const handleLike = async () => {
    try {
      await addLike({ articleId: params.id || "" }).unwrap()
      await refetch()
    }catch (error:any) {
      toast.error(error.data?.message || "Failed to like article" )
    }
  }

  if (isLoading || commentsLoading) return <Loader2 className="animate-spin mx-auto mt-20" />
  if (error) return <NotFound message={(error as any)?.data?.message} />

  return (
    <div className="min-h-screen bg-slate-900">
      <style>{`
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: rgb(15, 23, 42); }
        ::-webkit-scrollbar-thumb { background: rgb(71, 85, 105); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgb(100, 116, 139); }
        * { scrollbar-color: rgb(71, 85, 105) rgb(15, 23, 42); scrollbar-width: thin; }
      `}</style>
      <header className="sticky top-0 z-40 border-b border-slate-700 bg-slate-900/95 backdrop-blur-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex gap-3 items-center">
              <MoveLeft size={20} className="text-white cursor-pointer" onClick={() => navigate("/")} />
              <div className="text-xs sm:text-sm font-medium text-slate-300">{article.category}</div>
            </div>
            <div className="flex items-center gap-1">
              <button
                className="p-2 rounded-lg flex items-center gap-2 text-slate-400 hover:bg-slate-800 hover:text-blue-400 transition-colors"
                aria-label="View count"
              >
                <View size={20} className="transition-all" />
                <span className="text-xs sm:text-sm font-medium">{article.views}</span>
              </button>
              <button
                onClick={handleLike}
                className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
                aria-label="Like article"
              >
                <Heart
                  size={20}
                  className={`transition-all ${article?.isLiked ? "fill-red-500 text-red-500" : "text-slate-400 hover:text-red-400"}`}
                />
              </button>
              <button
                onClick={() => setCommentsOpen(!commentsOpen)}
                className={`p-2 rounded-lg flex items-center gap-2 transition-colors ${
                  commentsOpen
                    ? "bg-blue-500/15 text-blue-400"
                    : "hover:bg-slate-800 text-slate-400 hover:text-slate-200"
                }`}
                aria-label="Toggle comments"
              >
                <MessageSquare size={20} />
                <span className="text-xs sm:text-sm font-medium">{comments.length}</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      <div className="relative">
        <div className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="mb-6 sm:mb-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-3 sm:mb-4 text-white">
              {article.title}
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 mb-4 leading-relaxed">{article.about}</p>
            <div className="flex items-center gap-3 flex-wrap">
              {article.authorId?.avatar ? (
                <img
                  src={getCloudinaryImage(article.authorId.avatar) || "/placeholder.svg"}
                  alt={`${article.authorId.name}'s avatar`}
                  className="w-8 h-8 rounded-full bg-slate-700 object-cover"
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-full bg-linear-to-br from-blue-600 to-slate-700 flex items-center justify-center text-white text-xs font-semibold"
                  aria-label={`${article.authorId.name}'s avatar initials`}
                >
                  {getInitials(article.authorId.name)}
                </div>
              )}
              <div>
                <p className="text-white font-medium text-sm sm:text-base">{article.authorId?.name}</p>
                <p className="text-slate-400 text-xs sm:text-sm">
                  {formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          </div>
          <article className="text-slate-200 leading-relaxed text-base sm:text-lg">
            <style>
              {`
                .article-content h2 { font-size: clamp(24px, 5vw, 28px); font-weight: 700; margin: clamp(24px, 6vw, 32px) 0 clamp(12px, 3vw, 16px) 0; color: white; }
                .article-content h3 { font-size: clamp(20px, 4vw, 24px); font-weight: 600; margin: clamp(20px, 4vw, 24px) 0 clamp(10px, 2vw, 12px) 0; color: white; }
                .article-content h4 { font-size: clamp(16px, 2.5vw, 18px); font-weight: 600; margin: clamp(16px, 3vw, 20px) 0 clamp(8px, 2vw, 10px) 0; color: white; }
                .article-content p { margin: clamp(12px, 2vw, 16px) 0; color: rgb(209, 213, 219); }
                .article-content ul { list-style: disc; padding-left: clamp(20px, 5vw, 28px); margin: clamp(12px, 2vw, 16px) 0; }
                .article-content ol { list-style: decimal; padding-left: clamp(20px, 5vw, 28px); margin: clamp(12px, 2vw, 16px) 0; }
                .article-content li { margin: clamp(6px, 1vw, 8px) 0; color: rgb(209, 213, 219); }
                .article-content blockquote { border-left: 4px solid rgb(96, 165, 250); padding-left: clamp(12px, 3vw, 16px); font-style: italic; color: rgb(156, 163, 175); margin: clamp(16px, 3vw, 24px) 0; }
                .article-content pre { background: rgb(30, 41, 59); border: 1px solid rgb(71, 85, 105); border-radius: 8px; padding: clamp(12px, 2vw, 16px); overflow-x: auto; margin: clamp(16px, 3vw, 24px) 0; }
                .article-content code { background: rgb(30, 41, 59); color: rgb(253, 224, 71); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: clamp(13px, 1.5vw, 14px); }
                .article-content pre code { background: transparent; color: rgb(209, 213, 219); padding: 0; }
                .article-content a { color: rgb(96, 165, 250); text-decoration: none; }
                .article-content a:hover { text-decoration: underline; }
                .article-content hr { border: none; border-top: 1px solid rgb(55, 65, 81); margin: clamp(24px, 5vw, 32px) 0; }
                .article-content img { max-width: 100%; height: auto; border-radius: 8px; margin: clamp(16px, 3vw, 24px) 0; }
              `}
            </style>
            <div className="article-content" dangerouslySetInnerHTML={{ __html: article.content }} />
          </article>
          <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-slate-700">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white">Recommended Reading</h2>
            <div className="flex flex-col gap-3">
              {recomendations.map((suggestedArticle: Article) => (
                <Link
                  key={suggestedArticle._id}
                  to={`/article/${suggestedArticle._id}`}
                  className="flex items-start justify-between p-4 rounded-lg border border-slate-700 bg-slate-800/20 hover:bg-slate-800/40 transition-all duration-200 hover:border-slate-600"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-2 text-white text-sm sm:text-base hover:text-blue-400 transition-colors">
                      {suggestedArticle.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400 flex-wrap">
                      <span>{suggestedArticle.authorId.name}</span>
                      <span>·</span>
                      <span className="px-2 py-1 rounded bg-slate-800 text-slate-300">{suggestedArticle.category}</span>
                    </div>
                  </div>
                  <ChevronRight className="text-slate-500 shrink-0 ml-3" size={20} />
                </Link>
              ))}
            </div>
          </div>
        </div>
        {!isMobile && commentsOpen && (
          <div className="fixed right-0 top-16 w-96 h-[calc(100vh-64px)] bg-slate-900 border-l border-slate-700 p-6 overflow-y-auto z-50">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Comments ({comments.length})</h2>
              <button
                onClick={() => setCommentsOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                aria-label="Close comments"
              >
                <X size={20} />
              </button>
            </div>
            <CommentsContent
              newComment={newComment}
              setNewComment={setNewComment}
              comments={comments}
              handlePostComment={handlePostComment}
              handleKeyDown={handleKeyDown}
              textareaRef={textareaRef}
              isPostingComment={isPostingComment}
            />
          </div>
        )}
        {isMobile && commentsOpen && (
          <>
            <div onClick={() => setCommentsOpen(false)} className="fixed inset-0 bg-black/60 z-40 animate-in fade-in" />
            <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 rounded-t-2xl max-h-[85vh] overflow-y-auto z-50 animate-in slide-in-from-bottom">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-white">Comments ({comments.length})</h2>
                  <button
                    onClick={() => setCommentsOpen(false)}
                    className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
                    aria-label="Close comments"
                  >
                    <X size={20} />
                  </button>
                </div>
                <CommentsContent
                  newComment={newComment}
                  setNewComment={setNewComment}
                  comments={comments}
                  handlePostComment={handlePostComment}
                  handleKeyDown={handleKeyDown}
                  textareaRef={textareaRef}
                  isPostingComment={isPostingComment}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
