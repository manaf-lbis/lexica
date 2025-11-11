import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Plus } from "lucide-react"
import Footer from "../components/Footer"
import ArticleCard from "../components/ArticleCard"
import { useGetCategoriesQuery, useTrendingArticlesQuery } from "../api/articleApi"
import { getCoverImage } from "../utils/getCoverImage"
import { getCloudinaryImage } from "../utils/cloudinaryUrl"
import { formatDistanceToNow } from "date-fns"

const HomePage: React.FC = () => {

  const [likedArticles, setLikedArticles] = useState<Set<number>>(new Set())
  const [bookmarkedArticles, setBookmarkedArticles] = useState<Set<number>>(new Set())
  const { data: categories } = useGetCategoriesQuery({});
  const { data: trendingArticles } = useTrendingArticlesQuery({});
  const navigate = useNavigate();



  const toggleLike = (articleId: number) => {
    const newLiked = new Set(likedArticles)
    if (newLiked.has(articleId)) {
      newLiked.delete(articleId)
    } else {
      newLiked.add(articleId)
    }
    setLikedArticles(newLiked)
  }

  const toggleBookmark = (articleId: number) => {
    const newBookmarked = new Set(bookmarkedArticles)
    if (newBookmarked.has(articleId)) {
      newBookmarked.delete(articleId)
    } else {
      newBookmarked.add(articleId)
    }
    setBookmarkedArticles(newBookmarked)
  }

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

        {/* Category Tags */}
        <div className="flex flex-wrap gap-2 mb-12 sm:mb-16 justify-center">
          {categories && categories.map((category: string) => (
            <button
              key={category}
              className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium text-sm ${category === "All"
                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {trendingArticles && trendingArticles.map((article: any) => (
            <ArticleCard
              key={article._id}
              article={{
                _id: article._id,
                title: article.title,
                about: article.about,
                author: article.authorId?.name,
                avatar: getCloudinaryImage(article.authorId?.avatar),
                category: article.category,
                date: formatDistanceToNow(new Date(article.createdAt), { addSuffix: true }),
                likes: article.likes,
                coverImage: getCoverImage(article.content),
              }}
              isLiked={likedArticles.has(article.id)}
              isBookmarkedArticles={bookmarkedArticles.has(article.id)}
              toggleBookmark={() => toggleBookmark(article.id)}
              toggleLike={() => toggleLike(article.id)}
              onCommentClick={() => console.log("Comment Click")}
              onClick={() => navigate(`/article/${article._id}`)}
            />
          ))}
        </div>

        {/* For You Section */}
        <div className="mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8">For You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* {forYouArticles.map((article) => (
              <ArticleCard
                article={{
                  _id: article.id + '',
                  title: article.title,
                  about: article.about,
                  author: article.author,
                  avatar: article.avatar,
                  category: article.category,
                  date: article.date,
                  likes: article.likes,
                }}
                isLiked={likedArticles.has(article.id)}
                isBookmarkedArticles={bookmarkedArticles.has(article.id)}
                toggleBookmark={() => toggleBookmark(article.id)}
                toggleLike={() => toggleLike(article.id)}
                onCommentClick={() => console.log("Comment Click")}
              />
            ))} */}
          </div>
        </div>

        {/* Load More */}
        <div className="flex justify-center mb-12">
          <button className="px-8 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold rounded-lg transition-all duration-300">
            Load More Articles
          </button>
        </div>
      </main>

      <Footer />
    </div>
  )
}


export default HomePage