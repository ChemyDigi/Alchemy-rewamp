"use client";

// ─── Placeholder image data ───────────────────────────────────────────────────
const col1: ImageItem[] = [
  { src: "/images/services-it/1.png", alt: "Squib skincare tins", aspect: "square" },
  { src: "/images/services-it/2.png", alt: "Pink product flat-lay", aspect: "tall" },
  { src: "/images/services-it/3.png", alt: "Alure gold ad", aspect: "square" },
];

const col2: ImageItem[] = [
  { src: "/images/services-it/4.png", alt: "Model with candy", aspect: "square" },
  { src: "/images/services-it/5.jpg", alt: "Peach & Lily serum", aspect: "tall" },
  { src: "/images/services-it/6.jpg", alt: "Rosé hair-care", aspect: "tall" },
];

const col3: ImageItem[] = [
  { src: "/images/services-it/7.jpg", alt: "Skin Bloom spray", aspect: "tall" },
  { src: "/images/services-it/8.jpg", alt: "Dark hand with serum", aspect: "tall" },
  { src: "/images/services-it/9.jpg", alt: "Foam cleanser duo", aspect: "square" },
];

const col4: ImageItem[] = [
  { src: "/images/services-it/10.jpg", alt: "Bold type stack", aspect: "square" },
  { src: "/images/services-it/11.jpg", alt: "Alure avocado ad", aspect: "tall" },
  { src: "/images/services-it/12.jpg", alt: "Fresh Routine dropper", aspect: "tall" },
];

// ─── Types ────────────────────────────────────────────────────────────────────
interface ImageItem {
  src: string;
  alt: string;
  aspect: "square" | "tall";
}

// ─── Single card ─────────────────────────────────────────────────────────────
function Card({ item }: { item: ImageItem }) {
  const heightClass = item.aspect === "tall"
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
        onError={(e) => {
          const t = e.currentTarget;
          t.style.display = "none";
        }}
      />
    </div>
  );
}

// ─── Vertical infinite-scroll column using CSS animations ────────────────────
interface ColumnProps {
  images: ImageItem[];
  direction?: "up" | "down";
  speed?: number; // seconds for one complete loop
}

function InfiniteColumn({ images, direction = "up", speed = 30 }: ColumnProps) {
  // Triple the images for seamless looping (prevents the reset jump)
  const items = [...images, ...images, ...images];
  
  return (
    <div className="relative flex-1 min-w-0 overflow-hidden h-full">
      <div 
        className={`flex flex-col gap-20 infinite-scroll-${direction}`}
        style={{
          animationDuration: `${speed}s`,
          animationTimingFunction: "linear",
          animationIterationCount: "infinite",
        }}
      >
        {items.map((img, i) => (
          <Card key={`${img.src}-${i}`} item={img} />
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
        
        .infinite-scroll-up {
          animation: scroll-up linear infinite;
        }
        
        .infinite-scroll-down {
          animation: scroll-down linear infinite;
        }
      `}</style>
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────
export default function WorkSection() {
  return (
    <section className="relative w-full h-screen min-h-[600px] max-h-[1000px] bg-[#0e0b09] overflow-hidden flex items-center justify-center">
      {/* ── Giant background "WORK" text ───────────────────────────────────── */}
      <span
        aria-hidden="true"
        className="
          pointer-events-none select-none absolute inset-0
          flex items-center justify-center
          font-black uppercase tracking-tighter leading-none
          text-white
          text-[22vw] md:text-[20vw] lg:text-[18vw]
          z-0
        "
        style={{ 
          textShadow: '0 0 20px rgba(0,0,0,0.5)',
          willChange: 'transform'
        }}
      >
        WORK
      </span>

      {/* ── Carousel columns ── */}
      <div className="absolute inset-0 flex gap-32 px-8 z-10">
        <InfiniteColumn images={col1} direction="up" speed={35} />
        <InfiniteColumn images={col2} direction="down" speed={40} />
        <InfiniteColumn images={col3} direction="up" speed={38} />
        <InfiniteColumn images={col4} direction="down" speed={35} />
      </div>
    </section>
  );
}