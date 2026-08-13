"use client";

import Lanyard from "../ui/Lanyard";
import Image from "next/image";
import { useEffect, useState } from "react";

function DesktopLanyard() {
    const [isTabletOrDesktop, setIsTabletOrDesktop] = useState(false);

    useEffect(() => {
        const checkScreen = () => {
            const width = window.innerWidth;
            const isStandardTablet = width >= 768 && width < 1024;
            const isDesktop = width >= 1280;
            setIsTabletOrDesktop(isStandardTablet || isDesktop);
        };
        checkScreen();
        window.addEventListener("resize", checkScreen);
        return () => window.removeEventListener("resize", checkScreen);
    }, []);

    if (!isTabletOrDesktop) return null;

    return (
        <Lanyard
            position={[0, 0, 25]}
            gravity={[0, -40, 0]}
            offset={[3, 0, 0]}
        />
    );
}

export default function Hero() {
    return (
        <section className="relative min-h-[44vh] md:min-h-screen md:max-lg:portrait:min-h-fit bg-white overflow-x-hidden">

            {/* Full-screen Lanyard layer — mounted on standard tablet (md) and desktop (xl) */}
            <div className="absolute inset-0 z-20 hidden md:block lg:hidden xl:block">
                <DesktopLanyard />
            </div>

            {/* iPad Pro / Large Tablet Card Image — rendered only on large tablets (lg breakpoint to xl breakpoint / 1024px to 1279px) */}
            <div className="absolute -top-12 -right-6 z-10 hidden lg:block xl:hidden w-[48%] max-w-[460px] pointer-events-none select-none">
                <Image
                    src="/images/alchemy-card-ipad.png"
                    alt="Alchemy lanyard card"
                    width={450}
                    height={630}
                    className="w-full h-auto object-contain"
                    draggable={false}
                    priority
                />
            </div>

            {/* Contact page: Mobile responsive static card image sizing/repositioning */}
            <div className="absolute -top-12 xs:-top-8 sm:-top-6 -right-12 xs:-right-8 sm:-right-10 z-10 block md:hidden w-[46%] xs:w-[44%] sm:w-[48%] pointer-events-none select-none">
                <Image
                    src="/images/alchemy-tag.png"
                    alt="Alchemy lanyard card"
                    width={400}
                    height={560}
                    className="w-full h-auto object-contain rotate-[20deg]"
                    draggable={false}
                    priority
                />
            </div>
            {/* Main Hero Wrapper */}
            <div className="relative max-w-[1600px] mx-auto min-h-[44vh] md:min-h-screen md:max-lg:portrait:min-h-fit px-6 sm:px-8 md:px-16 pt-8 md:pt-32 lg:pt-36 xl:pt-44 pb-16 md:pb-20 lg:pb-32 xl:pb-40 z-10 pointer-events-none">

                {/* Contact page: Mobile responsive left content width adjustment */}
                <div className="z-10 mt-6 md:mt-auto md:max-lg:portrait:mt-0 max-w-[62%] sm:max-w-[65%] md:max-w-[620px] text-left mx-0 md:max-lg:portrait:text-left md:max-lg:portrait:mx-0 pt-10 lg:pt-12 pb-8 lg:-translate-x-12 xl:-translate-x-16 max-sm:mt-0 max-sm:pt-20">
                    <h1 className="text-[clamp(3.5rem,15vw,5.5rem)] sm:text-8xl md:text-9xl lg:text-[10.75rem] xl:text-[11.5rem] 2xl:text-[12.5rem] leading-[0.88] font-medium tracking-[-0.03em] text-black">
                        Contact
                    </h1>

                    <p className="ml-3 mt-3 text-lg xs:text-xl font-normal uppercase tracking-[-0.01em] text-orange sm:text-3xl lg:text-xl">
                        Say Hello
                    </p>
                    <p className="ml-3 text-lg xs:text-xl leading-snug font-normal uppercase tracking-[-0.01em] text-black sm:text-3xl lg:text-xl">
                        We&apos;re Ready When You Are
                    </p>
                </div>
            </div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 hidden md:block w-full h-20 bg-gradient-to-t from-white to-transparent z-20 pointer-events-none" />

        </section>
    );
}