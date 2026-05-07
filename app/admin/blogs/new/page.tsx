import BlogForm from "@/components/admin/BlogForm";
import { PageHeader } from "@/components/admin/AdminUI";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewBlogPage() {
  return (
    <>
      <PageHeader
        title="Create New Blog"
        description="Fill in the details below to publish a new blog post"
        action={
          <Link
            href="/admin/blogs"
            className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Blogs
          </Link>
        }
      />
      <BlogForm />
    </>
  );
}
