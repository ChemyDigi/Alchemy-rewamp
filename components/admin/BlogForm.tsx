"use client";

import { useState } from "react";
import { Blog, BlogSection, createBlog, updateBlog } from "@/lib/firestore";
import ImageUpload from "@/components/admin/ImageUpload";
import { AdminInput, AdminTextarea, AdminSelect, AdminButton } from "@/components/admin/AdminUI";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { uploadToCloudinary } from "@/lib/cloudinary";

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
  const [shortDescription, setShortDescription] = useState(initialData?.shortDescription ?? "");
  const [featuredImage, setFeaturedImage] = useState(initialData?.featuredImage ?? "");
  const [content, setContent] = useState(initialData?.content ?? "");
  const [status, setStatus] = useState<"draft" | "published">(initialData?.status ?? "draft");
  const [sections, setSections] = useState<BlogSection[]>(initialData?.sections ?? []);
  const [galleryImages, setGalleryImages] = useState<string[]>(initialData?.galleryImages ?? []);
  const [saving, setSaving] = useState(false);
  const [galleryUploading, setGalleryUploading] = useState(false);

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!isEdit) setSlug(slugify(val));
  }

  function addSection() {
    setSections((s) => [...s, { heading: "", description: "", image: "" }]);
  }

  function updateSection(idx: number, field: keyof BlogSection, value: string) {
    setSections((s) => s.map((sec, i) => (i === idx ? { ...sec, [field]: value } : sec)));
  }

  function removeSection(idx: number) {
    setSections((s) => s.filter((_, i) => i !== idx));
  }

  async function handleGalleryAdd(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setGalleryUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setGalleryImages((imgs) => [...imgs, url]);
      toast.success("Gallery image added");
    } catch {
      toast.error("Gallery upload failed");
    } finally {
      setGalleryUploading(false);
      e.target.value = "";
    }
  }

  function removeGalleryImage(idx: number) {
    setGalleryImages((imgs) => imgs.filter((_, i) => i !== idx));
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
        shortDescription: shortDescription.trim(),
        featuredImage,
        content: content.trim(),
        sections,
        galleryImages,
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Basic info */}
      <div className="bg-[#0f0f22] border border-[#1a1a35] rounded-2xl p-5 lg:p-6 space-y-4">
        <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Basic Info</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <AdminInput
            label="Blog Title *"
            placeholder="Enter blog title…"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
          />
          <AdminInput
            label="Slug *"
            placeholder="url-friendly-slug"
            value={slug}
            onChange={(e) => setSlug(slugify(e.target.value))}
          />
        </div>
        <AdminTextarea
          label="Short Description"
          placeholder="Brief summary shown in blog listing…"
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          rows={3}
        />
        <AdminSelect
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value as "draft" | "published")}
          options={[
            { value: "draft", label: "Draft" },
            { value: "published", label: "Published" },
          ]}
        />
      </div>

      {/* Featured Image */}
      <div className="bg-[#0f0f22] border border-[#1a1a35] rounded-2xl p-5 lg:p-6">
        <h2 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Featured Image</h2>
        <ImageUpload
          value={featuredImage}
          onChange={setFeaturedImage}
          onRemove={() => setFeaturedImage("")}
          label=""
        />
      </div>

      {/* Main Content */}
      <div className="bg-[#0f0f22] border border-[#1a1a35] rounded-2xl p-5 lg:p-6 space-y-4">
        <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Main Content</h2>
        <AdminTextarea
          label="Blog Content"
          placeholder="Write the main blog content here…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
        />
      </div>

      {/* Content Sections */}
      <div className="bg-[#0f0f22] border border-[#1a1a35] rounded-2xl p-5 lg:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Content Sections</h2>
          <AdminButton type="button" variant="secondary" size="sm" onClick={addSection}>
            <Plus size={13} />
            Add Section
          </AdminButton>
        </div>

        {sections.length === 0 ? (
          <p className="text-slate-600 text-sm text-center py-6">No sections added yet</p>
        ) : (
          <div className="space-y-4">
            {sections.map((section, idx) => (
              <div key={idx} className="bg-[#080818] border border-[#1a1a35] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 text-xs font-semibold uppercase tracking-wider">
                    Section {idx + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeSection(idx)}
                    className="text-slate-500 hover:text-red-400 transition-colors"
                  >
                    <X size={15} />
                  </button>
                </div>
                <AdminInput
                  label="Heading"
                  placeholder="Section heading…"
                  value={section.heading}
                  onChange={(e) => updateSection(idx, "heading", e.target.value)}
                />
                <AdminTextarea
                  label="Description"
                  placeholder="Section content…"
                  value={section.description}
                  onChange={(e) => updateSection(idx, "description", e.target.value)}
                  rows={4}
                />
                <ImageUpload
                  label="Section Image (optional)"
                  value={section.image}
                  onChange={(url) => updateSection(idx, "image", url)}
                  onRemove={() => updateSection(idx, "image", "")}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gallery Images */}
      <div className="bg-[#0f0f22] border border-[#1a1a35] rounded-2xl p-5 lg:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Gallery Images</h2>
          <AdminButton
            type="button"
            variant="secondary"
            size="sm"
            loading={galleryUploading}
            onClick={() => {
              const input = document.getElementById("gallery-file-input") as HTMLInputElement;
              input?.click();
            }}
          >
            <Plus size={13} />
            Add Image
          </AdminButton>
          <input
            id="gallery-file-input"
            type="file"
            accept="image/*"
            onChange={handleGalleryAdd}
            className="hidden"
          />
        </div>
        {galleryImages.length === 0 ? (
          <p className="text-slate-600 text-sm text-center py-4">No gallery images yet</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {galleryImages.map((url, idx) => (
              <div key={idx} className="relative group rounded-lg overflow-hidden border border-[#1a1a35]">
                <img src={url} alt="" className="w-full h-24 object-cover" />
                <button
                  type="button"
                  onClick={() => removeGalleryImage(idx)}
                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={11} className="text-white" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pb-6">
        <AdminButton type="submit" variant="primary" size="lg" loading={saving}>
          {isEdit ? "Update Blog" : "Create Blog"}
        </AdminButton>
        <AdminButton
          type="button"
          variant="secondary"
          size="lg"
          onClick={() => router.push("/admin/blogs")}
        >
          Cancel
        </AdminButton>
      </div>
    </form>
  );
}
