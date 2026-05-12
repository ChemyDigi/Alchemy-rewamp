"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { GalleryItem } from "@/types/brand";
import { getBrandBySlug } from "@/lib/firestore-brands";

interface Props {
  brandId?: string;
}

export default function Gallery({ brandId = "tommee-tippee" }: Props) {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [galleryTitle, setGalleryTitle] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const brand = await getBrandBySlug(brandId);
        
        if (!brand) {
          setError("Brand not found");
          return;
        }

        setGalleryTitle(brand.galleryTitle || "Gallery");
        setGalleryItems(brand.gallery || []);
      } catch (err) {
        console.error("Error fetching gallery:", err);
        setError("Failed to load gallery");
      } finally {
        setIsLoading(false);
      }
    };

    fetchGallery();
  }, [brandId]);

  if (isLoading) {
    return (
      <section className="w-full bg-white px-4 md:px-8 lg:px-16 py-10 md:py-14">
        <div className="max-w-6xl mx-auto">
          <div className="h-6 bg-gray-300 animate-pulse w-1/4 rounded mb-6" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[160px] md:auto-rows-[180px] gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="rounded-2xl bg-gray-300 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || galleryItems.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-white px-4 md:px-8 lg:px-16 py-10 md:py-14">
      
      <div className="max-w-6xl mx-auto mb-6">
        <p className="text-base text-orange mb-4">{galleryTitle}</p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[160px] md:auto-rows-[180px] gap-4">
        
        {galleryItems
          .sort((a, b) => a.order - b.order)
          .map((item: GalleryItem) => {
          if (item.type === "empty") {
            return (
              <div
                key={item.id}
                className={`${item.className} rounded-2xl bg-gray-200`}
              />
            );
          }

          return (
            <div
              key={item.id}
              className={`relative ${item.className} rounded-2xl overflow-hidden`}
            >
              <Image
                src={item.src}
                alt={item.alt || "gallery item"}
                fill
                className="object-cover"
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}