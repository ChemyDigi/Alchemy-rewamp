import AboutIntro from "@/components/home/aboutIntro";
import Hero from "@/components/home/hero";
import Services from "@/components/home/services";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PanoramicCarousel from "@/components/home/PanoramicCarousel";
import LogoDisplay from "@/components/home/LogoDisplay";

export default function Home() {
  return (
    <main className="min-h-screen bg-bg text-gray">

      <Navbar />
      <Hero />
      <AboutIntro />
      <Services />

      {/* ── Trusted-by / Partners section ── */}
      <style>{`
        @media (max-width: 767px) {
          #clients-inner     { flex-direction: column !important; gap: 32px !important; }
          #clients-text      { flex: unset !important; width: 100% !important; }
          #clients-logo      { flex: unset !important; width: 100% !important; max-height: 380px !important; }
        }
      `}</style>
      <section id="clients-section" className="w-full py-16 md:py-24 px-6 md:px-10 lg:px-16 bg-white">
        <div id="clients-inner" style={{
          maxWidth: "1400px",
          display: "flex", gap: "80px", alignItems: "center", justifyContent: "space-between"
        }}>
          {/* Left: Text */}
          <div id="clients-text" style={{ flex: "0 0 480px" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "5px 14px", background: "#fff",
              border: "1px solid #ffffffff",
              borderRadius: "20px", fontSize: "12px",
              fontWeight: 600, color: "#888",
              letterSpacing: "0.05em", marginBottom: "28px",
            }}>

            </span>
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-black uppercase" style={{
              marginBottom: "20px",
            }}>
              <span style={{ whiteSpace: "nowrap" }}>TRUSTED BY <span className="text-orange">40+</span></span>
              <br />BRANDS
            </h2>
            <p className="text-[#505050] mt-2 text-sm md:text-lg lg:text-2xl" style={{
              maxWidth: "300px", marginBottom: "36px",
            }}>
              From creative production to digital marketing, we deliver
              measurable results for Sri Lanka&rsquo;s top companies.
            </p>
          </div>

          {/* Right: Circular animated logo cluster */}
          <div id="clients-logo" style={{
            width: "100%",
            maxWidth: "760px",
            aspectRatio: "1 / 1",
            maxHeight: "540px",
            position: "relative",
          }}>
            <LogoDisplay />
          </div>
        </div>
      </section>


      <PanoramicCarousel />
      <Footer />
    </main>
  );
}
