"use client";

import { useInView, animate } from "framer-motion";
import { useEffect, useRef } from "react";

function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView || !ref.current) return;

    const controls = animate(0, value, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate(latest) {
        if (ref.current) {
          ref.current.textContent = Math.floor(latest).toString();
        }
      },
    });

    return () => controls.stop();
  }, [isInView, value]);

  return <span ref={ref}>0</span>;
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
    <section className="w-full flex items-center justify-center px-12 md:px-16 py-20">
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
            <h2
              className="
                text-orange 
                text-[64px] sm:text-[90px] md:text-[110px] lg:text-[130px]
                font-bold leading-none inline-flex items-start
              "
            >
              <Counter value={item.num} />
              <span
                className="
                  text-orange
                  text-[48px] sm:text-[68px] md:text-[84px] lg:text-[100px]
                  font-black
                  leading-none
                  -mt-2 sm:-mt-4 md:-mt-6
                "
              >
                +
              </span>
            </h2>

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