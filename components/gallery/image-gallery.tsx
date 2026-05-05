"use client";

import { useState } from "react";
import Image from "next/image";

type ImageItem = {
  id: number;
  src: string;
};

const images: ImageItem[] = [
  { id: 1, src: "/images/gallery/gallery_1.png" },
  { id: 2, src: "/images/gallery/gallery_2.png" },
  { id: 3, src: "/images/gallery/gallery_3.png" },
  { id: 4, src: "/images/gallery/gallery_4.png" },
  { id: 5, src: "/images/gallery/gallery_5.png" },
  { id: 6, src: "/images/gallery/gallery_6.png" },
  { id: 6, src: "/images/gallery/gallery_7.png" },
];

export default function GallerySection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

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

        {/* ROW 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* BIG LEFT */}
          <div
            className="relative md:col-span-2 h-[250px] md:h-[300px] rounded-2xl overflow-hidden cursor-pointer"
            onClick={() => open(0)}
          >
            <Image src={images[0].src} alt="" fill className="object-cover" />
          </div>

          {/* RIGHT SQUARE */}
          <div
            className="relative h-[250px] md:h-[300px] rounded-2xl overflow-hidden cursor-pointer"
            onClick={() => open(1)}
          >
            <Image src={images[1].src} alt="" fill className="object-cover" />
          </div>
        </div>

        {/* ROW 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {[2, 3, 4].map((i) => (
            <div
              key={i}
              className="relative h-[250px] md:h-[280px] rounded-2xl overflow-hidden cursor-pointer"
              onClick={() => open(i)}
            >
              <Image src={images[i].src} alt="" fill className="object-cover" />
            </div>
          ))}
        </div>

        {/* ROW 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* LEFT SQUARE */}
          <div
            className="relative h-[250px] md:h-[300px] rounded-2xl overflow-hidden cursor-pointer"
            onClick={() => open(5)}
          >
            <Image src={images[5].src} alt="" fill className="object-cover" />
          </div>

          {/* RIGHT BIG */}
          <div
            className="relative md:col-span-2 h-[250px] md:h-[300px] rounded-2xl overflow-hidden cursor-pointer"
            onClick={() => open(0)}
          >
            <Image src={images[0].src} alt="" fill className="object-cover" />
          </div>
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
              src={images[activeIndex].src}
              alt=""
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