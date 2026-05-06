"use client";

import { useState } from "react";

const services = [
  { title: "Audio & Visual Production", description: "Create engaging audio and visual content that brings your brand to life. From concept to final production, we deliver visually stunning and sonically impressive experiences designed to capture attention and leave a lasting impact." },
  { title: "Corporate Videos", hasSubmenu: true },
  { title: "Pre Production", hasSubmenu: true },
  { title: "Production", hasSubmenu: true },
  { title: "Post Production", hasSubmenu: true },
  { title: "Animations & Motion Graphics", hasSubmenu: true },
  { title: "Drone Videography", hasSubmenu: true },
  { title: "Music Production", hasSubmenu: true },
  { title: "Audio Recording", hasSubmenu: true },
  { title: "Sound Design", hasSubmenu: true },
  { title: "Audio Mixing & Mastering", hasSubmenu: true },
];

export default function ServicesOverview() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <section className="w-full px-6 md:px-12 lg:px-16 py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Description */}
          <div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8">
              SO WHAT DO WE DO
              <br />
              EXACTLY ?
            </h2>

            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Our team delivers creative audio and visual production solutions that bring ideas to life through compelling storytelling and high-quality media. From concept development to final production, we craft engaging visuals, videos, and sound experiences tailored to your brand and audience. Using modern production techniques and creative direction, we ensure every project is impactful, memorable, and aligned with your business goals.
            </p>

            <p className="text-lg text-gray-600 leading-relaxed">
              With a strong focus on creativity and technical excellence, we transform concepts into seamless visual experiences that connect, inspire, and leave a lasting impression.
            </p>
          </div>

          {/* Right: Services List/Accordion */}
          <div className="space-y-4">
            {services.map((service, index) => (
              <div key={index} className="border-b border-gray-200 pb-4">
                <button
                  onClick={() =>
                    setExpandedIndex(expandedIndex === index ? null : index)
                  }
                  className="w-full flex justify-between items-center py-4 hover:text-orange transition-colors duration-300"
                >
                  <h3 className="text-xl md:text-2xl font-semibold text-left">
                    {service.title}
                  </h3>
                  {service.hasSubmenu && (
                    <span
                      className={`text-2xl transition-transform duration-300 ${
                        expandedIndex === index ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  )}
                </button>

                {/* Expandable Content */}
                {expandedIndex === index && service.description && (
                  <div className="pl-4 pb-4">
                    <p className="text-gray-600 leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}