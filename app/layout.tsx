import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${seasonSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}