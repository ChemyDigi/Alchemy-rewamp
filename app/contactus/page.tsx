import HeroSection from "@/components/contactus/Hero";
import ContactInfoSection from "@/components/contactus/ContactInfoSection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactPage() {
    return (
        <div className="contact-page-container">
            <Navbar />
            <HeroSection />
            <ContactInfoSection />
            <Footer />
        </div>
    );
}