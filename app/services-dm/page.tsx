import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Hero from '@/components/services-dm/Front';
import ScrollFillText from "@/components/services-dm/ScrollFillText";
import Work from "@/components/services-dm/Work";
export default function Home() {
    return (
        <main className="min-h-screen bg-white text-gray">

            <Navbar />
            <Hero />
            <ScrollFillText text="We craft stories, not just campaigns. We build connections, not just clicks." />
            <Work/>
            <Footer />



        </main>
    );
}