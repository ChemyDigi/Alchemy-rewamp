import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "lenis/dist/lenis.css";
import Header from "@/components/Header";
import LenisProvider from "@/components/LenisProvider";

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${seasonSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col selection:bg-[#E3791D] selection:text-white">
        <LenisProvider>
          <Header />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}