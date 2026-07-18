"use client";

import Header from "@/components/Header";
import LenisProvider from "@/components/LenisProvider";
import PageTransition from "@/components/PageTransition";
import SplashScreen from "@/components/SplashScreen";

type SiteShellProps = {
  children: React.ReactNode;
};

export default function SiteShell({ children }: SiteShellProps) {
  return (
    <>
      <SplashScreen />
      <LenisProvider>
        <PageTransition />
        <Header />
        {children}
      </LenisProvider>
    </>
  );
}