import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/services-it/hero";
import { WaitlistHero } from "@/components/services-it/waitlist-hero";
import Work from "@/components/services-it/work"
import SpinCarousel from "@/components/services-it/SpinCarousel";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg text-gray">
      <Navbar />
      <Hero/>
      {/* <WaitlistHero/> */}
      <SpinCarousel/>
      <Footer />
      <Work/>
    </main>
  );
}