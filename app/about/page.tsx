import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "../../components/about/hero";
import Stats from "../../components/about/Stats";
import Team from "../../components/about/Team";
import BackgroundCircles from "@/components/about/BackgroundCircles";
export default function About() {
  return (
    <main className="min-h-screen bg-white text-gray relative overflow-hidden">

      {/* GLOBAL BACKGROUND */}
      <BackgroundCircles />

      <Navbar />
      <Hero />
      <Stats />
      <Team />
      <Footer />

    </main>
  );
}