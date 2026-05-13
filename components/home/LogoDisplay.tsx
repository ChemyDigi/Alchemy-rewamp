"use client";

import { useEffect, useRef, useState } from "react";
import { getHomeContent } from "@/lib/firestore";

/* ─── CIRCULAR CELL POSITIONS ──────────────────────────────────────────
 *  cx, cy in % relative to container. 3 concentric rings + 1 center.
 * ───────────────────────────────────────────────────────────────────── */
function buildCirclePositions() {
    const positions: { cx: number; cy: number; size: number }[] = [];

    positions.push({ cx: 50, cy: 50, size: 1.18 }); // center

    const r1 = 19;
    for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * 2 * Math.PI - Math.PI / 2;
        positions.push({ cx: 50 + r1 * Math.cos(angle), cy: 50 + r1 * Math.sin(angle), size: 1.0 });
    }

    const r2 = 36;
    for (let i = 0; i < 9; i++) {
        const angle = (i / 9) * 2 * Math.PI - Math.PI / 2 + 0.18;
        positions.push({ cx: 50 + r2 * Math.cos(angle), cy: 50 + r2 * Math.sin(angle), size: 0.9 });
    }

    const r3 = 50;
    const outerAngles = [0, 0.7, 1.4, 2.1, 2.8, 3.5, 4.2, 4.9, 5.6];
    for (const a of outerAngles) {
        const angle = a - Math.PI / 2;
        positions.push({ cx: 50 + r3 * Math.cos(angle), cy: 50 + r3 * Math.sin(angle), size: 0.8 });
    }

    return positions;
}

const CELLS = buildCirclePositions(); // 25 cells total
const LOGO_TILES = CELLS.slice(1);   // indices 1..24 (exclude center)
const TILE_COUNT = LOGO_TILES.length; // 24

const FADE_MS = 700;      // crossfade duration
const MIN_STAY = 2800;    // min ms a logo stays before swapping
const MAX_STAY = 5500;    // max ms

/* ─── PER-TILE STATE ────────────────────────────────────────────────── */
interface TileState {
    current: string;   // always-visible logo
    next: string;      // incoming logo (fading in)
    fading: boolean;   // true while crossfade is in progress
}

