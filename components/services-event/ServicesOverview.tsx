"use client";

import { useState } from "react";

const services = [
  {
    title: "Corporate Events & Conferences",
    content:
      "Engage in high-impact gatherings designed to inspire innovation, build strong networks, and drive business growth. We handle strategy, logistics, branding, and guest experience to deliver events that reflect your vision with precision and professionalism.",
  },
  {
    title: "Wedding Planning & Coordination",
    content:
      "We take care of every detail — from décor and logistics to vendor coordination — so you can truly enjoy your special day. Our team ensures a smooth, elegant, and memorable celebration that captures your love story perfectly.",
  },
  {
    title: "Entertainment & Live Shows",
    content:
      "From live bands and DJs to cultural acts and hosts, we bring vibrant energy to your event. Our team sources, schedules, and manages top talent to keep your guests entertained and engaged throughout.",
  },
  {
    title: "Event Photography",
    content:
      "Our professional photographers capture every detail, emotion, and highlight of your event. We deliver high-quality, timeless photos that tell your story beautifully and authentically.",
  },
  {
    title: "Event Videography",
    content:
      "Relive your special moments through cinematic storytelling. Our videographers create stunning highlight reels and full event coverage that bring your memories to life.",
  },
  {
    title: "Catering & Hospitality Services",
    content:
      "Delight your guests with curated menus and warm hospitality. From elegant buffets to themed dining, we ensure every bite and every moment is memorable. Our team also handles dietary preferences, service quality, and presentation to leave a lasting impression.",
  },
  {
    title: "Venue Selection & Management",
    content:
      "We help you find the ideal location and manage all on-site coordination. From ambiance and accessibility to vendor logistics, everything is handled smoothly. We also ensure that every technical and operational aspect runs without a hitch.",
  },
  {
    title: "Themed Party Planning",
    content:
      "Turn any celebration into an immersive experience with creative themes and stunning décor. Perfect for birthdays, galas, and private events that deserve a unique touch. We also coordinate props, lighting, and entertainment to bring your theme fully to life.",
  },
  {
    title: "Award Ceremonies & Galas",
    content:
      "We create elegant, high-profile events that honor achievement in style. From stage setup to guest experience, every element is designed to impress. Our team ensures seamless execution, from invitations and seating arrangements to post-event follow-up.",
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
  We create unforgettable event experiences that bring people together and
  leave lasting impressions. From corporate gatherings and weddings to live
  entertainment and gala nights, we combine creativity, planning, and flawless
  execution to make every event exceptional.
</p>

<p className="text-sm sm:text-[15px] text-black leading-relaxed max-w-md">
  Our focus is on delivering seamless, engaging, and beautifully curated events
  tailored to your vision, audience, and goals — ensuring every moment feels
  memorable and meaningful.
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

                  <span
                    className={`text-2xl sm:text-3xl font-light transition-colors duration-300 ${
                      isActive ? "text-orange" : "text-black"
                    }`}
                  >
                    {isActive ? "−" : "+"}
                  </span>
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