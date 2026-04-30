"use client";

import { useEffect, useRef, useState } from "react";

/* ─── CONFIG ─────────────────────────────────────────── */
const ANGLE = 30;
const ORIGIN_Z = 650;
const PERSPECTIVE = 1800;

/* 🖼️ CARD DATA */
const CARDS = [
  {
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    title: "Mountains",
    desc: "Experience breathtaking mountain landscapes.",
  },
  {
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    title: "Desert",
    desc: "Feel the calm and vast desert views.",
  },
  {
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    title: "Forest",
    desc: "Explore lush green forests and nature.",
  },
  {
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    title: "Ocean",
    desc: "Relax with the sound of waves.",
  },
  {
    image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d",
    title: "City",
    desc: "Dive into vibrant city life.",
  },
  {
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
    title: "Snow",
    desc: "Enjoy peaceful snowy landscapes.",
  },
  ...Array(3).fill(0).flatMap(() => [
    {
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      title: "Mountains",
      desc: "Experience breathtaking mountain landscapes.",
    },
    {
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      title: "Desert",
      desc: "Feel the calm and vast desert views.",
    },
  ]),
];

export default function PanoramicCarousel() {
  const [rotations, setRotations] = useState<number[]>((() =>
    CARDS.map((_, i) => i * -ANGLE)
  ) as any);

  const [activeIndex, setActiveIndex] = useState(0);
  const isTweening = useRef(false);

  function updateSlides(dir: "next" | "prev") {
    if (isTweening.current) return;
    isTweening.current = true;

    const multiplier = dir === "next" ? 1 : -1;

    setRotations((prev) => {
      const updated = prev.map((r) => r + multiplier * ANGLE);

      let closestIndex = 0;
      let minDiff = Infinity;

      updated.forEach((r, i) => {
        const diff = Math.abs(r % 360);
        if (diff < minDiff) {
          minDiff = diff;
          closestIndex = i;
        }
      });

      setActiveIndex(closestIndex);
      return updated;
    });

    setTimeout(() => {
      isTweening.current = false;
    }, 700);
  }

  const stageRef = useRef<HTMLDivElement>(null);
  const dragStart = useRef<{ x: number } | null>(null);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    const onMouseDown = (e: MouseEvent) => {
      dragStart.current = { x: e.clientX };
    };

    const onMouseUp = (e: MouseEvent) => {
      if (!dragStart.current) return;
      const dx = e.clientX - dragStart.current.x;

      if (Math.abs(dx) > 40) {
        updateSlides(dx > 0 ? "prev" : "next");
      }

      dragStart.current = null;
    };

    const onTouchStart = (e: TouchEvent) => {
      dragStart.current = { x: e.touches[0].clientX };
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!dragStart.current) return;
      const dx = e.changedTouches[0].clientX - dragStart.current.x;

      if (Math.abs(dx) > 40) {
        updateSlides(dx > 0 ? "prev" : "next");
      }

      dragStart.current = null;
    };

    el.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    el.addEventListener("touchstart", onTouchStart);
    el.addEventListener("touchend", onTouchEnd);

    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);

      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return (
    <div className="w-full bg-white overflow-hidden pb-40">

      {/* ✅ HEADING SECTION (SEPARATE DIV) */}
      <div className="w-full text-center pt-20 ">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">
          <span className="text-black">OUR LATESET </span>
          <span className="text-orange">CREATIONS</span>
        </h1>

        <p className="text-base md:text-lg text-black">
          A showcase of innovation
        </p>
      </div>

      {/* ✅ CAROUSEL SECTION */}
      <div className="relative w-full h-[80vh] flex items-center justify-center">

        {/* 🔘 LEFT BUTTON (INSIDE CAROUSEL) */}
        <button
          onClick={() => updateSlides("prev")}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-50 
                     w-12 h-12 rounded-full 
                     bg-orange text-white text-2xl 
                     flex items-center justify-center 
                     hover:bg-black transition"
        >
          ←
        </button>

        {/* 🔘 RIGHT BUTTON (INSIDE CAROUSEL) */}
        <button
          onClick={() => updateSlides("next")}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-50 
                     w-12 h-12 rounded-full 
                     bg-orange text-white text-2xl 
                     flex items-center justify-center 
                     hover:bg-black transition"
        >
          →
        </button>

        {/* 🎯 STAGE */}
        <div
          ref={stageRef}
          className="relative w-full h-full flex items-center justify-center"
          style={{
            perspective: PERSPECTIVE,
            transformStyle: "preserve-3d",
          }}
        >
          {CARDS.map((card, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 300,
                height: 380,
                borderRadius: 16,
                backgroundImage: `url(${card.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                transformOrigin: `50% 50% ${ORIGIN_Z}px`,
                transform: `rotateY(${rotations[i]}deg) translateX(20px)`,
                transition:
                  "transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)",
                backfaceVisibility: "hidden",
              }}
            />
          ))}
        </div>

        {/* ✅ TEXT INSIDE CAROUSEL */}
        <div className="absolute bottom-4 text-center max-w-xl px-6">
          <h2 className="text-orange text-3xl font-bold mb-2">
            {CARDS[activeIndex].title}
          </h2>
          <p className="text-black/70 text-lg">
            {CARDS[activeIndex].desc}
          </p>
        </div>
      </div>
    </div>
  );
}