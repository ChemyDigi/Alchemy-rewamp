"use client";

import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Brand } from "@/types/brand";
import { getBrandBySlug } from "@/lib/firestore-brands";

function ScrollFillText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 95%", "end 5%"], // smoother + longer scroll range
  });

  const words = text.split(" ");

  return (
    <p
      ref={ref}
      className="text-[15px] md:text-[24px] leading-relaxed font-medium"
    >
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 0.08; // 👈 overlap = smoother wave

        const color = useTransform(
          scrollYProgress,
          [start, end],
          ["#949494", "#000000"]
        );

        return (
          <motion.span key={i} style={{ color }}>
            {word}{" "}
          </motion.span>
        );
      })}
    </p>
  );
}

interface Props {
  brandSlug?: string;
}

export default function BrandsMore({ brandSlug = "tommee-tippee" }: Props) {
  const [brandData, setBrandData] = useState<Brand | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getBrandBySlug(brandSlug);
        if (!data) {
          setError("Brand not found");
          setBrandData(null);
        } else {
          setBrandData(data);
        }
      } catch (err) {
        console.error("Error fetching brand:", err);
        setError("Failed to load brand details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrand();
  }, [brandSlug]);

  if (isLoading) {
    return (
      <section className="w-full bg-white py-12 md:py-16 px-4 md:px-8 lg:px-16">
        <div className="w-full max-w-6xl mx-auto">
          <div className="rounded-2xl overflow-hidden bg-gray-300 h-[220px] sm:h-[300px] md:h-[400px] lg:h-[560px] animate-pulse" />
          <div className="mt-10 md:mt-14 space-y-4">
            <div className="h-8 bg-gray-300 animate-pulse w-1/3 rounded" />
            <div className="h-4 bg-gray-300 animate-pulse rounded" />
            <div className="h-4 bg-gray-300 animate-pulse w-5/6 rounded" />
          </div>
        </div>
      </section>
    );
  }

  if (error || !brandData) {
    return (
      <section className="w-full bg-white py-12 md:py-16 px-4 md:px-8 lg:px-16">
        <div className="w-full max-w-6xl mx-auto">
          <div className="text-center text-red-500">
            <p>{error || "Brand not found"}</p>
          </div>
        </div>
      </section>
    );
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
          <ScrollFillText text={brandData.introduction} />
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

            {brandData.details.industry && (
              <div className="flex justify-between py-4 border-t border-[#747474] text-base font-medium">
                <span className="text-[#949494]">Industry</span>
                <span className="text-black">{brandData.details.industry}</span>
              </div>
            )}

          </div>
        </div>

      </div>
    </section>
  );
}