"use client";

import Lanyard from "../ui/Lanyard";

export default function Hero() {
    return (
        <section className="relative min-h-screen bg-[#f5f5f5]">

            {/* Full-screen Lanyard layer */}
            <div className="absolute inset-0 z-0">
                <Lanyard
                    position={[0, 0, 25]}
                    gravity={[0, -40, 0]}
                    offset={[3, 0, 0]}
                />
            </div>

            {/* Logo */}
            <div className="absolute top-10 left-14 z-30">
                <h1 className="text-3xl font-bold tracking-tight">
                    <span className="text-black">alchem</span>
                    <span className="text-[#f28c28]">y</span>
                </h1>
            </div>

            {/* Main Hero Wrapper */}
            <div className="relative max-w-[1600px] mx-auto min-h-screen px-10 pt-36 z-10 pointer-events-none">

                {/* LEFT CONTENT */}
                <div className="max-w-[700px] relative z-20 pointer-events-auto">
                    <p className="uppercase text-[#f28c28] tracking-[0.35em] text-sm mb-5">
                        SAY HELLO
                    </p>

                    <h1 className="text-[110px] md:text-[160px] font-semibold leading-[0.9] tracking-tight text-black">
                        Contact
                    </h1>

                    <p className="mt-4 text-xl text-gray-700">
                        WE'RE READY WHEN YOU ARE.
                    </p>

                    <button className="mt-12 bg-black text-white px-10 py-4 rounded-xl font-medium hover:scale-105 transition-all duration-300">
                        Menu
                    </button>
                </div>
            </div>

            {/* Bottom Fade */}
            <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-white to-transparent z-10 pointer-events-none" />
        </section>
    );
}