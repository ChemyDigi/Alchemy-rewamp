"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Brand } from "@/types/brand";
import { getAllBrands, deleteBrand } from "@/lib/firestore-brands";
import { useRouter } from "next/navigation";

export default function BrandsListPage() {
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getAllBrands();
      setBrands(data);
    } catch (err) {
      console.error("Error fetching brands:", err);
      setError("Failed to load brands");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setIsLoading(true);
      await deleteBrand(id);
      setBrands(brands.filter((b) => b.id !== id));
      setDeleteConfirm(null);
    } catch (err) {
      console.error("Error deleting brand:", err);
      setError("Failed to delete brand");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Brands Management</h1>
          <Link
            href="/admin/brands/new"
            className="px-6 py-2 bg-orange text-white rounded font-medium"
          >
            + New Brand
          </Link>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
            {error}
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-10">
            <p>Loading brands...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && brands.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-500">No brands yet. Create one to get started.</p>
          </div>
        )}

        {/* Brands Table */}
        {!isLoading && brands.length > 0 && (
          <div className="bg-white rounded shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Image</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Slug</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Featured
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Published
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {brands.map((brand) => (
                  <tr
                    key={brand.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-3">
                      <div className="relative w-12 h-12 rounded overflow-hidden">
                        <Image
                          src={brand.thumbnailImage || brand.logoImage}
                          alt={brand.brandName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-3 font-medium">{brand.brandName}</td>
                    <td className="px-6 py-3 text-sm text-gray-600">{brand.slug}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          brand.featured
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {brand.featured ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          brand.isPublished
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {brand.isPublished ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/brands/${brand.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => setDeleteConfirm(brand.id)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg max-w-sm">
              <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this brand? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="px-4 py-2 bg-red-600 text-white rounded font-medium"
                >
                  Delete
                </button>
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 bg-gray-300 text-black rounded font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
