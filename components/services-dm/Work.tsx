"use client";

import { useEffect, useState } from "react";
import { getServiceBySlug, DMPost } from "@/lib/firestore";

// ─── Placeholder image data ───────────────────────────────────────────────────
const col1: ImageItem[] = [
  { src: "/images/posts/1 (1).jpg", alt: "Squib skincare tins", aspect: "tall" },
  { src: "/images/posts/1 (2).jpg", alt: "Pink product flat-lay", aspect: "tall" },
  { src: "/images/posts/1 (3).jpg", alt: "Alure gold ad", aspect: "square" },
];

const col2: ImageItem[] = [
  { src: "/images/posts/1 (4).jpg", alt: "Model with candy", aspect: "square" },
  { src: "/images/posts/1 (5).jpg", alt: "Peach & Lily serum", aspect: "tall" },
  { src: "/images/posts/1 (6).jpg", alt: "Rosé hair-care", aspect: "tall" },
];

const col3: ImageItem[] = [
  { src: "/images/posts/1 (7).jpg", alt: "Skin Bloom spray", aspect: "tall" },
  { src: "/images/posts/1 (8).jpg", alt: "Dark hand with serum", aspect: "tall" },
  { src: "/images/posts/1 (9).jpg", alt: "Foam cleanser duo", aspect: "square" },
];

const col4: ImageItem[] = [
  { src: "/images/posts/1 (10).jpg", alt: "Bold type stack", aspect: "square" },
  { src: "/images/posts/1 (1).jpg", alt: "Alure avocado ad", aspect: "tall" },
  { src: "/images/posts/1 (2).jpg", alt: "Fresh Routine dropper", aspect: "tall" },
];

// ─── Types ────────────────────────────────────────────────────────────────────
interface ImageItem {
  src: string;
  alt: string;
  aspect: "square" | "tall";
}

// ─── Card ────────────────────────────────────────────────────────────────────
function Card({ item }: { item: ImageItem }) {
  // Use aspect-ratio containers so the full image is always visible.
  // 1080x1350 posts are 4:5 (tall). Square posts use 1:1.
  const aspectClass =
    item.aspect === "tall" ? "aspect-[4/5]" : "aspect-square";

  return (
    <div
      className={`relative w-full ${aspectClass} rounded-xl overflow-hidden flex-shrink-0 bg-neutral-800 transition-transform duration-300 hover:scale-105`}
    >
      <img
        src={item.src}
        alt={item.alt}
        className="absolute inset-0 w-full h-full object-contain"
        loading="lazy"
      />
    </div>
  );
}