/* ═══ COMPONENT ═════════════════════════════════════════════════════════ */
export default function LogoDisplay() {
    const [tiles, setTiles] = useState<TileState[]>([]);
    const logosRef = useRef<string[]>([]);
    const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
    const mountedRef = useRef(true);

    /* pick a logo different from the current one for this tile */
    function pickNext(currentSrc: string): string {
        const all = logosRef.current;
        if (all.length <= 1) return all[0] ?? "";
        const others = all.filter(l => l !== currentSrc);
        return others[Math.floor(Math.random() * others.length)];
    }

    /* schedule a swap for tile[tileIdx] after `delay` ms */
    function scheduleTile(tileIdx: number, delay: number) {
        if (!mountedRef.current) return;

        const t = setTimeout(() => {
            if (!mountedRef.current) return;

            setTiles(prev => {
                const copy = [...prev];
                const tile = copy[tileIdx];
                if (!tile) return prev;
                copy[tileIdx] = { ...tile, next: pickNext(tile.current), fading: true };
                return copy;
            });

            // after fade finishes: promote next → current, end fade
            const t2 = setTimeout(() => {
                if (!mountedRef.current) return;
                setTiles(prev => {
                    const copy = [...prev];
                    const tile = copy[tileIdx];
                    if (!tile) return prev;
                    copy[tileIdx] = { current: tile.next, next: tile.next, fading: false };
                    return copy;
                });
                // schedule next cycle
                const stay = MIN_STAY + Math.random() * (MAX_STAY - MIN_STAY);
                scheduleTile(tileIdx, stay);
            }, FADE_MS + 50);

            timersRef.current.push(t2);
        }, delay);

        timersRef.current.push(t);
    }

    useEffect(() => {
        mountedRef.current = true;

        getHomeContent().then(data => {
            if (!mountedRef.current) return;

            const fetched: string[] = (data?.trustedLogos?.map((t: { url: string }) => t.url) || []).filter(Boolean);
            if (fetched.length === 0) return;

            logosRef.current = fetched;

            // distribute logos across tiles (round-robin)
            const initial: TileState[] = Array.from({ length: TILE_COUNT }, (_, i) => {
                const src = fetched[i % fetched.length];
                return { current: src, next: src, fading: false };
            });

            setTiles(initial);

            // stagger the first swap of each tile so they don't all fire together
            initial.forEach((_, i) => {
                const stagger = i * 180; // 180 ms apart
                const stay = MIN_STAY + Math.random() * (MAX_STAY - MIN_STAY);
                scheduleTile(i, stagger + stay);
            });
        });

        return () => {
            mountedRef.current = false;
            timersRef.current.forEach(clearTimeout);
            timersRef.current = [];
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const TILE_PCT = 17;

    return (
        <>
            <style>{`
                @keyframes logo-crossfade-in {
                    0%   { opacity: 0; transform: scale(0.82); filter: blur(3px); }
                    60%  { opacity: 1; transform: scale(1.04); filter: blur(0px); }
                    100% { opacity: 1; transform: scale(1);    filter: blur(0px); }
                }
                @keyframes logo-crossfade-out {
                    0%   { opacity: 1; transform: scale(1);    filter: blur(0px); }
                    100% { opacity: 0; transform: scale(0.85); filter: blur(3px); }
                }
                @keyframes alchemy-float {
                    0%, 100% { transform: translateY(0px);  }
                    50%      { transform: translateY(-7px); }
                }
                @keyframes alchemy-float-alt {
                    0%, 100% { transform: translateY(0px); }
                    50%      { transform: translateY(7px);  }
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
                {/* ── Center tile: permanent Alchemy logo ── */}
                {(() => {
                    const { cx, cy, size } = CELLS[0];
                    const tilePx = `${TILE_PCT * size}%`;
                    return (
                        <div
                            style={{
                                position: "absolute",
                                width: tilePx,
                                height: tilePx,
                                left: `calc(${cx}% - ${TILE_PCT * size / 2}%)`,
                                top: `calc(${cy}% - ${TILE_PCT * size / 2}%)`,
                                backgroundColor: "#0f0f0f",
                                backdropFilter: "blur(10px)",
                                WebkitBackdropFilter: "blur(10px)",
                                borderRadius: `${20 * size}px`,
                                boxShadow: "0 12px 40px rgba(0,0,0,0.32), 0 4px 12px rgba(0,0,0,0.2)",
                                overflow: "hidden",
                                zIndex: 10,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src="/alchemyLogoWhite.png"
                                alt="Alchemy"
                                style={{ width: "80%", height: "80%", objectFit: "contain" }}
                            />
                        </div>
                    );
                })()}

                {/* ── Logo tiles ── */}
                {LOGO_TILES.map(({ cx, cy, size }, i) => {
                    const tile = tiles[i];
                    const tilePx = `${TILE_PCT * size}%`;
                    const dist = Math.sqrt((cx - 50) ** 2 + (cy - 50) ** 2) / 50;
                    const tileOpacity = 1 - dist * 0.25;
                    const cellIndex = i + 1;

                    // gentle float stagger per ring
                    const floatAnim = cellIndex <= 6
                        ? `alchemy-float ${3.5 + cellIndex * 0.4}s ease-in-out infinite`
                        : cellIndex <= 15
                            ? `alchemy-float-alt ${4 + cellIndex * 0.3}s ease-in-out infinite`
                            : `alchemy-float ${4.5 + cellIndex * 0.2}s ease-in-out infinite`;

                    return (
                        <div
                            key={i}
                            style={{
                                position: "absolute",
                                width: tilePx,
                                height: tilePx,
                                left: `calc(${cx}% - ${TILE_PCT * size / 2}%)`,
                                top: `calc(${cy}% - ${TILE_PCT * size / 2}%)`,
                                backgroundColor: "rgba(255,255,255,0.88)",
                                backdropFilter: "blur(10px)",
                                WebkitBackdropFilter: "blur(10px)",
                                borderRadius: `${20 * size}px`,
                                boxShadow: [
                                    "0 4px 20px rgba(0,0,0,0.10)",
                                    "0 0 0 1px rgba(255,255,255,0.95) inset",
                                    "0 1px 4px rgba(0,0,0,0.07)",
                                ].join(", "),
                                opacity: tileOpacity,
                                overflow: "hidden",
                                animation: floatAnim,
                                zIndex: 1,
                            }}
                        >
                            {tile && (
                                <>
                                    {/* Current logo — fades out when swap is in progress */}
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={tile.current}
                                        alt="partner logo"
                                        style={{
                                            position: "absolute",
                                            inset: "10%",
                                            width: "80%",
                                            height: "80%",
                                            objectFit: "contain",
                                            animation: tile.fading
                                                ? `logo-crossfade-out ${FADE_MS}ms ease-in forwards`
                                                : undefined,
                                        }}
                                    />

                                    {/* Next logo — crossfades in on top when fading === true */}
                                    {tile.fading && (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            key={tile.next} // remount to restart animation each time
                                            src={tile.next}
                                            alt="partner logo"
                                            style={{
                                                position: "absolute",
                                                inset: "10%",
                                                width: "80%",
                                                height: "80%",
                                                objectFit: "contain",
                                                animation: `logo-crossfade-in ${FADE_MS}ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards`,
                                            }}
                                        />
                                    )}
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );
}
