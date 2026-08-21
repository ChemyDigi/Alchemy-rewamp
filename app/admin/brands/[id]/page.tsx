import BrandEditorClient from "@/components/admin/BrandEditorClient";

export async function generateStaticParams() {
  return [{ id: "new" }];
}

export default async function BrandEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BrandEditorClient id={id} />;
}
