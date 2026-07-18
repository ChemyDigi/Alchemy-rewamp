"use client";

import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";

type SplashState = "visible" | "fading" | "hidden";

type SplashScreenProps = {
  onHidden?: () => void;
};

export default function SplashScreen({ onHidden }: SplashScreenProps) {
  const [state, setState] = useState<SplashState>("visible");
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  const dismissed = useRef(false);

  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const hasShown = sessionStorage.getItem("splash-shown");

    if (prefersReducedMotion || hasShown) {
      setState("hidden");
      return;
    }

    document.body.style.overflow = "hidden";

    // Detect screen width to load appropriate video
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    setVideoSrc(
      isMobile
        ? "/splashscreen/splash-mobile.mp4"
        : "/splashscreen/splash-desktop.mp4"
    );

    // Safety fallback: force-dismiss after 8 seconds in case video never fires onEnded
    const fallbackTimeout = setTimeout(() => {
      handleVideoEnd();
    }, 8000);

    return () => {
      clearTimeout(fallbackTimeout);
      document.body.style.overflow = "";
    };
  }, []);

  // Ensure video is muted and plays programmatically to guarantee autoplay works on all devices
  useEffect(() => {
    const video = videoRef.current;
    if (video && videoSrc) {
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          // Ignore standard AbortError when component is unmounted or paused
          if (err.name !== "AbortError") {
            console.error("Autoplay failed:", err);
          }
        });
      }
    }

    return () => {
      if (video) {
        video.pause();
      }
    };
  }, [videoSrc]);

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    // Trigger fade-out 0.3 seconds before the video ends to bypass any black ending frame
    if (video.duration && video.duration - video.currentTime <= 0.3) {
      handleVideoEnd();
    }
  };

  const handleVideoEnd = () => {
    if (dismissed.current) return;
    dismissed.current = true;
    setState("fading");
    
    try {
      sessionStorage.setItem("splash-shown", "true");
    } catch (err) {
      console.warn("sessionStorage failed:", err);
    }

    setTimeout(() => {
      window.scrollTo(0, 0);
      lenisRef.current?.scrollTo(0, { immediate: true });
      document.body.style.overflow = "";
      document.body.style.height = "";
      setState("hidden");
    }, 500);
  };

  useEffect(() => {
    if (state === "hidden") {
      onHidden?.();
    }
  }, [onHidden, state]);

  if (state === "hidden") return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Loading website"
      className="splash-overlay fixed inset-0 flex items-center justify-center bg-white z-[99999]"
      style={{
        opacity: state === "fading" ? 0 : 1,
        transition: "opacity 500ms ease-in-out",
        pointerEvents: state === "fading" ? "none" : "all",
      }}
    >
      {videoSrc && (
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          muted
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnd}
          className="splash-video"
        />
      )}
    </div>
  );
}
