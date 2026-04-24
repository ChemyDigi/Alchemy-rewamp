// components/image-gallery.tsx
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { gsap } from 'gsap';
import { X } from 'lucide-react';
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

const useMedia = (queries: string[], values: number[], defaultValue: number): number => {
  const [value, setValue] = useState<number>(defaultValue);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const get = () => values[queries.findIndex(q => window.matchMedia(q).matches)] ?? defaultValue;
    setValue(get());
    
    const handler = () => setValue(get());
    queries.forEach(q => window.matchMedia(q).addEventListener('change', handler));
    return () => queries.forEach(q => window.matchMedia(q).removeEventListener('change', handler));
  }, [queries, values, defaultValue]);

  return value;
};

const useMeasure = <T extends HTMLElement>() => {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setSize({ width, height });
    });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  return [ref, size] as const;
};

const preloadImages = async (urls: string[]): Promise<void> => {
  await Promise.all(
    urls.map(
      src =>
        new Promise<void>(resolve => {
          const img = new Image();
          img.src = src;
          img.onload = img.onerror = () => resolve();
        })
    )
  );
};

interface Item {
  id: string;
  img: string;
  url: string;
  width: number;
}

interface GridItem extends Item {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface MasonryProps {
  items: Item[];
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: 'bottom' | 'top' | 'left' | 'right' | 'center' | 'random';
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
  colorShiftOnHover?: boolean;
  onImageClick?: (img: string) => void;
}

const Masonry: React.FC<MasonryProps> = ({
  items,
  ease = 'power3.out',
  duration = 0.6,
  stagger = 0.05,
  animateFrom = 'bottom',
  scaleOnHover = true,
  hoverScale = 0.95,
  blurToFocus = true,
  colorShiftOnHover = false,
  onImageClick
}) => {
  const columns = useMedia(
    ['(min-width:1500px)', '(min-width:1000px)', '(min-width:600px)', '(min-width:400px)'],
    [4, 3, 2, 2],
    2
  );

  const [containerRef, { width }] = useMeasure<HTMLDivElement>();
  const [imagesReady, setImagesReady] = useState(false);

  const getInitialPosition = (item: GridItem) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return { x: item.x, y: item.y };

    let direction = animateFrom;
    if (animateFrom === 'random') {
      const dirs = ['top', 'bottom', 'left', 'right'];
      direction = dirs[Math.floor(Math.random() * dirs.length)] as typeof animateFrom;
    }

    switch (direction) {
      case 'top':
        return { x: item.x, y: -200 };
      case 'bottom':
        return { x: item.x, y: window.innerHeight + 200 };
      case 'left':
        return { x: -200, y: item.y };
      case 'right':
        return { x: window.innerWidth + 200, y: item.y };
      case 'center':
        return {
          x: containerRect.width / 2 - item.w / 2,
          y: containerRect.height / 2 - item.h / 2
        };
      default:
        return { x: item.x, y: item.y + 100 };
    }
  };

  useEffect(() => {
    preloadImages(items.map(i => i.img)).then(() => setImagesReady(true));
  }, [items]);

  const grid = useMemo<GridItem[]>(() => {
    if (!width) return [];
    
    const rowHeight = 300;
    const gap = 16;
    
    let currentRow = 0;
    const rowItems: GridItem[] = [];
    
    const itemsWithWidth = items.map(item => {
      return { ...item, widthMultiplier: item.width };
    });
    
    let row: typeof itemsWithWidth = [];
    let rowWidth = 0;
    
    for (const item of itemsWithWidth) {
      const itemWidth = width * (item.widthMultiplier / columns);
      
      if (rowWidth + itemWidth > width && row.length > 0) {
        const totalWidth = row.reduce((sum, i) => sum + (width * (i.widthMultiplier / columns)), 0);
        const remainingSpace = width - totalWidth;
        const spacePerItem = remainingSpace / row.length;
        
        let xPos = 0;
        row.forEach((rowItem, idx) => {
          const calculatedWidth = (width * (rowItem.widthMultiplier / columns)) + spacePerItem;
          rowItems.push({
            ...rowItem,
            x: xPos,
            y: currentRow * (rowHeight + gap),
            w: calculatedWidth,
            h: rowHeight
          });
          xPos += calculatedWidth + gap;
        });
        
        row = [item];
        rowWidth = itemWidth;
        currentRow++;
      } else {
        row.push(item);
        rowWidth += itemWidth + gap;
      }
    }
    
    if (row.length > 0) {
      const totalWidth = row.reduce((sum, i) => sum + (width * (i.widthMultiplier / columns)), 0);
      const remainingSpace = width - totalWidth;
      const spacePerItem = remainingSpace / row.length;
      
      let xPos = 0;
      row.forEach((rowItem, idx) => {
        const calculatedWidth = (width * (rowItem.widthMultiplier / columns)) + spacePerItem;
        rowItems.push({
          ...rowItem,
          x: xPos,
          y: currentRow * (rowHeight + gap),
          w: calculatedWidth,
          h: rowHeight
        });
        xPos += calculatedWidth + gap;
      });
    }
    
    return rowItems;
  }, [columns, items, width]);

  const hasMounted = useRef(false);

