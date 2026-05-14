"use client";

import Lanyard from "../ui/Lanyard";

export default function Hero() {
    return (
        <section className="relative min-h-[53vh] md:min-h-screen md:max-lg:portrait:min-h-fit bg-white">

            {/* Full-screen Lanyard layer */}
            <div className="absolute inset-0 z-20 hidden md:landscape:block lg:block">
                <Lanyard
                    position={[0, 0, 25]}
                    gravity={[0, -40, 0]}
                    offset={[3, 0, 0]}
                />
            </div>

            {/* Main Hero Wrapper */}
            <div className="relative max-w-[1600px] mx-auto min-h-[53vh] md:min-h-screen md:max-lg:portrait:min-h-fit px-12 md:px-16 pt-12 md:pt-116 md:max-lg:portrait:pt-20 md:max-lg:portrait:pb-12 z-10 pointer-events-none">

                {/* LEFT CONTENT */}
                <div className="z-10 mt-6 md:mt-auto md:max-lg:portrait:mt-0 max-w-[620px] text-left mx-0 md:max-lg:portrait:text-left md:max-lg:portrait:mx-0 pb-3 md:pb-8 md:max-lg:portrait:pb-0 lg:translate-y-[-4rem] lg:pb-2 xl:translate-y-[-5.5rem] -ml-2 md:-ml-4">
                    <h1 className="text-7xl leading-[0.88] font-medium tracking-[-0.03em] text-black md:text-9xl lg:text-[10.75rem] xl:text-[11.5rem] 2xl:text-[12.5rem] mt-[1cm] md:mt-0 mb-2 md:mb-4 md:max-lg:portrait:mb-4">
                        Contact
                    </h1>

                    <p className=" ml-5 mt-0 md:mt-1 md:max-lg:portrait:mt-3 text-xl font-normal uppercase tracking-[-0.01em] text-[var(--color-orange)] sm:text-3xl lg:text-xl">
                        Say Hello
                    </p>
                    <p className=" ml-5 text-xl leading-none font-normal uppercase tracking-[-0.01em] text-black sm:text-3xl lg:text-xl">
                        We&apos;re Ready When You Are
                    </p>
                </div>
            </div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 hidden md:block w-full h-20 bg-gradient-to-t from-white to-transparent z-20 pointer-events-none" />

        </section>
    );
}