"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

function ScrollFillText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 90%", "end 10%"], // smoother on mobile
  });

  const words = text.split(" ");

  return (
    <p
      ref={ref}
      className="
        mt-6 md:mt-10
        max-w-full md:max-w-[900px]
        font-medium
        text-left
        text-[38px] sm:text-[24px] md:text-[40px] lg:text-[48px] xl:text-[56px]
        leading-[1.6]
        text-gray-400
        translate-x-0 md:translate-x-16 lg:translate-x-32
      "
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
    <section className="w-full min-h-screen flex items-start md:items-center bg-white pt-10 md:pt-0">
      <div className="w-full px-5 sm:px-8 md:px-16 lg:px-24">
        <div className="max-w-[1200px]">

          <h1
            className="
    text-[140px] sm:text-[100px] md:text-[140px] lg:text-[200px]
    font-medium text-black leading-[0.95] tracking-tight
    
    text-center md:text-left
    w-full
  "
          >
            About
          </h1>

          {/* SUB LABEL */}
          <div className="mt-3 md:mt-4">
            <p className="text-[14px] sm:text-[16px] md:text-[19px] text-orange-500 tracking-wide">
              CREATIVE
            </p>
            <p className="text-[14px] sm:text-[16px] md:text-[19px] text-gray-500 tracking-wide">
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