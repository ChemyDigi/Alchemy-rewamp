"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { Brand } from "@/types/brand";
import { getPublishedBrands } from "@/lib/firestore-brands";

export default function CreativeAgencySection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Fetch featured brands first, then all published brands
        const data = await getPublishedBrands();
        // Sort featured brands to the front
        const sorted = data.sort((a, b) => {
          if (a.featured === b.featured) return 0;
          return a.featured ? -1 : 1;
        });
        setBrands(sorted);
      } catch (err) {
        console.error("Error fetching brands:", err);
        setError("Failed to load brands. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const scrollAmount = 340;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full overflow-hidden bg-white pt-20 pb-10 md:pt-28 md:pb-12">
      <div className="mx-auto flex max-w-[1700px] flex-col gap-8">
        {/* Top Content */}
        <div className="flex flex-col justify-between gap-8 px-5 md:flex-row md:items-start md:px-10">
          {/* Heading */}
          <div className="max-w-[760px]">
            <h1 className="text-[42px] font-semibold leading-[0.95] tracking-[-0.06em] text-[#111111] sm:text-[58px] md:text-[78px] lg:text-[60px]">
              Crafted for Companies
              <br />
              That Want Results
            </h1>
          </div>
        </div>

        {/* Cards Slider */}
        <div className="relative">
          {/* Left Navigation Button (Prev) */}
          <button
            onClick={() => scroll("left")}
            className="absolute top-1/2 -translate-y-1/2 z-50 rounded-full bg-orange text-white flex items-center justify-center hover:bg-black transition left-6 w-12 h-12 text-2xl"
          >
            ←
          </button>

          {/* Right Navigation Button (Next) */}
          <button
            onClick={() => scroll("right")}
            className="absolute top-1/2 -translate-y-1/2 z-50 rounded-full bg-orange text-white flex items-center justify-center hover:bg-black transition right-6 w-12 h-12 text-2xl"
          >
            →
          </button>

          {/* Scroll Area */}
          <div
            ref={scrollRef}
            className="scrollbar-hide flex gap-4 overflow-x-auto px-5 pb-2 md:gap-4 md:px-10"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            <style jsx>{`
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            {/* Loading State */}
            {isLoading && (
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={`skeleton-${i}`}
                    className="h-[300px] w-[240px] min-w-[240px] rounded-[24px] bg-gray-300 animate-pulse sm:h-[360px] sm:w-[300px] sm:min-w-[300px] lg:h-[410px] lg:w-[340px] lg:min-w-[340px]"
                  />
                ))}
              </>
            )}

            {/* Error State */}
            {error && !isLoading && (
              <div className="flex items-center justify-center w-full px-5 py-10">
                <p className="text-red-500 text-center">{error}</p>
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && brands.length === 0 && (
              <div className="flex items-center justify-center w-full px-5 py-10">
                <p className="text-gray-500 text-center">No brands available yet.</p>
              </div>
            )}

            {/* Brands Cards */}
            {!isLoading &&
              !error &&
              brands.map((brand) => (
                <Link
                  href={`/brand/${brand.slug}`}
                  key={brand.id}
                  className="group relative h-[300px] w-[240px] min-w-[240px] overflow-hidden rounded-[24px] bg-white sm:h-[360px] sm:w-[300px] sm:min-w-[300px] lg:h-[410px] lg:w-[340px] lg:min-w-[340px]"
                >
                  <Image
                    src={brand.thumbnailImage || brand.logoImage}
                    alt={brand.brandName}
                    fill
                    priority
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 240px, (max-width: 1024px) 300px, 340px"
                  />

                  {/* Plus Icon */}
                  <button className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-all duration-300 hover:rotate-90">
                    <Plus
                      className="h-6 w-6 text-[#111111]"
                      strokeWidth={2.3}
                    />
                  </button>

                  {/* Soft Overlay */}
                  <div className="absolute inset-0 bg-black/0 transition-all duration-500 group-hover:bg-black/[0.03]" />
                </Link>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}