"use client";

import { useEffect, useState } from "react";
import { getBlogs, deleteBlog, Blog } from "@/lib/firestore";
import Link from "next/link";
import toast from "react-hot-toast";
import { PageHeader, AdminCard, EmptyState, AdminButton } from "@/components/admin/AdminUI";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { Plus, Pencil, Trash2, FileText, Eye, EyeOff } from "lucide-react";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Blog | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function loadBlogs() {
    setLoading(true);
    try {
      const data = await getBlogs();
      setBlogs(data);
    } catch {
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadBlogs(); }, []);

  async function handleDelete() {
    if (!deleteTarget?.id) return;
    setDeleting(true);
    try {
      await deleteBlog(deleteTarget.id);
      toast.success("Blog deleted");
      setDeleteTarget(null);
      loadBlogs();
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  function formatDate(ts: { seconds: number } | undefined): string {
    if (!ts) return "—";
    return new Date(ts.seconds * 1000).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric",
    });
  }

  return (
    <>
      <PageHeader
        title="Blog Management"
        description="Create, edit, and manage your blog posts"
        action={
          <Link href="/admin/blogs/new">
            <AdminButton variant="primary" size="md">
              <Plus size={16} />
              New Blog
            </AdminButton>
          </Link>
        }
      />

      <AdminCard>
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#e3791d] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : blogs.length === 0 ? (
          <EmptyState
            icon={<FileText size={28} />}
            title="No blogs yet"
            description="Create your first blog post to get started"
            action={
              <Link href="/admin/blogs/new">
                <AdminButton variant="primary" size="sm">
                  <Plus size={14} />
                  Create Blog
                </AdminButton>
              </Link>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1a1a35]">
                  <th className="text-left text-slate-500 text-xs font-semibold uppercase tracking-wider px-4 py-3">Title</th>
                  <th className="text-left text-slate-500 text-xs font-semibold uppercase tracking-wider px-4 py-3 hidden md:table-cell">Status</th>
                  <th className="text-left text-slate-500 text-xs font-semibold uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Created</th>
                  <th className="text-right text-slate-500 text-xs font-semibold uppercase tracking-wider px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1a1a35]">
                {blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-[#080818] transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        {blog.featuredImage ? (
                          <img
                            src={blog.featuredImage}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-[#12122a] rounded-lg flex items-center justify-center flex-shrink-0">
                            <FileText size={14} className="text-slate-600" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="text-white text-sm font-medium truncate max-w-[200px]">{blog.title}</p>
                          <p className="text-slate-500 text-xs truncate max-w-[200px]">/{blog.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 hidden md:table-cell">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
                        ${blog.status === "published"
                          ? "bg-emerald-500/10 text-emerald-400"
                          : "bg-slate-500/10 text-slate-400"}`}
                      >
                        {blog.status === "published" ? <Eye size={11} /> : <EyeOff size={11} />}
                        {blog.status === "published" ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <span className="text-slate-500 text-sm">
                        {formatDate(blog.createdAt as { seconds: number } | undefined)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/blogs/${blog.id}`}>
                          <AdminButton variant="ghost" size="sm">
                            <Pencil size={13} />
                            <span className="hidden sm:inline">Edit</span>
                          </AdminButton>
                        </Link>
                        <AdminButton
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteTarget(blog)}
                          className="text-red-400 hover:bg-red-500/10"
                        >
                          <Trash2 size={13} />
                        </AdminButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </AdminCard>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete Blog Post"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </>
  );
}
