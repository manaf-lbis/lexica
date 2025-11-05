import type React from "react";
import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Heart, MessageCircle, Bookmark, ArrowLeft } from "lucide-react";
import Footer from "../components/Footer";

interface Article {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  avatar: string;
  category: string;
  date: string;
  readTime: number;
  likes: number;
  liked: boolean;
}

const allArticles: Article[] = [
  {
    id: 1,
    title: "The Future of Web Development: 2025 Trends You Need to Know",
    excerpt: "Explore the emerging technologies and frameworks that are reshaping how we build web applications.",
    author: "Sarah Chen",
    avatar: "/professional-avatar-woman.jpg",
    category: "Technology",
    date: "Nov 2, 2025",
    readTime: 8,
    likes: 234,
    liked: false,
  },
  {
    id: 2,
    title: "Mastering React: Advanced Patterns for Production Applications",
    excerpt: "Deep dive into advanced React patterns that will level up your application architecture.",
    author: "Alex Kumar",
    avatar: "/professional-avatar-man.jpg",
    category: "Development",
    date: "Oct 30, 2025",
    readTime: 12,
    likes: 567,
    liked: false,
  },
  {
    id: 3,
    title: "Building Scalable APIs: From Concept to Production",
    excerpt: "Learn best practices for designing and implementing APIs that scale with your business.",
    author: "Emma Wilson",
    avatar: "/professional-avatar-female.jpg",
    category: "Backend",
    date: "Oct 28, 2025",
    readTime: 10,
    likes: 432,
    liked: false,
  },
  {
    id: 4,
    title: "TypeScript Best Practices in 2025",
    excerpt: "Master TypeScript with these proven practices used by top companies.",
    author: "David Lee",
    avatar: "/professional-avatar-man.jpg",
    category: "Development",
    date: "Nov 1, 2025",
    readTime: 7,
    likes: 189,
    liked: false,
  },
  {
    id: 5,
    title: "DevOps Automation: Streamline Your Workflow",
    excerpt: "Automate your deployment pipeline and reduce manual errors significantly.",
    author: "Lisa Wong",
    avatar: "/professional-avatar-woman.jpg",
    category: "DevOps",
    date: "Oct 29, 2025",
    readTime: 11,
    likes: 298,
    liked: false,
  },
  {
    id: 6,
    title: "Frontend Performance Optimization Guide",
    excerpt: "Learn techniques to make your React apps blazing fast.",
    author: "James Miller",
    avatar: "/professional-avatar-man.jpg",
    category: "Frontend",
    date: "Oct 27, 2025",
    readTime: 9,
    likes: 356,
    liked: false,
  },
];

const ExplorePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [likedArticles, setLikedArticles] = useState<Set<number>>(new Set());
  const [bookmarkedArticles, setBookmarkedArticles] = useState<Set<number>>(new Set());
  const [filteredArticles, setFilteredArticles] = useState(allArticles);

  useEffect(() => {
    const query = searchParams.get("search") || "";
    const filtered = allArticles.filter((article) => {
      const matchesSearch =
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(query.toLowerCase()) ||
        article.author.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = selectedCategory === "All" || article.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredArticles(filtered);
  }, [selectedCategory, searchParams]);


  const toggleLike = (articleId: number) => {
    const newLiked = new Set(likedArticles);
    if (newLiked.has(articleId)) {
      newLiked.delete(articleId);
    } else {
      newLiked.add(articleId);
    }
    setLikedArticles(newLiked);
  };

  const toggleBookmark = (articleId: number) => {
    const newBookmarked = new Set(bookmarkedArticles);
    if (newBookmarked.has(articleId)) {
      newBookmarked.delete(articleId);
    } else {
      newBookmarked.add(articleId);
    }
    setBookmarkedArticles(newBookmarked);
  };

  const categories = ["All", "Technology", "Development", "Backend", "Frontend", "DevOps"];

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900">


      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            {searchParams.get("search") ? `Search results for "${searchParams.get("search")}"` : "Explore Articles"}
          </h1>
          <p className="text-slate-400">
            {filteredArticles.length} {filteredArticles.length === 1 ? "article" : "articles"} found
          </p>
        </div>
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg transition-all duration-300 font-medium text-sm ${category === selectedCategory
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                }`}
            >
              {category}
            </button>
          ))}
        </div>
        {/* Articles Grid or Empty State */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <article
                key={article.id}
                className="group bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 flex flex-col"
              >
                <div className="h-40 bg-linear-to-br from-blue-600/20 to-slate-700 group-hover:from-blue-600/30 group-hover:to-slate-600 transition-all duration-300 relative overflow-hidden flex items-center justify-center">
                  <div className="text-4xl opacity-20 group-hover:opacity-30 transition-opacity">✎</div>
                </div>
                <div className="p-4 sm:p-6 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={article.avatar || "/placeholder.svg"}
                      alt={article.author}
                      className="w-8 h-8 rounded-full bg-slate-700 object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-white truncate">{article.author}</p>
                      <p className="text-xs text-slate-400">{article.date}</p>
                    </div>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                    <Link to={`/article/${article.id}`}>{article.title}</Link>
                  </h3>
                  <p className="text-sm text-slate-400 mb-4 line-clamp-2 flex-1">{article.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-4 pb-4 border-b border-slate-700/50">
                    <span>{article.category}</span>
                    <span>{article.readTime} min read</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleLike(article.id)}
                        className="flex items-center gap-1 text-slate-400 hover:text-red-400 transition-colors"
                      >
                        <Heart className="w-4 h-4" fill={likedArticles.has(article.id) ? "currentColor" : "none"} />
                        <span className="text-xs">{article.likes}</span>
                      </button>
                      <button className="text-slate-400 hover:text-blue-400 transition-colors">
                        <MessageCircle className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => toggleBookmark(article.id)}
                      className="text-slate-400 hover:text-blue-400 transition-colors"
                    >
                      <Bookmark
                        className="w-4 h-4"
                        fill={bookmarkedArticles.has(article.id) ? "currentColor" : "none"}
                      />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-white mb-2">No articles found</h2>
            <p className="text-slate-400 mb-6">Try adjusting your search query or selecting different categories</p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        )}
      </main>
      <Footer />
      {/* Decorative blur */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}


export default ExplorePage