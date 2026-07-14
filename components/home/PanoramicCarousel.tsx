"use client";

import type { StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import { getHomeContent } from "@/lib/firestore";


/* ─── CONFIG ─────────────────────────────────────────── */
// ANGLE: Rotation angle (in degrees) between each card in the carousel
const ANGLE = 30;

type CarouselImage = StaticImageData | string;
const getImageSrc = (image: CarouselImage) =>
  typeof image === "string" ? image : image.src;

export default function PanoramicCarousel() {
  const [activeCards, setActiveCards] = useState<any[]>([]);

  // Track rotation angles for each card (initially spread at ANGLE intervals)
  const [rotations, setRotations] = useState<number[]>([]);

  useEffect(() => {
    getHomeContent().then((data) => {
      if (data?.carouselProjects && data.carouselProjects.length > 0) {
        const customCards = data.carouselProjects.map(c => ({
          image: c.image,
          title: c.title,
          desc: c.desc,
        }));
        const newCards = [...customCards, ...customCards, ...customCards];
        setActiveCards(newCards);
        setRotations(newCards.map((_, i) => i * -ANGLE));
      }
    });
  }, []);

  // Track which card is currently in focus/center position
  const [activeIndex, setActiveIndex] = useState(0);
  // Prevent multiple animations from firing simultaneously
  const isTweening = useRef(false);
  // Track current rotation offset for continuous dragging
  const currentRotation = useRef(0);

  // Text overlay lags behind activeIndex and fades in once it settles,
  // so fast dragging doesn't flicker through every card's caption
  const [displayIndex, setDisplayIndex] = useState(0);
  const textFadeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (textFadeTimeout.current) clearTimeout(textFadeTimeout.current);
    textFadeTimeout.current = setTimeout(() => {
      setDisplayIndex(activeIndex);
    }, 150);
    return () => {
      if (textFadeTimeout.current) clearTimeout(textFadeTimeout.current);
    };
  }, [activeIndex]);

  // Responsive values based on screen size
  const [deviceType, setDeviceType] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [cardSize, setCardSize] = useState({ width: 300, height: 380 });
  const [perspective, setPerspective] = useState(1800);
  const [originZ, setOriginZ] = useState(650);

  // Update responsive values on mount and resize
  useEffect(() => {
    const updateResponsiveValues = () => {
      const width = window.innerWidth;
      let type: 'mobile' | 'tablet' | 'desktop';
      let size, persp, origin;

      if (width < 640) {
        // Mobile: Single large card
        type = 'mobile';
        size = { width: 280, height: 360 };
        persp = 800;
        origin = 300;
      } else if (width < 1024) {
        // Tablet: Smaller 3D carousel
        type = 'tablet';
        size = { width: 240, height: 320 };
        persp = 1400;
        origin = 500;
      } else {
        // Desktop: Full 3D carousel
        type = 'desktop';
        size = { width: 300, height: 380 };
        persp = 1800;
        origin = 650;
      }

      setDeviceType(type);
      setCardSize(size);
      setPerspective(persp);
      setOriginZ(origin);
    };

    updateResponsiveValues();
    window.addEventListener('resize', updateResponsiveValues);
    return () => window.removeEventListener('resize', updateResponsiveValues);
  }, []);

  function updateSlides(rotationDelta: number, immediate: boolean = false) {
    if (!immediate && isTweening.current) return;
    if (!immediate) isTweening.current = true;

    // Update current rotation offset
    currentRotation.current += rotationDelta;

    const newRotations = activeCards.map((_, i) => (i * -ANGLE) + currentRotation.current);

    let closestIndex = 0;
    let minDiff = Infinity;
    
    newRotations.forEach((r, i) => {
      let diff = Math.abs(r % 360);
      if (diff > 180) diff = 360 - diff;
      if (diff < minDiff) {
        minDiff = diff;
        closestIndex = i;
      }
    });

    setRotations(newRotations);

    if (immediate) {
      setActiveIndex(closestIndex);
      return;
    }

    setTimeout(() => {
      setActiveIndex(closestIndex);
      isTweening.current = false;
    }, 700);
  }

  function snapToNearestCard() {
    const targetRotation = Math.round(currentRotation.current / ANGLE) * ANGLE;
    const delta = targetRotation - currentRotation.current;
    if (Math.abs(delta) > 0.01) {
      updateSlides(delta);
    } else {
      const closestIndex = rotations.reduce((bestIndex, r, i) => {
        let diff = Math.abs(r % 360);
        if (diff > 180) diff = 360 - diff;
        let bestDiff = Math.abs(rotations[bestIndex] % 360);
        if (bestDiff > 180) bestDiff = 360 - bestDiff;
        return diff < bestDiff ? i : bestIndex;
      }, 0);
      setActiveIndex(closestIndex);
    }
  }

  // Store reference to carousel container for event listeners
  const stageRef = useRef<HTMLDivElement>(null);
  // Track drag starting position for mouse/touch interactions
  const dragStart = useRef<{ x: number } | null>(null);
  // Track if currently dragging for visual feedback
  const isDragging = useRef(false);
  const [isDraggingState, setIsDraggingState] = useState(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    dragStart.current = { x: e.clientX };
    isDragging.current = true;
    setIsDraggingState(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current || !dragStart.current) return;

    const dx = e.clientX - dragStart.current.x;
    const rotationDelta = (-dx / 100) * ANGLE;

    if (Math.abs(rotationDelta) > 0.1) {
      updateSlides(rotationDelta, true);
      dragStart.current = { x: e.clientX };
    }
  };

  const handlePointerUpOrLeave = (e: React.PointerEvent) => {
    if (isDragging.current) {
      snapToNearestCard();
    }
    dragStart.current = null;
    isDragging.current = false;
    setIsDraggingState(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  if (activeCards.length === 0) {
    return null; // Return nothing if no projects are configured
  }

  return (
    <div className="w-full bg-white overflow-hidden pb-40">

      {/* ═══ HEADER SECTION ═══ 
          Displays title with "OUR LATEST CREATIONS" headline */}
      <div className={`w-full text-center ${deviceType === 'mobile' ? 'pt-8' :
          deviceType === 'tablet' ? 'pt-12' : 'pt-20'
        }`}>
        <h1 className={`font-bold mb-3 ${deviceType === 'mobile' ? 'text-2xl md:text-3xl' :
            deviceType === 'tablet' ? 'text-3xl md:text-4xl' : 'text-4xl md:text-5xl'
          }`}>
          <span className="text-black">OUR LATESET </span>
          <span className="text-orange">CREATIONS</span>
        </h1>

        <p className={`text-black ${deviceType === 'mobile' ? 'text-xs md:text-sm' :
            deviceType === 'tablet' ? 'text-sm md:text-base' : 'text-base md:text-lg'
          }`}>
          A showcase of innovation
        </p>
      </div>

      {/* ═══ MAIN CAROUSEL SECTION ═══ 
          Container for 3D rotating cards with responsive height */}
      <div className={`relative w-full flex items-center justify-center ${deviceType === 'mobile' ? 'h-[50vh]' :
          deviceType === 'tablet' ? 'h-[65vh]' : 'h-[80vh]'
        }`}>

        {/* LEFT NAVIGATION BUTTON (Prev) 
            - Positioned on left side, vertically centered
            - Orange background, white arrow
            - Triggers "prev" rotation */}
        <button
          onClick={() => updateSlides(-ANGLE)}
          className={`absolute top-1/2 -translate-y-1/2 z-50 rounded-full 
                     bg-orange text-white flex items-center justify-center 
                     hover:bg-black transition ${deviceType === 'mobile' ? 'left-1 w-8 h-8 text-sm' :
              deviceType === 'tablet' ? 'left-3 w-10 h-10 text-lg' : 'left-6 w-12 h-12 text-2xl'
            }`}
        >
          ←
        </button>

        {/* RIGHT NAVIGATION BUTTON (Next)
            - Positioned on right side, vertically centered
            - Orange background, white arrow
            - Triggers "next" rotation */}
        <button
          onClick={() => updateSlides(ANGLE)}
          className={`absolute top-1/2 -translate-y-1/2 z-50 rounded-full 
                     bg-orange text-white flex items-center justify-center 
                     hover:bg-black transition ${deviceType === 'mobile' ? 'right-1 w-8 h-8 text-sm' :
              deviceType === 'tablet' ? 'right-3 w-10 h-10 text-lg' : 'right-6 w-12 h-12 text-2xl'
            }`}
        >
          →
        </button>

        {/* CAROUSEL STAGE - 3D ROTATING CONTAINER
            - Applies 3D perspective to child cards
            - Contains all card elements for rotation
            - Handles mouse/touch drag interactions (20px threshold)
            - Draggable on both desktop and mobile */}
        <div
          ref={stageRef}
          className={`relative w-full h-full flex items-center justify-center select-none touch-pan-y ${isDraggingState ? "cursor-grabbing" : "cursor-grab"}`}
          style={{
            perspective: perspective,
            transformStyle: "preserve-3d",
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUpOrLeave}
          onPointerCancel={handlePointerUpOrLeave}
        >
          {/* CARD ELEMENTS - Each card rotates around Z-axis
              - On mobile: Show only active card, larger size
              - On tablet/desktop: Show full 3D carousel */}
          {deviceType === 'mobile' ? (
            // Mobile: Single large card
            <div
              key={activeIndex}
              className="transition-all duration-700 ease-out"
              style={{
                position: "absolute",
                width: cardSize.width,
                height: cardSize.height,
                borderRadius: 16,
                backgroundImage: `url(${getImageSrc(activeCards[activeIndex]?.image)})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          ) : (
            // Tablet/Desktop: Full 3D carousel
            activeCards.map((card, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: cardSize.width,
                  height: cardSize.height,
                  borderRadius: deviceType === 'tablet' ? 14 : 16,
                  backgroundImage: `url(${getImageSrc(card.image)})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  // 3D rotation origin: center of card, positioned originZ pixels behind
                  transformOrigin: `50% 50% ${originZ}px`,
                  // rotateY creates the carousel effect, translateX shifts carousel left for centering
                  transform: `rotateY(${rotations[i]}deg) translateX(-1px)`,
                  // Disable transition while dragging for real-time response
                  transition: isDraggingState
                    ? "none"
                    : "transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)",
                  // Hide cards facing away from viewport
                  backfaceVisibility: "hidden",
                }}
              />
            ))
          )}
        </div>

        {/* TEXT OVERLAY - Displays active card's title & description
            - Positioned at bottom of carousel and centered horizontally
            - Responsive sizing and spacing for mobile/tablet/desktop */}
        <div
          className={`absolute left-1/2 -translate-x-1/2 text-center transition-opacity duration-300 ease-out ${deviceType === 'mobile' ? 'bottom-[-50] max-w-xs px-4 h-20 flex flex-col justify-center' :
              deviceType === 'tablet' ? 'bottom-2 max-w-md px-6' : 'bottom-[-50] max-w-xl px-6'
            }`}
          style={{ opacity: displayIndex === activeIndex ? 1 : 0 }}
        >
          <h2 className={`text-orange font-bold mb-2 ${deviceType === 'mobile' ? 'text-xl' :
              deviceType === 'tablet' ? 'text-2xl' : 'text-3xl'
            }`}>
            {activeCards[displayIndex]?.title}
          </h2>
          <p className={`text-black/70 ${deviceType === 'mobile' ? 'text-sm' :
              deviceType === 'tablet' ? 'text-base' : 'text-lg'
            }`}>
            {activeCards[displayIndex]?.desc}
          </p>
        </div>
      </div>
    </div>
  );
}