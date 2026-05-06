"use client";

import Link from "next/link";
import Image from "next/image";

export default function ServicesSection() {

  return (
    <section className="w-full bg-white overflow-hidden">

      {/* ================= HERO SECTION ================= */}
      <div
        className="
          max-w-[1400px] mx-auto
          pl-6 sm:pl-10 md:pl-10 lg:pl-[10px] pr-0
          pt-20 md:pt-36 pb-8
          grid grid-cols-1 lg:grid-cols-2
          items-center gap-10
        "
      >

        {/* LEFT */}
        {/* LEFT */}
        <div className="z-10 text-center lg:text-left mt-6 sm:mt-8 md:mt-12 lg:mt-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-[1.15] mb-6 text-black tracking-wide">
            PROFESSIONAL AUDIO & <br className="hidden sm:block" />
            VISUAL PRODUCTION
          </h1>

          <p className="text-sm sm:text-base text-black leading-relaxed mb-6 max-w-[550px] mx-auto lg:mx-0 text-justify">
            Transform ideas into powerful digital experiences with our full cycle audio and visual production services. From intuitive design to robust engineering, we craft solutions that elevate your brand and connect you with your audience.
          </p>

            {/* BUTTON → /contact */}
            <Link href="/contact">
                <button className="group mt-8 bg-orange text-white h-[56px] pl-8 pr-8 rounded-full relative flex items-center overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-black min-w-[200px] hover:min-w-[260px]">

                <span className="text-base md:text-lg font-medium whitespace-nowrap">
                    GET IN TOUCH
                </span>

                <span className="absolute right-6 text-2xl translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                    →
                </span>
                </button>
            </Link>

        </div>

        {/* RIGHT IMAGE */}
   
        <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[640px] -mt-6 sm:-mt-8 md:-mt-10 lg:-mt-14">
        <Image
            src="/images/services/AV/AVHero.jpeg"
            alt="hero"
            fill
            className="object-cover"
            priority
        />
        </div>

      </div>

    </section>
  );
}