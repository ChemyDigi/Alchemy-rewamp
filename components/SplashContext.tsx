"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface SplashContextValue {
  isSplashFinished: boolean;
  finishSplash: () => void;
}

const SplashContext = createContext<SplashContextValue>({
  isSplashFinished: true,
  finishSplash: () => {},
});

export function SplashProvider({ children }: { children: ReactNode }) {
  const [isSplashFinished, setIsSplashFinished] = useState<boolean>(false);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const hasShown =
      typeof window !== "undefined" &&
      sessionStorage.getItem("splash-shown-v2");

    if (prefersReducedMotion || hasShown) {
      setIsSplashFinished(true);
    }
  }, []);

  const finishSplash = () => {
    setIsSplashFinished(true);
  };

  return (
    <SplashContext.Provider value={{ isSplashFinished, finishSplash }}>
      {children}
    </SplashContext.Provider>
  );
}

export function useSplash() {
  return useContext(SplashContext);
}
