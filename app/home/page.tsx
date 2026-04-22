// import Navbar from "@/components/Navbar";
// import Hero from "@/components/Hero";
// import Features from "@/components/Features";
// import Footer from "@/components/Footer";
import Services from "@/components/home/services";
import LogoLoop from "@/components/home/logoloop";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg text-gray">
        Sample Home Page
      {/* <Navbar />
      <Hero />
      <Features />
      <Footer /> */}
      <Services/>
      <LogoLoop/>
    </main>
  );
}