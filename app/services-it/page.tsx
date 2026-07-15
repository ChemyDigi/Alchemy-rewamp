import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/services-it/hero";
import { WaitlistHero } from "@/components/services-it/waitlist-hero";
import SpinCarousel from "@/components/services-it/SpinCarousel";
import ServicesSection from "@/components/services-it/Services";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-bg text-gray">
      <div className="absolute top-14 left-6 md:top-15 md:left-10 z-50">
        <Link
          href="/#services"
          className="group relative inline-flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-full border-2 border-orange text-[#e3791d] transition duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-[#e3791d] hover:text-white hover:shadow-lg"
          aria-label="Back to Services"
        >
          <ArrowLeft className="h-5 w-5 md:h-7 md:w-7" strokeWidth={2.1} aria-hidden="true" />
        </Link>
      </div>

      <Navbar />
      <Hero />
      <SpinCarousel />
      <ServicesSection />
      <WaitlistHero />

      <Footer />

    </main>
  );
}