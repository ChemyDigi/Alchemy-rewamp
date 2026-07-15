import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Hero from '@/components/services-dm/Front';
import ScrollFillText from "@/components/services-dm/ScrollFillText";
import Work from "@/components/services-dm/Work";
import Video from "@/components/services-dm/Video";
import Services from "@/components/services-dm/Services";
import ClientCarousel from "@/components/services-dm/ClientCarousel";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function Home() {
    return (
        <main className="relative min-h-screen bg-white text-gray">
            <div className="absolute top-6 left-6 md:top-25 md:left-10 z-50">
                <Link
                    href="/#services"
                    className="group relative hidden md:inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-orange text-[#e3791d] transition duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-[#e3791d] hover:text-white hover:shadow-lg sm:h-[72px] sm:w-[72px]"
                    aria-label="Back to Services"
                >
                    <ArrowLeft className="h-7 w-7" strokeWidth={2.1} aria-hidden="true" />
                </Link>
            </div>

            <Navbar />
            <Hero />
            <ScrollFillText text="We craft stories, not just campaigns. We build connections, not just clicks." />
            <Video />
            <Services />
            <Work />
            <ClientCarousel />
            <Footer />
        </main>
    );
}