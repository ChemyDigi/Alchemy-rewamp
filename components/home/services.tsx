"use client"
import { useState } from "react"

type Service = {
  title: string
  count: string
  image: string
  label?: string
}

const services: Service[] = [
  {
    title: "IT Solutions",
    count: "01",
    image: "/images/it.jpg",
    label: "IT Solutions",
  },
  {
    title: "AV Production",
    count: "02",
    image: "/images/av.jpg",
    label: "AV Production",
  },
  {
    title: "Digital Marketing",
    count: "03",
    image: "/images/marketing.jpg",
    label: "Digital Marketing",
  },
  {
    title: "Event Management",
    count: "04",
    image: "/images/event.jpg",
    label: "Event Management",
  },
]

export default function Services() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0)

  const handleEnter = (index: number) => setActiveIndex(index)
  const handleLeave = () => setActiveIndex(null)
  const handleClick = (index: number) => {
    setActiveIndex((prev) => (prev === index ? null : index))
  }

  return (
    <section className="w-full py-20 px-4 md:px-10 bg-white">

      {/* Heading */}
      <div className="mb-12">
        <h2 className="text-3xl md:text-5xl font-bold text-black">
          OUR <span className="text-orange-500">SERVICES</span>
        </h2>
        <p className="text-[#505050] mt-2">We bring ideas to life</p>
      </div>

      {/* Container */}
      <div className="bg-gray-100 rounded-3xl p-6 md:p-30">
        <div className="max-w-4xl mx-auto" onMouseLeave={handleLeave}>
          {services.map((service, index) => {
            const isActive = activeIndex === index

            return (
              <div
                key={index}
                onMouseEnter={() => handleEnter(index)}
                onClick={() => handleClick(index)}
                className="cursor-pointer mb-6" // Changed from mb-10 to mb-6
              >
                {/* TEXT — fast collapse so no empty space */}
                <div
                  style={{
                    maxHeight: isActive ? "0px" : "180px",
                    opacity: isActive ? 0 : 1,
                    transform: isActive ? "translateY(-16px)" : "translateY(0px)",
                    overflow: "hidden",
                    transition: "max-height 300ms ease, opacity 300ms ease, transform 300ms ease",
                  }}
                  className="flex justify-center items-center gap-4 flex-wrap"
                >
                  <h3 className="text-4xl md:text-8xl font-semibold text-[#747474] text-center leading-[1.2] py-2">
                    {service.title}
                  </h3>
                  <span className="bg-white text-[12px] px-3 py-1 rounded-full self-center">
                    {service.count}
                  </span>
                </div>

                {/* OUTER WRAPPER — handles layout height so content below moves smoothly */}
                <div
                  style={{
                    height: isActive ? "420px" : "0px",
                    marginTop: isActive ? "24px" : "0px",
                    transition:
                      "height 900ms cubic-bezier(0.22,1,0.36,1), margin-top 900ms cubic-bezier(0.22,1,0.36,1)",
                    overflow: "hidden",
                  }}
                >
                  {/* SCALE CONTAINER — grows from dead center in all directions */}
                  <div
                    style={{
                      width: "100%",
                      height: "420px",
                      transformOrigin: "center center",
                      transform: isActive ? "scale(1)" : "scale(0)",
                      borderRadius: isActive ? "1rem" : "50%",
                      overflow: "hidden",
                      position: "relative",
                      transition:
                        "transform 900ms cubic-bezier(0.22,1,0.36,1), border-radius 900ms cubic-bezier(0.22,1,0.36,1)",
                    }}
                  >
                    {/* IMAGE — slow subtle zoom on top of the expand */}
                    <div
                      style={{
                        position: "relative",
                        width: "100%",
                        height: "100%",
                        transformOrigin: "center center",
                        transform: isActive ? "scale(1)" : "scale(1.15)",
                        transition: "transform 1200ms cubic-bezier(0.22,1,0.36,1)",
                      }}
                    >
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    
                    {/* LABEL WITH ANIMATION - moves from center to bottom-right */}
                    {service.label && (
                      <div
                        style={{
                          position: "absolute",
                          bottom: isActive ? "1rem" : "50%",
                          right: isActive ? "1rem" : "50%",
                          transform: isActive 
                            ? "translate(0, 0)" 
                            : "translate(50%, 50%)",
                          color: "white",
                          fontSize: "25px",
                          fontWeight: "500",
                          whiteSpace: "nowrap",
                          transition: "all 900ms cubic-bezier(0.22, 1, 0.36, 1)",
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
            )
          })}
        </div>
      </div>
    </section>
  )
}