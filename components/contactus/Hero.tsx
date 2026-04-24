"use client";

import Lanyard from "../ui/Lanyard";

export default function Hero() {
    return (
        <section className="relative min-h-screen bg-[#f5f5f5]">

            {/* Full-screen Lanyard layer */}
            <div className="absolute inset-0 z-20">
                <Lanyard
                    position={[0, 0, 25]}
                    gravity={[0, -40, 0]}
                    offset={[3, 0, 0]}
                />
            </div>

            {/* Main Hero Wrapper */}
            <div className="relative max-w-[1600px] mx-auto min-h-screen px-12 md:px-16 pt-116 z-10 pointer-events-none">

                {/* LEFT CONTENT */}
                <div className="z-10 mt-auto max-w-[620px] pb-8 lg:translate-y-[-1.5rem] lg:pb-2 xl:translate-y-[-2rem]">
                    <h1 className="text-7xl leading-[0.88] font-medium tracking-[-0.03em] text-black sm:text-8xl md:text-9xl lg:text-[10.75rem] xl:text-[11.5rem] 2xl:text-[12.5rem]">
                        Contact
                    </h1>

                    <p className="mt-3 text-xl font-normal uppercase tracking-[-0.01em] text-[var(--color-orange)] sm:text-3xl lg:text-xl">
                        Say Hello
                    </p>
                    <p className="text-xl leading-none font-normal uppercase tracking-[-0.01em] text-black sm:text-3xl lg:text-xl">
                        We&apos;re Ready When You Are.
                    </p>
                </div>
            </div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
        </section>
    );
}