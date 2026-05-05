"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { poppins } from "@/app/fonts";

/* ─── ALL LOGOS ────────────────────────────────────────────────────── */
const ALL_LOGOS = [
  "/images/logos/2.jpeg",
  "/images/logos/3.png",
  "/images/logos/5.jpeg",
  "/images/logos/hello2.png",
  "/images/logos/logo (1).jpg",
  "/images/logos/logo (1).png",
  "/images/logos/logo (1).webp",
  "/images/logos/logo (10).jpg",
  "/images/logos/logo (10).png",
  "/images/logos/logo (12).png",
  "/images/logos/logo (13).png",
  "/images/logos/logo (14).png",
  "/images/logos/logo (15).png",
  "/images/logos/logo (16).png",
  "/images/logos/logo (17).png",
  "/images/logos/logo (3).png",
  "/images/logos/logo (4).jpg",
  "/images/logos/logo (4).png",
  "/images/logos/logo (5).png",
  "/images/logos/logo (6).png",
  "/images/logos/logo (7).jpg",
  "/images/logos/logo (7).png",
  "/images/logos/logo (9).png",
  "/images/logos/new1.png",
  "/images/logos/new2.png",
  "/images/logos/new3.png",
  "/images/logos/new4.png",
  "/images/logos/new7.jpg",
  "/images/logos/new8.jpg",
  "/images/logos/new9.jpg",
  "/images/logos/new11.jpg",
  "/images/logos/new12.jpg",
  "/images/logos/new13.jpg",
  "/images/logos/new14.jpg",
  "/images/logos/new15.png",
  "/images/logos/new17.png",
  "/images/logos/new18.png",
  "/images/logos/new19.png",
  "/images/logos/new20.png",
  "/images/logos/sample.png",
];

/* ─── CIRCULAR CELL POSITIONS ─────────────────────────────────────────
 *  Each cell is a { cx, cy } in percentage (0–100) relative to the
 *  container.  Arranged in 3 concentric rings + 1 center tile,
 *  giving 19 cells total.  VISIBLE_COUNT logos occupy them at any time.
 * ────────────────────────────────────────────────────────────────────── */
function buildCirclePositions() {
  const positions: { cx: number; cy: number; size: number }[] = [];

  // Center tile (slightly larger)
  positions.push({ cx: 50, cy: 50, size: 1.18 });

  // Ring 1 – 6 tiles, radius ~19%
  const r1 = 19;
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * 2 * Math.PI - Math.PI / 2;
    positions.push({
      cx: 50 + r1 * Math.cos(angle),
      cy: 50 + r1 * Math.sin(angle),
      size: 1.0,
    });
  }

  // Ring 2 – 9 tiles, radius ~36%
  const r2 = 36;
  for (let i = 0; i < 9; i++) {
    const angle = (i / 9) * 2 * Math.PI - Math.PI / 2 + 0.18;
    positions.push({
      cx: 50 + r2 * Math.cos(angle),
      cy: 50 + r2 * Math.sin(angle),
      size: 0.9,
    });
  }

  // Ring 3 – partial outer ring (only 9 tiles, not full), radius ~50%
  const r3 = 50;
  const outerAngles = [0, 0.7, 1.4, 2.1, 2.8, 3.5, 4.2, 4.9, 5.6];
  for (const a of outerAngles) {
    const angle = a - Math.PI / 2;
    positions.push({
      cx: 50 + r3 * Math.cos(angle),
      cy: 50 + r3 * Math.sin(angle),
      size: 0.8,
    });
  }

  return positions;
}

const CELLS = buildCirclePositions();          // 25 cells total
const TOTAL_CELLS = CELLS.length;
const VISIBLE_COUNT = 15;                      // ~60% filled at any time

const MIN_STAY = 2600;
const MAX_STAY = 5200;
const FADE_MS  = 680;

/* ─── TYPES ───────────────────────────────────────────────────────── */
type Phase = "in" | "visible" | "out";
interface Slot { id: number; cellIndex: number; logoSrc: string; phase: Phase; }

let _uid = 0;
const uid = () => ++_uid;
const randBetween = (min: number, max: number) => min + Math.random() * (max - min);
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

