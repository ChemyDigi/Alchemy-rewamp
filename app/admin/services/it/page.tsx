"use client";

import { useEffect, useState } from "react";
import { getServiceBySlug, upsertService, Service, Project } from "@/lib/firestore";
import {
  PageHeader,
  AdminCard,
  AdminButton,
  AdminInput,
  EmptyState,
} from "@/components/admin/AdminUI";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { uploadToCloudinary } from "@/lib/cloudinary";
import toast from "react-hot-toast";
import { Plus, Trash2, X, Save, FolderOpen } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const SLUG = "it";
const DEFAULT_TITLE = "IT Solutions";

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

export default function ITServicePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteProject, setDeleteProject] = useState<string | null>(null);
  const [expandedProject, setExpandedProject] = useState<string | null>(null);

  // Keep non-project fields in state so we don't wipe them on save
  const [cachedService, setCachedService] = useState<Service | null>(null);

  useEffect(() => {
    getServiceBySlug(SLUG).then((data) => {
      if (data) {
        setCachedService(data);
        setProjects(data.projects || []);
      }
      setLoading(false);
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const payload: Service = {
        ...(cachedService ?? {}),
        slug: SLUG,
        title: cachedService?.title ?? DEFAULT_TITLE,
        description: cachedService?.description ?? "",
        heroImage: cachedService?.heroImage ?? "",
        projects,
      };
      await upsertService(payload);
      toast.success("Projects saved!");
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  }

  function updateProject(id: string, field: keyof Project, value: string | string[]) {
    setProjects((ps) => ps.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  }

  async function addProjectImage(projectId: string, file: File) {
    try {
      const url = await uploadToCloudinary(file);
      setProjects((ps) =>
        ps.map((p) => (p.id === projectId ? { ...p, images: [...p.images, url] } : p))
      );
      toast.success("Image added");
    } catch {
      toast.error("Image upload failed");
    }
  }

  function removeProjectImage(projectId: string, imgIdx: number) {
    setProjects((ps) =>
      ps.map((p) =>
        p.id === projectId ? { ...p, images: p.images.filter((_, i) => i !== imgIdx) } : p
      )
    );
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
        title="Manage: IT Solutions — Projects"
        description="Add, edit, and remove IT solution projects"
        action={
          <div className="flex items-center gap-3">
            <Link
              href="/admin/services"
              className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
            >
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
        {/* Projects */}
        <AdminCard>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-white font-semibold text-sm uppercase tracking-wider">
              Projects
            </h2>
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
              Add Project
            </AdminButton>
          </div>

          {projects.length === 0 ? (
            <EmptyState
              icon={<FolderOpen size={24} />}
              title="No projects yet"
              description="Add your first IT project"
              action={
                <AdminButton
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    const p = emptyProject();
                    setProjects([p]);
                    setExpandedProject(p.id);
                  }}
                >
                  <Plus size={13} />
                  Add Project
                </AdminButton>
              }
            />
          ) : (
            <div className="space-y-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="border border-[#1a1a35] rounded-xl overflow-hidden"
                >
                  {/* Accordion header */}
                  <div
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-[#080818] transition-colors"
                    onClick={() =>
                      setExpandedProject(expandedProject === project.id ? null : project.id)
                    }
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">
                        {project.title || "Untitled Project"}
                      </p>
                      {project.category && (
                        <p className="text-slate-600 text-xs">{project.category}</p>
                      )}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteProject(project.id);
                      }}
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
                          label="Project Title"
                          value={project.title}
                          onChange={(e) => updateProject(project.id, "title", e.target.value)}
                          placeholder="e.g. Brand Identity Redesign"
                        />
                        <AdminInput
                          label="Project Type"
                          value={project.category}
                          onChange={(e) => updateProject(project.id, "category", e.target.value)}
                          placeholder="e.g. Web App"
                        />
                      </div>

                      {/* Project Images */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-slate-400 text-sm font-medium">
                            Project Images
                          </label>
                          <button
                            type="button"
                            onClick={() => {
                              const input = document.getElementById(`img-upload-${project.id}`) as HTMLInputElement;
                              input?.click();
                            }}
                            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white border border-[#1a1a35] hover:border-[#e3791d] rounded-lg px-3 py-1.5 transition-all"
                          >
                            <Plus size={12} />
                            Add Image
                          </button>
                          <input
                            id={`img-upload-${project.id}`}
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
                        {project.images.length === 0 ? (
                          <p className="text-slate-600 text-xs">No images yet</p>
                        ) : (
                          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {project.images.map((url, i) => (
                              <div
                                key={i}
                                className="relative group rounded-lg overflow-hidden border border-[#1a1a35]"
                              >
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

        {/* Save */}
        <div className="flex gap-3 pb-6">
          <AdminButton variant="primary" size="lg" onClick={handleSave} loading={saving}>
            <Save size={15} />
            Save Projects
          </AdminButton>
        </div>
      </div>

      <ConfirmDialog
        open={deleteProject !== null}
        title="Delete Project"
        message="Delete this project? This cannot be undone."
        onConfirm={() => {
          if (deleteProject) {
            setProjects((ps) => ps.filter((p) => p.id !== deleteProject));
            setDeleteProject(null);
          }
        }}
        onCancel={() => setDeleteProject(null)}
      />
    </>
  );
}
