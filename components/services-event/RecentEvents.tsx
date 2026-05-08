"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const events = [
  {
    id: 1,
    title: "Qatar Charity",
    description:
      "Delivered global humanitarian and development initiatives supporting vulnerable communities through sustainable programs",
    image: "/images/services-event/qatar-charity.png",
    link: "#",
  },
  {
    id: 2,
    title: "Datadog Integration",
    description:
      "Successfully implemented comprehensive monitoring and observability solutions for large-scale enterprise infrastructures",
    image: "/images/services-event/datadog.jpeg",
    link: "#",
  },
  {
    id: 3,
    title: "Mobile Solutions",
    description:
      "Crafting cutting-edge mobile experiences that connect users with seamless digital services and intuitive interfaces",
    image: "/images/services-event/phone.jpeg",
    link: "#",
  },
];

export default function RecentEvents() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % events.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const currentEvent = events[currentIndex];

  return (
    <section className="w-full bg-white px-4 md:px-8 lg:px-14 py-14 md:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto relative">

        {/* Grey background area - positioned absolutely to allow overlap */}
        <div className="absolute inset-x-0 bottom-0 top-[60px] md:top-[80px] lg:top-[100px] bg-[#eeeeee] rounded-[4px] z-0" />

        {/* Content Grid - relative and z-10 to sit above the grey box */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">

          {/* Left Column: Heading and Text */}
          <div className="flex flex-col h-full lg:pl-16">
            {/* Title - stays on white, aligns with image top */}
            <div className="h-[60px] md:h-[80px] lg:h-[100px] flex items-center">
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight text-black">
                OUR RECENT <span className="text-orange">EVENTS</span>
              </h2>
            </div>

            {/* Event Text Content - inside the grey area */}
            <div className="pt-12 md:pt-20 lg:pt-24 pb-8 lg:pb-14 relative min-h-[200px]">
              <AnimatePresence>
                <motion.div
                  key={currentEvent.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  className="w-full max-w-md absolute"
                >
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-semibold text-orange mb-5">
                    {currentEvent.title}
                  </h3>

                  <p className="text-xs md:text-sm lg:text-base text-black font-normal leading-snug max-w-sm">
                    {currentEvent.description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Overlapping Image */}
          <div className="lg:pr-16 w-full pb-10">
            <div className="relative w-full h-[250px] md:h-[320px] lg:h-[400px] rounded-[6px] overflow-hidden md:-mt-8 lg:-mt-12">
              <AnimatePresence initial={false}>
                <motion.div
                  key={currentEvent.id}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 1.2,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                  className="absolute inset-0"
                >
                  <Image
                    src={currentEvent.image}
                    alt={currentEvent.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