// ─── Infinite Column (Desktop vertical / Mobile horizontal) ───────────────────
function InfiniteColumn({
  images,
  direction = "up",
  speed = 30,
  mobileDirection = "right",
}: {
  images: ImageItem[];
  direction?: "up" | "down";
  speed?: number;
  mobileDirection?: "right" | "left";
}) {
  const items = [...images, ...images, ...images];

  return (
    <div className="relative flex-1 min-w-[250px] overflow-hidden h-full">
      {/* DESKTOP (vertical scroll) - NO CHANGES */}
      <div
        className={`hidden md:flex flex-col gap-20 infinite-scroll-${direction}`}
        style={{
          animationDuration: `${speed}s`,
        }}
      >
        {items.map((img, i) => (
          <Card key={`${img.src}-${i}`} item={img} />
        ))}
      </div>

      {/* MOBILE (horizontal scroll) */}
      <div
        className={`flex md:hidden gap-6 infinite-scroll-${mobileDirection}`}
        style={{
          animationDuration: `4s`,
        }}
      >
        {items.map((img, i) => (
          <div key={`${img.src}-${i}`} className="w-40 flex-shrink-0">
            <Card item={img} />
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes scroll-up {
          0% { transform: translateY(0); }
          100% { transform: translateY(-66.666%); }
        }
        @keyframes scroll-down {
          0% { transform: translateY(-66.666%); }
          100% { transform: translateY(0); }
        }
        @keyframes scroll-right {
          0% { transform: translateX(0); }
          100% { transform: translateX(-66.666%); }
        }
        @keyframes scroll-left {
          0% { transform: translateX(-66.666%); }
          100% { transform: translateX(0); }
        }
        .infinite-scroll-up { animation: scroll-up linear infinite; }
        .infinite-scroll-down { animation: scroll-down linear infinite; }
        .infinite-scroll-right { animation: scroll-right linear infinite; }
        .infinite-scroll-left { animation: scroll-left linear infinite; }
      `}</style>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function WorkSection() {
  const [posts, setPosts] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getServiceBySlug("digital-marketing").then((data) => {
      if (data && data.dmPosts && data.dmPosts.length > 0) {
        // Map DMPost to ImageItem format
        const fetchedPosts: ImageItem[] = data.dmPosts.map((p) => ({
          src: p.imageUrl,
          alt: p.alt || "Work post",
          aspect: p.aspect,
        }));
        setPosts(fetchedPosts);
      }
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  // Fallback to placeholders if no data
  const finalCol1 = posts.length > 0 ? posts.filter((_, i) => i % 4 === 0) : col1;
  const finalCol2 = posts.length > 0 ? posts.filter((_, i) => i % 4 === 1) : col2;
  const finalCol3 = posts.length > 0 ? posts.filter((_, i) => i % 4 === 2) : col3;
  const finalCol4 = posts.length > 0 ? posts.filter((_, i) => i % 4 === 3) : col4;

  if (loading) {
    return (
      <section className="relative w-full bg-[#0e0b09] min-h-[700px] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#e3791d] border-t-transparent rounded-full animate-spin" />
      </section>
    );
  }

  return (
    <section className="relative w-full bg-[#0e0b09] overflow-hidden flex flex-col md:block md:h-[120vh] md:min-h-[700px] md:items-center md:justify-center">

      {/* Desktop TOP shadow - NO CHANGE */}
      <div className="hidden md:block pointer-events-none absolute top-0 left-0 w-full h-40 z-20 bg-gradient-to-b from-[#0e0b09] to-transparent" />

      {/* Desktop BOTTOM shadow - NO CHANGE */}
      <div className="hidden md:block pointer-events-none absolute bottom-0 left-0 w-full h-40 z-20 bg-gradient-to-t from-[#0e0b09] to-transparent" />

      {/* Mobile LEFT shadow - NO CHANGE */}
      <div className="md:hidden pointer-events-none absolute left-0 top-0 h-full w-16 z-20 bg-gradient-to-r from-[#0e0b09] to-transparent" />

      {/* Mobile RIGHT shadow - NO CHANGE */}
      <div className="md:hidden pointer-events-none absolute right-0 top-0 h-full w-16 z-20 bg-gradient-to-l from-[#0e0b09] to-transparent" />

      {/* WORK text - Desktop: absolute centered, Mobile: static on top, no blur */}
      <span className="
        md:pointer-events-none md:absolute md:inset-0 md:flex md:items-center md:justify-center
        md:font-black md:uppercase md:text-white md:text-[18vw] md:z-0
        hidden md:flex
      ">
        WORK
      </span>

      {/* Mobile WORK text — clean, on top, no blur, no overlap */}
      <div className="md:hidden w-full flex items-center justify-center pt-10 pb-6 z-10 relative">
        <span className="font-black uppercase text-white text-[22vw] leading-none">
          WORK
        </span>
      </div>

      {/* Blur overlay - Desktop only */}
      <div className="hidden md:block absolute inset-0 z-[5] backdrop-blur-sm bg-black/5" />

      {/* Columns - Desktop: absolute, Mobile: static flow below WORK text */}
      <div className="md:absolute md:inset-0 flex flex-col md:flex-row gap-10 md:gap-32 px-0 md:px-8 z-10 overflow-hidden md:top-0 pb-10 md:pb-0">
        {finalCol1.length > 0 && <InfiniteColumn images={finalCol1} direction="up" speed={35} mobileDirection="right" />}
        {finalCol2.length > 0 && <InfiniteColumn images={finalCol2} direction="down" speed={40} mobileDirection="left" />}
        {finalCol3.length > 0 && <InfiniteColumn images={finalCol3} direction="up" speed={38} mobileDirection="right" />}
        {/* Hide 4th column on mobile only */}
        {finalCol4.length > 0 && (
          <div className="hidden md:block">
            <InfiniteColumn images={finalCol4} direction="down" speed={35} mobileDirection="left" />
          </div>
        )}
      </div>
    </section>
  );
}