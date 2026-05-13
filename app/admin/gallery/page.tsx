"use client";

import { useEffect, useState } from "react";
import {
  getGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  GalleryItem,
} from "@/lib/firestore";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { PageHeader, AdminCard, EmptyState, AdminButton, AdminInput } from "@/components/admin/AdminUI";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import ImageUpload from "@/components/admin/ImageUpload";
import toast from "react-hot-toast";
import { Plus, Trash2, Pencil, Images, X, Check } from "lucide-react";

interface EditingItem extends Partial<GalleryItem> {
  isNew?: boolean;
}

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<EditingItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newImage, setNewImage] = useState("");

  async function load() {
    setLoading(true);
    try {
      setItems(await getGallery());
    } catch {
      toast.error("Failed to load gallery");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function openAdd() {
    setNewTitle("");
    setNewImage("");
    setShowForm(true);
  }

  function openEdit(item: GalleryItem) {
    setEditingItem({ ...item });
  }

  async function handleAdd() {
    if (!newImage) { toast.error("Please upload an image"); return; }
    setSaving(true);
    try {
      await createGalleryItem({
        title: newTitle || "Untitled",
        imageUrl: newImage,
        order: items.length,
      });
      toast.success("Photo added");
      setShowForm(false);
      load();
    } catch (err: any) {
      toast.error(err.message || "Failed to add photo");
    } finally {
      setSaving(false);
    }
  }

  async function handleEditSave() {
    if (!editingItem?.id) return;
    setSaving(true);
    try {
      await updateGalleryItem(editingItem.id, {
        title: editingItem.title,
        imageUrl: editingItem.imageUrl,
      });
      toast.success("Photo updated");
      setEditingItem(null);
      load();
    } catch (err: any) {
      toast.error(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget?.id) return;
    setDeleting(true);
    try {
      await deleteGalleryItem(deleteTarget.id);
      toast.success("Photo deleted");
      setDeleteTarget(null);
      load();
    } catch (err: any) {
      toast.error(err.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Gallery Management"
        description="Manage your photo gallery images"
        action={
          <AdminButton variant="primary" size="md" onClick={openAdd}>
            <Plus size={16} />
            Add Photo
          </AdminButton>
        }
      />

      {/* Add Form */}
      {showForm && (
        <AdminCard className="mb-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-gray-800 font-semibold">Add New Photo</h3>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-300 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={15} />
            </button>
          </div>
          <div className="space-y-4 max-w-md">
            <AdminInput
              label="Photo Title"
              placeholder="e.g. Corporate Event 2024"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <ImageUpload
              label="Image *"
              value={newImage}
              onChange={setNewImage}
              onRemove={() => setNewImage("")}
            />
            <div className="flex gap-3 pt-2">
              <AdminButton variant="primary" size="md" onClick={handleAdd} loading={saving}>
                <Check size={14} />
                Save Photo
              </AdminButton>
              <AdminButton variant="secondary" size="md" onClick={() => setShowForm(false)}>
                Cancel
              </AdminButton>
            </div>
          </div>
        </AdminCard>
      )}

      <AdminCard>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#e3791d] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={<Images size={24} />}
            title="No photos yet"
            description="Upload your first gallery photo"
            action={
              <AdminButton variant="primary" size="sm" onClick={openAdd}>
                <Plus size={13} />
                Add Photo
              </AdminButton>
            }
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {items.map((item) => (
              <div key={item.id} className="group relative">
                {editingItem?.id === item.id ? (
                  /* Inline edit */
                  <div className="border-2 border-[#e3791d]/30 rounded-xl p-3 space-y-3 bg-orange-50/50">
                    <img
                      src={editingItem?.imageUrl}
                      alt=""
                      className="w-full h-28 object-cover rounded-lg border border-gray-100"
                    />
                    <AdminInput
                      label="Title"
                      value={editingItem?.title ?? ""}
                      onChange={(e) =>
                        setEditingItem((prev) => prev ? { ...prev, title: e.target.value } : prev)
                      }
                    />
                    <div className="flex gap-2">
                      <AdminButton variant="primary" size="sm" onClick={handleEditSave} loading={saving} className="flex-1">
                        Save
                      </AdminButton>
                      <AdminButton variant="secondary" size="sm" onClick={() => setEditingItem(null)} className="flex-1">
                        Cancel
                      </AdminButton>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl overflow-hidden border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 bg-white">
                    <div className="relative">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEdit(item)}
                          className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors shadow-md"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(item)}
                          className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-md"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                    <div className="px-2.5 py-2">
                      <p className="text-gray-600 text-xs truncate font-medium">{item.title}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </AdminCard>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Photo"
        message={`Remove "${deleteTarget?.title}" from the gallery? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </>
  );
}
