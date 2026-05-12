import BrandForm from "@/components/admin/BrandForm";

export default function NewBrandPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Create New Brand</h1>
        <BrandForm />
      </div>
    </div>
  );
}
