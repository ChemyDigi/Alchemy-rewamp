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

      {/* ── Trusted-by / Partners section ── */}
      <section style={{ background: "#f8f9fb", padding: "90px 48px" }}>
        <div style={{
          maxWidth: "1200px", margin: "0 auto",
          display: "flex", gap: "80px", alignItems: "center",
        }}>
          {/* Left: Text */}
          <div style={{ flex: "0 0 360px" }}>
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "5px 14px", background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "20px", fontSize: "12px",
              fontWeight: 600, color: "#888",
              letterSpacing: "0.05em", marginBottom: "28px",
            }}>
              Our Clients
            </span>
            <h2 style={{
              fontSize: "clamp(30px, 3vw, 44px)", fontWeight: 800,
              lineHeight: 1.12, color: "#0f0f0f", marginBottom: "20px",
              letterSpacing: "-0.02em",
            }}>
              Trusted by{" "}
              <span style={{ color: "#f97316" }}>200+</span>
              <br />leading brands
            </h2>
            <p style={{
              fontSize: "15px", color: "#6b7280",
              lineHeight: 1.85, maxWidth: "300px", marginBottom: "36px",
            }}>
              From creative production to digital marketing, we deliver
              measurable results for Sri Lanka&rsquo;s top companies.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <a href="/contactus" style={{
                display: "inline-block", padding: "12px 28px",
                background: "#0f0f0f", color: "#fff",
                borderRadius: "10px", fontSize: "14px",
                fontWeight: 600, textDecoration: "none",
                letterSpacing: "0.01em",
              }}>
                Work with us
              </a>
              <a href="/about" style={{
                display: "inline-block", padding: "12px 28px",
                background: "transparent", color: "#0f0f0f",
                border: "1.5px solid #e5e7eb",
                borderRadius: "10px", fontSize: "14px",
                fontWeight: 600, textDecoration: "none",
              }}>
                Learn more
              </a>
            </div>
          </div>

          {/* Right: Circular animated logo cluster */}
          <div style={{
            flex: 1,
            aspectRatio: "1 / 1",
            maxHeight: "540px",
            position: "relative",
          }}>
            <LogoDisplay />
          </div>
        </div>
      </section>

      <AboutIntro />
      <Services/>
      <PanoramicCarousel />
      <Footer />
    </main>
  );
}
