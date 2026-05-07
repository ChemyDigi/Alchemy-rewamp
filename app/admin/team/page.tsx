"use client";

import { useEffect, useState } from "react";
import {
  getTeam,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember,
  TeamMember,
} from "@/lib/firestore";
import { PageHeader, AdminCard, EmptyState, AdminButton, AdminInput } from "@/components/admin/AdminUI";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import ImageUpload from "@/components/admin/ImageUpload";
import toast from "react-hot-toast";
import { Plus, Trash2, Pencil, Users, X, Check, User } from "lucide-react";

export default function AdminTeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<Partial<TeamMember> & { id?: string } | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TeamMember | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newImage, setNewImage] = useState("");

  async function load() {
    setLoading(true);
    try {
      setMembers(await getTeam());
    } catch {
      toast.error("Failed to load team");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleAdd() {
    if (!newName.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      await createTeamMember({
        name: newName.trim(),
        role: newRole.trim() || "Team Member",
        imageUrl: newImage,
        order: members.length,
      });
      toast.success("Team member added");
      setShowForm(false);
      setNewName(""); setNewRole(""); setNewImage("");
      load();
    } catch {
      toast.error("Failed to add member");
    } finally {
      setSaving(false);
    }
  }

  async function handleEditSave() {
    if (!editingMember?.id) return;
    setSaving(true);
    try {
      await updateTeamMember(editingMember.id, {
        name: editingMember.name,
        role: editingMember.role,
        imageUrl: editingMember.imageUrl,
      });
      toast.success("Member updated");
      setEditingMember(null);
      load();
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget?.id) return;
    setDeleting(true);
    try {
      await deleteTeamMember(deleteTarget.id);
      toast.success("Member removed");
      setDeleteTarget(null);
      load();
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Team Management"
        description="Add and manage team member profiles"
        action={
          <AdminButton variant="primary" size="md" onClick={() => setShowForm(true)}>
            <Plus size={16} />
            Add Member
          </AdminButton>
        }
      />

      {showForm && (
        <AdminCard className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Add Team Member</h3>
            <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-white">
              <X size={16} />
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="space-y-4">
              <AdminInput label="Full Name *" placeholder="e.g. Jane Smith" value={newName} onChange={(e) => setNewName(e.target.value)} />
              <AdminInput label="Role / Title" placeholder="e.g. Creative Director" value={newRole} onChange={(e) => setNewRole(e.target.value)} />
              <div className="flex gap-3 pt-2">
                <AdminButton variant="primary" size="md" onClick={handleAdd} loading={saving}>
                  <Check size={14} />
                  Add Member
                </AdminButton>
                <AdminButton variant="secondary" size="md" onClick={() => setShowForm(false)}>Cancel</AdminButton>
              </div>
            </div>
            <ImageUpload label="Profile Photo" value={newImage} onChange={setNewImage} onRemove={() => setNewImage("")} />
          </div>
        </AdminCard>
      )}

      <AdminCard>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#e3791d] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : members.length === 0 ? (
          <EmptyState
            icon={<Users size={28} />}
            title="No team members yet"
            description="Add your first team member profile"
            action={
              <AdminButton variant="primary" size="sm" onClick={() => setShowForm(true)}>
                <Plus size={13} />
                Add Member
              </AdminButton>
            }
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {members.map((member) => (
              <div key={member.id}>
                {editingMember?.id === member.id ? (
                  <div className="border border-[#e3791d]/40 rounded-2xl p-4 space-y-3 bg-[#080818]">
                    <ImageUpload
                      label="Photo"
                      value={editingMember.imageUrl}
                      onChange={(url) => setEditingMember((p) => p ? { ...p, imageUrl: url } : p)}
                      onRemove={() => setEditingMember((p) => p ? { ...p, imageUrl: "" } : p)}
                    />
                    <AdminInput
                      label="Name"
                      value={editingMember.name ?? ""}
                      onChange={(e) => setEditingMember((p) => p ? { ...p, name: e.target.value } : p)}
                    />
                    <AdminInput
                      label="Role"
                      value={editingMember.role ?? ""}
                      onChange={(e) => setEditingMember((p) => p ? { ...p, role: e.target.value } : p)}
                    />
                    <div className="flex gap-2">
                      <AdminButton variant="primary" size="sm" onClick={handleEditSave} loading={saving} className="flex-1">Save</AdminButton>
                      <AdminButton variant="secondary" size="sm" onClick={() => setEditingMember(null)} className="flex-1">Cancel</AdminButton>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#080818] border border-[#1a1a35] rounded-2xl overflow-hidden hover:border-[#e3791d]/20 transition-all group">
                    <div className="relative">
                      {member.imageUrl ? (
                        <img src={member.imageUrl} alt={member.name} className="w-full h-44 object-cover" />
                      ) : (
                        <div className="w-full h-44 bg-[#12122a] flex items-center justify-center">
                          <User size={40} className="text-slate-700" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          onClick={() => setEditingMember({ ...member })}
                          className="w-9 h-9 bg-[#e3791d] rounded-xl flex items-center justify-center text-white"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(member)}
                          className="w-9 h-9 bg-red-500 rounded-xl flex items-center justify-center text-white"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <div className="px-4 py-3">
                      <p className="text-white font-semibold text-sm">{member.name}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{member.role}</p>
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
        title="Remove Team Member"
        message={`Remove "${deleteTarget?.name}" from the team? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </>
  );
}
