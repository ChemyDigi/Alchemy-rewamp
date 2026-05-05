"use client";

import Image from "next/image";

export default function HeroSection() {
  return (
    <section className="w-full bg-white overflow-hidden">
      
      {/* ================= HERO SECTION ================= */}
      <div className="relative max-w-7xl mx-auto px-20 pt-8 pb-4 grid grid-cols-1 lg:grid-cols-2 items-center">
        
        {/* LEFT */}
        <div className="z-10">
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight mb-6 text-black">
            CUSTOM WEB & MOBILE <br /> DEVELOPMENT
          </h1>

          <p className="text-[15px] text-black leading-relaxed mb-6 max-w-[550px]">
            Transform ideas into powerful digital experiences with our full
            cycle web and mobile development services. From intuitive design to
            robust engineering, we craft solutions that elevate your brand and
            connect you with your audience.
          </p>

          <button className="bg-orange text-white text-sm px-6 py-3 rounded-full flex items-center gap-2 hover:bg-orange-600 transition font-bold">
            GET IN TOUCH →
          </button>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative h-[600px] lg:h-[700px]">
          <div className="absolute right-[-80px] top-0 w-[500px] h-full">
            <Image
              src="/it-3d-icon.png"
              alt="hero"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>

    </section>
  );
}