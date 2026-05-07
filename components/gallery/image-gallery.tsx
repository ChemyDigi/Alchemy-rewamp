"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getGallery, type GalleryItem } from "@/lib/firestore";

export default function GallerySection() {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    getGallery().then(setImages);
  }, []);

  const open = (index: number) => setActiveIndex(index);
  const close = () => setActiveIndex(null);

  const next = () => {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex + 1) % images.length);
  };

  const prev = () => {
    if (activeIndex === null) return;
    setActiveIndex((activeIndex - 1 + images.length) % images.length);
  };

  return (
    <section className="w-full bg-white py-16 px-4 md:px-10">
      
      <div className="flex flex-col gap-4">

        {/* DYNAMIC BENTO GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {images.map((img, i) => {
            const pos = i % 7;
            const isSpan2 = pos === 0 || pos === 6;
            return (
              <div
                key={img.id || i}
                className={`relative h-[250px] md:h-[300px] rounded-2xl overflow-hidden cursor-pointer ${
                  isSpan2 ? "md:col-span-2" : "col-span-1"
                }`}
                onClick={() => open(i)}
              >
                <Image src={img.imageUrl} alt={img.title || ""} fill className="object-cover" />
              </div>
            );
          })}
        </div>

      </div>

      {/* LIGHTBOX */}
      {activeIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur flex items-center justify-center">

          {/* CLOSE */}
          <button
            onClick={close}
            className="absolute top-6 right-6 text-white text-3xl"
          >
            ✕
          </button>

          {/* PREV */}
          <button
            onClick={prev}
            className="absolute left-6 text-white text-4xl"
          >
            ←
          </button>

          {/* IMAGE */}
          <div className="relative w-[90vw] max-w-5xl h-[70vh]">
            <Image
              src={images[activeIndex].imageUrl}
              alt={images[activeIndex].title || ""}
              fill
              className="object-contain rounded-xl"
            />
          </div>

          {/* NEXT */}
          <button
            onClick={next}
            className="absolute right-6 text-white text-4xl"
          >
            →
          </button>
        </div>
      )}
    </section>
  );
}