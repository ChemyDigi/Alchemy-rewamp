"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { getHomeContent } from "@/lib/firestore";



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
const FADE_MS = 680;

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
    const activeLogosRef = useRef<string[]>([]);
    const stateRef = useRef<Slot[]>([]);
    const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
    const mounted = useRef(true);
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
        const availLogos = activeLogosRef.current;
        if (availLogos.length === 0) return "";
        const used = new Set(stateRef.current.map(s => s.logoSrc));
        const avail = availLogos.filter(l => !used.has(l));
        return avail.length ? pick(avail) : pick(availLogos);
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
                if (!newLogo) return;
                const newId = uid();

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
        
        getHomeContent().then(data => {
            if (!mounted.current) return;
            const customLogos = (data?.trustedLogos?.map(t => t.url) || []).filter(Boolean);
            console.log("LogoDisplay - Fetched customLogos:", customLogos);
            
            if (customLogos.length > 0) {
                activeLogosRef.current = customLogos;
                
                // Initialize slots
                const cells = shuffle(Array.from({ length: TOTAL_CELLS - 1 }, (_, i) => i + 1))
                    .slice(0, VISIBLE_COUNT);
                const logos = shuffle(customLogos);
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
            }
        });

        return () => {
            mounted.current = false;
            timersRef.current.forEach(clearTimeout);
            timersRef.current.clear();
            stateRef.current = [];
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [scheduleCycle, setPhase, rerender]);

    const slots = stateRef.current;

    // Base tile size as % of container width — bigger = more visible logos
    const TILE_PCT = 17;

    return (
        <>
            {/* Keyframe animations injected once */}
            <style>{`
        @keyframes alchemy-float {
          0%, 100% { transform: translateY(0px);   }
          50%       { transform: translateY(-7px);  }
        }
        @keyframes alchemy-float-alt {
          0%, 100% { transform: translateY(0px);   }
          50%       { transform: translateY(7px);   }
        }
        @keyframes alchemy-logo-in {
          0%   { opacity: 0; transform: scale(0.6) translateY(12px) rotate(-4deg); filter: blur(4px); }
          60%  { opacity: 1; transform: scale(1.06) translateY(-3px) rotate(1deg); filter: blur(0px); }
          100% { opacity: 1; transform: scale(1) translateY(0px) rotate(0deg);    filter: blur(0px); }
        }
        @keyframes alchemy-logo-out {
          0%   { opacity: 1; transform: scale(1) translateY(0px) rotate(0deg);    filter: blur(0px); }
          100% { opacity: 0; transform: scale(0.75) translateY(-8px) rotate(3deg); filter: blur(3px); }
        }
      `}</style>
            <div
                aria-label="Partner logos"
                style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                    background:
                        "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(249,115,22,0.07) 0%, rgba(255,255,255,0) 70%)",
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
                                width: tilePx,
                                height: tilePx,
                                left: `calc(${cx}% - ${TILE_PCT * size / 2}%)`,
                                top: `calc(${cy}% - ${TILE_PCT * size / 2}%)`,
                                backgroundColor: cellIndex === 0 ? "#0f0f0f" : "rgba(255,255,255,0.88)",
                                backdropFilter: "blur(10px)",
                                WebkitBackdropFilter: "blur(10px)",
                                borderRadius: `${20 * size}px`,
                                boxShadow: cellIndex === 0
                                    ? [
                                        "0 12px 40px rgba(0,0,0,0.32)",
                                        "0 4px 12px rgba(0,0,0,0.2)",
                                    ].join(", ")
                                    : [
                                        "0 4px 20px rgba(0,0,0,0.10)",
                                        "0 0 0 1px rgba(255,255,255,0.95) inset",
                                        "0 1px 4px rgba(0,0,0,0.07)",
                                    ].join(", "),
                                opacity: tileOpacity,
                                overflow: "hidden",
                                // Gentle float animation — ring 1 bobs, ring 2 counter-bobs
                                animation: cellIndex === 0
                                    ? undefined
                                    : cellIndex <= 6
                                        ? `alchemy-float ${3.5 + (cellIndex * 0.4)}s ease-in-out infinite`
                                        : cellIndex <= 15
                                            ? `alchemy-float-alt ${4 + (cellIndex * 0.3)}s ease-in-out infinite`
                                            : `alchemy-float ${4.5 + (cellIndex * 0.2)}s ease-in-out infinite`,
                                zIndex: cellIndex === 0 ? 10 : 1,
                            }}
                        >
                            {/* ── Center: permanent Alchemy "A" ── */}
                            {cellIndex === 0 ? (
                                <div style={{
                                    position: "absolute", inset: "10%",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src="/alchemyLogoWhite.png"
                                        alt="Alchemy"
                                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                    />
                                </div>
                            ) : null}
                            {slot && cellIndex !== 0 && (
                                <div
                                    key={slot.id}
                                    style={{
                                        position: "absolute",
                                        inset: "6%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        // Use CSS animation for richer entrance/exit
                                        animation:
                                            slot.phase === "in" ? `alchemy-logo-in  ${FADE_MS}ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards` :
                                                slot.phase === "out" ? `alchemy-logo-out ${FADE_MS * 0.85}ms cubic-bezier(0.4, 0, 0.6, 1) forwards` :
                                                    undefined,
                                        opacity: slot.phase === "visible" ? 1 : undefined,
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
        </>
    );
}
