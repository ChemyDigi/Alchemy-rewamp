import EditBlogClient from "@/components/admin/EditBlogClient";

export async function generateStaticParams() {
  return [{ id: "edit" }];
}

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EditBlogClient id={id} />;
}
