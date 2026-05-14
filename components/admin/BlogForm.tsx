"use client";

import { useState } from "react";
import { Blog, createBlog, updateBlog } from "@/lib/firestore";
import ImageUpload from "@/components/admin/ImageUpload";
import { AdminInput, AdminSelect, AdminButton, AdminCard } from "@/components/admin/AdminUI";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Columns, Monitor, FileText, ImageIcon, AlignLeft } from "lucide-react";
import RichTextEditor from "./RichTextEditor";

interface BlogFormProps {
  initialData?: Partial<Blog> & { id?: string };
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function BlogForm({ initialData }: BlogFormProps) {
  const router = useRouter();
  const isEdit = !!initialData?.id;

  const [title, setTitle] = useState(initialData?.title ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [subtitle, setSubtitle] = useState(initialData?.subtitle ?? "");
  const [author, setAuthor] = useState(initialData?.author ?? "");
  const [date, setDate] = useState(initialData?.date ?? new Date().toISOString().split("T")[0]);
  const [readTime, setReadTime] = useState(initialData?.readTime ?? "");
  const [featuredImage, setFeaturedImage] = useState(initialData?.featuredImage ?? "");
  const [status, setStatus] = useState<"draft" | "published">(initialData?.status ?? "draft");
  
  // Single HTML string content instead of blocks
  const [content, setContent] = useState<string>(initialData?.content ?? "");

  const [saving, setSaving] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!isEdit) setSlug(slugify(val));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) { toast.error("Title is required"); return; }
    if (!slug.trim()) { toast.error("Slug is required"); return; }

    setSaving(true);
    try {
      const payload: Omit<Blog, "id"> = {
        title: title.trim(),
        slug: slug.trim(),
        subtitle: subtitle.trim(),
        author: author.trim(),
        date,
        readTime: readTime.trim(),
        featuredImage,
        content,
        status,
      };

      if (isEdit && initialData?.id) {
        await updateBlog(initialData.id, payload);
        toast.success("Blog updated");
      } else {
        await createBlog(payload);
        toast.success("Blog created");
      }
      router.push("/admin/blogs");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  const renderPreview = () => (
    <div className="bg-white rounded-2xl p-6 lg:p-10 text-black min-h-screen">
      {/* Blog Metadata Preview */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">{title || "Blog Title"}</h1>
        {subtitle && <p className="text-xl text-gray-600 mb-6">{subtitle}</p>}
        <div className="flex items-center justify-center gap-4 text-sm font-semibold text-gray-500">
          {author && <span>By <span className="text-[#e3791d]">{author}</span></span>}
          {date && <span>{date}</span>}
          {readTime && <span>{readTime} read</span>}
        </div>
      </div>
      
      {featuredImage && (
        <div className="max-w-4xl mx-auto rounded-2xl overflow-hidden mb-12 shadow-lg">
          <img src={featuredImage} alt={title} className="w-full h-auto object-cover" />
        </div>
      )}

      {/* Dynamic Rich Text Preview */}
      <div 
        className="max-w-3xl mx-auto prose prose-lg prose-orange max-w-none prose-img:rounded-xl prose-img:shadow-md"
        dangerouslySetInnerHTML={{ __html: content || "<p class='text-gray-400 italic'>Content preview will appear here...</p>" }}
      />
    </div>
  );

  return (
    <div className="relative pb-24">
      <div className="flex items-center justify-between mb-6">
        <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
          <button
            type="button"
            onClick={() => setPreviewMode(false)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${!previewMode ? "bg-[#e3791d] text-white shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
          >
            <Columns size={16} />
            Editor
          </button>
          <button
            type="button"
            onClick={() => setPreviewMode(true)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-2 ${previewMode ? "bg-[#e3791d] text-white shadow-sm" : "text-gray-500 hover:text-gray-800"}`}
          >
            <Monitor size={16} />
            Preview
          </button>
        </div>
        <div className="flex items-center gap-3">
          <AdminButton type="button" variant="primary" size="md" loading={saving} onClick={handleSubmit}>
            {isEdit ? "Save Changes" : "Publish Blog"}
          </AdminButton>
        </div>
      </div>

      <div className={`grid grid-cols-1 ${previewMode ? "" : "lg:grid-cols-[1fr,1fr]"} gap-6`}>
        {/* EDITOR COLUMN */}
        <div className={`space-y-6 ${previewMode ? "hidden" : "block"}`}>
          <form id="blog-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Metadata */}
            <AdminCard className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 bg-orange-50 rounded-lg flex items-center justify-center">
                  <FileText size={14} className="text-[#e3791d]" />
                </div>
                <h2 className="text-gray-800 font-semibold text-sm">Blog Metadata</h2>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <AdminInput label="Title *" placeholder="Enter title…" value={title} onChange={(e) => handleTitleChange(e.target.value)} />
                <AdminInput label="Slug *" placeholder="url-friendly-slug" value={slug} onChange={(e) => setSlug(slugify(e.target.value))} />
                <AdminInput label="Subtitle" placeholder="A catchy subtitle…" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
                <AdminInput label="Author" placeholder="Author name" value={author} onChange={(e) => setAuthor(e.target.value)} />
                <AdminInput label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                <AdminInput label="Read Time" placeholder="e.g. 5 min" value={readTime} onChange={(e) => setReadTime(e.target.value)} />
              </div>
              <AdminSelect
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value as "draft" | "published")}
                options={[
                  { value: "draft", label: "Draft" },
                  { value: "published", label: "Published" },
                ]}
              />
            </AdminCard>

            {/* Featured Image */}
            <AdminCard>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center">
                  <ImageIcon size={14} className="text-blue-500" />
                </div>
                <h2 className="text-gray-800 font-semibold text-sm">Featured Image</h2>
              </div>
              <ImageUpload
                value={featuredImage}
                onChange={setFeaturedImage}
                onRemove={() => setFeaturedImage("")}
                label=""
              />
            </AdminCard>

            {/* Rich Text Editor */}
            <AdminCard className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 bg-purple-50 rounded-lg flex items-center justify-center">
                  <AlignLeft size={14} className="text-purple-500" />
                </div>
                <h2 className="text-gray-800 font-semibold text-sm">Content</h2>
              </div>
              
              <RichTextEditor 
                content={content} 
                onChange={setContent} 
              />
            </AdminCard>
          </form>
        </div>

        {/* PREVIEW COLUMN */}
        <div className={`${!previewMode ? "hidden lg:block lg:sticky lg:top-6 lg:h-[calc(100vh-6rem)] lg:overflow-y-auto custom-scrollbar" : ""}`}>
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm relative">
            <div className="bg-gray-50 px-4 py-2 flex items-center gap-2 border-b border-gray-100">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="text-xs text-gray-400 font-medium ml-2">Live Preview</span>
            </div>
            <div className="h-full bg-white max-h-screen overflow-y-auto">
               {renderPreview()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
