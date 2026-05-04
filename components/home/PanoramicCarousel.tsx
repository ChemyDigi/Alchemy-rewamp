"use client";

import { useEffect, useRef, useState } from "react";

/* ─── CONFIG ─────────────────────────────────────────── */
// ANGLE: Rotation angle (in degrees) between each card in the carousel
const ANGLE = 30;

/* 🖼️ CARD DATA - Array of carousel items with images and descriptions */
const CARDS = [
  {
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    title: "Mountains",
    desc: "Experience breathtaking mountain landscapes.",
  },
  {
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
    title: "Desert",
    desc: "Feel the calm and vast desert views.",
  },
  {
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    title: "Forest",
    desc: "Explore lush green forests and nature.",
  },
  {
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    title: "Ocean",
    desc: "Relax with the sound of waves.",
  },
  {
    image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d",
    title: "City",
    desc: "Dive into vibrant city life.",
  },
  {
    image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e",
    title: "Snow",
    desc: "Enjoy peaceful snowy landscapes.",
  },
  ...Array(3).fill(0).flatMap(() => [
    {
      image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      title: "Mountains",
      desc: "Experience breathtaking mountain landscapes.",
    },
    {
      image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      title: "Desert",
      desc: "Feel the calm and vast desert views.",
    },
  ]),
];

