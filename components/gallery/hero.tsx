// components/hero.tsx
'use client';

import { motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getGallery } from '@/lib/firestore';

interface CardRotateProps {
  children: React.ReactNode;
  onSendToBack: () => void;
  sensitivity: number;
  disableDrag?: boolean;
}

function CardRotate({ children, onSendToBack, sensitivity, disableDrag = false }: CardRotateProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [60, -60]);
  const rotateY = useTransform(x, [-100, 100], [-60, 60]);

  function handleDragEnd(_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    // Only send to back if dragged left (negative x offset) and beyond sensitivity
    if (info.offset.x < -sensitivity) {
      onSendToBack();
    } else {
      x.set(0);
      y.set(0);
    }
  }

  if (disableDrag) {
    return (
      <motion.div className="absolute inset-0 cursor-pointer" style={{ x: 0, y: 0 }}>
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

  const [stack, setStack] = useState<{ id: number; content: React.ReactNode }[]>(() => {
    if (cards.length) {
      return cards.map((content, index) => ({ id: index + 1, content }));
    } else {
      return [];
    }
  });

  useEffect(() => {
    if (cards.length) {
      setStack(cards.map((content, index) => ({ id: index + 1, content })));
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
        const randomRotate = randomRotation ? Math.random() * 10 - 5 : 0;
        return (
          <CardRotate
            key={card.id}
            onSendToBack={() => sendToBack(card.id)}
            sensitivity={sensitivity}
            disableDrag={shouldDisableDrag}
          >
            <motion.div
              className="rounded-2xl overflow-hidden w-full h-full shadow-xl bg-white"
              style={{ backfaceVisibility: 'hidden', transformStyle: 'preserve-3d' }}
              onClick={() => shouldEnableClick && sendToBack(card.id)}
              animate={{
                rotateZ: (stack.length - index - 1) * 4 + randomRotate,
                scale: 1 + index * 0.06 - stack.length * 0.06,
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
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    getGallery().then(data => {
      // Use the first 5 images for the hero stack
      setImages(data.map(item => item.imageUrl).slice(0, 5));
    });
  }, []);

  return (
    <div className="min-h-screen bg-white pt-16 md:pt-0">
      <div className="w-full px-4 sm:px-8 md:px-12 lg:px-16">
        <div className="flex flex-col lg:flex-row items-center lg:items-end lg:justify-between gap-6 lg:gap-16 py-10 lg:py-20">
          {/* Right Content - Card Stack */}
          <div className="flex justify-center lg:justify-end lg:pr-24 pb-4 lg:pb-0 order-1 lg:order-2 w-full lg:w-auto">
            <div className="w-64 h-80 sm:w-72 sm:h-96 md:w-72 md:h-[400px] lg:w-80 lg:h-[480px] xl:w-80 xl:h-[520px]">
              <Stack
                randomRotation={false}
                sensitivity={200}
                sendToBackOnClick={true}
                cards={images.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`card-${i + 1}`}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', backgroundColor: '#fff' }}
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

          {/* Left Content */}
          <div className="z-10 max-w-[620px] text-center lg:text-left lg:translate-y-[-1.5rem] lg:pb-2 xl:translate-y-[-2rem] mb-2 lg:mb-0 order-2 lg:order-1 w-full">
            <h1 className="text-3xl leading-[0.95] font-medium tracking-[-0.03em] text-black sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl">
              Gallery
            </h1>
            <p className="mt-2 text-sm font-normal uppercase tracking-[-0.01em] text-[#E3791D] sm:text-base md:text-lg lg:text-xl">
              CREATIVE
            </p>
            <p className="text-sm leading-snug font-normal uppercase tracking-[-0.01em] text-black sm:text-base md:text-lg lg:text-xl">
              STORIES CAPTURED WITH PURPOSE
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}