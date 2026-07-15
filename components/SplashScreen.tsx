"use client";

import { useEffect, useRef, useState } from "react";

// State machine:
// "pending"  → Black overlay visible immediately (blocks homepage from showing). No video yet.
// "active"   → Video is playing
// "fading"   → Fade-out in progress
// "hidden"   → Fully unmounted, page is interactive
type SplashState = "pending" | "active" | "fading" | "hidden";

export default function SplashScreen() {
  // Start as "pending" — this renders a solid black overlay on the very first paint,
  // preventing the homepage from ever flashing through before we decide what to show.
  const [state, setState] = useState<SplashState>("pending");
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const hasShown = sessionStorage.getItem("splash-shown");

    if (prefersReducedMotion || hasShown) {
      // Already seen or motion-sensitive: quickly dismiss the pending black overlay
      setState("fading");
      const t = setTimeout(() => setState("hidden"), 300);
      return () => clearTimeout(t);
    }

    // First visit: show the video
    sessionStorage.setItem("splash-shown", "true");
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";
    setState("active");

    return () => {
      document.body.style.overflow = "";
      document.body.style.height = "";
    };
  }, []);

  const handleVideoEnd = () => {
    document.body.style.overflow = "";
    document.body.style.height = "";
    setState("fading");
    setTimeout(() => setState("hidden"), 500);
  };

  // Safety fallback: force-dismiss after 10s in case video never fires onEnded
  useEffect(() => {
    if (state !== "active") return;
    const fallback = setTimeout(handleVideoEnd, 10_000);
    return () => clearTimeout(fallback);
  }, [state]);

  if (state === "hidden") return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Loading website"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        backgroundColor: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: state === "fading" ? 0 : 1,
        transition: "opacity 500ms ease-in-out",
        pointerEvents: state === "fading" ? "none" : "all",
      }}
    >
      {state === "active" && (
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
      )}
    </div>
  );
}
