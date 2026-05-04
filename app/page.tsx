import AboutIntro from "@/components/home/aboutIntro";

// import Navbar from "@/components/Navbar";
// import Hero from "@/components/Hero";
// import Features from "@/components/Features";
// import Footer from "@/components/Footer";
import Hero from "@/components/home/hero";
import Services from "@/components/home/services";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PanoramicCarousel from "@/components/home/PanoramicCarousel";
<<<<<<< Updated upstream

=======
 
>>>>>>> Stashed changes
export default function Home() {
  return (
    <main className="min-h-screen bg-bg text-gray">

      <Navbar />
      <Hero />
      <AboutIntro />
      <Services/>
<<<<<<< Updated upstream
      <PanoramicCarousel />
=======
      
      <PanoramicCarousel />
       
>>>>>>> Stashed changes
      <Footer />
    </main>
  );
}
