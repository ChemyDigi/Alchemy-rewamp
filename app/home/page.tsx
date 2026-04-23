import AboutIntro from "@/components/home/aboutIntro";

// import Navbar from "@/components/Navbar";
// import Hero from "@/components/Hero";
// import Features from "@/components/Features";
// import Footer from "@/components/Footer";
import Hero from "@/components/home/hero";
import Services from "@/components/home/services";
import LogoLoop from "@/components/home/logoloop";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg text-gray">
      <AboutIntro />
      {/* <Navbar />
      <Hero />
      <Features />
      <Footer /> */}
      <Hero />
      <Services/>
      <LogoLoop/>
    </main>
  );
}