/* ═══ COMPONENT ════════════════════════════════════════════════════════ */
export default function LogoDisplay() {
  const stateRef  = useRef<Slot[]>([]);
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
  const mounted   = useRef(true);
  const [, forceRender] = useState(0);
  const rerender = useCallback(() => forceRender(n => n + 1), []);

  const setPhase = useCallback((id: number, phase: Phase) => {
    stateRef.current = stateRef.current.map(s => s.id === id ? { ...s, phase } : s);
    rerender();
  }, [rerender]);

  const freeCell = useCallback((excludeCell?: number): number => {
    const occupied = new Set(stateRef.current.map(s => s.cellIndex));
    if (excludeCell !== undefined) occupied.delete(excludeCell);
    // Cell 0 is reserved for the Alchemy center logo — never use it
    const free = Array.from({ length: TOTAL_CELLS }, (_, i) => i)
      .filter(i => i !== 0 && !occupied.has(i));
    return free.length ? pick(free) : 1;
  }, []);

  const freeLogo = useCallback((): string => {
    const used = new Set(stateRef.current.map(s => s.logoSrc));
    const avail = ALL_LOGOS.filter(l => !used.has(l));
    return avail.length ? pick(avail) : pick(ALL_LOGOS);
  }, []);

  const scheduleCycle = useCallback((slotId: number, stayMs: number) => {
    if (!mounted.current) return;
    const t = setTimeout(() => {
      if (!mounted.current) return;
      timersRef.current.delete(slotId);
      setPhase(slotId, "out");

      const t2 = setTimeout(() => {
        if (!mounted.current) return;
        const current = stateRef.current.find(s => s.id === slotId);
        const newCell = freeCell(current?.cellIndex);
        const newLogo = freeLogo();
        const newId   = uid();

        stateRef.current = stateRef.current
          .filter(s => s.id !== slotId)
          .concat({ id: newId, cellIndex: newCell, logoSrc: newLogo, phase: "in" });
        rerender();

        const t3 = setTimeout(() => { if (mounted.current) setPhase(newId, "visible"); }, FADE_MS);
        scheduleCycle(newId, randBetween(MIN_STAY, MAX_STAY) + FADE_MS);
        timersRef.current.set(newId + 100_000, t3);
      }, FADE_MS + 60);

      timersRef.current.set(slotId + 10_000, t2);
    }, stayMs);
    timersRef.current.set(slotId, t);
  }, [freeCell, freeLogo, setPhase, rerender]);

  useEffect(() => {
    mounted.current = true;
    // Cells 1..TOTAL_CELLS-1 available (0 is reserved for Alchemy center)
    const cells = shuffle(Array.from({ length: TOTAL_CELLS - 1 }, (_, i) => i + 1))
      .slice(0, VISIBLE_COUNT);
    const logos = shuffle(ALL_LOGOS);
    const initial: Slot[] = cells.map((cellIndex, i) => ({
      id: uid(), cellIndex, logoSrc: logos[i % logos.length], phase: "in" as Phase,
    }));
    stateRef.current = initial;
    rerender();

    initial.forEach((slot, i) => {
      const delay = i * 120;
      const t = setTimeout(() => { setPhase(slot.id, "visible"); }, FADE_MS + delay);
      timersRef.current.set(-(slot.id + i), t);
      scheduleCycle(slot.id, randBetween(MIN_STAY, MAX_STAY) + delay);
    });

    return () => {
      mounted.current = false;
      timersRef.current.forEach(clearTimeout);
      timersRef.current.clear();
      stateRef.current = [];
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const slots = stateRef.current;

  // Base tile size as % of container width
  const TILE_PCT = 14; // each tile is ~14% of container width

  return (
    <div
      aria-label="Partner logos"
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        // Soft radial glow behind the cluster
        background:
          "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(249,115,22,0.06) 0%, rgba(255,255,255,0) 70%)",
      }}
    >
      {CELLS.map(({ cx, cy, size }, cellIndex) => {
        const slot = slots.find(s => s.cellIndex === cellIndex);
        const tilePx = `${TILE_PCT * size}%`;

        // Distance from centre (0→1) used for subtle edge fade on tiles
        const dist = Math.sqrt((cx - 50) ** 2 + (cy - 50) ** 2) / 50;
        const tileOpacity = 1 - dist * 0.25; // outer tiles slightly dimmer

        return (
          <div
            key={cellIndex}
            style={{
              position: "absolute",
              width:  tilePx,
              height: tilePx,
              left:   `calc(${cx}% - ${TILE_PCT * size / 2}%)`,
              top:    `calc(${cy}% - ${TILE_PCT * size / 2}%)`,
              // Center tile: black Alchemy brand tile
              backgroundColor: cellIndex === 0 ? "#0f0f0f" : "rgba(255,255,255,0.85)",
              backdropFilter:  "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              borderRadius:   `${18 * size}px`,
              boxShadow: cellIndex === 0
                ? [
                    "0 8px 32px rgba(0,0,0,0.28)",
                    "0 2px 8px rgba(0,0,0,0.18)",
                  ].join(", ")
                : [
                    "0 2px 16px rgba(0,0,0,0.08)",
                    "0 0 0 1px rgba(255,255,255,0.9) inset",
                    "0 1px 3px rgba(0,0,0,0.06)",
                  ].join(", "),
              opacity:  tileOpacity,
              overflow: "hidden",
              transition: "box-shadow 0.3s ease",
              // Lift center tile above others
              zIndex: cellIndex === 0 ? 10 : 1,
            }}
          >
            {/* ── Center: permanent Alchemy "A" ── */}
            {cellIndex === 0 ? (
              <div style={{
                position: "absolute", inset: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: `${TILE_PCT * size * 0.9}px`,
              }}>
                <span style={{
                  fontFamily: poppins.style.fontFamily,
                  fontSize:   "clamp(20px, 3.5vw, 56px)",
                  fontWeight: 700,
                  color:      "#ffffff",
                  lineHeight: 1,
                  letterSpacing: "-0.04em",
                  userSelect: "none",
                }}>
                  a
                </span>
              </div>
            ) : null}
            {slot && cellIndex !== 0 && (
              <div
                key={slot.id}
                style={{
                  position:  "absolute",
                  inset:     "12%",
                  display:   "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity:   slot.phase === "visible" ? 1 : 0,
                  transform:
                    slot.phase === "in"  ? "scale(0.68)" :
                    slot.phase === "out" ? "scale(0.84)" :
                    "scale(1)",
                  transition: [
                    `opacity   ${FADE_MS}ms cubic-bezier(0.4, 0, 0.2, 1)`,
                    `transform ${FADE_MS}ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
                  ].join(", "),
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slot.logoSrc}
                  alt="partner logo"
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
