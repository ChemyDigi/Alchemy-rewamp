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

  const handleEnter = (index: number) => {
    setActiveIndex(index)
  }

  const handleLeave = () => {
    setActiveIndex(null)
  }

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
        <div
          className="space-y-10 max-w-4xl mx-auto"
          onMouseLeave={handleLeave}
        >
          {services.map((service, index) => {
            const isActive = activeIndex === index

            return (
              <div
                key={index}
                onMouseEnter={() => handleEnter(index)}
                onClick={() => handleClick(index)}
                className="cursor-pointer"
              >
                {/* TEXT */}
                <div
                  className={`flex justify-center items-center gap-4 flex-wrap transition-all duration-300 ${
                    isActive ? "opacity-0 -translate-y-4" : "opacity-100"
                  }`}
                >
                  <h3 className="text-4xl md:text-8xl font-semibold text-[#747474] text-center">
                    {service.title}
                  </h3>

                  <span className="bg-white text-[12px] px-3 py-1 rounded-full">
                    {service.count}
                  </span>
                </div>

                {/* IMAGE CONTAINER */}
                <div
                  className={`overflow-hidden rounded-2xl transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isActive ? "mt-6 max-h-[420px]" : "mt-0 max-h-0"
                  }`}
                >
                  <div
                    className={`relative w-full h-[420px] transition-transform duration-700 ${
                      isActive ? "scale-100" : "scale-110"
                    }`}
                  >
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover object-center rounded-2xl"
                    />

                    {/* Bottom label */}
                    {service.label && (
                      <div className="absolute bottom-4 right-4 text-white text-[25px]">
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