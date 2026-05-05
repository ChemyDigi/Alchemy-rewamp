"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import uppersectionData from "@/data/brand.json";

interface BrandDetails {
  brandName: string;
  timeFrame: string;
  role: string;
}

interface BrandData {
  id: string;
  slug: string;
  heroImage: string;
  brandName: string;
  bornYear: string;
  introduction: string;
  details: BrandDetails;
}

interface Props {
  brandSlug?: string;
}

export default function BrandsMore({ brandSlug = "tommee-tippee" }: Props) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const textRef = useRef<HTMLParagraphElement>(null);
  
  const brandData = uppersectionData.brands.find(
    (brand: BrandData) => brand.slug === brandSlug
  );

  useEffect(() => {
    const handleScroll = () => {
      if (textRef.current) {
        const rect = textRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        const visiblePart = Math.max(0, Math.min(1, 
          (windowHeight - rect.top) / (windowHeight + rect.height)
        ));
        
        const progress = Math.min(1, Math.max(0, visiblePart * 1.5));
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const words = brandData?.introduction.split(" ") || [];

  if (!brandData) {
    return <div>Brand not found</div>;
  }

  return (
    <section className="w-full bg-white py-12 md:py-16 px-4 md:px-8 lg:px-16">
      
      {/* TOP IMAGE */}
      <div className="w-full max-w-6xl mx-auto rounded-2xl overflow-hidden">
        <div className="relative w-full h-[220px] sm:h-[300px] md:h-[400px] lg:h-[560px]">
          <Image
            src={brandData.heroImage}
            alt={brandData.brandName}
            fill
            className="object-cover"
            priority
          />

          <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 text-white">
            <h2 className="text-xl md:text-2xl font-semibold tracking-wide">
              {brandData.brandName}
            </h2>
            <p className="text-sm opacity-80 mt-1">BORN {brandData.bornYear}</p>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16">
        
        <div>
          <p className="text-base text-orange mb-4">Introduction</p>

          <p 
            ref={textRef} 
            className="text-[15px] md:text-[24px] leading-relaxed font-medium"
          >
            {words.map((word, index) => {
              const wordIndex = index / words.length;
              const isFilled = wordIndex <= scrollProgress;
              
              return (
                <span
                  key={index}
                  className="transition-colors duration-300"
                  style={{
                    color: isFilled ? "#000000" : "#949494",
                  }}
                >
                  {word}{" "}
                </span>
              );
            })}
          </p>
        </div>

        <div>
          <p className="text-base text-orange mb-4">Details</p>

          <div className="border-t border-[#747474]">
            
            <div className="flex justify-between py-4 border-b border-[#747474] text-base font-medium">
              <span className="text-[#949494]">Brand Name</span>
              <span className="text-black">{brandData.details.brandName}</span>
            </div>

            <div className="flex justify-between py-4 border-b border-[#747474] text-base font-medium">
              <span className="text-[#949494]">Time Frame</span>
              <span className="text-black">{brandData.details.timeFrame}</span>
            </div>

            <div className="flex justify-between py-4 text-base font-medium">
              <span className="text-[#949494]">Role</span>
              <span className="text-black">
                {brandData.details.role}
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}