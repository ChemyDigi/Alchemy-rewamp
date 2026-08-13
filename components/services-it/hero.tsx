"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function ServicesSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-white overflow-hidden">

      {/* ================= HERO SECTION ================= */}
      <div
        className="
  max-w-[1400px] mx-auto
  px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12
  pt-20 md:pt-36 pb-8
  grid grid-cols-1 lg:grid-cols-2
  items-center gap-10
"
      >

        {/* LEFT */}
        {/* LEFT */}
        <div className="z-10 text-center lg:text-left mt-6 sm:mt-8 md:mt-12 lg:mt-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight mb-6 text-black">
            CUSTOM WEB & MOBILE <br className="hidden sm:block" />
            DEVELOPMENT
          </h1>

          <p className="text-normal sm:text-base text-black/80 leading-relaxed mb-6 max-w-[550px] mx-auto lg:mx-0 lg:text-justify">
            Transform ideas into powerful digital experiences with our full cycle web and mobile development services. From intuitive design to robust engineering, we craft solutions that elevate your brand and connect you with your audience.
          </p>

          {/* BUTTON → /contact */}
          <Link href="/contactus" className="flex justify-center lg:justify-start">
            <button className="group mt-8 mx-auto lg:mx-0 bg-orange text-white h-[48px] pl-10 pr-10 rounded-full relative flex items-center overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-black min-w-[200px] hover:min-w-[260px] active:scale-[0.97] active:duration-75">

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

        <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[650px] -mt-6 sm:-mt-8 md:-mt-10 lg:-mt-12">
          <Image
            src="/images/services-it/hero.png"
            alt="hero"
            fill
            className="object-contain"
            priority
          />
        </div>

      </div>

    </section>
  );
}