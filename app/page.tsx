import AboutIntro from "@/components/home/aboutIntro";

// import Navbar from "@/components/Navbar";
// import Hero from "@/components/Hero";
// import Features from "@/components/Features";
// import Footer from "@/components/Footer";
import Hero from "@/components/home/hero";
import Services from "@/components/home/services";
import LogoLoop from "@/components/home/logoloop";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PanoramicCarousel from "@/components/home/PanoramicCarousel";
import LogoSection from "@/components/home/LogoSection";
export default function Home() {
  return (
    <main className="min-h-screen bg-bg text-gray">

      <Navbar />
      <Hero />
      <AboutIntro />
      <Services/>
      <LogoLoop/>
      <PanoramicCarousel />
      <LogoSection />
      <Footer />
    </main>
  );
}
