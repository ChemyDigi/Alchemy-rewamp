"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const services = [
  {
    title: "Corporate Videos",
    content:
      "Boost engagement and drive results with videos that tell your brand story effectively. Our corporate productions focus on clear messaging, cinematic visuals, and measurable impact tailored to your business goals.",
  },
  {
    title: "Pre Production",
    content:
      "Storyboarding, scripting, and detailed planning create the perfect foundation for a smooth production process. We collaborate closely to shape your vision, timelines, and creative direction.",
  },
  {
    title: "Production",
    content:
      "Professional filming with industry-standard equipment and experienced crews ensures visually stunning content. From lighting to camera direction, every detail is handled with precision.",
  },
  {
    title: "Post Production",
    content:
      "Editing, color grading, sound enhancement, and visual effects transform raw footage into compelling stories that connect with audiences and elevate your brand.",
  },
  {
    title: "Animations & Motion Graphics",
    content:
      "Dynamic animations and motion graphics simplify complex ideas while adding energy and creativity to your content. Every animation is crafted to match your visual identity.",
  },
  {
    title: "Drone Videography",
    content:
      "Capture breathtaking aerial perspectives with cinematic drone footage. Our licensed operators deliver smooth, creative visuals ideal for events, promotions, and commercial productions.",
  },
  {
    title: "Music Production",
    content:
      "Original music composition and production tailored to the tone and atmosphere of your project, creating emotional depth and a memorable viewing experience.",
  },
  {
    title: "Audio Recording",
    content:
      "High-quality recording for voiceovers, podcasts, instruments, and more in acoustically optimized environments designed for crystal-clear sound capture.",
  },
  {
    title: "Sound Design",
    content:
      "Custom sound effects and immersive audio elements that strengthen storytelling, enhance emotion, and create a richer audience experience.",
  },
  {
    title: "Audio Mixing & Mastering",
    content:
      "Professional mixing and mastering that balances and refines every layer of sound, ensuring clarity, depth, and consistency across all playback platforms.",
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
  We create cinematic visual and audio experiences that help brands connect,
  inspire, and stand out. From concept development to final delivery, our
  productions combine creativity, strategy, and technical excellence.
</p>

<p className="text-sm sm:text-[15px] text-black leading-relaxed max-w-md">
  From corporate storytelling to immersive sound design, we bring ideas to
  life through powerful media production.
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
                    className={`text-xl sm:text-2xl md:text-[25px] font-semibold transition-colors duration-300 ${
                      isActive ? "text-orange" : "text-black"
                    }`}
                  >
                    {item.title}
                  </h3>

                  <ChevronDown
                    className={`w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-300 ${
                      isActive ? "rotate-180 text-orange" : "text-black"
                    }`}
                  />
                </div>

                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isActive ? "max-h-40 mt-4" : "max-h-0"
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