import AboutIntro from "@/components/home/aboutIntro";
import Hero from "@/components/home/hero";
import Services from "@/components/home/services";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PanoramicCarousel from "@/components/home/PanoramicCarousel";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg text-gray">

      <Navbar />
      <Hero />
      <AboutIntro />
      <Services/>
      <PanoramicCarousel />
      <Footer />
    </main>
  );
}
