import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "lenis/dist/lenis.css";
import { MobileMenuProvider } from "@/components/MobileMenuContext";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { headers } from "next/headers";
import SiteShell from "@/components/SiteShell";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const seasonSans = localFont({
  src: [
    { path: "../public/fonts/SeasonSans-TRIAL-Light.ttf", weight: "300", style: "normal" },
    { path: "../public/fonts/SeasonSans-TRIAL-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/SeasonSans-TRIAL-Medium.ttf", weight: "500", style: "normal" },
    { path: "../public/fonts/SeasonSans-TRIAL-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../public/fonts/SeasonSans-TRIAL-Bold.ttf", weight: "700", style: "normal" },
    { path: "../public/fonts/SeasonSans-TRIAL-Heavy.ttf", weight: "800", style: "normal" },
  ],
  variable: "--font-season-sans",
});

export const metadata: Metadata = {
  title: "Alchemy",
  description: "Your project",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "";
  const isAdmin = pathname.startsWith("/admin");

  return (
    <html lang="en" className={cn("h-full", "antialiased", seasonSans.variable, "font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col bg-white selection:bg-[#E3791D] selection:text-white">
        {isAdmin ? (
          children
        ) : (
          <MobileMenuProvider>
            <SiteShell>{children}</SiteShell>
          </MobileMenuProvider>
        )}
      </body>
    </html>
  );
}