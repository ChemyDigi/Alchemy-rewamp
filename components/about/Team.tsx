"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { getTeam, type TeamMember } from "@/lib/firestore";



export default function TeamSection() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

  // Mouse drag-to-scroll state
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  useEffect(() => {
    getTeam().then(setTeamMembers);
  }, []);

  const arrowBtn =
    "absolute top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-md transition-all duration-300 ease-out hover:bg-orange-500 hover:text-white hover:scale-110 hover:shadow-xl hover:shadow-[0_0_20px_rgba(249,115,22,0.6)] active:scale-95";

  const checkScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;

    setShowLeft(scrollLeft > 10);
    setShowRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const width = 360;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -width : width,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    checkScroll();
    // Run once after a brief timeout to let DOM render
    const timer = setTimeout(checkScroll, 100);
    window.addEventListener("resize", checkScroll);
    return () => {
      window.removeEventListener("resize", checkScroll);
      clearTimeout(timer);
    };
  }, [checkScroll, teamMembers]);

  // Mouse drag-to-scroll handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeftStart.current = scrollRef.current.scrollLeft;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; // Scroll speed multiplier
    scrollRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
  };

  return (
    <section className="px-12 md:px-16 py-24">
      <div className="max-w-[1300px] mx-auto">

        {/* ================= HEADING ================= */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            <span className="text-black">PEOPLE OF </span>
            <span className="text-orange">ALCHEMY</span>
          </h2>

          <p className="text-gray-500 mt-3 text-lg">
            Driven by passion. United by creativity.
          </p>
        </div>

        {/* ================= MOBILE ================= */}
        <div className="grid md:hidden gap-10">
          {teamMembers.map((m) => (
            <div key={m.id || m.name}>
              <div className="rounded-2xl overflow-hidden">
                <Image
                  src={m.imageUrl || "/placeholder.jpg"}
                  alt={m.name}
                  width={400}
                  height={500}
                  className="w-full h-[380px] object-cover"
                />
              </div>

              <p className="mt-4 text-orange font-semibold text-lg">
                {m.name}
              </p>
              <p className="text-gray-500 text-sm">{m.role?.replace(/^\+\s*/, "")}</p>
            </div>
          ))}
        </div>

        {/* ================= DESKTOP SCROLL ================= */}
        <div className="hidden md:block relative">

          {showLeft && (
            <button
              onClick={() => scroll("left")}
              className={`${arrowBtn} left-0`}
            >
              ←
            </button>
          )}

          <div
            ref={scrollRef}
            onScroll={checkScroll}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUpOrLeave}
            onMouseLeave={handleMouseUpOrLeave}
            className="flex gap-10 overflow-x-auto px-2 py-4 cursor-grab active:cursor-grabbing select-none
              [scrollbar-width:none]
              [-ms-overflow-style:none]
              [&::-webkit-scrollbar]:hidden"
          >
            {teamMembers.map((m, i) => (
              <div
                key={m.id || m.name}
                className={`min-w-[300px] ${i % 2 === 0 ? "mt-0" : "mt-12"
                  }`}
              >
                <div className="rounded-2xl overflow-hidden">
                  <Image
                    src={m.imageUrl || "/placeholder.jpg"}
                    alt={m.name}
                    width={400}
                    height={500}
                    className="w-full h-[420px] object-cover pointer-events-none"
                  />
                </div>

                <p className="mt-4 text-orange font-semibold text-lg">
                  {m.name}
                </p>
                <p className="text-gray-500 text-sm">{m.role?.replace(/^\+\s*/, "")}</p>
              </div>
            ))}
          </div>

          {showRight && (
            <button
              onClick={() => scroll("right")}
              className={`${arrowBtn} right-0`}
            >
              →
            </button>
          )}
        </div>
      </div>
    </section>
  );
}