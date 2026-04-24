"use client";

import { useState } from "react";
import Image from "next/image";

const services = [
  {
    title: "Website Development",
    content:
      "Build, revamp, and launch websites or landing pages that grab attention instantly thanks to compelling UX and a user-centric approach. Spiced up with the latest trends, these sites represent your brand in the digital space, making it more noticeable among the competitors.",
  },
  {
    title: "Mobile Development",
    content:
      "We create high-performance mobile applications tailored to your business goals with modern technologies and seamless user experiences.",
  },
  {
    title: "SEO Optimization",
    content:
      "Improve your visibility and ranking with our advanced SEO strategies designed to drive organic traffic and conversions.",
  },
  {
    title: "Wordpress Development",
    content:
      "Custom WordPress solutions that are scalable, secure, and optimized for performance and flexibility.",
  },
  {
    title: "Website Redesign",
    content:
      "Transform outdated websites into modern, visually appealing, and highly functional digital experiences.",
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

        {/* RIGHT IMAGE (CUT OFF) */}
        <div className="relative h-[600px] lg:h-[700px]">
          <div className="absolute right-[-80px] top-0 w-[500px] h-full">
            <Image
              src="/it-3d-icon.png" // <-- your transparent image
              alt="hero"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>

      {/* ================= SERVICES SECTION ================= */}
      <div className="max-w-7xl mx-auto px-20 pt-4 pb-21 grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* LEFT TEXT */}
        <div>
          <h2 className="text-4xl md:text-5xl font-semibold leading-tight mb-6 text-black">
            SO WHAT DO WE DO <br /> EXACTLY ?
          </h2>

          <p className="text-[15px] text-black leading-relaxed mb-6 max-w-[550px]">
            Our team delivers tailored solutions across industries technology,
            e-commerce, hospitality, and beyond. From concept to deployment, we
            build scalable, high performance systems designed to evolve with
            your business. Every product is engineered with precision,
            creativity, and long-term impact in mind.
          </p>

          <p className="text-[15px] text-black leading-relaxed max-w-md">
            With a strong foundation in modern technologies and real-world
            problem solving, we turn complex ideas into seamless digital
            experiences.
          </p>
        </div>

        {/* RIGHT ACCORDION */}
        <div>
          {services.map((item, index) => {
            const isActive = activeIndex === index;

            return (
              <div
                key={index}
                className="py-2 cursor-pointer"
                onClick={() => toggle(index)}
              >
                <div className="flex justify-between items-center">
                  <h3
                    className={`text-lg font-medium font-semibold ${
                      isActive ? "text-orange text-[25px]" : "text-black text-[25px]"
                    }`}
                  >
                    {item.title}
                  </h3>

                  <span className={`text-xl ${isActive ? "text-orange font-bold text-[25px]" : "text-black font-bold text-[25px]"}`}>
                    {isActive ? "−" : "+"}
                  </span>
                </div>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isActive ? "max-h-40 mt-3" : "max-h-0"
                  }`}
                >
                  <p className="text-sm text-black leading-relaxed pr-6 text-[15px]">
                    {item.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}