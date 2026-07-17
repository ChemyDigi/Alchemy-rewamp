"use client";

import { useEffect, useState } from "react";
import TransitionOverlay from "@/components/TransitionOverlay";

type SplashState = "visible" | "fading" | "hidden";

type SplashScreenProps = {
  onHidden?: () => void;
};

export default function SplashScreen({ onHidden }: SplashScreenProps) {
  const [state, setState] = useState<SplashState>("visible");
  const [opacity, setOpacity] = useState(0);
  const [logoScale, setLogoScale] = useState(0.75);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const hasShown = sessionStorage.getItem("splash-shown");

    if (prefersReducedMotion || hasShown) {
      setState("fading");
      const t = setTimeout(() => setState("hidden"), 150);
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
  }, []);

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
