"use client";

import { useState } from "react";

const services = [
  {
    title: "Mobile Application Development",
    content:
      "We design and develop seamless, user-friendly mobile apps for iOS and Android. Our team focuses on creating intuitive interfaces, smooth performance, and scalable architectures to ensure your app grows with your business.",
  },
  {
    title: "Web Application Development",
    content:
      "We build modern, responsive, and high-performing web applications that elevate your online presence. Using the latest frameworks, we focus on speed, security, and great user experiences to help your business grow. Every solution is crafted to scale effortlessly as your needs evolve.",
  },
  {
    title: "SEO Optimization",
    content:
      "Our SEO strategies boost your online visibility and attract the right audience. We optimize content and technical elements to improve rankings and organic traffic.",
  },
  {
    title: "WordPress Web Development",
    content:
      "We create custom WordPress websites designed to match your brand and business goals. From theme customization to plugin integration, we build responsive, secure, and scalable platforms. Every site is optimized for performance and easy future growth.",
  },
  {
    title: "Website Redesign",
    content:
      "We transform outdated websites into modern, high-performing experiences. By improving UI/UX, speed, and mobile responsiveness, we enhance engagement and results.",
  },
];

export default function ServicesSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 md:px-10 lg:px-12 xl:px-16 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 xl:gap-32">

        {/* LEFT TEXT */}
        <div className="flex flex-col justify-start">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight mb-5 text-black">
            SO WHAT DO WE DO <br className="hidden sm:block" /> EXACTLY ?
          </h2>

          <p className="text-sm sm:text-[15px] text-black leading-relaxed mb-5 max-w-[550px]">
            We create modern digital solutions that help businesses grow, engage users,
            and strengthen their online presence. From mobile apps to scalable web
            platforms, we combine strategy, creativity, and technology to deliver
            impactful results.
          </p>

          <p className="text-sm sm:text-[15px] text-black leading-relaxed max-w-md">
            Our focus is on building fast, responsive, and user-friendly experiences
            tailored to your brand, goals, and long-term business growth.
          </p>
        </div>

        {/* RIGHT ACCORDION */}
        <div className="w-full">
          {services.map((item, index) => {
            const isActive = activeIndex === index;

            return (
              <div
                key={index}
                className="py-4 border-b border-black/10 cursor-pointer"
                onClick={() => toggle(index)}
              >
                <div className="flex justify-between items-center gap-4">
                  <h3
                    className={`text-xl sm:text-2xl md:text-[25px] font-semibold transition-colors duration-300 ${isActive ? "text-orange" : "text-black"
                      }`}
                  >
                    {item.title}
                  </h3>

                  <span
                    className={`text-2xl sm:text-3xl font-light transition-colors duration-300 ${isActive ? "text-orange" : "text-black"
                      }`}
                  >
                    {isActive ? "−" : "+"}
                  </span>
                </div>

                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${isActive ? "max-h-40 mt-4" : "max-h-0"
                    }`}
                >
                  <p className="text-sm sm:text-[15px] text-black leading-relaxed pr-0 sm:pr-6 max-w-[600px]">
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