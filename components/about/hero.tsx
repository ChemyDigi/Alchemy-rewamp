"use client";

export default function AboutHero() {
    return (
        <section className="w-full min-h-screen  flex items-center">

            <div className="w-full px-6 md:px-16 lg:px-24">

                <div className="max-w-[1200px]"> {/* ⬅️ increased width */}

                    {/* TITLE */}
                    <h1 className="text-[72px] md:text-[200px] font-medium text-black leading-[0.95] tracking-tight">
                        About
                    </h1>

                    {/* SUB LABEL */}
                    <div className="mt-4">
                        <p className="text-[19px] text-orange tracking-wide">
                            CREATIVE
                        </p>
                        <p className="text-[19px] text-gray-500 tracking-wide">
                            FORCE BUILT ON PURPOSE.
                        </p>
                    </div>

                    {/* PARAGRAPH */}
                    <p className="mt-10 max-w-[900px] font-medium mx-auto text-left text-[18px] md:text-[38px] leading-[1.5] text-gray-500 translate-x-0 md:translate-x-32 lg:translate-x-50">

                        <span className="text-black">Since 2020,</span>{" "}

                        Alchemy has evolved from a marketing agency into a creative technology company.
                        We craft digital experiences, build innovative IT solutions!
                    </p>
                </div>
            </div>
        </section>
    );
}