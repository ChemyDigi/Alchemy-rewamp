"use client";

import { useState } from "react";
import Image from "next/image";
import { Brand, BrandFormData, GalleryItem } from "@/types/brand";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { createBrand, updateBrand, isSlugExists } from "@/lib/firestore-brands";
import { useRouter } from "next/navigation";

interface BrandFormProps {
  initialData?: Brand;
  isEditing?: boolean;
}

export default function BrandForm({
  initialData,
  isEditing = false,
}: BrandFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState<BrandFormData>({
    brandName: initialData?.brandName || "",
    slug: initialData?.slug || "",
    shortTitle: initialData?.shortTitle || "",
    bornYear: initialData?.bornYear || "",
    introduction: initialData?.introduction || "",
    heroImage: initialData?.heroImage || "",
    logoImage: initialData?.logoImage || "",
    thumbnailImage: initialData?.thumbnailImage || "",
    galleryTitle: initialData?.galleryTitle || "",
    gallery: initialData?.gallery || [],
    details: initialData?.details || {
      brandName: "",
      timeFrame: "",
      role: "",
      industry: "",
      services: [],
    },
    featured: initialData?.featured || false,
    isPublished: initialData?.isPublished || false,
  });

  const [imagePreview, setImagePreview] = useState<{
    heroImage: string | null;
    logoImage: string | null;
    thumbnailImage: string | null;
  }>({
    heroImage: initialData?.heroImage || null,
    logoImage: initialData?.logoImage || null,
    thumbnailImage: initialData?.thumbnailImage || null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const target = e.target as HTMLInputElement;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: target.checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDetailsChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        [name]: value,
      },
    }));
  };

  const handleServicesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const services = e.target.value.split(",").map((s) => s.trim());
    setFormData((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        services,
      },
    }));
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    imageType: "heroImage" | "logoImage" | "thumbnailImage"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      setError(null);

      const cloudinaryFolder = `brands/${imageType.replace("Image", "")}`;
      const url = await uploadToCloudinary(
        file,
        cloudinaryFolder as any
      );

      setFormData((prev) => ({
        ...prev,
        [imageType]: url,
      }));

      setImagePreview((prev) => ({
        ...prev,
        [imageType]: url,
      }));

      setSuccessMessage(`${imageType} uploaded successfully`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error(`Error uploading ${imageType}:`, err);
      setError(`Failed to upload ${imageType}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddGalleryItem = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsLoading(true);
      setError(null);

      const url = await uploadToCloudinary(
        file,
        "brands/gallery"
      );

      const newItem: GalleryItem = {
        id: Date.now(),
        src: url,
        className: "col-span-1 row-span-1",
        type: "image",
        alt: "Gallery image",
        order: formData.gallery.length,
      };

      setFormData((prev) => ({
        ...prev,
        gallery: [...prev.gallery, newItem],
      }));

      setSuccessMessage("Gallery image added successfully");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Error uploading gallery image:", err);
      setError("Failed to upload gallery image");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateGalleryItem = (
    id: number,
    updates: Partial<GalleryItem>
  ) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.map((item) =>
        item.id === id ? { ...item, ...updates } : item
      ),
    }));
  };

  const handleRemoveGalleryItem = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((item) => item.id !== id),
    }));
  };

  const handleReorderGallery = (fromIndex: number, toIndex: number) => {
    const newGallery = [...formData.gallery];
    const [item] = newGallery.splice(fromIndex, 1);
    newGallery.splice(toIndex, 0, item);

    newGallery.forEach((item, index) => {
      item.order = index;
    });

    setFormData((prev) => ({
      ...prev,
      gallery: newGallery,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validation
    if (!formData.brandName || !formData.slug) {
      setError("Brand name and slug are required");
      return;
    }

    if (!formData.heroImage || !formData.logoImage || !formData.thumbnailImage) {
      setError("All three images are required");
      return;
    }

    try {
      setIsLoading(true);

      // Check slug uniqueness (unless editing)
      if (!isEditing) {
        const slugExists = await isSlugExists(formData.slug);
        if (slugExists) {
          setError("Slug already exists");
          setIsLoading(false);
          return;
        }
      }

      if (isEditing && initialData) {
        await updateBrand(initialData.id, formData);
        setSuccessMessage("Brand updated successfully");
        setTimeout(() => router.push("/admin/brands"), 2000);
      } else {
        const newId = await createBrand(formData);
        setSuccessMessage("Brand created successfully");
        setTimeout(() => router.push("/admin/brands"), 2000);
      }
    } catch (err) {
      console.error("Error saving brand:", err);
      setError("Failed to save brand");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Success Message */}
      {successMessage && (
        <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}

      {/* Basic Information */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Basic Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Brand Name</label>
            <input
              type="text"
              name="brandName"
              value={formData.brandName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Slug</label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded"
              required
              disabled={isEditing}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Short Title</label>
          <input
            type="text"
            name="shortTitle"
            value={formData.shortTitle}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Born Year</label>
          <input
            type="text"
            name="bornYear"
            value={formData.bornYear}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Introduction</label>
          <textarea
            name="introduction"
            value={formData.introduction}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Gallery Title</label>
          <input
            type="text"
            name="galleryTitle"
            value={formData.galleryTitle}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
      </div>

      {/* Images */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Images</h2>

        {/* Hero Image */}
        <div>
          <label className="block text-sm font-medium mb-2">Hero Image</label>
          {imagePreview.heroImage && (
            <div className="relative w-full h-40 mb-2 rounded overflow-hidden">
              <Image
                src={imagePreview.heroImage}
                alt="Hero preview"
                fill
                className="object-cover"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, "heroImage")}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Logo Image */}
        <div>
          <label className="block text-sm font-medium mb-2">Logo Image</label>
          {imagePreview.logoImage && (
            <div className="relative w-full h-40 mb-2 rounded overflow-hidden">
              <Image
                src={imagePreview.logoImage}
                alt="Logo preview"
                fill
                className="object-cover"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, "logoImage")}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Thumbnail Image */}
        <div>
          <label className="block text-sm font-medium mb-2">Thumbnail Image</label>
          {imagePreview.thumbnailImage && (
            <div className="relative w-full h-40 mb-2 rounded overflow-hidden">
              <Image
                src={imagePreview.thumbnailImage}
                alt="Thumbnail preview"
                fill
                className="object-cover"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, "thumbnailImage")}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
      </div>

      {/* Details */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Details</h2>

        <div>
          <label className="block text-sm font-medium mb-2">Brand Name</label>
          <input
            type="text"
            name="brandName"
            value={formData.details.brandName}
            onChange={handleDetailsChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Time Frame</label>
            <input
              type="text"
              name="timeFrame"
              value={formData.details.timeFrame}
              onChange={handleDetailsChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Role</label>
            <input
              type="text"
              name="role"
              value={formData.details.role}
              onChange={handleDetailsChange}
              className="w-full px-3 py-2 border rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Industry</label>
          <input
            type="text"
            name="industry"
            value={formData.details.industry || ""}
            onChange={handleDetailsChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Services (comma-separated)
          </label>
          <input
            type="text"
            value={formData.details.services?.join(", ") || ""}
            onChange={handleServicesChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
      </div>

      {/* Gallery */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Gallery</h2>

        <div>
          <label className="block text-sm font-medium mb-2">Add Gallery Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleAddGalleryItem}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="space-y-2">
          {formData.gallery.map((item, index) => (
            <div key={item.id} className="flex gap-2 items-start p-4 border rounded">
              <div className="flex-1">
                <div className="relative w-full h-24 mb-2 rounded overflow-hidden">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    className="object-cover"
                  />
                </div>

                <select
                  value={item.className}
                  onChange={(e) =>
                    handleUpdateGalleryItem(item.id, {
                      className: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border rounded text-sm mb-2"
                >
                  <option value="col-span-1 row-span-1">1x1</option>
                  <option value="col-span-1 row-span-2">1x2</option>
                  <option value="col-span-2 row-span-1">2x1</option>
                  <option value="col-span-2 row-span-2">2x2</option>
                </select>

                <select
                  value={item.type}
                  onChange={(e) =>
                    handleUpdateGalleryItem(item.id, {
                      type: e.target.value as "image" | "empty",
                    })
                  }
                  className="w-full px-3 py-2 border rounded text-sm mb-2"
                >
                  <option value="image">Image</option>
                  <option value="empty">Empty Placeholder</option>
                </select>

                <input
                  type="text"
                  placeholder="Alt text"
                  value={item.alt}
                  onChange={(e) =>
                    handleUpdateGalleryItem(item.id, { alt: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded text-sm"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() =>
                    index > 0 && handleReorderGallery(index, index - 1)
                  }
                  className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
                  disabled={index === 0}
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() =>
                    index < formData.gallery.length - 1 &&
                    handleReorderGallery(index, index + 1)
                  }
                  className="px-3 py-2 bg-gray-200 rounded disabled:opacity-50"
                  disabled={index === formData.gallery.length - 1}
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveGalleryItem(item.id)}
                  className="px-3 py-2 bg-red-500 text-white rounded"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Settings</h2>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="featured"
              checked={formData.featured}
              onChange={handleInputChange}
              className="w-4 h-4"
            />
            <span>Featured</span>
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleInputChange}
              className="w-4 h-4"
            />
            <span>Published</span>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-orange text-white rounded font-medium disabled:opacity-50"
        >
          {isLoading ? "Saving..." : isEditing ? "Update Brand" : "Create Brand"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 bg-gray-300 text-black rounded font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
