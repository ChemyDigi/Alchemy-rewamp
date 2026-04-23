"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Hero text scrolls higher
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.7]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 0.5, 0]);

  // Video starts much higher (from top area instead of bottom)
  const reelY = useTransform(scrollYProgress, [0, 1], ["10%", "0%"]);
  const reelWidth = useTransform(scrollYProgress, [0.05, 0.45], ["25%", "94%"]);
  const reelRadius = useTransform(scrollYProgress, [0, 0.45], ["16px", "16px"]);
  const reelScale = useTransform(scrollYProgress, [0.05, 0.45], [0.6, 1]);

  return (
    <section ref={containerRef} className="relative h-[200vh] bg-white">

      {/* HERO TEXT */}
      <motion.div
        style={{ y: heroY, scale: heroScale, opacity: heroOpacity }}
        className="sticky top-0 h-screen flex flex-col items-center justify-center text-center z-10 px-4"
      >
        <div className="mb-6">
          <Image
            src="/logo.png"
            alt="logo"
            width={280}
            height={280}
            priority
          />
        </div>

        {/* <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-black">
          FROM <span className="text-orange">VISION</span> TO IMPACT
        </h1> */}

        <h1 
        className="font-semibold tracking-tight text-black"
        style={{
            fontSize: 'clamp(30px, 5vw, 40px)'
        }}
        >
        FROM <span className="text-orange">VISION</span> TO IMPACT
        </h1>

        <p className="mt-1 text-black text-lg md:text-2xl max-w-xl">
          Creative production. Marketing strategy. IT innovation.
          <br />
          All under one roof.
        </p>
      </motion.div>

      {/* SHOWREEL */}
      <motion.div
        style={{ y: reelY }}
        className="sticky top-0 h-screen flex items-center justify-center z-20 pointer-events-none"
      >
        <motion.div
          style={{
            width: reelWidth,
            borderRadius: reelRadius,
            scale: reelScale,
          }}
          className="overflow-hidden aspect-video"
        >
          <motion.div
            style={{
              scale: useTransform(scrollYProgress, [0.05, 0.5], [1.15, 1]),
            }}
            className="w-full h-full"
          >
            <video
              src="/showreel.mp4"
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
            />
          </motion.div>
        </motion.div>
      </motion.div>

    </section>
  );
}
