import type React from "react"
import { useCallback, useRef, useState } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Placeholder from "@tiptap/extension-placeholder"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import TextAlign from "@tiptap/extension-text-align"
import Heading from "@tiptap/extension-heading"
import HorizontalRule from "@tiptap/extension-horizontal-rule"
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading2,
  List,
  ListOrdered,
  Quote,
  LinkIcon,
  Undo2,
  Redo2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ImageIcon,
  ChevronDown,
  X,
  Loader,
  Trash2,
  Minus,
} from "lucide-react"

interface TipTapEditorProps {
  value: string
  onChange: (value: string) => void
}

export default function TipTapEditor({ value, onChange }: TipTapEditorProps) {
  const [isHeadingOpen, setIsHeadingOpen] = useState(false)
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const [selectedImageNode, setSelectedImageNode] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [linkUrl, setLinkUrl] = useState("")
  const [linkError, setLinkError] = useState("")

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Heading.configure({
        levels: [1, 2, 3, 4, 5],
      }),
      Placeholder.configure({
        placeholder: "Start typing your article...",
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
      Image.configure({
        allowBase64: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      HorizontalRule.configure({
        HTMLAttributes: {
          class: "my-4 border-t-2 border-slate-600",
        },
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    onSelectionUpdate: ({ editor }) => {
      const { $from } = editor.state.selection
      const node = $from.nodeAfter
      if (node?.type.name === "image") {
        setSelectedImageNode(node)
      } else {
        setSelectedImageNode(null)
      }
    },
  })

  const isValidUrl = (urlString: string): boolean => {
    try {
      const url = new URL(urlString.startsWith("http") ? urlString : `https://${urlString}`)
      return url.protocol === "http:" || url.protocol === "https:"
    } catch {
      return false
    }
  }

  const handleAddLink = () => {
    setLinkUrl("")
    setLinkError("")
    setIsLinkModalOpen(true)
  }

  const handleConfirmLink = useCallback(() => {
    if (!linkUrl.trim()) {
      setLinkError("URL cannot be empty")
      return
    }

    if (!isValidUrl(linkUrl)) {
      setLinkError("Please enter a valid URL (e.g., https://example.com)")
      return
    }

    if (editor) {
      const urlToAdd = linkUrl.startsWith("http") ? linkUrl : `https://${linkUrl}`
      editor.chain().focus().extendMarkRange("link").setLink({ href: urlToAdd }).run()
      setIsLinkModalOpen(false)
      setLinkUrl("")
      setLinkError("")
    }
  }, [linkUrl, editor])

  const handleAddImage = () => {
    fileInputRef.current?.click()
  }

  const handleDeleteImage = () => {
    if (editor && selectedImageNode) {
      editor.chain().focus().deleteSelection().run()
      setSelectedImageNode(null)
    }
  }

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file || !editor) return

      setImageLoading(true)
      try {
        const reader = new FileReader()
        reader.onload = (event) => {
          const base64 = event.target?.result as string
          editor.chain().focus().setImage({ src: base64, alt: file.name }).run()
          setImageLoading(false)
        }
        reader.onerror = () => {
          setImageLoading(false)
          alert("Failed to read image file")
        }
        reader.readAsDataURL(file)
      } catch  {
        setImageLoading(false)
        alert("Failed to process image")
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    },
    [editor],
  )

  const ToolbarButton = ({
    onClick,
    isActive,
    children,
    title,
    disabled,
  }: {
    onClick: () => void
    isActive?: boolean
    children: React.ReactNode
    title: string
    disabled?: boolean
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`px-2.5 py-2 rounded-md transition-all duration-150 flex items-center justify-center ${
        disabled
          ? "opacity-50 cursor-not-allowed"
          : isActive
            ? "bg-slate-700 text-white"
            : "text-slate-300 hover:text-white hover:bg-slate-700/60"
      }`}
    >
      {children}
    </button>
  )

  const Separator = () => <div className="w-px h-6 bg-slate-600 mx-1"></div>

  const undo = () => editor?.chain().focus().undo().run()
  const redo = () => editor?.chain().focus().redo().run()
  const alignLeft = () => editor?.chain().focus().setTextAlign("left").run()
  const alignCenter = () => editor?.chain().focus().setTextAlign("center").run()
  const alignRight = () => editor?.chain().focus().setTextAlign("right").run()

  const setHeading = (level: 1 | 2 | 3 | 4 | 5) => {
    editor?.chain().focus().toggleHeading({ level }).run()
    setIsHeadingOpen(false)
  }

  const toggleBold = () => editor?.chain().focus().toggleBold().run()
  const toggleItalic = () => editor?.chain().focus().toggleItalic().run()
  const toggleStrike = () => editor?.chain().focus().toggleStrike().run()
  const toggleBulletList = () => editor?.chain().focus().toggleBulletList().run()
  const toggleOrderedList = () => editor?.chain().focus().toggleOrderedList().run()
  const toggleBlockquote = () => editor?.chain().focus().toggleBlockquote().run()
  const toggleCodeBlock = () => editor?.chain().focus().toggleCodeBlock().run()

  const insertSeparator = () => editor?.chain().focus().setHorizontalRule().run()

  if (!editor) {
    return null
  }

  return (
    <div className="w-full">
      <div className="sticky top-0 z-40 bg-slate-900 border border-b border-slate-700 rounded-t-lg p-3 flex flex-wrap items-center gap-1 shadow-lg">
        <ToolbarButton onClick={undo} title="Undo">
          <Undo2 className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton onClick={redo} title="Redo">
          <Redo2 className="w-4 h-4" />
        </ToolbarButton>

        <Separator />

        <div className="relative">
          <button
            onClick={() => setIsHeadingOpen(!isHeadingOpen)}
            title="Heading"
            className={`px-2.5 py-2 rounded-md transition-all duration-150 flex items-center justify-center gap-1 ${
              editor.isActive("heading")
                ? "bg-slate-700 text-white"
                : "text-slate-300 hover:text-white hover:bg-slate-700/60"
            }`}
          >
            <Heading2 className="w-4 h-4" />
            <ChevronDown className="w-3 h-3" />
          </button>

          {isHeadingOpen && (
            <div className="absolute top-full left-0 mt-1 bg-slate-800 border border-slate-700 rounded-md shadow-lg z-50">
              <button
                onClick={() => {
                  editor.chain().focus().setParagraph().run()
                  setIsHeadingOpen(false)
                }}
                className={`w-full px-4 py-2 text-left text-sm ${
                  editor.isActive("paragraph")
                    ? "bg-slate-700 text-white"
                    : "text-slate-300 hover:bg-slate-700 hover:text-white"
                }`}
              >
                Paragraph
              </button>
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => setHeading(level as 1 | 2 | 3 | 4 | 5)}
                  className={`w-full px-4 py-2 text-left text-sm ${
                    editor.isActive("heading", { level })
                      ? "bg-slate-700 text-white"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white"
                  }`}
                >
                  {level === 1 && "H1 - Heading 1"}
                  {level === 2 && "H2 - Heading 2"}
                  {level === 3 && "H3 - Heading 3"}
                  {level === 4 && "H4 - Heading 4"}
                  {level === 5 && "H5 - Heading 5"}
                </button>
              ))}
            </div>
          )}
        </div>

        <Separator />

        <ToolbarButton onClick={toggleBulletList} isActive={editor.isActive("bulletList")} title="Bullet List">
          <List className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton onClick={toggleOrderedList} isActive={editor.isActive("orderedList")} title="Ordered List">
          <ListOrdered className="w-4 h-4" />
        </ToolbarButton>

        <Separator />

        <ToolbarButton onClick={toggleBold} isActive={editor.isActive("bold")} title="Bold">
          <Bold className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton onClick={toggleItalic} isActive={editor.isActive("italic")} title="Italic">
          <Italic className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton onClick={toggleStrike} isActive={editor.isActive("strike")} title="Strikethrough">
          <Strikethrough className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton onClick={toggleCodeBlock} isActive={editor.isActive("codeBlock")} title="Code Block">
          <Code className="w-4 h-4" />
        </ToolbarButton>

        <Separator />

        <ToolbarButton onClick={toggleBlockquote} isActive={editor.isActive("blockquote")} title="Quote">
          <Quote className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton onClick={insertSeparator} title="Add Separator Line">
          <Minus className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton onClick={handleAddLink} title="Add Link">
          <LinkIcon className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton onClick={handleAddImage} disabled={imageLoading} title="Add Image">
          {imageLoading ? <Loader className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
        </ToolbarButton>

        {selectedImageNode && (
          <>
            <Separator />
            <ToolbarButton onClick={handleDeleteImage} title="Delete Image" isActive={true}>
              <Trash2 className="w-4 h-4" />
            </ToolbarButton>
          </>
        )}

        <Separator />

        <ToolbarButton onClick={alignLeft} isActive={editor.isActive({ textAlign: "left" })} title="Align Left">
          <AlignLeft className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton onClick={alignCenter} isActive={editor.isActive({ textAlign: "center" })} title="Align Center">
          <AlignCenter className="w-4 h-4" />
        </ToolbarButton>

        <ToolbarButton onClick={alignRight} isActive={editor.isActive({ textAlign: "right" })} title="Align Right">
          <AlignRight className="w-4 h-4" />
        </ToolbarButton>
      </div>

      <div className="bg-slate-900/50 border border-t-0 border-slate-700 rounded-b-lg overflow-hidden editor-content-wrapper">
        <style>{`
          .editor-content-wrapper .ProseMirror {
            outline: none !important;
            border: none !important;
          }
          .editor-content-wrapper .ProseMirror:focus {
            outline: none !important;
            border: none !important;
            box-shadow: none !important;
          }
          .editor-content-wrapper .ProseMirror h1 {
            font-size: 2.25rem;
            font-weight: 700;
            margin-top: 0.67em;
            margin-bottom: 0.67em;
            line-height: 1.2;
            color: inherit;
          }
          .editor-content-wrapper .ProseMirror h2 {
            font-size: 1.875rem;
            font-weight: 700;
            margin-top: 0.75em;
            margin-bottom: 0.75em;
            line-height: 1.2;
            color: inherit;
          }
          .editor-content-wrapper .ProseMirror h3 {
            font-size: 1.5rem;
            font-weight: 700;
            margin-top: 0.89em;
            margin-bottom: 0.89em;
            line-height: 1.2;
            color: inherit;
          }
          .editor-content-wrapper .ProseMirror h4 {
            font-size: 1.25rem;
            font-weight: 700;
            margin-top: 1em;
            margin-bottom: 1em;
            line-height: 1.2;
            color: inherit;
          }
          .editor-content-wrapper .ProseMirror h5 {
            font-size: 1.1rem;
            font-weight: 700;
            margin-top: 1.17em;
            margin-bottom: 1.17em;
            line-height: 1.2;
            color: inherit;
          }
          .editor-content-wrapper .ProseMirror p {
            margin-bottom: 1rem;
          }
          /* Improve bullet list visibility with better colors and styling */
          .editor-content-wrapper .ProseMirror ul {
            margin-left: 1.5rem;
            margin-bottom: 1rem;
            list-style-type: disc;
          }
          .editor-content-wrapper .ProseMirror ol {
            margin-left: 1.5rem;
            margin-bottom: 1rem;
            list-style-type: decimal;
          }
          .editor-content-wrapper .ProseMirror li {
            margin-bottom: 0.5rem;
            color: #e2e8f0;
            line-height: 1.6;
          }
          .editor-content-wrapper .ProseMirror ul li::marker {
            color: #60a5fa;
            font-weight: 600;
          }
          .editor-content-wrapper .ProseMirror ol li::marker {
            color: #60a5fa;
            font-weight: 600;
          }
          .editor-content-wrapper .ProseMirror blockquote {
            border-left: 4px solid #3f46e1;
            margin-left: 0;
            padding-left: 1rem;
            font-style: italic;
            color: #cbd5e1;
            margin-bottom: 1rem;
          }
          .editor-content-wrapper .ProseMirror code {
            background-color: #1e293b;
            padding: 0.2em 0.4em;
            border-radius: 3px;
            font-family: monospace;
            color: #f1f5f9;
          }
          .editor-content-wrapper .ProseMirror pre {
            background-color: #1e293b;
            padding: 1rem;
            border-radius: 6px;
            overflow-x: auto;
            margin-bottom: 1rem;
          }
          .editor-content-wrapper .ProseMirror pre code {
            background-color: transparent;
            padding: 0;
            color: #f1f5f9;
          }
          .editor-content-wrapper .ProseMirror img {
            max-width: 100%;
            height: auto;
            border-radius: 6px;
            margin: 1rem 0;
            cursor: pointer;
          }
          .editor-content-wrapper .ProseMirror a {
            color: #60a5fa;
            text-decoration: underline;
            cursor: pointer;
          }
          .editor-content-wrapper .ProseMirror a:hover {
            color: #93c5fd;
          }
        `}</style>
        <EditorContent editor={editor} className="p-6 text-slate-200 leading-relaxed min-h-96" />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        aria-label="Upload image"
      />

      {isLinkModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 max-w-sm w-full">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Add Link</h2>
              <button
                onClick={() => setIsLinkModalOpen(false)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <input
              type="text"
              placeholder="https://example.com"
              value={linkUrl}
              onChange={(e) => {
                setLinkUrl(e.target.value)
                setLinkError("")
              }}
              onKeyPress={(e) => e.key === "Enter" && handleConfirmLink()}
              autoFocus
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder:text-slate-400 focus:outline-none focus:border-blue-500 mb-4"
            />
            {linkError && <p className="text-red-400 text-sm mb-4">{linkError}</p>}
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setIsLinkModalOpen(false)}
                className="px-4 py-2 text-slate-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLink}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Add Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}














