"use client";

import { useState } from "react";

const services = [
  {
    title: "Website Development",
    content:
      "Build, revamp, and launch websites or landing pages that grab attention instantly thanks to compelling UX and a user-centric approach.",
  },
  {
    title: "Mobile Development",
    content:
      "We create high-performance mobile applications tailored to your business goals with modern technologies.",
  },
  {
    title: "SEO Optimization",
    content:
      "Improve your visibility and ranking with our advanced SEO strategies designed to drive organic traffic.",
  },
  {
    title: "Wordpress Development",
    content:
      "Custom WordPress solutions that are scalable, secure, and optimized for performance.",
  },
  {
    title: "Website Redesign",
    content:
      "Transform outdated websites into modern, visually appealing, and highly functional experiences.",
  },
];

export default function ServicesSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-20 pt-10 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* LEFT TEXT */}
        <div>
          <h2 className="text-4xl md:text-5xl font-semibold leading-tight mb-6 text-black">
            SO WHAT DO WE DO <br /> EXACTLY ?
          </h2>

          <p className="text-[15px] text-black leading-relaxed mb-6 max-w-[550px]">
            Our team delivers tailored solutions across industries. From concept
            to deployment, we build scalable systems designed to evolve with your business.
          </p>

          <p className="text-[15px] text-black leading-relaxed max-w-md">
            We turn complex ideas into seamless digital experiences.
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
                    className={`text-[25px] font-semibold ${
                      isActive ? "text-orange" : "text-black"
                    }`}
                  >
                    {item.title}
                  </h3>

                  <span
                    className={`text-[25px] font-bold ${
                      isActive ? "text-orange" : "text-black"
                    }`}
                  >
                    {isActive ? "−" : "+"}
                  </span>
                </div>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isActive ? "max-h-40 mt-3" : "max-h-0"
                  }`}
                >
                  <p className="text-[15px] text-black leading-relaxed pr-6">
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