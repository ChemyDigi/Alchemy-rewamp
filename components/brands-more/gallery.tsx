"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

interface Props {
  brandId?: string;
}

export default function Gallery({ brandId = "tommee-tippee" }: Props) {
  const [subImages, setSubImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const q = query(
          collection(db, "brands"),
          where("slug", "==", brandId)
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          const data = snap.docs[0].data();
          setSubImages(data.subImages ?? []);
        }
      } catch (err) {
        console.error("Failed to load gallery:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [brandId]);

  if (loading || subImages.length === 0) return null;

  // Layout classes for up to 5 images with a bento-style grid
  const layoutClasses = [
    "col-span-2 row-span-2",   // img 1 — large left
    "col-span-1 row-span-1",   // img 2 — top right
    "col-span-1 row-span-1",   // img 3 — bottom right
    "col-span-1 row-span-1",   // img 4
    "col-span-1 row-span-1",   // img 5
  ];

  return (
    <section className="w-full bg-white px-4 md:px-8 lg:px-16 py-10 md:py-14">
      <div className="max-w-6xl mx-auto mb-6">
        <p className="text-base text-orange mb-4">Gallery</p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-[200px] gap-4">
        {subImages.map((src, idx) => (
          <div
            key={idx}
            className={`relative rounded-2xl overflow-hidden ${
              idx === 0 && subImages.length >= 3
                ? "lg:col-span-2 lg:row-span-2"
                : ""
            }`}
          >
            <Image
              src={src}
              alt={`Gallery image ${idx + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        ))}
      </div>
    </section>
  );
}