"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";

type TeamMember = {
  name: string;
  role: string;
  img: string;
};

const names = [
  "Ravindu Lakshan",
  "Iwanka Sandaru",
  "Isuri Udayangani",
  "Dineth Gunawardana",
  "Member 5",
  "Member 6",
  "Member 7",
  "Member 8",
  "Member 9",
  "Member 10",
  "Member 11",
  "Member 12",
  "Member 13",
];

const TEAM_MEMBERS: TeamMember[] = Array.from({ length: 13 }, (_, i) => ({
  name: names[i],
  role: "Creative Team Lead",
  img: `/team/${i + 1}.jpg`,
}));

export default function TeamSection() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);

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
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll]);

  return (
    <section className="px-12 md:px-16 py-24">
      <div className="max-w-[1300px] mx-auto">

        {/* ================= HEADING ================= */}
        <div className="mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
            <span className="text-black">PEOPLE OF </span>
            <span className="text-orange-500">ALCHEMY</span>
          </h2>

          <p className="text-gray-500 mt-3 text-lg">
            Driven by passion. United by creativity.
          </p>
        </div>

        {/* ================= MOBILE ================= */}
        <div className="grid md:hidden gap-10">
          {TEAM_MEMBERS.map((m) => (
            <div key={m.name}>
              <div className="rounded-2xl overflow-hidden">
                <Image
                  src={m.img}
                  alt={m.name}
                  width={400}
                  height={500}
                  className="w-full h-[380px] object-cover"
                />
              </div>

              <p className="mt-4 text-orange-500 font-semibold text-lg">
                {m.name}
              </p>
              <p className="text-gray-500 text-sm">{m.role}</p>
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
            className="flex gap-10 overflow-x-auto px-2 py-4
              [scrollbar-width:none]
              [-ms-overflow-style:none]
              [&::-webkit-scrollbar]:hidden"
          >
            {TEAM_MEMBERS.map((m, i) => (
              <div
                key={m.name}
                className={`min-w-[300px] ${
                  i % 2 === 0 ? "mt-0" : "mt-12"
                }`}
              >
                <div className="rounded-2xl overflow-hidden">
                  <Image
                    src={m.img}
                    alt={m.name}
                    width={400}
                    height={500}
                    className="w-full h-[420px] object-cover"
                  />
                </div>

                <p className="mt-4 text-orange-500 font-semibold text-lg">
                  {m.name}
                </p>
                <p className="text-gray-500 text-sm">{m.role}</p>
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