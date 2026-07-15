"use client";

import { useEffect, useState, useRef } from "react";

export default function SplashScreen() {
  const [showSplash, setShowSplash] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Check if splash has already been shown in the current session
    const hasShownSplash = sessionStorage.getItem("splash-shown");

    if (prefersReducedMotion || hasShownSplash) {
      return;
    }

    // Set splash to show and record in session storage
    setShowSplash(true);
    sessionStorage.setItem("splash-shown", "true");

    // Lock body scroll
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";

    return () => {
      // Re-enable body scroll if component unmounts early
      document.body.style.overflow = "";
      document.body.style.height = "";
    };
  }, []);

  const handleVideoEnd = () => {
    setFadeOut(true);
    // Restore scrolling slightly before the fadeout completes for a smoother feel,
    // or precisely when it ends. Let's restore scroll now.
    document.body.style.overflow = "";
    document.body.style.height = "";

    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 500); // matches the transition-opacity duration-500 class

    return () => clearTimeout(timer);
  };

  // Fallback timer: in case video fails to load/play, auto-transition after 5 seconds
  useEffect(() => {
    if (!showSplash) return;

    const fallbackTimer = setTimeout(() => {
      handleVideoEnd();
    }, 6000); // 6 seconds maximum fallback

    return () => clearTimeout(fallbackTimer);
  }, [showSplash]);

  if (!showSplash) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Loading website"
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-black transition-opacity duration-500 ease-in-out ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <video
        ref={videoRef}
        src="/splash.mp4"
        autoPlay
        muted
        playsInline
        onEnded={handleVideoEnd}
        className="w-full h-full object-cover"
        style={{ pointerEvents: "none" }}
      />
    </div>
  );
}
