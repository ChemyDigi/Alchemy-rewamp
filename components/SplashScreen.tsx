"use client";

import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { useSplash } from "@/components/SplashContext";
import TransitionOverlay from "@/components/TransitionOverlay";

type SplashState = "visible" | "fading" | "hidden";

type SplashScreenProps = {
  onHidden?: () => void;
};

export default function SplashScreen({ onHidden }: SplashScreenProps) {
  const [state, setState] = useState<SplashState>("visible");
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [logoScale, setLogoScale] = useState(0.75);
  const videoRef = useRef<HTMLVideoElement>(null);
  const lenis = useLenis();
  const lenisRef = useRef(lenis);
  const dismissed = useRef(false);
  const { finishSplash } = useSplash();

  useEffect(() => {
    lenisRef.current = lenis;
  }, [lenis]);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const hasShown = sessionStorage.getItem("splash-shown-v2");

    if (prefersReducedMotion || hasShown) {
      setState("hidden");
      return;
    }

    document.body.style.overflow = "hidden";

    // Detect screen width to load appropriate mode
    const isMobileDevice = window.matchMedia("(max-width: 767px)").matches;
    setIsMobile(isMobileDevice);

    if (isMobileDevice) {
      // Mobile: uses TransitionOverlay animation instead of video
      return () => {
        document.body.style.overflow = "";
      };
    } else {
      // Desktop: load video
      setVideoSrc("/splashscreen/splash-desktop.mp4");

      // Safety fallback: force-dismiss after 8 seconds in case video never fires onEnded
      const fallbackTimeout = setTimeout(() => {
        handleVideoEnd();
      }, 8000);

      return () => {
        clearTimeout(fallbackTimeout);
        document.body.style.overflow = "";
      };
    }
  }, []);

  // Timer-based animation sequence for mobile splash screen
  useEffect(() => {
    if (!isMobile || state === "hidden") return;

    // Start animating logo scale to 1 shortly after mount
    const scaleUpTimeout = setTimeout(() => {
      setLogoScale(1);
    }, 50);

    // Hold for 1 second, then start fading out
    const fadeOutTimeout = setTimeout(() => {
      setLogoScale(0.85);
      setState("fading");
      finishSplash();
      try {
        sessionStorage.setItem("splash-shown-v2", "true");
      } catch (err) {
        console.warn("sessionStorage failed:", err);
      }
    }, 1100);

    // Fully hide after fade animation finishes
    const hideTimeout = setTimeout(() => {
      window.scrollTo(0, 0);
      lenisRef.current?.scrollTo(0, { immediate: true });
      document.body.style.overflow = "";
      document.body.style.height = "";
      setState("hidden");
    }, 1600);

    return () => {
      clearTimeout(scaleUpTimeout);
      clearTimeout(fadeOutTimeout);
      clearTimeout(hideTimeout);
    };
  }, [isMobile, state, finishSplash]);

  // Ensure video is muted and plays programmatically to guarantee autoplay works on all devices
  useEffect(() => {
    const video = videoRef.current;
    if (video && videoSrc) {
      video.muted = true;
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          // Ignore standard AbortError when component is unmounted or paused
          if (err.name !== "AbortError") {
            console.error("Autoplay failed:", err);
          }
        });
      }
    }

    return () => {
      if (video) {
        video.pause();
      }
    };
  }, [videoSrc]);

  const handleTimeUpdate = (e: React.SyntheticEvent<HTMLVideoElement>) => {
    const video = e.currentTarget;
    // Trigger fade-out 0.3 seconds before the video ends to bypass any black ending frame
    if (video.duration && video.duration - video.currentTime <= 0.3) {
      handleVideoEnd();
    }
  };

  const handleVideoEnd = () => {
    if (dismissed.current) return;
    dismissed.current = true;
    setState("fading");
    finishSplash();
    
    try {
      sessionStorage.setItem("splash-shown-v2", "true");
    } catch (err) {
      console.warn("sessionStorage failed:", err);
    }

    setTimeout(() => {
      window.scrollTo(0, 0);
      lenisRef.current?.scrollTo(0, { immediate: true });
      document.body.style.overflow = "";
      document.body.style.height = "";
      setState("hidden");
    }, 500);
  };

  useEffect(() => {
    if (state === "hidden") {
      onHidden?.();
    }
  }, [onHidden, state]);

  if (state === "hidden") return null;

  if (isMobile) {
    return (
      <TransitionOverlay
        role="dialog"
        ariaModal
        ariaLabel="Loading website"
        opacity={state === "fading" ? 0 : 1}
        logoScale={logoScale}
        zIndex={99999}
        pointerEvents={state === "fading" ? "none" : "all"}
      />
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Loading website"
      className="splash-overlay fixed inset-0 flex items-center justify-center bg-white z-[99999]"
      style={{
        opacity: state === "fading" ? 0 : 1,
        transition: "opacity 500ms ease-in-out",
        pointerEvents: state === "fading" ? "none" : "all",
      }}
    >
      {videoSrc && (
        <video
          ref={videoRef}
          src={videoSrc}
          autoPlay
          muted
          playsInline
          preload="auto"
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnd}
          onError={handleVideoEnd}
          className="splash-video"
        />
      )}
    </div>
  );
}
