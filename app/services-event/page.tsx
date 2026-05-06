import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/services-event/hero";
import RecentEvents from "@/components/services-event/RecentEvents";
import ServicesOverview from "@/components/services-event/ServicesOverview";

export default function ServicesEventPage() {
  return (
    <main className="min-h-screen bg-white text-black">
      <Navbar />
      <Hero />
      <RecentEvents />
      <ServicesOverview />
      <Footer />
    </main>
  );
}