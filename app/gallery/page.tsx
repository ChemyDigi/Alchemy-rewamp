import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Hero from '@/components/gallery/hero';
import ImageGallery from '@/components/gallery/image-gallery';
export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray">
      <Hero />
      <ImageGallery />
      {/* NAVBAR */}
      <Navbar />
      {/* FOOTER */}
      <Footer />

      

    </main>
  );
}