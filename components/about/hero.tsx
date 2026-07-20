"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

function ScrollFillText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 95%", "end 5%"], // smoother + longer scroll range
  });

  const letters = text.split("");

  return (
    <p
      ref={ref}
      className="
  relative
  mt-20 sm:mt-16 md:mt-10
  w-full max-w-[95%] sm:max-w-[90%] md:max-w-[600px] lg:max-w-[900px]
  font-medium

  text-center sm:text-left
  mx-auto sm:mx-0

  text-[26px] sm:text-[26px] md:text-[34px] lg:text-[38px]
  leading-[1.5]
  text-gray-400

  translate-x-0 sm:translate-x-8 md:translate-x-0 lg:translate-x-72
"
    >
      {letters.map((letter, i) => {
        const start = i / letters.length;
        const end = start + 0.08; // 👈 overlap = smoother wave

        const color = useTransform(
          scrollYProgress,
          [start, end],
          ["#9ca3af", "#000000"]
        );

        return (
          <motion.span key={i} style={{ color }}>
            {letter}
          </motion.span>
        );
      })}
    </p>
  );
}

export default function AboutHero() {
  return (
    <section className="w-full min-h-[70vh] md:min-h-[70vh] lg:min-h-fit lg:pb-12 flex items-start bg-white pt-16 md:pt-24 lg:pt-32">
      <div className="w-full px-12 md:px-16">
        <div className="max-w-[1200px]">

          <h1
            className="
    text-7xl sm:text-8xl md:text-9xl 
    lg:text-[10.75rem] xl:text-[11.5rem] 2xl:text-[12.5rem]
    font-medium text-black
    leading-[0.88] tracking-[-0.03em]

    mt-[2cm] md:mt-8 lg:mt-12 xl:mt-16
    text-left
    w-full
  "
          >
            About
          </h1>

          {/* SUB LABEL */}
          <div className="mt-5 md:mt-3">
            <p className="text-xl sm:text-3xl lg:text-xl font-normal uppercase tracking-[-0.01em] text-orange">
              CREATIVE
            </p>
            <p className="text-xl sm:text-3xl lg:text-xl leading-none font-normal uppercase tracking-[-0.01em] text-gray-500">
              FORCE BUILT ON PURPOSE
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