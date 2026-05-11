"use client";

import {
  motion,
  useMotionValue,
  useTransform,
  type PanInfo
} from "framer-motion";
import { useEffect, useState } from "react";
import { getGallery } from "@/lib/firestore";

interface CardRotateProps {
  children: React.ReactNode;
  onSendToBack: () => void;
  sensitivity: number;
  disableDrag?: boolean;
}

function CardRotate({
  children,
  onSendToBack,
  sensitivity,
  disableDrag = false
}: CardRotateProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [60, -60]);
  const rotateY = useTransform(x, [-100, 100], [-60, 60]);

  function handleDragEnd(
    _event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) {
    if (info.offset.x < -sensitivity) {
      onSendToBack();
    } else {
      x.set(0);
      y.set(0);
    }
  }

  if (disableDrag) {
    return (
      <motion.div
        className="absolute inset-0 cursor-pointer"
        style={{ x: 0, y: 0 }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className="absolute inset-0 cursor-grab"
      style={{ x, y, rotateX, rotateY }}
      drag
      dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
      dragElastic={0.6}
      whileTap={{ cursor: "grabbing" }}
      onDragEnd={handleDragEnd}
    >
      {children}
    </motion.div>
  );
}

interface StackProps {
  randomRotation?: boolean;
  sensitivity?: number;
  sendToBackOnClick?: boolean;
  cards?: React.ReactNode[];
  animationConfig?: { stiffness: number; damping: number };
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  mobileClickOnly?: boolean;
  mobileBreakpoint?: number;
}

function Stack({
  randomRotation = false,
  sensitivity = 200,
  cards = [],
  animationConfig = { stiffness: 260, damping: 20 },
  sendToBackOnClick = false,
  autoplay = false,
  autoplayDelay = 3000,
  pauseOnHover = false,
  mobileClickOnly = false,
  mobileBreakpoint = 768
}: StackProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < mobileBreakpoint);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, [mobileBreakpoint]);

  const shouldDisableDrag = mobileClickOnly && isMobile;
  const shouldEnableClick = sendToBackOnClick || shouldDisableDrag;

  const [stack, setStack] = useState<
    { id: number; content: React.ReactNode }[]
  >(() => {
    if (cards.length) {
      return cards.map((content, index) => ({
        id: index + 1,
        content
      }));
    } else {
      return [];
    }
  });

  useEffect(() => {
    if (cards.length) {
      setStack(
        cards.map((content, index) => ({
          id: index + 1,
          content
        }))
      );
    }
  }, [cards]);

  const sendToBack = (id: number) => {
    setStack(prev => {
      const newStack = [...prev];

      const index = newStack.findIndex(card => card.id === id);

      const [card] = newStack.splice(index, 1);

      newStack.unshift(card);

      return newStack;
    });
  };

  useEffect(() => {
    if (autoplay && stack.length > 1 && !isPaused) {
      const interval = setInterval(() => {
        const topCardId = stack[stack.length - 1].id;

        sendToBack(topCardId);
      }, autoplayDelay);

      return () => clearInterval(interval);
    }
  }, [autoplay, autoplayDelay, stack, isPaused]);

  return (
    <div
      className="relative w-full h-full"
      style={{
        perspective: 600
      }}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
    >
      {stack.map((card, index) => {
        const randomRotate = randomRotation
          ? Math.random() * 10 - 5
          : 0;

        return (
          <CardRotate
            key={card.id}
            onSendToBack={() => sendToBack(card.id)}
            sensitivity={sensitivity}
            disableDrag={shouldDisableDrag}
          >
            <motion.div
              className="rounded-2xl overflow-hidden w-full h-full shadow-xl bg-white"
              style={{
                backfaceVisibility: "hidden",
                transformStyle: "preserve-3d"
              }}
              onClick={() =>
                shouldEnableClick && sendToBack(card.id)
              }
              animate={{
                rotateZ:
                  (stack.length - index - 1) * 4 + randomRotate,
                scale:
                  1 + index * 0.06 - stack.length * 0.06,
                transformOrigin: "90% 90%"
              }}
              initial={false}
              transition={{
                type: "spring",
                stiffness: animationConfig.stiffness,
                damping: animationConfig.damping
              }}
            >
              {card.content}
            </motion.div>
          </CardRotate>
        );
      })}
    </div>
  );
}

export default function Hero() {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    getGallery().then(data => {
      setImages(data.map(item => item.imageUrl).slice(0, 5));
    });
  }, []);

  return (
    <section className="relative min-h-[60vh] md:min-h-screen bg-white overflow-hidden">

      <div className="relative max-w-[1600px] mx-auto min-h-[60vh] md:min-h-screen px-6 sm:px-8 md:px-16 pt-24 md:pt-32 lg:pt-20 pb-10 md:pb-16">

        <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-12 lg:gap-20 h-full">

          {/* LEFT CONTENT */}
<div className="z-10 mt-auto max-w-[620px] pt-10 lg:pt-20 pb-8 lg:translate-y-[3rem] xl:translate-y-[4rem] max-sm:mt-0 max-sm:pt-20">
          <h1 className="text-7xl leading-[0.88] font-medium tracking-[-0.03em] text-black sm:text-8xl md:text-9xl lg:text-[10.75rem] xl:text-[11.5rem] 2xl:text-[12.5rem]">
            Gallery
          </h1>

          <p className="mt-3 text-xl font-normal uppercase tracking-[-0.01em] text-[#FF6B35] sm:text-3xl lg:text-xl">
            Creative
          </p>
          <p className="text-xl leading-none font-normal uppercase tracking-[-0.01em] text-black sm:text-3xl lg:text-xl">
            Stories Captured
    <br />
    With Purpose
          </p>
        </div>
          {/* RIGHT CONTENT */}
          <div className="relative w-full lg:w-auto flex justify-center lg:justify-end lg:-ml-40 xl:-ml-52">

            <div
  className="
    w-[80vw]
    h-[118vw]

    max-w-[350px]
    max-h-[500px]

    sm:w-[390px]
    sm:h-[520px]

    md:w-[370px]
    md:h-[500px]

    lg:w-[360px]
    lg:h-[500px]

    xl:w-[400px]
    xl:h-[560px]
  "
>
              <Stack
                randomRotation={false}
                sensitivity={200}
                sendToBackOnClick={true}
                cards={images.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`card-${i + 1}`}
                    className="w-full h-full object-cover bg-white"
                  />
                ))}
                autoplay={false}
                autoplayDelay={3500}
                pauseOnHover={false}
                mobileClickOnly={true}
                mobileBreakpoint={768}
              />

            </div>

          </div>

        </div>

      </div>

      {/* Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-20 md:h-40 bg-gradient-to-t from-white to-transparent pointer-events-none" />

    </section>
  );
}