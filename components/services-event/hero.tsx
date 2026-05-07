"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ScrollFillText from "../services-dm/ScrollFillText";

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
        <div className="z-10 text-center lg:text-left mt-6 sm:mt-8 md:mt-12 lg:mt-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight mb-6 text-black">
            RESULT - DRIVEN EVENT <br className="hidden sm:block" />
            MANAGEMENT
          </h1>

          <p className="text-sm sm:text-base text-gray-600/80 leading-relaxed mb-6 max-w-[550px] mx-auto lg:mx-0">
            Transform ideas into powerful digital experiences with our full cycle web and mobile development services. From intuitive design to robust engineering, we craft solutions that elevate your brand and connect with your audiences.
          </p>

          <Link href="/contactus">
            <button className="bg-orange text-white text-sm px-6 py-3 rounded-full flex items-center gap-2 hover:bg-orange-600 transition font-bold mx-auto lg:mx-0">
              GET IN TOUCH →
            </button>
          </Link>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[650px] -mt-6 sm:-mt-8 md:-mt-10 lg:-mt-12">
          <Image
            src="/images/services-event/phone.png"
            alt="Event Management Device"
            fill
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* Bottom Tagline */}
      <div className="mt-20 pb-20 text-center">
        <ScrollFillText text="We craft exceptional events that leave lasting impressions with creativity and care." />
      </div>
    </section>
  );
}
