"use client";

import Header from "@/components/Header";
import LenisProvider from "@/components/LenisProvider";
import PageTransition from "@/components/PageTransition";
import SplashScreen from "@/components/SplashScreen";
import { SplashProvider } from "@/components/SplashContext";
import { usePathname } from "next/navigation";

type SiteShellProps = {
  children: React.ReactNode;
};

export default function SiteShell({ children }: SiteShellProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

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