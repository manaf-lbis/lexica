import { useState } from "react"
import { useNavigate } from "react-router-dom"

interface Article {
  id: string
  title: string
  category: string
  date: string
  views: number
  isBlocked: boolean
}

const mockArticles: Article[] = [
  {
    id: "1",
    title: "Getting Started with React Hooks",
    category: "Development",
    date: "Nov 8, 2024",
    views: 1243,
    isBlocked: false,
  },
  {
    id: "2",
    title: "Understanding Web Performance",
    category: "Performance",
    date: "Nov 5, 2024",
    views: 892,
    isBlocked: false,
  },
  {
    id: "3",
    title: "CSS Grid vs Flexbox",
    category: "CSS",
    date: "Nov 1, 2024",
    views: 2105,
    isBlocked: true,
  },
  {
    id: "4",
    title: "TypeScript Best Practices",
    category: "Development",
    date: "Oct 28, 2024",
    views: 756,
    isBlocked: false,
  },
  {
    id: "5",
    title: "Next.js 15 Features Deep Dive",
    category: "Development",
    date: "Oct 22, 2024",
    views: 3421,
    isBlocked: false,
  },
  {
    id: "6",
    title: "Mastering State Management",
    category: "Architecture",
    date: "Oct 18, 2024",
    views: 1567,
    isBlocked: false,
  },
]

export default function MyArticles() {
  const [articles, setArticles] = useState<Article[]>(mockArticles);
  const navigate = useNavigate();

  const handleBlock = (id: string) => {
    setArticles(
      articles.map((article) => (article.id === id ? { ...article, isBlocked: !article.isBlocked } : article)),
    )
  }

  const handleEdit = (id: string) => {
    console.log("Editing article:", id)
  }

  const handleView = (id: string) => {
    console.log("Viewing article:", id)
  }

  const totalViews = articles.reduce((sum, article) => sum + article.views, 0)
  const blockedCount = articles.filter((article) => article.isBlocked).length

  return (
    <main className="min-h-screen bg-slate-950 text-slate-50 p-6 md:p-12">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">My Articles</h1>
            <p className="text-slate-400">Manage and organize your content</p>
          </div>
          <button onClick={()=>navigate('/write')} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
            New Article
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <p className="text-slate-400 text-sm mb-1">Total Articles</p>
            <p className="text-3xl font-bold">{articles.length}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <p className="text-slate-400 text-sm mb-1">Total Views</p>
            <p className="text-3xl font-bold">{totalViews.toLocaleString()}</p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <p className="text-slate-400 text-sm mb-1">Blocked</p>
            <p className="text-3xl font-bold">{blockedCount}</p>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-3">
          {articles.map((article) => (
            <div
              key={article.id}
              className={`group border rounded-lg p-5 transition-all hover:border-slate-600 ${
                article.isBlocked
                  ? "bg-slate-900/50 border-slate-800 opacity-60"
                  : "bg-slate-900 border-slate-800 hover:bg-slate-800"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Content */}
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
                    <span>{article.date}</span>
                    <span className="flex items-center gap-1">{article.views.toLocaleString()} views</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleView(article.id)}
                    className="px-3 py-1.5 text-sm bg-slate-800 hover:bg-slate-700 text-slate-300 rounded transition-colors"
                    title="View article"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(article.id)}
                    className="px-3 py-1.5 text-sm bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded transition-colors"
                    title="Edit article"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleBlock(article.id)}
                    className={`px-3 py-1.5 text-sm rounded transition-colors ${
                      article.isBlocked
                        ? "bg-green-600/20 hover:bg-green-600/30 text-green-400"
                        : "bg-red-600/20 hover:bg-red-600/30 text-red-400"
                    }`}
                    title={article.isBlocked ? "Unblock article" : "Block article"}
                  >
                    {article.isBlocked ? "Unblock" : "Block"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
