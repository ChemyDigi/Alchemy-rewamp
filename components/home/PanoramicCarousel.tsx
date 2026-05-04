"use client";

import { useEffect, useRef, useState } from "react";

/* ─── CONFIG ─────────────────────────────────────────── */
// ANGLE: Rotation angle (in degrees) between each card in the carousel
const ANGLE = 30;
// ORIGIN_Z: Distance (in pixels) from the viewport for 3D rotation origin
const ORIGIN_Z = 650;
// PERSPECTIVE: 3D perspective depth effect (lower = more dramatic)
const PERSPECTIVE = 1800;

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

    setRotations((prev) => {
      // Apply rotation delta to all cards for continuous movement
      const updated = prev.map((r) => r + rotationDelta);

      // Find which card is closest to center (0 degrees) after rotation
      let closestIndex = 0;
      let minDiff = Infinity;

      updated.forEach((r, i) => {
        // Check distance from 0 (normalized with modulo 360)
        const diff = Math.abs(r % 360);
        if (diff < minDiff) {
          minDiff = diff;
          closestIndex = i;
        }
      });

      // Update the active card display
      setActiveIndex(closestIndex);
      return updated;
    });

    // Unlock carousel after animation completes (only for non-immediate updates)
    if (!immediate) {
      setTimeout(() => {
        isTweening.current = false;
      }, 400);
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
      const rotationDelta = (dx / 100) * ANGLE;

      // Update carousel in real-time while dragging (immediate mode)
      if (Math.abs(rotationDelta) > 0.1) {
        updateSlides(rotationDelta, true);
        // Reset drag start for incremental dragging
        dragStart.current = { x: e.clientX };
      }
    };

    const onMouseUp = (e: MouseEvent) => {
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
      const rotationDelta = (dx / 100) * ANGLE;

      // Update carousel in real-time while dragging (immediate mode)
      if (Math.abs(rotationDelta) > 0.1) {
        updateSlides(rotationDelta, true);
        // Reset drag start for incremental dragging
        dragStart.current = { x: e.touches[0].clientX };
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
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
      <div className="w-full text-center pt-20 ">
        <h1 className="text-4xl md:text-5xl font-bold mb-3">
          <span className="text-black">OUR LATESET </span>
          <span className="text-orange">CREATIONS</span>
        </h1>

        <p className="text-base md:text-lg text-black">
          A showcase of innovation
        </p>
      </div>

      {/* ═══ MAIN CAROUSEL SECTION ═══ 
          Container for 3D rotating cards with full height */}
      <div className="relative w-full h-[80vh] flex items-center justify-center">

        {/* LEFT NAVIGATION BUTTON (Prev) 
            - Positioned on left side, vertically centered
            - Orange background, white arrow
            - Triggers "prev" rotation */}
        <button
          onClick={() => updateSlides(-ANGLE)}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-50 
                     w-12 h-12 rounded-full 
                     bg-orange text-white text-2xl 
                     flex items-center justify-center 
                     hover:bg-black transition"
        >
          ←
        </button>

        {/* RIGHT NAVIGATION BUTTON (Next)
            - Positioned on right side, vertically centered
            - Orange background, white arrow
            - Triggers "next" rotation */}
        <button
          onClick={() => updateSlides(ANGLE)}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-50 
                     w-12 h-12 rounded-full 
                     bg-orange text-white text-2xl 
                     flex items-center justify-center 
                     hover:bg-black transition"
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
            perspective: PERSPECTIVE,
            transformStyle: "preserve-3d",
          }}
        >
          {/* CARD ELEMENTS - Each card rotates around Z-axis
              - Initially positioned at ANGLE intervals
              - Rotations update based on carousel direction
              - Only visible card is front-facing (backfaceVisibility: hidden) */}
          {CARDS.map((card, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 300,
                height: 380,
                borderRadius: 16,
                backgroundImage: `url(${card.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                // 3D rotation origin: center of card, positioned ORIGIN_Z pixels behind
                transformOrigin: `50% 50% ${ORIGIN_Z}px`,
                // rotateY creates the carousel effect, translateX fine-tunes positioning
                transform: `rotateY(${rotations[i]}deg) translateX(20px)`,
                // Ultra-smooth animation for real-time dragging response
                transition:
                  "transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
                // Hide cards facing away from viewport
                backfaceVisibility: "hidden",
              }}
            />
          ))}
        </div>

        {/* TEXT OVERLAY - Displays active card's title & description
            - Positioned at bottom of carousel (moved down for better spacing)
            - Updates automatically when activeIndex changes */}
        <div className="absolute bottom-1 text-center max-w-xl px-6">
          <h2 className="text-orange text-3xl font-bold mb-2">
            {CARDS[activeIndex].title}
          </h2>
          <p className="text-black/70 text-lg">
            {CARDS[activeIndex].desc}
          </p>
        </div>
      </div>
    </div>
  );
}