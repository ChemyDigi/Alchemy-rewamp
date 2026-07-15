"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { poppins } from "@/app/fonts";
import { usePathname } from "next/navigation";
import { useLenis } from "lenis/react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import StaggeredMenu, { StaggeredMenuItem, StaggeredMenuSocialItem } from "@/components/home/StaggeredMenu";

const navItems = ["Services", "About", "Gallery", "Blog", "Contact"];

const navLinks: Record<string, string> = {
  About: "/about",
  Services: "/#services",
  Gallery: "/gallery",
  Blog: "/blog",
  Contact: "/contactus",
};

const mobileMenuItems: StaggeredMenuItem[] = navItems.map((item) => ({
  label: item,
  ariaLabel: `Go to ${item}`,
  link: navLinks[item],
}));

const mobileSocialItems: StaggeredMenuSocialItem[] = [
  { label: "Facebook", link: "https://facebook.com/alchemys.lk", icon: <FaFacebookF /> },
  { label: "Instagram", link: "https://instagram.com/alchemy.lk/", icon: <FaInstagram /> },
  { label: "LinkedIn", link: "https://linkedin.com/company/alchemylk/", icon: <FaLinkedinIn /> },
];

export default function Navbar() {
  const [hovered, setHovered] = useState(false);
  const [active, setActive] = useState("About");
  const [open, setOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    setHovered(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hash links (e.g. "/#services") to a section of the page we're already
  // on won't trigger a pathname change, so the browser/router won't scroll
  // there on their own — scroll to it ourselves via Lenis instead
  const handleNavClick = useCallback(
    (link: string) => (event: React.MouseEvent) => {
      const [path, hash] = link.split("#");
      if (hash && path === pathname) {
        event.preventDefault();
        const target = document.getElementById(hash);
        if (target) lenis?.scrollTo(target);
      }
    },
    [pathname, lenis]
  );

  const isBlogDetailPage = pathname.startsWith("/blog/");
  const isServicesPage = pathname.startsWith("/services-");

  return (
    <>
      {/* ================= DESKTOP ================= */}
      <div className="hidden md:flex fixed bottom-10 left-1/2 -translate-x-1/2 z-50">
        <div
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className="relative flex items-center gap-3"
        >
          {/* MENU BUTTON */}
          <button
            className={`absolute left-1/2 -translate-x-1/2 
            h-[58px] rounded-[15px] font-semibold
            flex items-center justify-center
            transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
            ${hovered
                ? "w-[220px] opacity-0 pointer-events-none"
                : "w-[120px] opacity-100 menu-btn"
              }`}
          >
            Menu
          </button>

          {/* EXPANDED NAV */}
          <div
            className={`flex items-center gap-3
            transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]
            ${hovered
                ? "scale-x-100 opacity-100"
                : "scale-x-0 opacity-0 pointer-events-none"
              }`}
          >
            {/* LOGO */}
            <Link href="/">
              <div className="group h-[50px] w-[50px] bg-black rounded-[14px] flex items-center justify-center overflow-hidden relative shrink-0 cursor-pointer">

                {/* ORANGE (default) */}
                <span
                  className={`${poppins.className} absolute text-orange text-[36px] font-[700]
      transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
      translate-y-0 group-hover:-translate-y-[120%]`}
                >
                  a
                </span>

                {/* WHITE (hover) */}
                <span
                  className={`${poppins.className} absolute text-white text-[36px] font-[700]
      transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
      translate-y-[120%] group-hover:translate-y-0`}
                >
                  a
                </span>

              </div>
            </Link>

            {/* NAV */}
            <div className="relative h-[56px] flex items-center gap-2 bg-[#e9e9e9] px-2 rounded-[10px]">
              {navItems.map((item) => (
                <div key={item} className="relative flex items-center">
                  {active === item && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[36px] bg-black rounded-full"
                      transition={{
                        type: "spring",
                        stiffness: 220,
                        damping: 26,
                      }}
                    />
                  )}

                  <Link
                    href={navLinks[item]}
                    onMouseEnter={() => setActive(item)}
                    onClick={handleNavClick(navLinks[item])}
                    className={`relative z-10 px-5 py-[8px] rounded-full font-medium transition-colors duration-300
                    ${active === item
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
      <div className="md:hidden">
        <StaggeredMenu
          position="right"
          items={mobileMenuItems}
          socialItems={mobileSocialItems}
          displaySocials
          isFixed
        />
      </div>

      {/* Scroll to Top on Blog Detail & Services Pages (Mobile only) */}
      {(isBlogDetailPage || isServicesPage) && showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-24 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-orange text-white shadow-lg transition-all duration-300 active:scale-95 md:hidden"
          aria-label="Scroll to top"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </>
  );
}