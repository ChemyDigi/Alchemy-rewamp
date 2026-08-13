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
    <section className="w-full bg-white pt-6 pb-16 md:pt-4 md:pb-16 lg:pt-16 px-4 md:px-10">
      
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
                <Image
                  src={img.imageUrl}
                  alt={img.title || ""}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                />
              </div>
            );
          })}
        </div>

      </div>

      {/* LIGHTBOX */}
      {activeIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 select-none"
          onClick={close}
        >
          {/* CLOSE */}
          <button
            onClick={close}
            aria-label="Close lightbox"
            className="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center text-xl transition backdrop-blur-sm shadow-md active:scale-95"
          >
            ✕
          </button>

          {/* PREV */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous image"
            className="absolute left-3 sm:left-6 z-20 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center text-2xl transition backdrop-blur-sm shadow-md active:scale-95"
          >
            ‹
          </button>

          {/* IMAGE */}
          <div
            className="relative w-[90vw] max-w-5xl h-[75vh] z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[activeIndex].imageUrl}
              alt={images[activeIndex].title || ""}
              fill
              sizes="(max-width: 1024px) 90vw, 1024px"
              className="object-contain rounded-xl select-none"
            />
          </div>

          {/* NEXT */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next image"
            className="absolute right-3 sm:right-6 z-20 w-11 h-11 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center text-2xl transition backdrop-blur-sm shadow-md active:scale-95"
          >
            ›
          </button>
        </div>
      )}
    </section>
  );
}