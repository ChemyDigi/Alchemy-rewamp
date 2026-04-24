"use client"

type Logo = {
  src: string
  alt: string
}

const logos: Logo[] = [
  { src: "/images/logos/sample.png", alt: "Unilever" },
  { src: "/images/logos/sample.png", alt: "Sunquick" },
  { src: "/images/logos/sample.png", alt: "Sarasavi" },
  { src: "/images/logos/sample.png", alt: "Nature" },
  { src: "/images/logos/sample.png", alt: "Herbal" },
  { src: "/images/logos/sample.png", alt: "Keells" },
]

// Repeat enough times so the strip always overflows the viewport
const track = [...logos, ...logos, ...logos, ...logos]

export default function LogoLoop() {
  return (
    <section className="w-full py-20 bg-white overflow-hidden">

      {/* Heading */}
      <div className="px-12 md:px-16 mb-12">
        <h2 className="text-3xl md:text-5xl font-bold text-black">
          JOIN THE <span className="text-orange">BEST</span>
        </h2>
        <p className="text-[#505050] mt-2">
          Trusted by leading partners across industries
        </p>
      </div>

      {/* LOGO ROWS */}
      <div className="space-y-3">

        {/* ROW 1 → scroll right-to-left */}
        <div className="relative w-full overflow-hidden">
          <div className="flex w-max animate-marquee-left">
            {track.map((logo, i) => (
              <LogoItem key={i} logo={logo} />
            ))}
          </div>
        </div>

        {/* ROW 2 → scroll left-to-right */}
        <div className="relative w-full overflow-hidden">
          <div className="flex w-max animate-marquee-right">
            {track.map((logo, i) => (
              <LogoItem key={i} logo={logo} />
            ))}
          </div>
        </div>

      </div>

      <style jsx>{`
        @keyframes marquee-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes marquee-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }

        .animate-marquee-left {
          animation: marquee-left 30s linear infinite;
        }

        .animate-marquee-right {
          animation: marquee-right 30s linear infinite;
        }
      `}</style>
    </section>
  )
}

function LogoItem({ logo }: { logo: Logo }) {
  return (
    <div className="w-32 h-32 md:w-40 md:h-40 mx-2 flex items-center justify-center rounded-full bg-[#EAEAEA] shrink-0">
      <img
        src={logo.src}
        alt={logo.alt}
        className="max-w-[70%] max-h-[70%] object-contain opacity-80"
      />
    </div>
  )
}