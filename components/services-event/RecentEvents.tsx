"use client";

import Image from "next/image";

export default function RecentEvents() {
  return (
    <section className="w-full px-6 md:px-12 lg:px-16 py-20 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
            OUR RECENT <span className="text-orange">EVENTS</span>
          </h2>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Event Card */}
          <div>
            <h3 className="text-3xl md:text-4xl font-bold text-orange mb-6">
              Qatar Charity
            </h3>
            <p className="text-lg text-gray-600 leading-relaxed mb-8">
              Delivered global humanitarian and development initiatives supporting vulnerable communities through sustainable programs
            </p>
            <div className="flex gap-4">
              <button className="border-2 border-black text-black px-8 py-2 rounded-full font-semibold transition-all duration-300 hover:bg-black hover:text-white">
                View Project
              </button>
            </div>
          </div>

          {/* Event Image */}
          <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden">
            <Image
              src="/images/services-event/qatar-charity.png"
              alt="Qatar Charity Event"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}