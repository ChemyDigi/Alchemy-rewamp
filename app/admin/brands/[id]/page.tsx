"use client";

import { useState, useEffect } from "react";
import BrandForm from "@/components/admin/BrandForm";
import { Brand } from "@/types/brand";
import { getBrandById } from "@/lib/firestore-brands";

interface PageProps {
  params: {
    id: string;
  };
}

export default function EditBrandPage({ params }: PageProps) {
  const { id } = params;
  const [brandData, setBrandData] = useState<Brand | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getBrandById(id);
        if (!data) {
          setError("Brand not found");
        } else {
          setBrandData(data);
        }
      } catch (err) {
        console.error("Error fetching brand:", err);
        setError("Failed to load brand");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrand();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <p>Loading brand...</p>
      </div>
    );
  }

  if (error || !brandData) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-red-500 text-center py-10">
            <p>{error || "Brand not found"}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Edit Brand: {brandData.brandName}</h1>
        <BrandForm initialData={brandData} isEditing={true} />
      </div>
    </div>
  );
}
