import AVHero from "@/components/services-av/hero";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import AlchemyPics from "@/components/services-av/alchemyPics";
import AlchemyRecords from "@/components/services-av/alchemyRecords";
import WhatWeDo from "@/components/services-av/whatWeDo";

export const metadata = {
  title: "AV Production Services | Alchemy",
  description: "Professional audio and visual production services. Transform your ideas into powerful digital experiences.",
};

export default function AVProductionPage() {
  return (
    <div>
      <Navbar />
      <AVHero />
      <AlchemyPics/>
      <AlchemyRecords/>
      <WhatWeDo/>
      <Footer />
    </div>
  );
}
