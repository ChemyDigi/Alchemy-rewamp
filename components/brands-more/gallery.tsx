"use client";

import Image from "next/image";
import galleryData from "@/data/gallery.json";

interface GalleryItem {
  id: number;
  src: string;
  className: string;
  type: string;
}

interface Gallery {
  brandId: string;
  title: string;
  items: GalleryItem[];
}

interface Props {
  brandId?: string;
}

export default function Gallery({ brandId = "tommee-tippee" }: Props) {
  const gallery = galleryData.galleries.find(
    (g: Gallery) => g.brandId === brandId
  );

  if (!gallery) {
    return null;
  }

  return (
    <section className="w-full bg-white px-4 md:px-8 lg:px-16 py-10 md:py-14">
      
      <div className="max-w-6xl mx-auto mb-6">
        <p className="text-base text-orange mb-4">{gallery.title}</p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[160px] md:auto-rows-[180px] gap-4">
        
        {gallery.items.map((item: GalleryItem) => {
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
                alt="gallery item"
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