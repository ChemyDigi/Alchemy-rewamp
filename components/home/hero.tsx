"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { getHomeContent } from "@/lib/firestore";
import { useSplash } from "@/components/SplashContext";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [watchReelUrl, setWatchReelUrl] = useState("/showreel.mp4");
  const { isSplashFinished } = useSplash();

  const mobileBgVideoRef = useRef<HTMLVideoElement>(null);
  const mobileReelVideoRef = useRef<HTMLVideoElement>(null);
  const desktopBgVideoRef = useRef<HTMLVideoElement>(null);
  const desktopReelVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    getHomeContent().then((data) => {
      if (data?.watchReelUrl) {
        setWatchReelUrl(data.watchReelUrl);
      }
    });
  }, []);

  useEffect(() => {
    const videos = [
      mobileBgVideoRef.current,
      mobileReelVideoRef.current,
      desktopBgVideoRef.current,
      desktopReelVideoRef.current,
    ].filter(Boolean) as HTMLVideoElement[];

    if (!isSplashFinished) {
      videos.forEach((video) => {
        video.pause();
        try {
          video.currentTime = 0;
        } catch { }
      });
    } else {
      videos.forEach((video) => {
        try {
          video.currentTime = 0;
        } catch { }
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => { });
        }
      });
    }
  }, [isSplashFinished]);

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

      {/* ── MOBILE LAYOUT (fills initial screen viewport, centered) ── */}
      <div className="md:hidden relative flex flex-col items-center justify-center text-center px-6 pt-14 pb-8 gap-8 overflow-hidden bg-white min-h-[100dvh]">
        {/* Mobile Animated Logo Video */}
        <div className="w-full max-w-[440px] h-[190px] sm:h-[220px] relative overflow-hidden flex items-center justify-center">
          <video
            ref={mobileBgVideoRef}
            src="/heroVideos/hero-mobile.mp4"
            muted
            loop
            playsInline
            className="w-full h-full object-cover scale-[1.28] pointer-events-none"
          />
        </div>

        {/* Showreel — plain video */}
        <div className="relative z-10 w-full max-w-[500px] mt-20 sm:mt-24 rounded-2xl overflow-hidden aspect-video shadow-sm">
          <video
            ref={mobileReelVideoRef}
            src={watchReelUrl}
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* ── DESKTOP LAYOUT (original scroll-animated, unchanged) ── */}
      <div className="hidden md:block h-[200vh] relative">
        {/* Background Video */}
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
          <video
            ref={desktopBgVideoRef}
            src="/heroVideos/hero-desktop.mp4"
            muted
            loop
            playsInline
            className="sticky top-0 h-screen w-full object-contain xl:object-cover"
          />
        </div>

        {/* HERO TEXT */}
        <motion.div
          style={{ y: heroY, scale: heroScale, opacity: heroOpacity }}
          className="sticky top-0 h-screen flex flex-col items-center justify-center text-center z-10 px-12 md:px-16"
        >
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
                ref={desktopReelVideoRef}
                src={watchReelUrl}
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