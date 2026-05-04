"use client";

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
  const heightClass =
    item.aspect === "tall"
      ? "h-48 md:h-60 lg:h-72"
      : "h-40 md:h-52 lg:h-50";

  return (
    <div
      className={`relative w-full ${heightClass} rounded-xl overflow-hidden flex-shrink-0 bg-neutral-800 transition-transform duration-300 hover:scale-105`}
    >
      <img
        src={item.src}
        alt={item.alt}
        className="absolute inset-0 w-full h-full object-cover"
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
}: {
  images: ImageItem[];
  direction?: "up" | "down";
  speed?: number;
}) {
  const items = [...images, ...images, ...images];

  return (
    <div className="relative flex-1 min-w-[250px] overflow-hidden h-full">
      {/* DESKTOP (vertical scroll) */}
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
        className={`flex md:hidden gap-6 infinite-scroll-x`}
        style={{
          animationDuration: `${speed}s`,
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
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(-66.666%);
          }
        }

        @keyframes scroll-down {
          0% {
            transform: translateY(-66.666%);
          }
          100% {
            transform: translateY(0);
          }
        }

        @keyframes scroll-x {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-66.666%);
          }
        }

        .infinite-scroll-up {
          animation: scroll-up linear infinite;
        }

        .infinite-scroll-down {
          animation: scroll-down linear infinite;
        }

        .infinite-scroll-x {
          animation: scroll-x linear infinite;
        }
      `}</style>
    </div>
  );
}

// ─── Main Section ─────────────────────────────────────────────────────────────
export default function WorkSection() {
  return (
    <section className="relative w-full h-[120vh] min-h-[700px] bg-[#0e0b09] overflow-hidden flex items-center justify-center">

      {/* Desktop TOP shadow */}
      <div className="hidden md:block pointer-events-none absolute top-0 left-0 w-full h-40 z-20 bg-gradient-to-b from-[#0e0b09] to-transparent" />

      {/* Desktop BOTTOM shadow */}
      <div className="hidden md:block pointer-events-none absolute bottom-0 left-0 w-full h-40 z-20 bg-gradient-to-t from-[#0e0b09] to-transparent" />

      {/* Mobile LEFT shadow */}
      <div className="md:hidden pointer-events-none absolute left-0 top-0 h-full w-16 z-20 bg-gradient-to-r from-[#0e0b09] to-transparent" />

      {/* Mobile RIGHT shadow */}
      <div className="md:hidden pointer-events-none absolute right-0 top-0 h-full w-16 z-20 bg-gradient-to-l from-[#0e0b09] to-transparent" />

      {/* WORK background */}
      <span className="pointer-events-none absolute inset-0 flex items-center justify-center font-black uppercase text-white text-[22vw] md:text-[18vw] z-0">
        WORK
      </span>

      {/* Blur overlay */}
      <div className="absolute inset-0 z-[5] backdrop-blur-sm bg-black/5" />

      {/* Columns */}
      <div className="absolute inset-0 flex flex-col md:flex-row gap-10 md:gap-32 px-6 md:px-8 z-10 overflow-hidden">
        <InfiniteColumn images={col1} direction="up" speed={35} />
        <InfiniteColumn images={col2} direction="down" speed={40} />
        <InfiniteColumn images={col3} direction="up" speed={38} />
        <InfiniteColumn images={col4} direction="down" speed={35} />
      </div>
    </section>
  );
}