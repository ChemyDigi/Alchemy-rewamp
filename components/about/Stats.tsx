"use client";

import { motion, useInView, animate } from "framer-motion";
import { useEffect, useRef } from "react";

function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView || !ref.current) return;

    const start = Math.floor(value * 0.66);

    const controls = animate(start, value, {
      duration: 1.2, // 👈 speed (lower = faster)
      ease: "linear", // 👈 removes end lag completely
      onUpdate(latest) {
        if (ref.current) {
          ref.current.textContent = Math.floor(latest).toString();
        }
      },
    });

    return () => controls.stop();
  }, [isInView, value]);

  return <span ref={ref}>{Math.floor(value * 0.66)}</span>;
}

/* ================= MAIN COMPONENT ================= */
export default function AboutStats() {
  const stats = [
    { num: 80, title: "GLOBAL", sub: "HAPPY CLIENTS" },
    { num: 600, title: "PROJECTS", sub: "COMPLETED" },
    { num: 20, title: "TEAM", sub: "MEMBERS" },
    { num: 550, title: "DIGITAL", sub: "PRODUCTS" },
  ];

  return (
    <section className="w-full flex items-center justify-center px-6 md:px-16 py-20">
      <div
        className="
          grid 
          grid-cols-1 sm:grid-cols-2
          gap-y-16 sm:gap-y-20 md:gap-y-28
          gap-x-12 md:gap-x-24 lg:gap-x-36
          text-center
        "
      >
        {stats.map((item, i) => (
          <div key={i}>
            
            {/* NUMBER + PLUS */}
            <div className="relative inline-block">
              <h2
                className="
                  text-orange 
                  text-[64px] sm:text-[90px] md:text-[110px] lg:text-[130px]
                  font-bold leading-none
                "
              >
                <Counter value={item.num} />
              </h2>

              <div
                className="
                  absolute 
                  -top-2 -right-2 sm:-top-3 sm:-right-3
                  w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12
                  bg-black text-white
                  rounded-full
                  flex items-center justify-center
                  text-sm sm:text-lg md:text-xl
                "
              >
                +
              </div>
            </div>

            {/* TITLE */}
            <p
              className="
                text-black font-bold leading-none mt-3
                text-[28px] sm:text-[36px] md:text-[44px] lg:text-[54px]
              "
            >
              {item.title}
            </p>

            {/* SUBTEXT */}
            <p
              className="
                text-black mt-1
                text-[14px] sm:text-[18px] md:text-[20px] lg:text-[24px]
              "
            >
              {item.sub}
            </p>

          </div>
        ))}
      </div>
    </section>
  );
}