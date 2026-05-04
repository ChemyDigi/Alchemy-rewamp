// hero.tsx (Blog page component)
import Image from "next/image";
import CardSwap, { Card } from "./CardSwap";

export default function BlogHero() {
  return (
    <section className="min-h-screen w-full bg-white overflow-hidden">
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col justify-between pl-8 pt-16 pb-10 sm:pl-12 lg:flex-row lg:items-end lg:pl-20 lg:pt-12 lg:pb-14">
        {/* Left side - Text content */}
        <div className="z-10 mt-auto max-w-[620px] pb-8 lg:translate-y-[-1.5rem] lg:pb-2 xl:translate-y-[-2rem] max-sm:mt-0 max-sm:pt-12">
          <h1 className="text-7xl leading-[0.88] font-medium tracking-[-0.03em] text-black sm:text-8xl md:text-9xl lg:text-[10.75rem] xl:text-[11.5rem] 2xl:text-[12.5rem]">
            Blog
          </h1>

          <p className="mt-3 text-xl font-normal uppercase tracking-[-0.01em] text-[#FF6B35] sm:text-3xl lg:text-xl">
            Insight
          </p>
          <p className="text-xl leading-none font-normal uppercase tracking-[-0.01em] text-black sm:text-3xl lg:text-xl">
            Driven By Impact.
          </p>
        </div>

        {/* Right side - Card stack */}
        <div className="relative mt-8 shrink-0 sm:mt-0 lg:mt-0 sm:ml-auto lg:ml-0 max-sm:ml-auto max-sm:translate-x-1">
          <div 
            className="relative"
            style={{
              width: "clamp(300px, 35vw, 450px)",
              height: "clamp(360px, 52vw, 520px)",
            }}
          >
            <CardSwap
              cardDistance={55}
              verticalDistance={55}
              delay={5000}
              pauseOnHover={true}
              width="100%"
              height="100%"
              skewAmount={5}
              easing="elastic"
            >
              {/* Card 1 */}
              <Card customClass="overflow-hidden">
                <div className="absolute inset-0">
                  <Image 
                    src="/images/blog/Blog1.jpg" 
                    alt="Blog 1" 
                    fill 
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <p className="text-sm uppercase tracking-wide text-[#FF6B35]">AI</p>
                    <p className="text-lg font-semibold">The Impact of AI</p>
                  </div>
                </div>
              </Card>

              {/* Card 2 */}
              <Card customClass="overflow-hidden">
                <div className="absolute inset-0">
                  <Image 
                    src="/images/home/event.jpg" 
                    alt="Event" 
                    fill 
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <p className="text-sm uppercase tracking-wide text-[#FF6B35]">Tech</p>
                    <p className="text-lg font-semibold">Creative Summit 2025</p>
                  </div>
                </div>
              </Card>

              {/* Card 3 */}
              <Card customClass="overflow-hidden">
                <div className="absolute inset-0">
                  <Image 
                    src="/images/home/it.jpg" 
                    alt="IT" 
                    fill 
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                    <p className="text-sm uppercase tracking-wide text-[#FF6B35]">Cybersecurity</p>
                    <p className="text-lg font-semibold">Innovation in Tech</p>
                  </div>
                </div>
              </Card>
            </CardSwap>
          </div>
        </div>
      </div>
    </section>
  );
}