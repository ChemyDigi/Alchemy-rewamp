"use client"

import { useState, useEffect } from "react"
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
    image: "/images/home/it.jpg",
    label: "IT Solutions",
    link: "/services-it",
  },
  {
    title: "AV Production",
    count: "02",
    image: "/images/home/av.jpg",
    label: "AV Production",
    link: "/services/av-production",
  },
  {
    title: "Digital Marketing",
    count: "03",
    image: "/images/home/marketing.jpg",
    label: "Digital Marketing",
    link: "/services-dm",
  },
  {
    title: "Event Management",
    count: "04",
    image: "/images/home/event.jpg",
    label: "Event Management",
    link: "/services-event",
  },
]

export default function Services() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkScreen = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }

    checkScreen()
    window.addEventListener("resize", checkScreen)

    return () => window.removeEventListener("resize", checkScreen)
  }, [])

  const handleEnter = (index: number) => {
    if (isDesktop) setActiveIndex(index)
  }

  const handleLeave = () => {
    if (isDesktop) setActiveIndex(null)
  }

  return (
    <section className="w-full pt-4 pb-8 px-6 md:px-10 lg:px-16 bg-white">

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
        <div className="max-w-4xl mx-auto" onMouseLeave={handleLeave}>
          {services.map((service, index) => {
            const isActive = activeIndex === index

            return (
              <Link key={index} href={service.link}>
                <div
                  onMouseEnter={() => handleEnter(index)}
                  className="cursor-pointer mb-6"
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
                        "max-height 300ms ease, opacity 300ms ease, transform 300ms ease",
                    }}
                    className="flex justify-center items-center gap-3 flex-wrap"
                  >
                    <h3 className="text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-semibold text-[#747474] text-center leading-[1.2] py-2">
                      {service.title}
                    </h3>
                    <span className="bg-white text-[10px] md:text-xs px-2 py-1 rounded-full">
                      {service.count}
                    </span>
                  </div>

                  {/* EXPAND WRAPPER */}
                  <div
                    style={{
                      height: isActive ? "250px" : "0px",
                      marginTop: isActive ? "16px" : "0px",
                      transition:
                        "height 700ms cubic-bezier(0.22,1,0.36,1), margin-top 700ms cubic-bezier(0.22,1,0.36,1)",
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
                          "transform 700ms cubic-bezier(0.22,1,0.36,1), border-radius 700ms cubic-bezier(0.22,1,0.36,1)",
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
                            "transform 900ms cubic-bezier(0.22,1,0.36,1)",
                        }}
                      >
                        <img
                          src={service.image}
                          alt={service.title}
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
                              "all 700ms cubic-bezier(0.22, 1, 0.36, 1)",
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