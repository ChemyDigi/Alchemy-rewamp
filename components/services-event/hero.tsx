"use client";

import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="w-full px-6 md:px-12 lg:px-16 py-20 md:py-32">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="flex flex-col justify-center">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              RESULT - DRIVEN EVENT
              <br />
              MANAGEMENT
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-lg">
              Transform ideas into powerful digital experiences with our full cycle web and mobile development services. From intuitive design to robust engineering, we craft solutions that elevate your brand and connect you with your audiences.
            </p>

            <div className="flex gap-4">
              <Link href="/contactus">
                <button className="group bg-orange text-white px-8 py-3 rounded-full font-semibold text-base md:text-lg transition-all duration-300 hover:bg-orange/90 flex items-center gap-2">
                  GET IN TOUCH
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </button>
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex justify-center items-center">
            <div className="relative w-full max-w-md h-96 md:h-[500px] lg:h-[600px]">
              <Image
                src="/images/services-event/phone.png"
                alt="Event Management Device"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>

        {/* Bottom Tagline */}
        <div className="mt-20 text-center">
          <p className="text-xl md:text-2xl text-gray-700 font-medium">
            We craft <span className="font-bold">exceptional events</span> that leave lasting impressions
            <br />
            with creativity and care.
          </p>
        </div>
      </div>
    </section>
  );
}