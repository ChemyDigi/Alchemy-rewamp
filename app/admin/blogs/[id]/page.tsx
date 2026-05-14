"use client";

import { useEffect, useState } from "react";
import { getBlogById, Blog } from "@/lib/firestore";
import BlogForm from "@/components/admin/BlogForm";
import { PageHeader } from "@/components/admin/AdminUI";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { use } from "react";

export default function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getBlogById(id).then((data) => {
      setBlog(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-2 border-[#e3791d] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-400">Blog not found.</p>
        <Link href="/admin/blogs" className="text-[#e3791d] text-sm mt-2 inline-block">
          Back to blogs
        </Link>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Edit Blog"
        description={`Editing: ${blog.title}`}
        action={
          <Link
            href="/admin/blogs"
            className="flex items-center gap-2 text-gray-500 hover:text-gray-900 text-sm transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Blogs
          </Link>
        }
      />
      <BlogForm initialData={{ ...blog, id }} />
    </>
  );
}
