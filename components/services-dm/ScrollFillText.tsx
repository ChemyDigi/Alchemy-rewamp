"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export default function ScrollFillText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 95%", "end 5%"],
  });

  const letters = text.split("");

  return (
    <p
      ref={ref}
      className="
        relative
        w-full max-w-[900px]
        mx-auto
        text-center

        text-[26px] sm:text-[30px] md:text-[36px] lg:text-[40px]
        leading-[1.5]
        font-medium
        text-gray-400
      "
    >
      {letters.map((letter, i) => {
        const start = i / letters.length;
        const end = start + 0.08;

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