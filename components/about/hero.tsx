"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

function ScrollFillText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 15%"], // controls animation timing
  });

  const words = text.split(" ");

  return (
    <p
      ref={ref}
      className="mt-10 max-w-[900px] font-medium mx-auto text-left text-[18px] md:text-[38px] leading-[1.5] text-gray-400 translate-x-0 md:translate-x-32 lg:translate-x-50"
    >
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;

        const color = useTransform(
          scrollYProgress,
          [start, end],
          ["#9ca3af", "#000000"]
        );

        return (
          <motion.span key={i} style={{ color }}>
            {word}{" "}
          </motion.span>
        );
      })}
    </p>
  );
}

export default function AboutHero() {
  return (
    <section className="w-full min-h-screen flex items-center bg-white">
      <div className="w-full px-6 md:px-16 lg:px-24">
        <div className="max-w-[1200px]">

          {/* TITLE */}
          <h1 className="text-[72px] md:text-[200px] font-medium text-black leading-[0.95] tracking-tight">
            About
          </h1>

          {/* SUB LABEL */}
          <div className="mt-4">
            <p className="text-[19px] text-orange-500 tracking-wide">
              CREATIVE
            </p>
            <p className="text-[19px] text-gray-500 tracking-wide">
              FORCE BUILT ON PURPOSE.
            </p>
          </div>

          {/* SCROLL FILL TEXT */}
          <ScrollFillText
            text="Since 2020, Alchemy has evolved from a marketing agency into a creative technology company. We craft digital experiences, build innovative IT solutions!"
          />

        </div>
      </div>
    </section>
  );
}