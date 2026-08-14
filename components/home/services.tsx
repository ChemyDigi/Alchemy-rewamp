"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"

type Service = {
  title: string
  count: string
  image: string
  label?: string
  link: string
}

const services: Service[] = [
  {
    title: "IT Solutions",
    count: "01",
    image: "/images/home/it.webp",
    label: "IT Solutions",
    link: "/services-it",
  },
  {
    title: "AV Production",
    count: "02",
    image: "/images/home/av.webp",
    label: "AV Production",
    link: "/services-av",
  },
  {
    title: "Digital Marketing",
    count: "03",
    image: "/images/home/marketing.webp",
    label: "Digital Marketing",
    link: "/services-dm",
  },
  {
    title: "Event Management",
    count: "04",
    image: "/images/home/event.webp",
    label: "Event Management",
    link: "/services-event",
  },
]

export default function Services() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [isDesktop, setIsDesktop] = useState(false)
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
  const [isCursorVisible, setIsCursorVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const targetPos = useRef({ x: 0, y: 0 })
  const currentPos = useRef({ x: 0, y: 0 })
  const rafId = useRef<number | null>(null)

  useEffect(() => {
    const checkScreen = () => {
      const hasHover = window.matchMedia("(hover: hover)").matches
      setIsDesktop(window.innerWidth >= 1024 && hasHover)
    }

    checkScreen()
    window.addEventListener("resize", checkScreen)

    return () => window.removeEventListener("resize", checkScreen)
  }, [])

  // RAF lerp loop — runs only while cursor is visible
  useEffect(() => {
    if (!isCursorVisible) {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current)
      return
    }

    const LERP = 0.12

    const loop = () => {
      const dx = targetPos.current.x - currentPos.current.x
      const dy = targetPos.current.y - currentPos.current.y

      if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1) {
        currentPos.current.x += dx * LERP
        currentPos.current.y += dy * LERP
        setCursorPos({ x: currentPos.current.x, y: currentPos.current.y })
      }

      rafId.current = requestAnimationFrame(loop)
    }

    rafId.current = requestAnimationFrame(loop)
    return () => {
      if (rafId.current !== null) cancelAnimationFrame(rafId.current)
    }
  }, [isCursorVisible])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const rect = sectionRef.current?.getBoundingClientRect()
    if (rect) {
      targetPos.current = { x: e.clientX - rect.left, y: e.clientY - rect.top }
    }
  }, [])

  const handleSectionEnter = () => setIsCursorVisible(true)
  const handleSectionLeave = () => {
    setIsCursorVisible(false)
    if (isDesktop) setActiveIndex(null)
  }

  const handleEnter = (index: number) => {
    if (isDesktop) setActiveIndex(index)
  }

  const handleLeave = () => {
    if (isDesktop) setActiveIndex(null)
  }

  return (
    <section
      ref={sectionRef}
      className="w-full pt-4 pb-8 px-6 md:px-10 lg:px-16 bg-white relative"
      style={{ cursor: isDesktop ? "none" : "auto" }}
      onMouseMove={isDesktop ? handleMouseMove : undefined}
      onMouseEnter={isDesktop ? handleSectionEnter : undefined}
      onMouseLeave={isDesktop ? handleSectionLeave : undefined}
    >
      {/* Dedicated scroll target, positioned further down so clicking "Services"
          in navigation scrolls cleanly past the preceding AboutIntro section */}
      <div id="services" className="absolute top-0 left-0" aria-hidden="true" />

      {/* Custom Cursor */}
      {isDesktop && (
        <div
          style={{
            position: "absolute",
            left: cursorPos.x,
            top: cursorPos.y,
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            zIndex: 9999,
            opacity: isCursorVisible ? 1 : 0,
            transition: "opacity 150ms ease",
          }}
        >
          {/* Outer circle */}
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              backgroundColor: "#E3791D",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 16px rgba(227,121,29,0.45)",
            }}
          >
            {/* Arrow SVG */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 10H16M16 10L11 5M16 10L11 15"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      )}

      {/* Heading */}
      <div className="mb-10">
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-black">
          OUR <span className="text-orange">SERVICES</span>
        </h2>
        <p className="text-[#505050] mt-2 text-sm md:text-lg lg:text-2xl">
          We bring ideas to life
        </p>
      </div>

      {/* Container */}
      <div className="bg-gray-100 rounded-3xl p-4 md:p-10 lg:p-20">
        <div className="max-w-4xl mx-auto">
          {services.map((service, index) => {
            const isActive = activeIndex === index

            return (
              <Link key={index} href={service.link}>
                <div
                  onMouseEnter={isDesktop ? () => handleEnter(index) : undefined}
                  className="cursor-pointer mb-6 active:scale-[0.97] transition-all duration-150 ease-out"
                >
                  {/* TEXT */}
                  <div
                    style={{
                      maxHeight: isActive ? "0px" : "140px",
                      opacity: isActive ? 0 : 1,
                      transform: isActive
                        ? "translateY(-12px)"
                        : "translateY(0px)",
                      overflow: "hidden",
                      transition:
                        "max-height 250ms ease-out, opacity 200ms ease-out, transform 250ms ease-out",
                    }}
                    className="flex justify-center items-center gap-3 flex-wrap"
                  >
                    <h3 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-semibold text-[#747474] text-center leading-[1.2] py-2">
                      {service.title}
                    </h3>
                  </div>

                  {/* EXPAND WRAPPER */}
                  <div
                    style={{
                      height: isActive ? "250px" : "0px",
                      marginTop: isActive ? "16px" : "0px",
                      transition:
                        "height 300ms cubic-bezier(0.16,1,0.3,1), margin-top 300ms cubic-bezier(0.16,1,0.3,1)",
                      overflow: "hidden",
                    }}
                  >
                    {/* SCALE CONTAINER */}
                    <div
                      style={{
                        width: "100%",
                        height: "250px",
                        transformOrigin: "center center",
                        transform: isActive ? "scale(1)" : "scale(0)",
                        borderRadius: isActive ? "1rem" : "50%",
                        overflow: "hidden",
                        position: "relative",
                        transition:
                          "transform 300ms cubic-bezier(0.16,1,0.3,1), border-radius 300ms cubic-bezier(0.16,1,0.3,1)",
                      }}
                    >
                      {/* IMAGE */}
                      <div
                        style={{
                          position: "relative",
                          width: "100%",
                          height: "100%",
                          transformOrigin: "center center",
                          transform: isActive ? "scale(1)" : "scale(1.1)",
                          transition:
                            "transform 350ms cubic-bezier(0.16,1,0.3,1)",
                        }}
                      >
                        <img
                          src={service.image}
                          alt={service.title}
                          loading="eager"
                          className="w-full h-full object-cover object-center"
                        />
                      </div>

                      {/* LABEL */}
                      {service.label && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: isActive ? "0.75rem" : "50%",
                            right: isActive ? "0.75rem" : "50%",
                            transform: isActive
                              ? "translate(0, 0)"
                              : "translate(50%, 50%)",
                            color: "white",
                            fontSize: "16px",
                            fontWeight: "500",
                            whiteSpace: "nowrap",
                            transition:
                              "all 300ms cubic-bezier(0.16, 1, 0.3, 1)",
                            opacity: isActive ? 1 : 0,
                            pointerEvents: "none",
                            textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                            zIndex: 10,
                          }}
                        >
                          {service.label}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}