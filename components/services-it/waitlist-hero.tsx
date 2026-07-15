"use client"

import { useState, useRef, FormEvent, useEffect } from "react"

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  color: string;
  size: number;
}

export const WaitlistHero = () => {
  const [email, setEmail] = useState<string>("")
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle")
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email) return

    setStatus("loading")

    // Simulate API delay
    setTimeout(() => {
      setStatus("success")
      setEmail("")
      fireConfetti()
    }, 1500)
  }

  // --- Confetti Logic ---
  const fireConfetti = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const particles: Particle[] = []
    const colors = ["#0079da", "#10b981", "#fbbf24", "#f472b6", "#fff"]

    // Resize canvas to cover the button area mostly
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const createParticle = (): Particle => {
      return {
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 12, // Random spread X
        vy: (Math.random() - 2) * 10, // Upward velocity
        life: 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 4 + 2,
      }
    }

    // Create batch of particles
    for (let i = 0; i < 50; i++) {
      particles.push(createParticle())
    }

    let animationFrameId: number

    const animate = () => {
      if (particles.length === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId)
        }
        return
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.vy += 0.5 // Gravity
        p.life -= 2

        ctx.fillStyle = p.color
        ctx.globalAlpha = Math.max(0, p.life / 100)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fill()

        if (p.life <= 0) {
          particles.splice(i, 1)
          i--
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()
  }

  const techLogos = [
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-original.svg",
    // "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
    "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  ]

  // Don't render the animated logos on the server
  if (!isMounted) {
    return (
      <div className="w-full min-h-screen bg-black flex items-center justify-center">
        <div className="relative w-full h-screen overflow-hidden shadow-2xl" style={{ backgroundColor: "#09090b" }}>
          {/* Gradient Overlay */}
          <div
            className="absolute inset-0 z-10 pointer-events-none"
            style={{
              background: `linear-gradient(to top, #09090b 10%, rgba(9, 9, 11, 0.8) 40%, transparent 100%)`,
            }}
          />
          {/* Content Container */}
          <div className="relative z-20 w-full h-full flex flex-col items-center justify-center gap-2">
            <h1 className="text-2xl md:text-4xl font-semibold text-center tracking-tight" style={{ color: "#ffffff" }}>
              TECH STACK
            </h1>
            <p className="text-sm md:text-lg font-light text-center max-w-2xl" style={{ color: "#ffffff" }}>
              We stay with the latest trends in design and technology
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-black flex items-center justify-center">
      {/* Animation Styles */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 60s linear infinite;
        }
        @keyframes spin-slow-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 60s linear infinite;
        }
        @keyframes bounce-in {
          0% { transform: scale(0.8); opacity: 0; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        @keyframes success-pulse {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.1); }
          70% { transform: scale(0.95); }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes success-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(16, 185, 129, 0.4); }
          50% { box-shadow: 0 0 60px rgba(16, 185, 129, 0.8), 0 0 100px rgba(16, 185, 129, 0.4); }
        }
        @keyframes checkmark-draw {
          0% { stroke-dashoffset: 24; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes celebration-ring {
          0% { transform: translate(-50%, -50%) scale(0.8); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
        }
        .animate-success-pulse {
          animation: success-pulse 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .animate-success-glow {
          animation: success-glow 2s ease-in-out infinite;
        }
        .animate-checkmark {
          stroke-dasharray: 24;
          stroke-dashoffset: 24;
          animation: checkmark-draw 0.4s ease-out 0.3s forwards;
        }
        .animate-ring {
          animation: celebration-ring 0.8s ease-out forwards;
        }
      `}</style>

      {/* Main Container */}
      <div
        className="relative w-full h-screen overflow-hidden shadow-2xl"
        style={{
          backgroundColor: "#09090b",
        }}
      >
        {/* Background Decorative Layer */}
        <div
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{
            perspective: "1200px",
            transform: "perspective(1200px) rotateX(15deg)",
            transformOrigin: "center bottom",
            opacity: 1,
          }}
        >
          {/* Layer 1 - Outer Edge (Background): Smaller, dimmer, and blurred logos */}
          <div className="absolute inset-0 animate-spin-slow">
            {techLogos.map((logo, index) => {
              const angle = (index / techLogos.length) * Math.PI * 2
              const radius = 800
              const x = Math.cos(angle) * radius
              const y = Math.sin(angle) * radius
              return (
                <div
                  key={index}
                  className="absolute top-1/2 left-1/2 select-none pointer-events-none"
                  style={{
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    width: "35px",
                    height: "35px",
                    zIndex: 0,
                  }}
                >
                  <img
                    src={logo}
                    alt={`Tech logo ${index}`}
                    className="w-full h-full object-contain opacity-25 filter blur-[1.5px]"
                  />
                </div>
              )
            })}
          </div>

          {/* Layer 2 - Middle Distance: Medium scale and opacity, subtle blur */}
          <div className="absolute inset-0 animate-spin-slow-reverse">
            {techLogos.map((logo, index) => {
              const angle = (index / techLogos.length) * Math.PI * 2 + Math.PI / 6
              const radius = 500
              const x = Math.cos(angle) * radius
              const y = Math.sin(angle) * radius
              return (
                <div
                  key={index}
                  className="absolute top-1/2 left-1/2 select-none pointer-events-none"
                  style={{
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    width: "55px",
                    height: "55px",
                    zIndex: 1,
                  }}
                >
                  <img
                    src={logo}
                    alt={`Tech logo ${index}`}
                    className="w-full h-full object-contain opacity-55 filter blur-[0.5px]"
                  />
                </div>
              )
            })}
          </div>

          {/* Layer 3 - Foreground (Center): Larger, sharp, and highly visible logos */}
          <div className="absolute inset-0 animate-spin-slow">
            {techLogos.map((logo, index) => {
              const angle = (index / techLogos.length) * Math.PI * 2 + Math.PI / 3
              const radius = 250
              const x = Math.cos(angle) * radius
              const y = Math.sin(angle) * radius
              return (
                <div
                  key={index}
                  className="absolute top-1/2 left-1/2 select-none pointer-events-none"
                  style={{
                    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
                    width: "75px",
                    height: "75px",
                    zIndex: 2,
                  }}
                >
                  <img
                    src={logo}
                    alt={`Tech logo ${index}`}
                    className="w-full h-full object-contain opacity-90"
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: `linear-gradient(to top, #09090b 10%, rgba(9, 9, 11, 0.8) 40%, transparent 100%)`,
          }}
        />

        {/* Content Container */}
        <div className="relative z-20 w-full h-full flex flex-col items-center justify-center gap-2">
          {/* Radial Gradient Behind Text to Make it Pop */}
          <div
            className="absolute inset-0 m-auto w-[90%] max-w-[650px] h-[300px] rounded-full pointer-events-none filter blur-[60px]"
            style={{
              background: "radial-gradient(circle, rgba(9,9,11,0.95) 0%, rgba(9,9,11,0.6) 60%, transparent 100%)",
              zIndex: -1,
            }}
          />

          {/* TECH STACK Heading */}
          <h1 className="text-2xl md:text-4xl font-semibold text-center tracking-tight" style={{ color: "#ffffff" }}>
            TECH STACK
          </h1>

          {/* Subheading */}
          <p className="text-sm md:text-lg font-light text-center max-w-2xl px-6" style={{ color: "#ffffff" }}>
            We stay with the latest trends in design and technology
          </p>
        </div>
      </div>
    </div>
  )
}