"use client";

import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import Link from "next/link";
import { BorderBeam } from "@/components/ui/border-beam";

export default function ContactInfoSection() {
    return (
        <section className="w-full bg-white py-24 px-6 md:px-12 lg:px-20">
            <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

                {/* LEFT SIDE */}
                <div>
                    <p className="text-[20px] text-[#5b5b5b] mb-8 font-light">
                        We’re here to help you grow
                    </p>

                    <h2 className="text-[51\px] md:text-[50px] font-black leading-[0.95] uppercase tracking-tight text-black max-w-[620px]">
                        WE’RE HERE TO <span className="text-[#f28c28]">HELP</span> YOU
                        <br />
                        GROW
                    </h2>

                    <p className="mt-8 text-[20px] leading-[1.5] text-[#4f4f4f] max-w-[620px]">
                        At Alchemy, we turn your ideas into impactful digital
                        solutions and are always ready to help.
                    </p>

                    {/* INFO GRID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-14 gap-x-10 mt-16">

                        {/* Phone */}
                        <div>
                            <h3 className="text-[25px] font-bold text-black mb-5">
                                Phone
                            </h3>

                            <p className="text-[20px] leading-[1.8] text-[#555]">
                                +94 719 563 675
                                <br />
                                +61 404 713 766
                            </p>
                        </div>

                        {/* Address */}
                        <div>
                            <h3 className="text-[25px] font-bold text-black mb-5">
                                Address
                            </h3>

                            <p className="text-[20px] leading-[1.8] text-[#555]">
                                43/5, Senanayake Mawatha,
                                <br />
                                Sri Jayawardenepura Kotte,
                                <br />
                                Sri Lanka
                                <br />
                                <br />
                                203, George Street
                                <br />
                                Queens Park, WA 6107
                                <br />
                                Australia
                            </p>
                        </div>

                        {/* Email */}
                        <div>
                            <h3 className="text-[25px] font-bold text-black mb-5">
                                Email
                            </h3>

                            <p className="text-[20px] text-[#555]">
                                hello@alchemy.lk
                            </p>
                        </div>

                        {/* Social */}
                        <div>
                            <h3 className="text-[25px] font-bold text-black mb-5">
                                Social Network
                            </h3>

                            <div className="flex items-center gap-7 text-[20px] text-[#555]">
                                <a href="#" className="hover:text-[#f28c28] transition">
                                    <FaFacebookF />
                                </a>

                                <a href="#" className="hover:text-[#f28c28] transition">
                                    <FaInstagram />
                                </a>

                                <a href="#" className="hover:text-[#f28c28] transition">
                                    <FaLinkedinIn />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE FORM */}
                <div className="relative bg-[#faf9f9] rounded-[26px] p-8 md:p-12 shadow-sm overflow-hidden">

                    <h2 className="text-[48px] md:text-[50px] font-black text-black leading-none">
                        Get in Touch
                    </h2>

                    <p className="mt-5 text-[20px] text-[#5f5f5f] leading-[1.5] max-w-[500px]">
                        Have a question or project? Fill the form and
                        we’ll get back to you soon.
                    </p>

                    <form className="mt-10 space-y-8">

                        <Field label="Your Name" />
                        <Field label="Your Mobile Number" />
                        <Field label="Your Email" />

                        {/* Select */}
                        <div>
                            <label className="block text-[18px] text-[#555] mb-2">
                                Project Type
                            </label>

                            <select className="w-full bg-transparent border-b border-[#9e9e9e] pb-3 text-[14px] text-[#888] outline-none">
                                <option>Select Project Type</option>
                                <option>Web Design</option>
                                <option>Web Development</option>
                                <option>Branding</option>
                                <option>Marketing</option>
                            </select>
                        </div>

                        {/* Message */}
                        <div>
                            <p className="text-[18px] text-[#555] mb-2">
                                Message
                            </p>

                            <textarea
                                rows={4}
                                className="w-full bg-transparent border-b border-[#9e9e9e] pb-3 text-[20px] text-black outline-none resize-none"
                            />
                        </div>

                        {/* Button */}
                        <Link href="/contact">
                            <button className="group mt-8 bg-orange text-white h-[56px] rounded-full relative overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-black min-w-[230px] hover:min-w-[260px]">

                                <span className="flex 1 absolute left-8 top-1/2 -translate-y-1/2 text-base md:text-lg font-medium whitespace-nowrap">
                                    SEND A MESSAGE
                                </span>

                                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                                    →
                                </span>
                            </button>
                        </Link>
                    </form>

                    {/* BorderBeam effects */}
                    <BorderBeam
                        duration={6}
                        size={400}
                        colorFrom="#f28c28"
                        colorTo="#ff4d4d"
                    />
                    <BorderBeam
                        duration={6}
                        delay={3}
                        size={400}
                        borderWidth={2}
                        colorFrom="#3b82f6"
                        colorTo="#a855f7"
                        reverse
                    />
                </div>
            </div>
        </section>
    );
}

function Field({ label }: { label: string }) {
    return (
        <div>
            <label className="block text-[18px] text-[#555] mb-2">
                {label}
            </label>

            <input
                type="text"
                className="w-full bg-transparent border-b border-[#9e9e9e] pb-3 text-[20px] text-black outline-none"
            />
        </div>
    );
}