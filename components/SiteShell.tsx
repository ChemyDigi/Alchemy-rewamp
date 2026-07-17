"use client";

import { useState } from "react";
import Header from "@/components/Header";
import LenisProvider from "@/components/LenisProvider";
import PageTransition from "@/components/PageTransition";
import SplashScreen from "@/components/SplashScreen";

type SiteShellProps = {
  children: React.ReactNode;
};

export default function SiteShell({ children }: SiteShellProps) {
  const [isReady, setIsReady] = useState(false);

  return (
    <>
      <SplashScreen onHidden={() => setIsReady(true)} />
      {isReady ? (
        <LenisProvider>
          <PageTransition />
          <Header />
          {children}
        </LenisProvider>
      ) : null}
    </>
  );
}