"use client";

import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

interface Brand {
  id: string;
  brandName: string;
  slug: string;
  heroImage: string;
}

export default function CreativeAgencySection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const q = query(collection(db, "brands"), orderBy("brandName"));
        const snap = await getDocs(q);
        setBrands(
          snap.docs.map((d) => ({ id: d.id, ...d.data() } as Brand))
        );
      } catch (err) {
        console.error("Failed to load brands:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -340 : 340,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full overflow-hidden bg-white pt-20 pb-10 md:pt-28 md:pb-12">
      <div className="mx-auto flex max-w-[1700px] flex-col gap-8">
        {/* Top Content */}
        <div className="flex flex-col justify-between gap-8 px-5 md:flex-row md:items-start md:px-10">
          <div className="max-w-[760px]">
            <h1 className="text-[42px] font-semibold leading-[0.95] tracking-[-0.06em] text-[#111111] sm:text-[58px] md:text-[78px] lg:text-[60px]">
              Crafted for Companies
              <br />
              That Want Results
            </h1>
          </div>
        </div>

        {/* Cards Slider */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" />
          </div>
        ) : brands.length === 0 ? (
          <p className="text-center text-gray-400 py-10 px-5">
            No brands added yet. Add brands from the admin panel.
          </p>
        ) : (
          <div className="relative">
            {/* Left Nav */}
            <button
              onClick={() => scroll("left")}
              className="absolute top-1/2 -translate-y-1/2 z-50 rounded-full bg-orange text-white flex items-center justify-center hover:bg-black transition left-6 w-12 h-12 text-2xl"
            >
              ←
            </button>

            {/* Right Nav */}
            <button
              onClick={() => scroll("right")}
              className="absolute top-1/2 -translate-y-1/2 z-50 rounded-full bg-orange text-white flex items-center justify-center hover:bg-black transition right-6 w-12 h-12 text-2xl"
            >
              →
            </button>

            {/* Scroll Area */}
            <div
              ref={scrollRef}
              className="scrollbar-hide flex overflow-x-auto px-5 pb-2 md:px-10"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <style jsx>{`
                div::-webkit-scrollbar {
                  display: none;
                }
              `}</style>

              <div className="flex gap-4 md:gap-4 mx-auto">
                {brands.map((brand) => (
                  <div
                    key={brand.id}
                    className="group relative h-[300px] w-[240px] min-w-[240px] overflow-hidden rounded-[24px] bg-[#f0f0f0] sm:h-[360px] sm:w-[300px] sm:min-w-[300px] lg:h-[410px] lg:w-[340px] lg:min-w-[340px] block flex-shrink-0"
                  >
                    {brand.heroImage ? (
                      <Image
                        src={brand.heroImage}
                        alt={brand.brandName}
                        fill
                        priority
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 240px, (max-width: 1024px) 300px, 340px"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400 text-sm">
                        {brand.brandName}
                      </div>
                    )}

                    {/* Brand name overlay at bottom */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-5 py-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white font-semibold text-sm">{brand.brandName}</p>
                    </div>

                    {/* Soft overlay */}
                    <div className="absolute inset-0 bg-black/0 transition-all duration-500 group-hover:bg-black/[0.03]" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}