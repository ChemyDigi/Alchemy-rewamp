"use client";

import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["800"],
});

export default function Footer() {
  return (
    <footer className="bg-white text-black w-full overflow-hidden">
      {/* BIG TYPO */}
      <div className="w-full px-[100px] pt-10 flex justify-center">
  <h1
    className={`
      ${poppins.className}
      text-[18vw]
      font-[800]
      leading-none
      tracking-tight
      flex
    `}
  >
    <span className="text-orange">a</span>
    lch
    <span className="inline-block scale-x-[-1]">e</span>
    m
    <span className="text-orange">y</span>
  </h1>
</div>

      {/* CONTENT */}
<div className="max-w-7xl ml-[100px] mr-6 pt-16 pb-14 flex flex-col md:flex-row justify-between gap-14">
  {/* LEFT */}
  <div>
    <p className="text-orange font-semibold mb-3 text-xl">
      Get in Touch
    </p>

   <p className="text-4xl md:text-5xl font-medium leading-[1.1]">
  hello@alchemy.lk
</p>

<p className="text-gray-500 mt-3 max-w-[720px] text-lg md:text-xl leading-[1.5]">
  Where creativity flows through our bloodline. We transform
  ideas into extraordinary digital experiences.
</p>

<button className="group mt-8 bg-orange text-white h-[56px] pl-8 pr-8 rounded-full relative flex items-center overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-black min-w-[280px] hover:min-w-[340px]">
  
  {/* TEXT (left aligned, stable) */}
  <span className="text-base md:text-lg font-medium whitespace-nowrap">
    LET’S CREATE TOGETHER
  </span>

  {/* ARROW */}
  <span className="absolute right-6 text-2xl translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
    →
  </span>
</button>
  </div>

  {/* RIGHT */}
  <div className="flex items-end gap-8 text-orange text-2xl">
    <Link href="#"><FaFacebookF /></Link>
    <Link href="#"><FaInstagram /></Link>
    <Link href="#"><FaLinkedinIn /></Link>
  </div>
</div>

      {/* BOTTOM */}
      <div className="border-t border-gray-200 px-6 py-4 flex flex-col md:flex-row justify-between text-sm text-gray-500">
        <p>© 2025 alchemy. All rights reserved</p>
        <Link href="/privacy-policy" className="hover:text-black">
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}