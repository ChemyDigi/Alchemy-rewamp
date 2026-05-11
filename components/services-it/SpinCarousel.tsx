"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { getServiceBySlug, Project } from "@/lib/firestore";

export default function SpinCarousel() {
  const [items, setItems] = useState<Project[]>([]);
  const [active, setActive] = useState(0);
  const [dragStartX, setDragStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [loading, setLoading] = useState(true);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // ── Fetch projects from Firebase ──────────────────────────────────────────
  useEffect(() => {
    getServiceBySlug("it").then((service) => {
      if (service?.projects?.length) {
        setItems(service.projects);
      }
      setLoading(false);
    });
  }, []);

  const handleNext = () => setActive((prev) => (prev + 1) % items.length);
  const handlePrev = () => setActive((prev) => (prev - 1 + items.length) % items.length);

  // ── Drag ──────────────────────────────────────────────────────────────────
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    setAutoScroll(false);
    const x = "touches" in e ? e.touches[0].clientX : e.clientX;
    setDragStartX(x);
  };

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const x = "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;
    const diff = x - dragStartX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) handlePrev();
      else handleNext();
    }
    setIsDragging(false);
    setTimeout(() => setAutoScroll(true), 2500);
  };

  // ── Auto scroll ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!autoScroll || items.length < 2) return;
    intervalRef.current = setInterval(handleNext, 3500);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [autoScroll, active, items.length]);

  // ── Position logic ────────────────────────────────────────────────────────
  const getPosition = (index: number) => {
    const diff = index - active;
    const len = items.length;
    if (diff === 0) return "center";
    if (diff === -1 || diff === len - 1) return "left";
    if (diff === 1 || diff === -(len - 1)) return "right";
    if (diff === -2 || diff === len - 2) return "left-2";
    if (diff === 2 || diff === -(len - 2)) return "right-2";
    return "hidden";
  };

  return (
    <section className="w-full bg-white py-20 overflow-hidden">

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 mb-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-4">
          OUR CUSTOM <span className="text-orange">IT SOLUTIONS</span>
        </h2>
        <p className="text-black text-sm md:text-base max-w-md">
          From concept to execution, we build custom IT solutions that are
          efficient and scalable.
        </p>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="flex items-center justify-center h-[440px] md:h-[540px]">
          <div className="w-10 h-10 border-2 border-orange border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* No projects yet */}
      {!loading && items.length === 0 && (
        <div className="flex items-center justify-center h-[200px]">
          <p className="text-gray-400 text-sm">No projects added yet.</p>
        </div>
      )}

      {/* Carousel */}
      {!loading && items.length > 0 && (
        <div
          className="relative w-full flex items-center justify-center h-[440px] md:h-[540px] select-none cursor-grab active:cursor-grabbing"
          onMouseDown={handleDragStart}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchEnd={handleDragEnd}
        >
          {items.map((item, index) => {
            const position = getPosition(index);
            const coverImage = item.images?.[0] ?? null;

            let styles = "";
            let showText = false;
            let textOpacity = "";

            if (position === "center") {
              styles = "z-30 scale-100 opacity-100 translate-x-0";
              showText = true;
              textOpacity = "opacity-100";
            } else if (position === "left") {
              styles = "z-20 scale-90 opacity-100 -translate-x-[60%]";
              showText = true;
              textOpacity = "opacity-40";
            } else if (position === "right") {
              styles = "z-20 scale-90 opacity-100 translate-x-[60%]";
              showText = true;
              textOpacity = "opacity-40";
            } else if (position === "left-2") {
              styles = "z-10 scale-75 opacity-100 -translate-x-[120%]";
            } else if (position === "right-2") {
              styles = "z-10 scale-75 opacity-100 translate-x-[120%]";
            } else {
              styles = "z-0 scale-75 opacity-0 translate-x-[180%]";
            }

            return (
              <div
                key={item.id}
                className={`absolute ${styles}`}
                style={{
                  transition: isDragging
                    ? "none"
                    : "all 900ms cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                {/* Card */}
                <div className="w-[220px] md:w-[280px] lg:w-[320px] h-[340px] md:h-[420px] lg:h-[460px] relative rounded-2xl overflow-hidden shadow-xl pointer-events-none">
                  {coverImage ? (
                    <Image
                      src={coverImage}
                      alt={item.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 220px, (max-width: 1024px) 280px, 320px"
                    />
                  ) : (
                    /* Fallback gradient when no image is set */
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        background:
                          "linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 50%, #e3791d22 100%)",
                      }}
                    >
                      <span className="text-white/20 text-5xl font-bold select-none">
                        {item.title.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Caption */}
                {showText && (
                  <div className={`mt-4 text-center ${textOpacity}`}>
                    <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                      {item.title}
                    </h3>
                    {item.category && (
                      <p className="text-sm text-gray-500">{item.category}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}