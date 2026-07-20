"use client";

import Header from "@/components/Header";
import LenisProvider from "@/components/LenisProvider";
import PageTransition from "@/components/PageTransition";
import SplashScreen from "@/components/SplashScreen";
import { SplashProvider } from "@/components/SplashContext";

type SiteShellProps = {
  children: React.ReactNode;
};

export default function SiteShell({ children }: SiteShellProps) {
  return (
    <SplashProvider>
      <SplashScreen />
      <LenisProvider>
        <PageTransition />
        <Header />
        {children}
      </LenisProvider>
    </SplashProvider>
  );
}