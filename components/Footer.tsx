"use client";

import Image from "next/image";
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
      <div className="w-full px-6 md:px-16 pt-10 flex justify-center">
        <Image
          src="/alchemyLogo.png"
          alt="Alchemy Logo"
          width={1200}
          height={400}
          className="w-full max-w-[70vw] md:max-w-[60vw] h-auto object-contain"
          priority={false}
        />
      </div>

      {/* CONTENT */}
      <div className="w-full px-6 md:px-16 pt-8 pb-14 flex flex-col md:flex-row items-stretch justify-between gap-8 md:gap-14">
        {/* LEFT */}
        <div>
          <p className="text-orange font-semibold mb-3 text-xl">
            Get in Touch
          </p>

          {/* EMAIL (clickable) */}
          <a
            href="mailto:hello@alchemy.lk"
            className="text-4xl md:text-5xl font-medium leading-[1.1]   transition-colors duration-300"
          >
            hello@alchemy.lk
          </a>

          <p className="text-gray-500 mt-3 max-w-[720px] text-lg md:text-xl leading-[1.5]">
            Where creativity flows through our bloodline. We transform<br />
            ideas into extraordinary digital experiences.
          </p>

          {/* BUTTON → /contact */}
          <Link href="/contactus">
            <button className="group mt-8 bg-orange text-white h-[56px] pl-8 pr-8 rounded-full relative flex items-center overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-black min-w-[280px] hover:min-w-[340px]">

              <span className="text-base md:text-lg font-medium whitespace-nowrap">
                LET’S CREATE TOGETHER
              </span>

              <span className="absolute right-6 text-2xl translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                →
              </span>
            </button>
          </Link>
        </div>

        {/* RIGHT (ADDRESSES & SOCIALS) */}
        <div className="flex flex-col justify-between gap-10 md:items-end w-full md:min-w-[300px] md:max-w-fit">
          <div className="flex flex-row flex-wrap gap-8 md:gap-12 text-left md:text-right">
            {/* Sri Lanka Address */}
            <a
              href="https://www.google.com/maps/search/?api=1&query=43%2F5+Senanayake+Mawatha+Sri+Jayawardenepura+Kotte+Sri+Lanka"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col group transition-transform duration-300 hover:-translate-y-1"
            >
              <p className="text-orange font-semibold mb-2 text-2xl">Sri Lanka</p>
              <p className="text-gray-600 text-lg md:text-xl leading-loose">
                43/5, Senanayake Mawatha,<br />
                Sri Jayawardenepura Kotte,<br />
                Sri Lanka
              </p>
            </a>
            {/* Australia Address */}
            <div className="flex flex-col">
              <p className="text-orange font-semibold mb-2 text-2xl">Australia</p>
              <p className="text-gray-600 text-lg md:text-xl leading-loose">
                203, George Street,<br />
                Queens Park, WA 6107,<br />
                Australia
              </p>
            </div>
          </div>

          <div className="flex gap-8 text-orange text-2xl mt-6 md:mr-8">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-all duration-300 hover:text-black hover:scale-110"
            >
              <FaFacebookF />
            </a>

            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-all duration-300 hover:text-black hover:scale-110"
            >
              <FaInstagram />
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-all duration-300 hover:text-black hover:scale-110"
            >
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-gray-200 px-6 md:px-16 py-4 flex flex-col md:flex-row justify-between gap-2 text-sm text-gray-500">
        <p>© 2026 alchemy. All rights reserved</p>
        <Link href="/privacy-policy" className="hover:text-black">
          Privacy Policy
        </Link>
      </div>
    </footer>
  );
}