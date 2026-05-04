import Navbar from "@/components/Navbar";
import BrandsMore from "@/components/brands-more/uppersection";
import Gallery from "@/components/brands-more/gallery";
import Footer from "@/components/Footer";


export default function Home() {
  return (
    <main className="min-h-screen bg-bg text-gray">

      <Navbar />
      <BrandsMore/>
      <Gallery/>
      <Footer />
    </main>
  );
}