import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/services-it/hero";
import { WaitlistHero } from "@/components/services-it/waitlist-hero";
import SpinCarousel from "@/components/services-it/SpinCarousel";
import ServicesSection from "@/components/services-it/Services";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-white text-gray">

      <Navbar />
      <Hero />
      <SpinCarousel />
      <ServicesSection />
      <WaitlistHero />

      <Footer />

    </main>
  );
}