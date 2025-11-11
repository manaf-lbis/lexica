import { useState, useEffect } from "react"
import { ChevronRight, Heart, Loader2, MessageSquare, MoveLeft, View, X } from "lucide-react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useGetArticleByIdQuery } from "../api/articleApi"
import { getCloudinaryImage } from "../utils/cloudinaryUrl"
import { formatDistanceToNow } from 'date-fns'



interface Comment {
    id: string
    author: string
    avatar: string
    content: string
    date: string
    likes: number
}

export default function ArticleReader() {
    const params = useParams()
    const [liked, setLiked] = useState(false)
    const [commentsOpen, setCommentsOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)
    const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
    const { data, isLoading } = useGetArticleByIdQuery(params.id || "")
    const { article, recomendations } = data || {};
    const navigate = useNavigate()


    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024)
        checkMobile()
        window.addEventListener("resize", checkMobile)
        return () => window.removeEventListener("resize", checkMobile)
    }, [])

    const [comments] = useState<Comment[]>([
        {
            id: "1",
            author: "Sarah Johnson",
            avatar: "SJ",
            content: "This is a great article! Really insightful perspective on the topic.",
            date: "2 days ago",
            likes: 12,
        },
        {
            id: "2",
            author: "Michael Chen",
            avatar: "MC",
            content: "Loved the way you explained this. Very clear and concise.",
            date: "1 day ago",
            likes: 8,
        },
        {
            id: "3",
            author: "Emma Watson",
            avatar: "EW",
            content:
                "The section on AI-powered development was particularly enlightening. Can't wait to see how this evolves.",
            date: "1 day ago",
            likes: 15,
        },
        {
            id: "4",
            author: "David Rodriguez",
            avatar: "DR",
            content: "Great breakdown of modern frameworks. React Server Components are game-changing.",
            date: "12 hours ago",
            likes: 9,
        },
        {
            id: "5",
            author: "Jessica Lee",
            avatar: "JL",
            content: "The performance optimization tips are practical and immediately applicable. Thanks for sharing!",
            date: "10 hours ago",
            likes: 11,
        },
        {
            id: "6",
            author: "Alex Thompson",
            avatar: "AT",
            content: "Really appreciate the examples in the code section. Makes it much easier to understand.",
            date: "6 hours ago",
            likes: 7,
        },
        {
            id: "7",
            author: "Nina Patel",
            avatar: "NP",
            content: "Well-written and comprehensive. Looking forward to your next article on this topic.",
            date: "4 hours ago",
            likes: 13,
        },
        {
            id: "8",
            author: "Chris Anderson",
            avatar: "CA",
            content: "This deserves to be on the front page of every tech news site. Outstanding work!",
            date: "2 hours ago",
            likes: 20,
        },
    ])



    const getInitials = (name: string) =>
        name
            ? name
                .split(" ")
                .slice(0, 2)
                .map((word) => word.charAt(0).toUpperCase())
                .join("")
            : "AN";

    const CommentCard = ({ comment }: { comment: Comment }) => {
        const isLiked = likedComments.has(comment.id)
        const currentLikes = isLiked ? comment.likes + 1 : comment.likes

        return (
            <div className="group p-4 rounded-lg border border-slate-700 bg-slate-800/40 hover:bg-slate-800/60 transition-all duration-200 hover:border-slate-600">
                {/* Comment Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        {article.authorId?.avatar ? (
                            <img
                                src={getCloudinaryImage(article.authorId?.avatar)}
                                alt={`${article.authorId?.name}'s avatar`}
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

                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-white truncate">{comment.author}</p>
                            <p className="text-xs text-slate-400">{comment.date}</p>
                        </div>
                    </div>

                    {/* Like Button */}
                    <button
                        onClick={() => {
                            const newLiked = new Set(likedComments)
                            if (isLiked) {
                                newLiked.delete(comment.id)
                            } else {
                                newLiked.add(comment.id)
                            }
                            setLikedComments(newLiked)
                        }}
                        className="shrink-0 p-2 rounded-md hover:bg-slate-700/50 transition-colors duration-200"
                        aria-label="Like comment"
                    >
                        <Heart
                            size={16}
                            className={`transition-all duration-200 ${isLiked ? "fill-red-500 text-red-500" : "text-slate-400 hover:text-red-400"
                                }`}
                        />
                    </button>
                </div>

                {/* Comment Content */}
                <p className="text-sm text-slate-300 leading-relaxed mb-3 line-clamp-3">{comment.content}</p>

                {/* Comment Footer */}
                <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                        {currentLikes} {currentLikes === 1 ? "like" : "likes"}
                    </span>
                    <button className="text-slate-400 hover:text-slate-300 font-medium transition-colors duration-200">
                        Reply
                    </button>
                </div>
            </div>
        )
    }

    const CommentsContent = () => (
        <div className="flex flex-col gap-3">
            {comments.length > 0 ? (
                comments.map((comment) => <CommentCard key={comment.id} comment={comment} />)
            ) : (
                <div className="py-12 text-center">
                    <p className="text-sm text-slate-400">No comments yet. Be the first to comment!</p>
                </div>
            )}
        </div>
    )

    if (isLoading) return <Loader2 className="animate-spin" />


    return (
        <div className="min-h-screen bg-slate-900">
            <style>{`
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: rgb(15, 23, 42);
        }
        ::-webkit-scrollbar-thumb {
          background: rgb(71, 85, 105);
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgb(100, 116, 139);
        }
        * {
          scrollbar-color: rgb(71, 85, 105) rgb(15, 23, 42);
          scrollbar-width: thin;
        }
      `}</style>


            {/* Header */}
            <header className="sticky top-0 z-40 border-b border-slate-700 bg-slate-900/95 backdrop-blur-sm">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex gap-3 items-center justify-center">
                            <MoveLeft size={20} className="text-white cursor-pointer" onClick={()=>navigate('/home')} />
                            <div className="text-xs sm:text-sm font-medium text-slate-300">{article.category}</div> 
                        </div>


                        <div className="flex items-center gap-1">
                            <button
                                className="p-2 rounded-lg flex items-center gap-2  text-slate-400 hover:bg-slate-800 hover:text-blue-400 transition-colors duration-200"
                                aria-label="Like article"
                            >
                                <View
                                    size={20}
                                    className={"transition-all duration-200 "}
                                />
                                <span className="text-xs sm:text-sm font-medium">{article.views}</span>
                            </button>

                            <button
                                onClick={() => setLiked(!liked)}
                                className="p-2 rounded-lg hover:bg-slate-800 transition-colors duration-200"
                                aria-label="Like article"
                            >
                                <Heart
                                    size={20}
                                    className={`transition-all duration-200 ${liked ? "fill-red-500 text-red-500" : "text-slate-400 hover:text-red-400"
                                        }`}
                                />
                            </button>
                            <button
                                onClick={() => setCommentsOpen(!commentsOpen)}
                                className={`p-2 rounded-lg flex items-center gap-2 transition-colors duration-200 ${commentsOpen
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

            {/* Main Content */}
            <div className="flex gap-0 relative">
                {/* Center Article */}
                <div className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
                    {/* Article Header */}
                    <div className="mb-6 sm:mb-8">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-3 sm:mb-4 text-white">
                            {article.title}
                        </h1>
                        <p className="text-lg sm:text-xl text-slate-300 mb-4 leading-relaxed">{article.about}</p>
                        <div className="flex items-center gap-3 flex-wrap">
                            {article.authorId?.avatar ? (
                                <img
                                    src={getCloudinaryImage(article.authorId?.avatar)}
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
                                <p className="text-slate-400 text-xs sm:text-sm">{formatDistanceToNow(article.createdAt, { addSuffix: true })}</p>
                            </div>
                        </div>
                    </div>

                    <article className="text-slate-200 leading-relaxed text-base sm:text-lg">
                        <style>{`
              .article-content h2 { 
                font-size: clamp(24px, 5vw, 28px); 
                font-weight: 700; 
                margin: clamp(24px, 6vw, 32px) 0 clamp(12px, 3vw, 16px) 0; 
                color: white; 
              }
              .article-content h3 { 
                font-size: clamp(20px, 4vw, 24px); 
                font-weight: 600; 
                margin: clamp(20px, 4vw, 24px) 0 clamp(10px, 2vw, 12px) 0; 
                color: white; 
              }
              .article-content h4 { 
                font-size: clamp(16px, 2.5vw, 18px); 
                font-weight: 600; 
                margin: clamp(16px, 3vw, 20px) 0 clamp(8px, 2vw, 10px) 0; 
                color: white; 
              }
              .article-content p { 
                margin: clamp(12px, 2vw, 16px) 0; 
                color: rgb(209, 213, 219); 
              }
              .article-content ul { 
                list-style: disc; 
                padding-left: clamp(20px, 5vw, 28px); 
                margin: clamp(12px, 2vw, 16px) 0; 
              }
              .article-content ol { 
                list-style: decimal; 
                padding-left: clamp(20px, 5vw, 28px); 
                margin: clamp(12px, 2vw, 16px) 0; 
              }
              .article-content li { 
                margin: clamp(6px, 1vw, 8px) 0; 
                color: rgb(209, 213, 219); 
              }
              .article-content blockquote { 
                border-left: 4px solid rgb(96, 165, 250); 
                padding-left: clamp(12px, 3vw, 16px); 
                font-style: italic; 
                color: rgb(156, 163, 175); 
                margin: clamp(16px, 3vw, 24px) 0; 
              }
              .article-content pre { 
                background: rgb(30, 41, 59); 
                border: 1px solid rgb(71, 85, 105); 
                border-radius: 8px; 
                padding: clamp(12px, 2vw, 16px); 
                overflow-x: auto; 
                margin: clamp(16px, 3vw, 24px) 0; 
              }
              .article-content code { 
                background: rgb(30, 41, 59); 
                color: rgb(253, 224, 71); 
                padding: 2px 6px; 
                border-radius: 4px; 
                font-family: monospace; 
                font-size: clamp(13px, 1.5vw, 14px);
              }
              .article-content pre code { 
                background: transparent; 
                color: rgb(209, 213, 219); 
                padding: 0; 
              }
              .article-content a { 
                color: rgb(96, 165, 250); 
                text-decoration: none; 
              }
              .article-content a:hover { 
                text-decoration: underline; 
              }
              .article-content hr { 
                border: none; 
                border-top: 1px solid rgb(55, 65, 81); 
                margin: clamp(24px, 5vw, 32px) 0; 
              }
              .article-content img { 
                max-width: 100%; 
                height: auto; 
                border-radius: 8px; 
                margin: clamp(16px, 3vw, 24px) 0; 
              }
            `}</style>
                        <div className="article-content" dangerouslySetInnerHTML={{ __html: article.content }} />
                    </article>

                    {/* Suggested Articles */}
                    <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-slate-700">
                        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-white">Recommended Reading</h2>
                        <div className="flex flex-col gap-3">
                            {recomendations.map((suggestedArticle: any) => (
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
                                            <span>{suggestedArticle?.authorId?.name}</span>
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

                {/* Desktop Comments Sidebar */}
                {!isMobile && commentsOpen && (
                    <div className="w-80 border-l border-slate-700 bg-slate-900 p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-64px)] sticky top-16">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg sm:text-xl font-bold text-white">Comments ({comments.length})</h2>
                            <button
                                onClick={() => setCommentsOpen(false)}
                                className="p-1 rounded-lg hover:bg-slate-800 transition-colors duration-200 text-slate-400 hover:text-white shrink-0"
                                aria-label="Close comments"
                            >
                                <X size={20} />
                            </button>
                        </div>
                        <CommentsContent />
                    </div>
                )}
                {/* Mobile Comments Modal Drawer */}
                {isMobile && commentsOpen && (
                    <>
                        {/* Backdrop */}
                        <div onClick={() => setCommentsOpen(false)} className="fixed inset-0 bg-black/60 z-40 animate-in fade-in" />
                        {/* Drawer */}
                        <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 rounded-t-2xl max-h-[85vh] overflow-y-auto z-50 animate-in slide-in-from-bottom">
                            <div className="p-4 sm:p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-bold text-white">Comments ({comments.length})</h2>
                                    <button
                                        onClick={() => setCommentsOpen(false)}
                                        className="p-1 rounded-lg hover:bg-slate-800 transition-colors duration-200 text-slate-400 hover:text-white"
                                        aria-label="Close comments"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                                <CommentsContent />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
