"use client";

import { useEffect, useState } from "react";
import { getServiceBySlug, upsertService, Service, Project, DMPost } from "@/lib/firestore";
import { PageHeader, AdminCard, AdminButton, AdminInput, AdminTextarea, EmptyState } from "@/components/admin/AdminUI";
import ImageUpload from "@/components/admin/ImageUpload";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { uploadToCloudinary } from "@/lib/cloudinary";
import toast from "react-hot-toast";
import { Plus, Trash2, X, Save, FolderOpen, ChevronDown, ChevronUp, ImageIcon, Tag } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface ServiceEditorProps {
  slug: string;
  defaultTitle: string;
  backHref?: string;
  showDMPosts?: boolean;
  projectLabel?: string;
}

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const emptyProject = (): Project => ({
  id: generateId(),
  title: "",
  description: "",
  category: "",
  images: [],
});

export default function ServiceEditor({ slug, defaultTitle, backHref = "/admin/services", showDMPosts = false, projectLabel = "Project" }: ServiceEditorProps) {
  const [title, setTitle] = useState(defaultTitle);
  const [description, setDescription] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [dmPosts, setDmPosts] = useState<DMPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteProject, setDeleteProject] = useState<string | null>(null);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);
  const [deleteDMPost, setDeleteDMPost] = useState<string | null>(null);

  useEffect(() => {
    getServiceBySlug(slug).then((data) => {
      if (data) {
        setTitle(data.title || defaultTitle);
        setDescription(data.description || "");
        setHeroImage(data.heroImage || "");
        setProjects(data.projects || []);
        setDmPosts(data.dmPosts || []);
      }
      setLoading(false);
    });
  }, [slug, defaultTitle]);

  async function handleSave() {
    setSaving(true);
    try {
      const payload: Service = { slug, title, description, heroImage, projects, dmPosts };
      await upsertService(payload);
      toast.success("Service updated");
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  }

  function updateProject(id: string, field: keyof Project, value: string | string[]) {
    setProjects((ps) => ps.map((p) => p.id === id ? { ...p, [field]: value } : p));
  }

  async function addProjectImage(projectId: string, file: File) {
    try {
      const url = await uploadToCloudinary(file);
      setProjects((ps) =>
        ps.map((p) => p.id === projectId ? { ...p, images: [...p.images, url] } : p)
      );
      toast.success("Image added");
    } catch {
      toast.error("Image upload failed");
    }
  }

  function removeProjectImage(projectId: string, imgIdx: number) {
    setProjects((ps) =>
      ps.map((p) => p.id === projectId ? { ...p, images: p.images.filter((_, i) => i !== imgIdx) } : p)
    );
  }

  async function addDMPostImage(file: File) {
    try {
      const url = await uploadToCloudinary(file);
      const newPost: DMPost = {
        id: generateId(),
        imageUrl: url,
        alt: "Digital Marketing Post",
        aspect: "tall"
      };
      setDmPosts((prev) => [...prev, newPost]);
      toast.success("Post image added");
    } catch {
      toast.error("Image upload failed");
    }
  }

  function updateDMPost(id: string, field: keyof DMPost, value: string) {
    setDmPosts((prev) => prev.map((p) => p.id === id ? { ...p, [field]: value } : p));
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#e3791d] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title={`Manage: ${defaultTitle}`}
        description={`Edit service content and manage ${projectLabel.toLowerCase()}s`}
        action={
          <div className="flex items-center gap-3">
            <Link
              href={backHref}
              className="flex items-center gap-2 text-gray-400 hover:text-gray-700 text-sm font-medium transition-colors px-3 py-2 rounded-xl hover:bg-gray-100"
            >
              <ArrowLeft size={14} />
              Back
            </Link>
            <AdminButton variant="primary" size="md" onClick={handleSave} loading={saving}>
              <Save size={15} />
              Save Changes
            </AdminButton>
          </div>
        }
      />

      <div className="space-y-5 max-w-4xl">
        {/* Service Info */}

        {/* Projects / Custom Label */}
        <AdminCard>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-purple-50 rounded-lg flex items-center justify-center">
                <FolderOpen size={14} className="text-purple-500" />
              </div>
              <h2 className="text-gray-800 font-semibold text-sm">{projectLabel}s</h2>
              {projects.length > 0 && (
                <span className="bg-gray-100 text-gray-500 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {projects.length}
                </span>
              )}
            </div>
            <AdminButton
              variant="secondary"
              size="sm"
              onClick={() => {
                const p = emptyProject();
                setProjects((ps) => [...ps, p]);
                setExpandedProject(p.id);
              }}
            >
              <Plus size={13} />
              Add {projectLabel}
            </AdminButton>
          </div>

          {projects.length === 0 ? (
            <EmptyState
              icon={<FolderOpen size={22} />}
              title={`No ${projectLabel.toLowerCase()}s yet`}
              description={`Add your first ${projectLabel.toLowerCase()} for this service`}
              action={
                <AdminButton variant="secondary" size="sm" onClick={() => {
                  const p = emptyProject();
                  setProjects([p]);
                  setExpandedProject(p.id);
                }}>
                  <Plus size={13} />
                  Add {projectLabel}
                </AdminButton>
              }
            />
          ) : (
            <div className="space-y-2">
              {projects.map((project, idx) => (
                <div key={project.id} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                  {/* Accordion header */}
                  <div
                    className="flex items-center gap-3 px-4 py-3.5 cursor-pointer hover:bg-gray-50 transition-colors bg-white"
                    onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
                  >
                    <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 text-gray-500 text-xs font-bold">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-800 text-sm font-semibold truncate">
                        {project.title || `Untitled ${projectLabel}`}
                      </p>
                      {project.category && (
                        <p className="text-gray-400 text-xs mt-0.5">{project.category}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteProject(project.id); }}
                        className="text-gray-300 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 size={13} />
                      </button>
                      <div className="text-gray-300">
                        {expandedProject === project.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </div>
                    </div>
                  </div>

                  {/* Accordion body */}
                  {expandedProject === project.id && (
                    <div className="border-t border-gray-100 bg-gray-50 p-5 space-y-4">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <AdminInput
                          label={`${projectLabel} Title`}
                          value={project.title}
                          onChange={(e) => updateProject(project.id, "title", e.target.value)}
                          placeholder={`e.g. ${projectLabel} Title`}
                        />
                        <AdminInput
                          label="Category"
                          value={project.category}
                          onChange={(e) => updateProject(project.id, "category", e.target.value)}
                          placeholder="e.g. Branding"
                        />
                      </div>
                      <AdminTextarea
                        label="Description"
                        value={project.description}
                        onChange={(e) => updateProject(project.id, "description", e.target.value)}
                        rows={3}
                        placeholder={`${projectLabel} description…`}
                      />
                      {/* Project Images */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-gray-600 text-sm font-medium">{projectLabel} Images</label>
                          <div className="relative">
                            <AdminButton
                              type="button"
                              variant="secondary"
                              size="sm"
                              onClick={() => document.getElementById(`project-img-upload-${project.id}`)?.click()}
                            >
                              <Plus size={12} />
                              Add Image
                            </AdminButton>
                            <input
                              id={`project-img-upload-${project.id}`}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) addProjectImage(project.id, file);
                                e.target.value = "";
                              }}
                            />
                          </div>
                        </div>
                        {project.images.length === 0 ? (
                          <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
                            <p className="text-gray-400 text-xs">No images yet — click &ldquo;Add Image&rdquo; to upload</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {project.images.map((url, i) => (
                              <div key={i} className="relative group rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                                <img src={url} alt="" className="w-full h-20 object-cover" />
                                <button
                                  onClick={() => removeProjectImage(project.id, i)}
                                  className="absolute top-1.5 right-1.5 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md"
                                >
                                  <X size={10} className="text-white" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </AdminCard>

        {/* DM Posts (optional) */}
        {showDMPosts && (
          <AdminCard>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center">
                  <ImageIcon size={14} className="text-emerald-500" />
                </div>
                <div>
                  <h2 className="text-gray-800 font-semibold text-sm">Work Section Posts</h2>
                  <p className="text-gray-400 text-xs mt-0.5">Images displayed in the WORK columns</p>
                </div>
                {dmPosts.length > 0 && (
                  <span className="bg-gray-100 text-gray-500 text-xs font-semibold px-2 py-0.5 rounded-full ml-1">
                    {dmPosts.length}
                  </span>
                )}
              </div>
              <div className="relative">
                <AdminButton
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => document.getElementById('dm-post-img-upload')?.click()}
                >
                  <Plus size={13} />
                  Add Post
                </AdminButton>
                <input
                  id="dm-post-img-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) addDMPostImage(file);
                    e.target.value = "";
                  }}
                />
              </div>
            </div>

            {dmPosts.length === 0 ? (
              <EmptyState
                icon={<ImageIcon size={22} />}
                title="No posts yet"
                description="Upload images to display in the WORK section columns."
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {dmPosts.map((post) => (
                  <div key={post.id} className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm">
                    <div className="relative group aspect-square overflow-hidden bg-gray-50">
                      <img src={post.imageUrl} alt={post.alt} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                      <button
                        onClick={() => setDeleteDMPost(post.id)}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                      >
                        <Trash2 size={14} className="text-white" />
                      </button>
                    </div>
                    <div className="p-3 space-y-2.5">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Alt Text</label>
                        <input
                          type="text"
                          value={post.alt}
                          onChange={(e) => updateDMPost(post.id, "alt", e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 text-sm text-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-[#e3791d] focus:ring-1 focus:ring-orange-100 transition-all"
                          placeholder="Image alt text"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">Aspect Ratio</label>
                        <select
                          value={post.aspect}
                          onChange={(e) => updateDMPost(post.id, "aspect", e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 text-sm text-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:border-[#e3791d] focus:ring-1 focus:ring-orange-100 transition-all"
                        >
                          <option value="tall">Tall</option>
                          <option value="square">Square</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </AdminCard>
        )}

        {/* Save */}
        <div className="flex items-center justify-between gap-3 pb-6 pt-2 border-t border-gray-100">
          <p className="text-gray-400 text-xs">All changes are saved to Firestore</p>
          <AdminButton variant="primary" size="lg" onClick={handleSave} loading={saving}>
            <Save size={15} />
            Save Service
          </AdminButton>
        </div>
      </div>

      <ConfirmDialog
        open={deleteProject !== null}
        title={`Delete ${projectLabel}`}
        message={`Delete this ${projectLabel.toLowerCase()}? This cannot be undone.`}
        onConfirm={() => {
          if (deleteProject) {
            setProjects((ps) => ps.filter((p) => p.id !== deleteProject));
            setDeleteProject(null);
          }
        }}
        onCancel={() => setDeleteProject(null)}
      />

      <ConfirmDialog
        open={deleteDMPost !== null}
        title="Delete Post"
        message="Delete this post image? This cannot be undone."
        onConfirm={() => {
          if (deleteDMPost) {
            setDmPosts((prev) => prev.filter((p) => p.id !== deleteDMPost));
            setDeleteDMPost(null);
          }
        }}
        onCancel={() => setDeleteDMPost(null)}
      />
    </>
  );
}
