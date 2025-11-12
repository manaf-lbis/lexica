import { useState } from "react";
import { Send, Eye, EyeOff } from "lucide-react";
import TipTapEditor from "./TipTapEditor";
import { useGetCategoriesQuery, usePublishMutation } from "../../api/articleApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useArticleValidation } from "../../hooks/useArticleValidation";

export default function NewArticleForm() {
  const [title, setTitle] = useState("");
  const [about, setAbout] = useState("");
  const [category, setCategory] = useState("Technology");
  const [content, setContent] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const { data: categories, isLoading } = useGetCategoriesQuery({});
  const [publish, { isLoading: isPublishing }] = usePublishMutation();
  const navigate = useNavigate();
  const { errors, isValid, handleBlur, handleChange } = useArticleValidation(title, about);

  const handlePublish = async () => {
    try {
      await publish({ title, about, content, category }).unwrap();
      toast.success("Article published successfully.");
      navigate(`/my-articles`, { replace: true });
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to publish article. Please try again.");
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Article Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              handleChange("title");
            }}
            onBlur={() => handleBlur("title")}
            placeholder="What's on your mind?"
            className={`w-full px-4 py-3 bg-slate-800/50 border ${
              errors.title ? "border-red-500" : "border-slate-700"
            } rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors text-lg font-semibold`}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">About</label>
          <textarea
            value={about}
            onChange={(e) => {
              setAbout(e.target.value);
              handleChange("about");
            }}
            onBlur={() => handleBlur("about")}
            placeholder="A brief summary of your article..."
            rows={2}
            className={`w-full px-4 py-3 bg-slate-800/50 border ${
              errors.about ? "border-red-500" : "border-slate-700"
            } rounded-lg text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 transition-colors resize-none`}
          />
          {errors.about && <p className="text-red-500 text-sm mt-1">{errors.about}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
          >
            {categories.map((cat: string) => (
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
          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-6 prose prose-invert max-w-none">
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
          onClick={handlePublish}
          disabled={isPublishing || !isValid}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all duration-300 transform hover:shadow-lg hover:shadow-blue-500/30"
        >
          <Send className="w-4 h-4" />
          {isPublishing ? "Publishing..." : "Publish"}
        </button>
      </div>
    </div>
  );
}