"use client";

import { useEffect, useState } from "react";
import { getServiceBySlug, upsertService, Service, Project, DMPost } from "@/lib/firestore";
import { PageHeader, AdminCard, AdminButton, AdminInput, AdminTextarea, EmptyState } from "@/components/admin/AdminUI";
import ImageUpload from "@/components/admin/ImageUpload";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { uploadToCloudinary } from "@/lib/cloudinary";
import toast from "react-hot-toast";
import { Plus, Trash2, X, Save, FolderOpen } from "lucide-react";
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
        <div className="w-8 h-8 border-2 border-[#e3791d] border-t-transparent rounded-full animate-spin" />
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
            <Link href={backHref} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
              <ArrowLeft size={14} />
              Back
            </Link>
            <AdminButton variant="primary" size="md" onClick={handleSave} loading={saving}>
              <Save size={15} />
              Save
            </AdminButton>
          </div>
        }
      />

      <div className="space-y-6 max-w-4xl">
        {/* Service Info */}
        <AdminCard>
          <h2 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Service Info</h2>
          <div className="space-y-4">
            <AdminInput label="Service Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Service title…" />
            <AdminTextarea label="Service Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Describe this service…" />
          </div>
        </AdminCard>

        {/* Hero Image */}
        <AdminCard>
          <h2 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Hero Image</h2>
          <ImageUpload
            value={heroImage}
            onChange={setHeroImage}
            onRemove={() => setHeroImage("")}
            label=""
          />
        </AdminCard>

        {/* Projects / Custom Label */}
        <AdminCard>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold text-sm uppercase tracking-wider">{projectLabel}s</h2>
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
              icon={<FolderOpen size={24} />}
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
            <div className="space-y-3">
              {projects.map((project) => (
                <div key={project.id} className="border border-[#1a1a35] rounded-xl overflow-hidden">
                  {/* Accordion header */}
                  <div
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#080818] transition-colors"
                    onClick={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {project.title || `Untitled ${projectLabel}`}
                      </p>
                      {project.category && (
                        <p className="text-slate-600 text-xs">{project.category}</p>
                      )}
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setDeleteProject(project.id); }}
                      className="text-slate-500 hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  {/* Accordion body */}
                  {expandedProject === project.id && (
                    <div className="border-t border-[#1a1a35] bg-[#080818] p-4 space-y-4">
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
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-slate-400 text-sm font-medium">{projectLabel} Images</label>
                          <div className="relative">
                            <AdminButton type="button" variant="ghost" size="sm" onClick={() => document.getElementById(`project-img-upload-${project.id}`)?.click()}>
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
                          <p className="text-slate-600 text-xs">No images yet</p>
                        ) : (
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {project.images.map((url, i) => (
                              <div key={i} className="relative group rounded-lg overflow-hidden border border-[#1a1a35]">
                                <img src={url} alt="" className="w-full h-20 object-cover" />
                                <button
                                  onClick={() => removeProjectImage(project.id, i)}
                                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
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
              <h2 className="text-white font-semibold text-sm uppercase tracking-wider">Digital Marketing Posts (Work Section)</h2>
              <div className="relative">
                <AdminButton type="button" variant="secondary" size="sm" onClick={() => document.getElementById('dm-post-img-upload')?.click()}>
                  <Plus size={13} />
                  Add Post Image
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
                icon={<FolderOpen size={24} />}
                title="No posts yet"
                description="Upload images to display in the WORK section columns."
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {dmPosts.map((post) => (
                  <div key={post.id} className="border border-[#1a1a35] rounded-xl overflow-hidden bg-[#080818] p-3 flex flex-col gap-3">
                    <div className="relative group rounded-lg overflow-hidden border border-[#1a1a35] aspect-square">
                      <img src={post.imageUrl} alt={post.alt} className="w-full h-full object-cover" />
                      <button
                        onClick={() => setDeleteDMPost(post.id)}
                        className="absolute top-2 right-2 w-7 h-7 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={14} className="text-white" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Alt Text</label>
                        <input
                          type="text"
                          value={post.alt}
                          onChange={(e) => updateDMPost(post.id, "alt", e.target.value)}
                          className="w-full bg-[#111122] text-sm text-white rounded border border-[#1a1a35] px-2 py-1 focus:outline-none focus:border-[#e3791d]"
                          placeholder="Image alt text"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-400 mb-1">Aspect Ratio</label>
                        <select
                          value={post.aspect}
                          onChange={(e) => updateDMPost(post.id, "aspect", e.target.value)}
                          className="w-full bg-[#111122] text-sm text-white rounded border border-[#1a1a35] px-2 py-1 focus:outline-none focus:border-[#e3791d]"
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
        <div className="flex gap-3 pb-6">
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
