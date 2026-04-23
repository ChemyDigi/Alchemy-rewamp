import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "../../components/about/hero";
import Stats from "../../components/about/Stats";
import Team from "../../components/about/Team";
export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray">
      
      {/* NAVBAR */}
      <Navbar />
<Hero/>
<Stats/>
<Team/>
     
      <Footer/>

    </main>
  );
}