"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import BackgroundCircles from "@/components/about/BackgroundCircles";

export default function NotFound() {
  return (
    <main className="min-h-screen min-h-[100dvh] bg-white text-black relative flex flex-col justify-center items-center overflow-x-hidden px-6 py-16">
      {/* Background Decorative Rings */}
      <BackgroundCircles />

      {/* Global Navbar */}
      <Navbar />

      {/* Hero 404 Content Container */}
      <section className="relative z-10 max-w-4xl mx-auto w-full flex flex-col items-center text-center my-auto">
        
        {/* Big 404 Typography Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative my-2 flex items-center justify-center select-none"
        >
          <h1 className="font-black tracking-tighter text-[130px] xs:text-[160px] sm:text-[210px] md:text-[260px] lg:text-[300px] leading-none text-black">
            4<span className="text-orange">0</span>4
          </h1>
        </motion.div>

        {/* Main Heading & Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="max-w-3xl mx-auto space-y-4"
        >
          <h2 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-[1.05]">
            PAGE TRANSFORMED INTO <span className="text-orange">THIN AIR</span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-[#505050] font-normal leading-relaxed max-w-2xl mx-auto">
            The page you are looking for doesn&apos;t exist, has been relocated, or transmutated into another dimension. Let&apos;s guide you back to safety.
          </p>
        </motion.div>

        {/* Primary Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex justify-center w-full"
        >
          <Link href="/">
            <button className="group bg-orange text-white h-[56px] px-8 rounded-full relative flex items-center justify-center overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-black hover:px-10 active:scale-[0.97] cursor-pointer shadow-md">
              <span className="text-base font-semibold tracking-wide whitespace-nowrap transition-transform duration-500 group-hover:-translate-x-3">
                RETURN TO HOME
              </span>
              <span className="absolute right-5 text-xl translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                →
              </span>
            </button>
          </Link>
        </motion.div>

      </section>
    </main>
  );
}
