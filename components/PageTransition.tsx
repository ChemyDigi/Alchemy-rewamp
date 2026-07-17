"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import TransitionOverlay from "@/components/TransitionOverlay";

export default function PageTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const [logoScale, setLogoScale] = useState(0.75);
  // Guard against concurrent transitions
  const isNavigating = useRef(false);

  // Keep track of navigation states to coordinate route swapping
  const [targetPath, setTargetPath] = useState<string | null>(null);
  const [startingPath, setStartingPath] = useState<string | null>(null);
  const resolveRef = useRef<(() => void) | null>(null);

  // Listen for changes in the pathname to resolve the transition wait promise
  useEffect(() => {
    if (
      (targetPath && pathname === targetPath) ||
      (startingPath && pathname !== startingPath)
    ) {
      if (resolveRef.current) {
        resolveRef.current();
      }
    }
  }, [pathname, targetPath, startingPath]);

  const runTransition = useCallback(
    async (href: string) => {
      if (isNavigating.current) return;
      isNavigating.current = true;

      const pathOnly = href.split("?")[0].split("#")[0];
      const currentPath = window.location.pathname;

      setTargetPath(pathOnly);
      setStartingPath(currentPath);

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

      // Wait until the route has actually swapped, with a defensive timeout
      await new Promise<void>((resolve) => {
        let resolved = false;
        const done = () => {
          if (!resolved) {
            resolved = true;
            resolve();
          }
        };

        // Defensive timeout of 3.5 seconds
        const timeoutId = setTimeout(done, 3500);

        resolveRef.current = () => {
          clearTimeout(timeoutId);
          done();
        };
      });

      // ── Step 5: Fade out overlay once the route has swapped in
      setLogoScale(0.85);
      await new Promise((r) => setTimeout(r, 300));
      setOpacity(0);

      // ── Step 6: Fully unmount
      setVisible(false);
      isNavigating.current = false;

      // Reset transition states
      setTargetPath(null);
      setStartingPath(null);
      resolveRef.current = null;
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

      // Links that point at the page we're already on (e.g. a hash-anchor
      // like "/#services", or the logo's "/" while already home) are
      // handled by the component that rendered them — smooth-scroll via
      // Lenis, closing the mobile menu, syncing the URL hash, etc. Stealing
      // the click here would run a full page transition + a delayed
      // router.push that fights with (and re-clobbers) that in-page handler
      const [hrefPath] = href.split("#");
      if (hrefPath === window.location.pathname) return;

      // Respect prefers-reduced-motion
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      // Take over this navigation. Only preventDefault (not stopPropagation)
      // — the click must still bubble so the clicked component's own
      // onClick (e.g. closing the mobile menu) runs. Next's <Link> checks
      // e.defaultPrevented before navigating on its own, so this alone is
      // enough to stop it from double-navigating.
      e.preventDefault();

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