  useLayoutEffect(() => {
    if (!imagesReady) return;

    grid.forEach((item, index) => {
      const selector = `[data-key="${item.id}"]`;
      const animProps = { x: item.x, y: item.y, width: item.w, height: item.h };

      if (!hasMounted.current) {
        const start = getInitialPosition(item);
        gsap.fromTo(
          selector,
          {
            opacity: 0,
            x: start.x,
            y: start.y,
            width: item.w,
            height: item.h,
            ...(blurToFocus && { filter: 'blur(10px)' })
          },
          {
            opacity: 1,
            ...animProps,
            ...(blurToFocus && { filter: 'blur(0px)' }),
            duration: 0.8,
            ease: 'power3.out',
            delay: index * stagger
          }
        );
      } else {
        gsap.to(selector, {
          ...animProps,
          duration,
          ease,
          overwrite: 'auto'
        });
      }
    });

    hasMounted.current = true;
  }, [grid, imagesReady, stagger, animateFrom, blurToFocus, duration, ease]);

  const handleMouseEnter = (id: string, element: HTMLElement) => {
    if (scaleOnHover) {
      gsap.to(`[data-key="${id}"]`, {
        scale: hoverScale,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
    if (colorShiftOnHover) {
      const overlay = element.querySelector('.color-overlay') as HTMLElement;
      if (overlay) gsap.to(overlay, { opacity: 0.3, duration: 0.3 });
    }
  };

  const handleMouseLeave = (id: string, element: HTMLElement) => {
    if (scaleOnHover) {
      gsap.to(`[data-key="${id}"]`, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
    if (colorShiftOnHover) {
      const overlay = element.querySelector('.color-overlay') as HTMLElement;
      if (overlay) gsap.to(overlay, { opacity: 0, duration: 0.3 });
    }
  };

  const handleClick = (img: string) => {
    if (onImageClick) {
      onImageClick(img);
    }
  };

  return (
    <div ref={containerRef} className="relative w-full" style={{ minHeight: '800px' }}>
      {grid.map(item => (
        <div
          key={item.id}
          data-key={item.id}
          className="absolute box-content cursor-pointer"
          style={{ willChange: 'transform, width, height, opacity' }}
          onClick={() => handleClick(item.img)}
          onMouseEnter={e => handleMouseEnter(item.id, e.currentTarget)}
          onMouseLeave={e => handleMouseLeave(item.id, e.currentTarget)}
        >
          <div
            className="relative w-full h-full bg-cover bg-center rounded-2xl shadow-lg overflow-hidden"
            style={{ backgroundImage: `url(${item.img})` }}
          >
            {colorShiftOnHover && (
              <div className="color-overlay absolute inset-0 rounded-2xl bg-gradient-to-tr from-pink-500/50 to-sky-500/50 opacity-0 pointer-events-none" />
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition duration-300 flex items-center justify-center">
              <span className="text-white text-sm font-medium bg-black/50 px-4 py-2 rounded-full">
                VIEW
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default function ImageGallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const items = [
    {
      id: "1",
      img: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?q=80&w=800&auto=format",
      url: "#",
      width: 1,
    },
    {
      id: "2",
      img: "https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=800&auto=format",
      url: "#",
      width: 2,
    },
    {
      id: "3",
      img: "https://images.unsplash.com/photo-1452626212852-811d58933cae?q=80&w=800&auto=format",
      url: "#",
      width: 1,
    },
    {
      id: "4",
      img: "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?q=80&w=800&auto=format",
      url: "#",
      width: 1.5,
    },
    {
      id: "5",
      img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format",
      url: "#",
      width: 1,
    },
    {
      id: "6",
      img: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=800&auto=format",
      url: "#",
      width: 2,
    },
    {
      id: "7",
      img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800&auto=format",
      url: "#",
      width: 1,
    },
    {
      id: "8",
      img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800&auto=format",
      url: "#",
      width: 1,
    },
    {
      id: "9",
      img: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?q=80&w=800&auto=format",
      url: "#",
      width: 1.5,
    },
    {
      id: "10",
      img: "https://images.unsplash.com/photo-1534081333815-ae5019106622?q=80&w=800&auto=format",
      url: "#",
      width: 1,
    },
  ];

  const openImage = (image: string) => {
    setSelectedImage(image);
    setIsOpen(true);
  };

  const closeImage = () => {
    setIsOpen(false);
    setTimeout(() => setSelectedImage(null), 300);
  };

  return (
    <>
      <div className="w-full bg-white">
        <div className="w-full px-12 md:px-16">
          <Masonry
            items={items}
            ease="power3.out"
            duration={0.6}
            stagger={0.05}
            animateFrom="bottom"
            scaleOnHover={true}
            hoverScale={0.95}
            blurToFocus={true}
            colorShiftOnHover={false}
            onImageClick={openImage}
          />
        </div>
      </div>
      {/* 10cm of white space - approximately 40rem */}
      <div className="w-full bg-white" style={{ height: '40rem' }}></div>

      {/* Full Screen Modal */}
      <AnimatePresence>
        {isOpen && selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={closeImage}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-6 right-6 text-white hover:text-gray-300 transition z-10"
              onClick={closeImage}
            >
              <X size={32} />
            </motion.button>
            
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={selectedImage}
              alt="Full size"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}