export default function PanoramicCarousel() {
  // Track rotation angles for each card (initially spread at ANGLE intervals)
  const [rotations, setRotations] = useState<number[]>((() =>
    CARDS.map((_, i) => i * -ANGLE)
  ) as any);

  // Track which card is currently in focus/center position
  const [activeIndex, setActiveIndex] = useState(0);
  // Prevent multiple animations from firing simultaneously
  const isTweening = useRef(false);
  // Track current rotation offset for continuous dragging
  const currentRotation = useRef(0);

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

  /**
   * updateSlides: Rotates carousel continuously based on drag distance
   * - Calculates rotation based on drag pixels (smoother than discrete steps)
   * - Updates activeIndex based on closest card to center
   * - Can be called with immediate=true for real-time dragging
   */
  function updateSlides(rotationDelta: number, immediate: boolean = false) {
    if (!immediate && isTweening.current) return;
    if (!immediate) isTweening.current = true;

    // Update current rotation offset
    currentRotation.current += rotationDelta;

    if (immediate) {
      setRotations((prev) => prev.map((r) => r + rotationDelta));
      return;
    }

    let closestIndex = 0;

    setRotations((prev) => {
      const updated = prev.map((r) => r + rotationDelta);

      // Find which card is closest to center (0 degrees) after rotation
      let minDiff = Infinity;
      updated.forEach((r, i) => {
        const diff = Math.abs(r % 360);
        if (diff < minDiff) {
          minDiff = diff;
          closestIndex = i;
        }
      });

      return updated;
    });

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
        const diff = Math.abs(r % 360);
        const bestDiff = Math.abs(rotations[bestIndex] % 360);
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

  /**
   * Setup drag/swipe handlers for continuous carousel movement
   * - Mouse drag: Click and drag horizontally (real-time rotation)
   * - Touch swipe: Swipe on mobile/touch devices (real-time rotation)
   * - Smooth continuous movement while dragging
   */
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;

    // MOUSE EVENTS
    const onMouseDown = (e: MouseEvent) => {
      dragStart.current = { x: e.clientX };
      isDragging.current = true;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !dragStart.current) return;

      // Calculate current drag distance from start
      const dx = e.clientX - dragStart.current.x;

      // Convert drag distance to rotation (100px drag = ~30° rotation)
      // Negative sign so dragging left rotates left, dragging right rotates right
      const rotationDelta = (-dx / 100) * ANGLE;

      // Update carousel in real-time while dragging (immediate mode)
      if (Math.abs(rotationDelta) > 0.1) {
        updateSlides(rotationDelta, true);
        // Reset drag start for incremental dragging
        dragStart.current = { x: e.clientX };
      }
    };

    const onMouseUp = (e: MouseEvent) => {
      if (isDragging.current) {
        snapToNearestCard();
      }
      dragStart.current = null;
      isDragging.current = false;
    };

    // TOUCH EVENTS (Mobile/Tablet)
    const onTouchStart = (e: TouchEvent) => {
      dragStart.current = { x: e.touches[0].clientX };
      isDragging.current = true;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging.current || !dragStart.current) return;

      // Calculate current drag distance from start
      const dx = e.touches[0].clientX - dragStart.current.x;

      // Convert drag distance to rotation (100px drag = ~30° rotation)
      // Negative sign so dragging left rotates left, dragging right rotates right
      const rotationDelta = (-dx / 100) * ANGLE;

      // Update carousel in real-time while dragging (immediate mode)
      if (Math.abs(rotationDelta) > 0.1) {
        updateSlides(rotationDelta, true);
        // Reset drag start for incremental dragging
        dragStart.current = { x: e.touches[0].clientX };
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (isDragging.current) {
        snapToNearestCard();
      }
      dragStart.current = null;
      isDragging.current = false;
    };

    // Attach event listeners
    el.addEventListener("mousedown", onMouseDown);
    el.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    el.addEventListener("touchstart", onTouchStart);
    el.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchEnd);

    // Cleanup event listeners on unmount
    return () => {
      el.removeEventListener("mousedown", onMouseDown);
      el.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);

      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return (
    <div className="w-full bg-white overflow-hidden pb-40">

      {/* ═══ HEADER SECTION ═══ 
          Displays title with "OUR LATEST CREATIONS" headline */}
      <div className={`w-full text-center ${
        deviceType === 'mobile' ? 'pt-8' : 
        deviceType === 'tablet' ? 'pt-12' : 'pt-20'
      }`}>
        <h1 className={`font-bold mb-3 ${
          deviceType === 'mobile' ? 'text-2xl md:text-3xl' : 
          deviceType === 'tablet' ? 'text-3xl md:text-4xl' : 'text-4xl md:text-5xl'
        }`}>
          <span className="text-black">OUR LATESET </span>
          <span className="text-orange">CREATIONS</span>
        </h1>

        <p className={`text-black ${
          deviceType === 'mobile' ? 'text-xs md:text-sm' : 
          deviceType === 'tablet' ? 'text-sm md:text-base' : 'text-base md:text-lg'
        }`}>
          A showcase of innovation
        </p>
      </div>

      {/* ═══ MAIN CAROUSEL SECTION ═══ 
          Container for 3D rotating cards with responsive height */}
      <div className={`relative w-full flex items-center justify-center ${
        deviceType === 'mobile' ? 'h-[50vh]' : 
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
                     hover:bg-black transition ${
            deviceType === 'mobile' ? 'left-1 w-8 h-8 text-sm' : 
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
                     hover:bg-black transition ${
            deviceType === 'mobile' ? 'right-1 w-8 h-8 text-sm' : 
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
          className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
          style={{
            perspective: perspective,
            transformStyle: "preserve-3d",
          }}
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
                backgroundImage: `url(${CARDS[activeIndex].image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          ) : (
            // Tablet/Desktop: Full 3D carousel
            CARDS.map((card, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: cardSize.width,
                  height: cardSize.height,
                  borderRadius: deviceType === 'tablet' ? 14 : 16,
                  backgroundImage: `url(${card.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  // 3D rotation origin: center of card, positioned originZ pixels behind
                  transformOrigin: `50% 50% ${originZ}px`,
                  // rotateY creates the carousel effect, translateX shifts carousel left for centering
                  transform: `rotateY(${rotations[i]}deg) translateX(-1px)`,
                  // Ultra-smooth animation for real-time dragging response
                  transition:
                    "transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)",
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
        <div className={`absolute left-1/2 -translate-x-1/2 text-center ${
          deviceType === 'mobile' ? 'bottom-[-50] max-w-xs px-4 h-20 flex flex-col justify-center' :
          deviceType === 'tablet' ? 'bottom-2 max-w-md px-6' : 'bottom-[-50] max-w-xl px-6'
        }`}>
          <h2 className={`text-orange font-bold mb-2 ${
            deviceType === 'mobile' ? 'text-xl' : 
            deviceType === 'tablet' ? 'text-2xl' : 'text-3xl'
          }`}>
            {CARDS[activeIndex].title}
          </h2>
          <p className={`text-black/70 ${
            deviceType === 'mobile' ? 'text-sm' : 
            deviceType === 'tablet' ? 'text-base' : 'text-lg'
          }`}>
            {CARDS[activeIndex].desc}
          </p>
        </div>
      </div>
    </div>
  );
}