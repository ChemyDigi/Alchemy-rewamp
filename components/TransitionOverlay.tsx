"use client";

import Image from "next/image";

type TransitionOverlayProps = {
  opacity: number;
  logoScale: number;
  zIndex: number;
  pointerEvents: "all" | "none";
  ariaHidden?: boolean;
  role?: "dialog";
  ariaModal?: boolean;
  ariaLabel?: string;
};

export default function TransitionOverlay({
  opacity,
  logoScale,
  zIndex,
  pointerEvents,
  ariaHidden,
  role,
  ariaModal,
  ariaLabel,
}: TransitionOverlayProps) {
  return (
    <div
      role={role}
      aria-hidden={ariaHidden}
      aria-modal={ariaModal}
      aria-label={ariaLabel}
      style={{
        position: "fixed",
        inset: 0,
        zIndex,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255, 255, 255, 0.97)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        opacity,
        transition: "opacity 300ms ease-in-out",
        pointerEvents,
      }}
    >
      <div
        style={{
          width: "clamp(120px, 20vw, 280px)",
          height: "clamp(120px, 20vw, 280px)",
          position: "relative",
          transform: `scale(${logoScale})`,
          transition: "transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <Image
          src="/alchemyLogo.png"
          alt="Alchemy"
          fill
          priority
          style={{ objectFit: "contain" }}
        />
      </div>
    </div>
  );
}