"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { getHomeContent } from "@/lib/firestore";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [watchReelUrl, setWatchReelUrl] = useState("/showreel.mp4");

  useEffect(() => {
    getHomeContent().then((data) => {
      if (data?.watchReelUrl) {
        setWatchReelUrl(data.watchReelUrl);
      }
    });
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Hero text scrolls higher
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "-80%"]);
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.7]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 0.5, 0]);

  // Video
  const reelY = useTransform(scrollYProgress, [0, 1], ["10%", "0%"]);
  const reelWidth = useTransform(scrollYProgress, [0.05, 0.45], ["25%", "94%"]);
  const reelRadius = useTransform(scrollYProgress, [0, 0.45], ["16px", "16px"]);
  const reelScale = useTransform(scrollYProgress, [0.05, 0.45], [0.6, 1]);
  const reelInnerScale = useTransform(scrollYProgress, [0.05, 0.5], [1.15, 1]);

  return (
    <section ref={containerRef} className="relative bg-white">

      {/* ── MOBILE LAYOUT (static, no animation) ── */}
      <div className="md:hidden flex flex-col items-center text-center px-6 pt-16 pb-8 gap-6">
        <div>
          <Image
            src="/images/home/logo.png"
            alt="logo"
            width={200}
            height={200}
            priority
          />
        </div>
        <div>
          <h1
            className="font-semibold tracking-tight text-black"
            style={{ fontSize: "clamp(26px, 7vw, 36px)" }}
          >
            FROM <span className="text-orange">VISION</span> TO IMPACT
          </h1>
          <p className="mt-2 text-black text-base max-w-xs mx-auto">
            Creative production. Marketing strategy. IT innovation.
            <br />
            All under one roof.
          </p>
        </div>

        {/* Showreel — plain video, no animation */}
        <div className="w-full rounded-2xl overflow-hidden aspect-video">
          <video
            src={watchReelUrl}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* ── DESKTOP LAYOUT (original scroll-animated, unchanged) ── */}
      <div className="hidden md:block h-[200vh]">
        {/* HERO TEXT */}
        <motion.div
          style={{ y: heroY, scale: heroScale, opacity: heroOpacity }}
          className="sticky top-0 h-screen flex flex-col items-center justify-center text-center z-10 px-12 md:px-16"
        >
          <div className="mb-6">
            <Image
              src="/images/home/logo.png"
              alt="logo"
              width={280}
              height={280}
              priority
            />
          </div>
          <h1
            className="font-semibold tracking-tight text-black"
            style={{ fontSize: "clamp(30px, 5vw, 40px)" }}
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
              style={{ scale: reelInnerScale }}
              className="w-full h-full"
            >
              <video
                src={watchReelUrl}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

    </section>
  );
}