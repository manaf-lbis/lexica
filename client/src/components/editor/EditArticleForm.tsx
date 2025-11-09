import { useState } from "react"
import { Save, Eye, EyeOff } from "lucide-react"
import TipTapEditor from "./TipTapEditor"
interface Article {
  id?: string
  title: string
  about: string
  content: string
  category: string
  isPublished: boolean
}

interface EditArticleFormProps {
  article: Article
}

export default function EditArticleForm({ article }: EditArticleFormProps) {
  const [title, setTitle] = useState(article.title)
  const [about, setAbout] = useState(article.about)
  const [category, setCategory] = useState(article.category)
  const [content, setContent] = useState(article.content)
  const [isPreview, setIsPreview] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const categories = ["Technology", "Development", "Backend", "Frontend", "DevOps", "Other"]

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    alert("Article updated successfully!")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Edit Article</h1>
        <p className="text-slate-400">Update and refine your article content</p>
      </div>

      {/* Form Section */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Article Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors text-lg font-semibold"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">about</label>
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            rows={2}
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500 transition-colors resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-slate-800">
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Editor Section */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-slate-300">Content</label>
          <button
            onClick={() => setIsPreview(!isPreview)}
            className="flex items-center gap-2 px-3 py-1 text-xs text-slate-400 hover:text-white transition-colors"
          >
            {isPreview ? (
              <>
                <Eye className="w-4 h-4" />
                Edit
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4" />
                Preview
              </>
            )}
          </button>
        </div>

        {isPreview ? (
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 prose prose-invert max-w-none">
            <style>{`
              .preview-content h1 {
                font-size: 2.25rem;
                font-weight: 700;
                margin-top: 0.67em;
                margin-bottom: 0.67em;
                line-height: 1.2;
                color: inherit;
              }
              .preview-content h2 {
                font-size: 1.875rem;
                font-weight: 700;
                margin-top: 0.75em;
                margin-bottom: 0.75em;
                line-height: 1.2;
                color: inherit;
              }
              .preview-content h3 {
                font-size: 1.5rem;
                font-weight: 700;
                margin-top: 0.89em;
                margin-bottom: 0.89em;
                line-height: 1.2;
                color: inherit;
              }
              .preview-content h4 {
                font-size: 1.25rem;
                font-weight: 700;
                margin-top: 1em;
                margin-bottom: 1em;
                line-height: 1.2;
                color: inherit;
              }
              .preview-content h5 {
                font-size: 1.1rem;
                font-weight: 700;
                margin-top: 1.17em;
                margin-bottom: 1.17em;
                line-height: 1.2;
                color: inherit;
              }
              .preview-content p {
                margin-bottom: 1rem;
              }
              .preview-content ul, .preview-content ol {
                margin-left: 1.5rem;
                margin-bottom: 1rem;
              }
              .preview-content li {
                margin-bottom: 0.25rem;
              }
              .preview-content blockquote {
                border-left: 4px solid #3f46e1;
                margin-left: 0;
                padding-left: 1rem;
                font-style: italic;
                color: #cbd5e1;
                margin-bottom: 1rem;
              }
              .preview-content code {
                background-color: #1e293b;
                padding: 0.2em 0.4em;
                border-radius: 3px;
                font-family: monospace;
                color: #f1f5f9;
              }
              .preview-content pre {
                background-color: #1e293b;
                padding: 1rem;
                border-radius: 6px;
                overflow-x: auto;
                margin-bottom: 1rem;
              }
              .preview-content pre code {
                background-color: transparent;
                padding: 0;
                color: #f1f5f9;
              }
              .preview-content img {
                max-width: 100%;
                height: auto;
                border-radius: 6px;
                margin: 1rem 0;
              }
              .preview-content a {
                color: #60a5fa;
                text-decoration: underline;
                cursor: pointer;
              }
              .preview-content a:hover {
                color: #93c5fd;
              }
            `}</style>
            <div
              dangerouslySetInnerHTML={{ __html: content }}
              className="preview-content text-slate-200 leading-relaxed"
            />
          </div>
        ) : (
          <TipTapEditor value={content} onChange={setContent} />
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-6 border-t border-slate-700">
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-lg transition-all duration-300 transform hover:shadow-lg hover:shadow-blue-500/30"
        >
          <Save className="w-4 h-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  )
}
