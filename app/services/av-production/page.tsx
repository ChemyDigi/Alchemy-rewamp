import AVHero from "@/components/services/av/hero";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "AV Production Services | Alchemy",
  description: "Professional audio and visual production services. Transform your ideas into powerful digital experiences.",
};

export default function AVProductionPage() {
  return (
    <div>
      <Navbar />
      <AVHero />

      <Footer />
    </div>
  );
}
