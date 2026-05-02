"use client";

import { useState } from "react";
import Image from "next/image";

const services = [
  {
    title: "Website Development",
    content:
      "Build, revamp, and launch websites or landing pages that grab attention instantly thanks to compelling UX and a user-centric approach.",
  },
  {
    title: "Mobile Development",
    content:
      "We create high-performance mobile applications tailored to your business goals.",
  },
  {
    title: "SEO Optimization",
    content:
      "Improve your visibility and ranking with our advanced SEO strategies.",
  },
  {
    title: "Wordpress Development",
    content:
      "Custom WordPress solutions that are scalable and secure.",
  },
  {
    title: "Website Redesign",
    content:
      "Transform outdated websites into modern digital experiences.",
  },
];

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
          px-6 sm:px-10 md:px-16 lg:px-[10px]
          pt-20 md:pt-36 pb-8
          grid grid-cols-1 lg:grid-cols-2
          items-center gap-10
        "
      >

        {/* LEFT */}
        <div className="z-10 text-center lg:text-left">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight mb-6 text-black">
            PERFORMANCE-DRIVEN<br className="hidden sm:block" />
            DIGITAL MARKETING
          </h1>

          <p className="text-sm sm:text-base text-black/80 leading-relaxed mb-6 max-w-[550px] mx-auto lg:mx-0">
            Transform visibility into measurable growth with our data-driven digital marketing services. From strategic campaigns to performance analytics, we drive engagement that converts audiences into loyal customers.
          </p>

          <button className="bg-orange text-white text-sm px-6 py-3 rounded-full flex items-center gap-2 hover:bg-orange-600 transition font-bold mx-auto lg:mx-0">
            GET IN TOUCH →
          </button>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[650px]">
          <Image
            src="/images/dm/hero.png"
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