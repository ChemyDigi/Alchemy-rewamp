"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { poppins } from "@/app/fonts";
import { usePathname } from "next/navigation";

const navItems = ["About", "Gallery", "Blog", "Contact"];

const navLinks: Record<string, string> = {
  About: "/about",
  Gallery: "/gallery",
  Blog: "/blog",
  Contact: "/contact",
};

export default function Navbar() {
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState("About");
  const [open, setOpen] = useState(false);

  const pathname = usePathname();

  // ✅ Reset menu on route change
  useEffect(() => {
    setOpen(false);
    setHovered(false);
  }, [pathname]);

  return (
    <>
      {/* ================= DESKTOP ================= */}
      <div className="hidden md:flex fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="relative flex items-center gap-3"
        >
          {/* MENU BUTTON (stretches left & right) */}
          <button
            className={`absolute left-1/2 -translate-x-1/2 
            h-[58px] rounded-[15px] font-semibold
            flex items-center justify-center
            transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
            ${
              hovered
                ? "w-[220px] opacity-0 pointer-events-none"
                : "w-[120px] opacity-100 bg-black text-white"
            }`}
          >
            Menu
          </button>

          {/* EXPANDED NAV */}
          <div
            className={`flex items-center gap-3
            transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
            origin-center
            ${
              hovered
                ? "scale-x-100 opacity-100"
                : "scale-x-0 opacity-0 pointer-events-none"
            }`}
          >
            {/* LOGO */}
            <div className="h-[58px] w-[52px] rounded-[8px] bg-black flex items-center justify-center">
              <span
                className={`${poppins.className} text-orange-500 text-[32px] font-[700]`}
              >
                a
              </span>
            </div>

            {/* NAV */}
            <div className="relative h-[56px] flex items-center gap-2 bg-[#e9e9e9] px-2 rounded-[10px]">
              {navItems.map((item) => (
                <div key={item} className="relative flex items-center">
                  {/* MOVING TAB */}
                  {active === item && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[36px] bg-black rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 220,
                        damping: 26,
                        mass: 1,
                      }}
                    />
                  )}

                  <Link
                    href={navLinks[item]}
                    onMouseEnter={() => setActive(item)}
                    className={`relative z-10 px-5 py-[8px] rounded-full font-medium transition-colors duration-200
                    ${
                      active === item
                        ? "text-white"
                        : "text-black hover:text-white"
                    }`}
                  >
                    {item}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= MOBILE ================= */}
      <div className="md:hidden fixed bottom-6 left-0 w-full flex justify-center z-50">
        <div className="w-auto flex items-center gap-3">

          {/* BACKDROP */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                onClick={() => setOpen(false)}
              />
            )}
          </AnimatePresence>

          {/* MENU CARD */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ scale: 0.85, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 10 }}
                transition={{
                  type: "spring",
                  stiffness: 140,
                  damping: 22,
                }}
                style={{ originY: 1 }}
                className="fixed bottom-[90px] left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-black rounded-[16px] py-12 z-50"
              >
                <div className="flex flex-col items-center gap-8">
                  {navItems.map((item) => (
                    <Link
                      key={item}
                      href={navLinks[item]}
                      onClick={() => setOpen(false)}
                      className="text-white text-[15px] tracking-wide"
                    >
                      {item.toUpperCase()}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* LOGO */}
          <div className="h-[50px] w-[50px] bg-black rounded-[14px] flex items-center justify-center">
            <span className={`${poppins.className} text-orange-500 text-[26px] font-[700]`}>
              a
            </span>
          </div>

          {/* MENU BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            className="h-[50px] px-6 bg-black text-white rounded-[14px] font-medium transition-all duration-500 active:scale-95"
          >
            {open ? "CLOSE MENU" : "MENU"}
          </button>

        </div>
      </div>
    </>
  );
}