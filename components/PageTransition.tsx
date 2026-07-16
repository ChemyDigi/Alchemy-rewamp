"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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

      // ── Step 1: Mount the overlay invisibly
      setLogoScale(0.75);
      setOpacity(0);
      setVisible(true);

      // ── Step 2: Tick to allow DOM paint, then fade in + pop logo
      await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));
      setOpacity(1);
      setLogoScale(1);

      // ── Step 3: Hold so user sees the logo (300ms)
      await new Promise((r) => setTimeout(r, 700));

      // ── Step 4: Navigate — new page renders underneath the overlay
      router.push(href);

      // ── Step 5: Give Next.js a moment to render the new route (200ms)
      await new Promise((r) => setTimeout(r, 200));

      // ── Step 6: Fade out overlay (300ms)
      setOpacity(1);
      setLogoScale(0.85);
      await new Promise((r) => setTimeout(r, 300));

      // ── Step 7: Fully unmount
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

      // Same-page hash links (e.g. "/#services") are handled by the
      // component that rendered them (smooth-scroll via Lenis, closing the
      // mobile menu, etc.) — stealing the click here would run a full page
      // transition instead and leave that in-page handler never called
      const [hrefPath, hrefHash] = href.split("#");
      if (hrefHash && hrefPath === window.location.pathname) return;

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
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99998, // just below SplashScreen (99999)
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.97)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        opacity,
        transition: "opacity 300ms ease-in-out",
        pointerEvents: "all",
      }}
    >
      <div
        style={{
          width: "clamp(120px, 20vw, 280px)",
          height: "clamp(120px, 20vw, 280px)",
          position: "relative",
          transform: `scale(${logoScale})`,
          transition: "transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <Image
          src="/alchemyLogo.png"
          alt="Alchemy"
          fill
          style={{ objectFit: "contain" }}
          priority
        />
      </div>
    </div>
  );
}
