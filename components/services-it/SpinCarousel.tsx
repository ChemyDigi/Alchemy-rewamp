"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

type Item = {
  id: number;
  title: string;
  type: string;
  image: string;
};

const items: Item[] = [
  {
    id: 1,
    title: "Naabhi 4.0",
    type: "Project Type",
    image: "/images/services-it/pro1.jpg",
  },
  {
    id: 2,
    title: "Starbucks",
    type: "Project Type",
    image: "/images/services-it/pro2.jpg",
  },
  {
    id: 3,
    title: "Sunshine",
    type: "Project Type",
    image: "/images/services-it/pro3.jpg",
  },
  {
    id: 4,
    title: "Project X",
    type: "Project Type",
    image: "/images/services-it/pro4.jpg",
  },
  {
    id: 5,
    title: "Project Y",
    type: "Project Type",
    image: "/images/services-it/pro5.jpg",
  },
];

export default function SpinCarousel() {
  const [active, setActive] = useState(1);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const carouselRef = useRef<HTMLDivElement>(null);
  const autoScrollInterval = useRef<NodeJS.Timeout | null>(null);

  const handleNext = () => {
    setActive((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setActive((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    setAutoScroll(false);
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setDragStart({ x: clientX, y: 0 });
  };

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    setIsDragging(false);

    const clientX =
      "changedTouches" in e ? e.changedTouches[0].clientX : e.clientX;
    const dragDistance = clientX - dragStart.x;

    if (Math.abs(dragDistance) > 50) {
      if (dragDistance > 0) {
        handlePrev();
      } else {
        handleNext();
      }
    }

    setTimeout(() => {
      if (!isDragging) {
        setAutoScroll(true);
      }
    }, 3000);
  };

  useEffect(() => {
    if (autoScroll && !isDragging) {
      autoScrollInterval.current = setInterval(() => {
        handleNext();
      }, 4000);
    } else if (autoScrollInterval.current) {
      clearInterval(autoScrollInterval.current);
    }

    return () => {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
      }
    };
  }, [autoScroll, isDragging, active]);

  useEffect(() => {
    if (autoScroll && !isDragging) {
      if (autoScrollInterval.current) {
        clearInterval(autoScrollInterval.current);
      }
      autoScrollInterval.current = setInterval(() => {
        handleNext();
      }, 4000);
    }
  }, [active]);

  const getPosition = (index: number) => {
    const diff = index - active;

    if (diff === 0) return "center";
    if (diff === -1 || diff === items.length - 1) return "left";
    if (diff === 1 || diff === -(items.length - 1)) return "right";

    if (diff === -2 || diff === items.length - 2) return "left-2";
    if (diff === 2 || diff === -(items.length - 2)) return "right-2";

    return "hidden";
  };

  return (
    <section className="w-full bg-white py-20 overflow-hidden">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 mb-16">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black leading-tight mb-4">
          OUR CUSTOM{" "}
          <span className="text-orange">IT SOLUTIONS</span>
        </h2>
        <p className="text-black text-sm md:text-base max-w-md leading-relaxed">
          From concept to execution, we build custom IT solutions that are
          efficient, scalable, and crafted to elevate your brand in a
          competitive digital landscape.
        </p>
      </div>

      {/* Carousel */}
      <div
        ref={carouselRef}
        className="relative w-full flex items-center justify-center h-[440px] md:h-[540px] cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleDragStart}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchEnd={handleDragEnd}
      >
        {items.map((item, index) => {
          const position = getPosition(index);

          let styles = "";
          let showText = false;
          let textOpacity = "";

          if (position === "center") {
            styles = "z-30 scale-100 opacity-100 translate-x-0";
            showText = true;
            textOpacity = "opacity-100";
          } else if (position === "left") {
            styles = "z-20 scale-90 opacity-100 -translate-x-[60%]";
            showText = true;
            textOpacity = "opacity-40";
          } else if (position === "right") {
            styles = "z-20 scale-90 opacity-100 translate-x-[60%]";
            showText = true;
            textOpacity = "opacity-40";
          } else if (position === "left-2") {
            styles = "z-10 scale-75 opacity-100 -translate-x-[120%]";
            showText = false;
          } else if (position === "right-2") {
            styles = "z-10 scale-75 opacity-100 translate-x-[120%]";
            showText = false;
          } else {
            styles = "z-0 scale-75 opacity-0 translate-x-[180%]";
            showText = false;
          }

          return (
            <div
              key={item.id}
              className={`absolute transition-all duration-500 ease-in-out ${styles}`}
              style={{
                transition: isDragging ? "none" : "all 0.5s ease-in-out",
              }}
            >
              <div className="w-[220px] md:w-[280px] lg:w-[320px] h-[340px] md:h-[420px] lg:h-[460px] relative rounded-2xl overflow-hidden shadow-xl bg-black pointer-events-none">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>

              {showText && (
                <div className={`mt-4 text-center ${textOpacity}`}>
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500">{item.type}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}