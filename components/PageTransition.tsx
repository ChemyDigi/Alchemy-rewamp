"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import TransitionOverlay from "@/components/TransitionOverlay";

export default function PageTransition() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const [logoScale, setLogoScale] = useState(0.75);
  // Guard against concurrent transitions
  const isNavigating = useRef(false);

  const runTransition = useCallback(
    async (href: string) => {
      if (isNavigating.current) return;
      isNavigating.current = true;

      // ── Step 1: Mount the overlay and make it visible before navigation
      setLogoScale(0.75);
      setOpacity(1);
      setVisible(true);

      // ── Step 2: Let the overlay paint once so it covers the current page
      await new Promise<void>((r) => requestAnimationFrame(() => r()));
      setLogoScale(1);

      // ── Step 3: Hold so user sees the logo (700ms)
      await new Promise((r) => setTimeout(r, 700));

      // ── Step 4: Navigate — new page renders underneath the overlay
      router.push(href);

      // ── Step 5: Fade out overlay once the route has swapped in
      setLogoScale(0.85);
      await new Promise((r) => setTimeout(r, 300));
      setOpacity(0);

      // ── Step 6: Fully unmount
      setVisible(false);
      isNavigating.current = false;
    },
    [router]
  );

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Find the closest anchor up the DOM tree
      const anchor = (e.target as Element).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Only intercept internal navigation (starts with /)
      if (!href.startsWith("/")) return;
      // Don't intercept new-tab or download links
      if (anchor.target === "_blank") return;
      if (anchor.hasAttribute("download")) return;

      // Respect prefers-reduced-motion
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Take over this navigation
      e.preventDefault();
      e.stopPropagation();

      runTransition(href);
    };

    // Capture phase — fires before Next.js Link's own handler
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [runTransition]);

  if (!visible) return null;

  return (
    <TransitionOverlay
      ariaHidden
      opacity={opacity}
      logoScale={logoScale}
      zIndex={99998}
      pointerEvents="all"
    />
  );
}
