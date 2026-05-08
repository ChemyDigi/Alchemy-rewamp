// components/hero.tsx
'use client';

import photo8 from '@/public/images/gallery/photo8.png';
import photo9 from '@/public/images/gallery/photo9.png';

import {
  motion,
  useMotionValue,
  useTransform,
  type PanInfo
} from 'framer-motion';

import { useEffect, useState } from 'react';

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
      whileTap={{ cursor: 'grabbing' }}
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

    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
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
    }

    return [
      {
        id: 1,
        content: (
          <img
            src={photo8.src}
            alt="photo8"
            className="w-full h-full object-cover pointer-events-none bg-white"
          />
        )
      },
      {
        id: 2,
        content: (
          <img
            src={photo9.src}
            alt="photo9"
            className="w-full h-full object-cover pointer-events-none bg-white"
          />
        )
      }
    ];
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
                backfaceVisibility: 'hidden',
                transformStyle: 'preserve-3d'
              }}
              onClick={() =>
                shouldEnableClick && sendToBack(card.id)
              }
              animate={{
                rotateZ:
                  (stack.length - index - 1) * 4 + randomRotate,
                scale:
                  1 + index * 0.06 - stack.length * 0.06,
                transformOrigin: '90% 90%'
              }}
              initial={false}
              transition={{
                type: 'spring',
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
  const images = [photo8.src, photo9.src];

  return (
    <div className="w-full bg-white overflow-hidden pt-20 md:pt-24 lg:pt-12">
      <div className="w-full px-4 sm:px-8 md:px-10 lg:px-16">

        <div className="flex flex-row items-start justify-between gap-8 md:gap-10 lg:gap-16 py-4 md:py-6 lg:py-20">

          {/* Left Content */}
          <div className="z-10 order-1 flex-1 text-left md:pt-16 lg:pt-0 lg:translate-y-[-1.5rem] lg:pb-2 xl:translate-y-[-2rem]">

            <h1 className="text-[4rem] leading-[0.9] font-medium tracking-[-0.03em] text-black sm:text-[5rem] md:text-[5.2rem] lg:text-[7.5rem] xl:text-[8.5rem] 2xl:text-[9.5rem]">
              Gallery
            </h1>

            <p className="mt-2 text-[1.5rem] font-normal uppercase tracking-[-0.01em] text-[#E3791D] sm:text-[1.8rem] md:text-[2rem] lg:text-[2.4rem] xl:text-[2.6rem]">
              CREATIVE
            </p>

            <p className="text-[1.5rem] leading-snug font-normal uppercase tracking-[-0.01em] text-black sm:text-[1.8rem] md:text-[2rem] lg:text-[2.4rem] xl:text-[2.6rem]">
              STORIES CAPTURED
              <br />
              WITH PURPOSE
            </p>

          </div>

          {/* Right Content - Card Stack */}
          <div className="flex justify-end order-2 shrink-0">

            <div className="w-52 h-64 sm:w-64 sm:h-80 md:w-72 md:h-[400px] lg:w-80 lg:h-[480px] xl:w-80 xl:h-[520px]">

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
    </div>
  );
}