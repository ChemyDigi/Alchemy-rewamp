"use client";

import TransitionOverlay from "@/components/TransitionOverlay";
import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";

type SplashState = "visible" | "fading" | "hidden";

type SplashScreenProps = {
  onHidden?: () => void;
};

export default function SplashScreen({ onHidden }: SplashScreenProps) {
  const [state, setState] = useState<SplashState>("visible");
  const [opacity, setOpacity] = useState(0);
  const [logoScale, setLogoScale] = useState(0.75);

  const lenis = useLenis();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const hasShown = sessionStorage.getItem("splash-shown");

    if (prefersReducedMotion || hasShown) {
      setState("fading");
      const t = setTimeout(() => {
        window.scrollTo(0, 0);
        lenis?.scrollTo(0, { immediate: true });
        setState("hidden");
      }, 300);
      return () => clearTimeout(t);
    }

    sessionStorage.setItem("splash-shown", "true");
    document.body.style.overflow = "hidden";
    setOpacity(0);
    setLogoScale(0.75);

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setOpacity(1);
        setLogoScale(1);
      });
    });

    const dismiss = window.setTimeout(() => {
      document.body.style.overflow = "";
      setState("fading");
      setOpacity(0);
      setLogoScale(0.85);
      window.setTimeout(() => setState("hidden"), 300);
    }, 1000);

    return () => {
      window.clearTimeout(dismiss);
      cancelAnimationFrame(frame);
      document.body.style.overflow = "";
    };
  }, [lenis]);

  const handleVideoEnd = () => {
    setState("fading");
    setTimeout(() => {
      window.scrollTo(0, 0);
      lenis?.scrollTo(0, { immediate: true });
      document.body.style.overflow = "";
      document.body.style.height = "";
      setState("hidden");
    }, 500);
  };

  // Safety fallback: force-dismiss after 10s in case video never fires onEnded
  useEffect(() => {
    if (state === "hidden") {
      onHidden?.();
    }
  }, [onHidden, state]);

  if (state === "hidden") return null;

  return (
    <TransitionOverlay
      role="dialog"
      ariaModal
      ariaLabel="Loading website"
      opacity={state === "fading" ? 0 : opacity}
      logoScale={logoScale}
      zIndex={99999}
      pointerEvents={state === "fading" ? "none" : "all"}
    />
  );
}
