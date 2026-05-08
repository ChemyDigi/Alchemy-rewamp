"use client";

import { useRef, useState, useEffect } from "react";
import { Backlight } from "@/components/magicui/backlight";

export default function VideoBlock() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.6 }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;

    if (isVisible) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isVisible]);

  const togglePlay = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;

    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div
      ref={containerRef}
      className="w-full max-w-[1300px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20"
    >
      <Backlight blur={16} className="w-full">
        <div className="relative rounded-xl sm:rounded-2xl overflow-hidden group w-full shadow-[0_8px_30px_rgba(0,0,0,0.08)]">

          {/* VIDEO */}
          <video
            ref={videoRef}
            className="w-full aspect-video object-cover"
            src="/showreel.mp4"
            muted={isMuted}
            loop
            playsInline
          />

          {/* CENTER PLAY / PAUSE BUTTON */}
          <button
            onClick={togglePlay}
            className="
              absolute inset-0 flex items-center justify-center
              bg-black/20 opacity-0 group-hover:opacity-100 transition
            "
          >
            <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg text-xl">
              {isPlaying ? "❚❚" : "▶"}
            </div>
          </button>

          {/* SOUND CONTROL BUTTON */}
          <button
            onClick={toggleMute}
            className="
              absolute bottom-4 right-4
              w-10 h-10 bg-black/60 text-white rounded-full
              flex items-center justify-center text-lg
              hover:bg-black/80 transition
            "
          >
            {isMuted ? "🔇" : "🔊"}
          </button>

        </div>
      </Backlight>
    </div>
  );
}