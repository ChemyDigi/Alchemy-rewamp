"use client";

import { ReactLenis, useLenis } from "lenis/react";
import { ReactNode, useEffect } from "react";
import { usePathname } from "next/navigation";

function ScrollToTopOnNavigate() {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    const hash = window.location.hash;
    const target = hash ? document.querySelector(hash) : null;
    if (target) {
      lenis?.scrollTo(target as HTMLElement, { immediate: true });
    } else {
      lenis?.scrollTo(0, { immediate: true });
    }
  }, [pathname, lenis]);

  return null;
}

export default function LenisProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.05, // Lower value means slower/smoother scroll (default is ~0.1)
        duration: 1.5,
        smoothWheel: true,
      }}
    >
      <ScrollToTopOnNavigate />
      {children}
    </ReactLenis>
  );
}
