import AVHero from "@/components/services-av/hero";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import AlchemyPics from "@/components/services-av/alchemyPics";
import AlchemyRecords from "@/components/services-av/alchemyRecords";
import WhatWeDo from "@/components/services-av/whatWeDo";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "AV Production Services | Alchemy",
  description: "Professional audio and visual production services. Transform your ideas into powerful digital experiences.",
};

export default function AVProductionPage() {
  return (
    <div className="relative">
      <div className="absolute top-6 left-6 md:top-25 md:left-10 z-50">
        <Link
          href="/#services"
          className="group relative hidden md:inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-orange text-[#e3791d] transition duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-[#e3791d] hover:text-white hover:shadow-lg sm:h-[72px] sm:w-[72px]"
          aria-label="Back to Services"
        >
          <ArrowLeft className="h-7 w-7" strokeWidth={2.1} aria-hidden="true" />
        </Link>
      </div>
      <Navbar />
      <AVHero />
      <AlchemyPics />
      <AlchemyRecords />
      <WhatWeDo />
      <Footer />
    </div>
  );
}
