"use client";

import { useState } from "react";
import { BorderBeam } from "@/components/ui/border-beam";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { ChevronDown } from "lucide-react";

export default function ContactInfoSection() {
    const [formData, setFormData] = useState({
        name: "",
        mobile: "",
        email: "",
        projectType: "Select Project Type",
        message: ""
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const options = ["Web Design", "Web Development", "Branding", "Marketing"];

    const validateField = (name: string, value: string) => {
        let errorMsg = "";
        if (name === "name") {
            if (!value.trim()) {
                errorMsg = "Name is required.";
            } else if (value.trim().length < 2) {
                errorMsg = "Name must be at least 2 characters long.";
            }
        } else if (name === "mobile") {
            if (!value.trim()) {
                errorMsg = "Mobile number is required.";
            } else {
                const phoneRegex = /^\+?[0-9\s\-()]{7,16}$/;
                if (!phoneRegex.test(value.trim())) {
                    errorMsg = "Please provide a valid phone number.";
                }
            }
        } else if (name === "email") {
            if (!value.trim()) {
                errorMsg = "Email address is required.";
            } else {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value.trim())) {
                    errorMsg = "Please enter a valid email address.";
                }
            }
        } else if (name === "projectType") {
            if (value === "Select Project Type") {
                errorMsg = "Please select a project type.";
            }
        } else if (name === "message") {
            if (!value.trim()) {
                errorMsg = "Message is required.";
            } else if (value.trim().length < 10) {
                errorMsg = "Message must be at least 10 characters long.";
            }
        }
        return errorMsg;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        const errorMsg = validateField(name, value);
        setErrors(prev => ({ ...prev, [name]: errorMsg }));
    };

    const handleSelectOption = (option: string) => {
        setFormData(prev => ({ ...prev, projectType: option }));
        setErrors(prev => ({ ...prev, projectType: "" }));
        setIsDropdownOpen(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate all fields
        const newErrors: Record<string, string> = {};
        Object.keys(formData).forEach(key => {
            const errorVal = validateField(key, formData[key as keyof typeof formData]);
            if (errorVal) {
                newErrors[key] = errorVal;
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);
        // Simulate API call
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSubmitSuccess(true);
            setFormData({
                name: "",
                mobile: "",
                email: "",
                projectType: "Select Project Type",
                message: ""
            });
            setErrors({});
            setTimeout(() => setSubmitSuccess(false), 5000);
        } catch (err) {
            console.error("Submission error", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="w-full bg-white py-1 md:py-24 px-6 md:px-12 lg:px-20 -mt-2 md:mt-0">
            <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-start">

                {/* LEFT SIDE */}
                <div>
                    <p className="text-[20px] text-[#5b5b5b] mb-8 font-light hidden md:block">
                        We’re here to help you grow
                    </p>

                    {/* Contact page: Mobile responsive title heading */}
                    <h2 className="text-[28px] xs:text-[34px] sm:text-[38px] md:text-[50px] font-black leading-[0.95] uppercase tracking-tight text-black max-w-[620px]">
                        WE'RE HERE TO <span className="text-orange">HELP</span> YOU
                        <br />
                        GROW
                    </h2>

                    <p className="mt-6 md:mt-8 text-[16px] md:text-[20px] leading-[1.6] text-[#4f4f4f] max-w-[620px]">
                        At Alchemy, we turn your ideas into impactful digital
                        solutions and are always ready to help.
                    </p>
                    {/* Contact page: Reorganize contact information layout */}
                    <div className="contact-info-grid grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-4 sm:gap-x-10 mt-16">
                        
                        {/* Left Column: Phone, Email, Social Network */}
                        <div className="flex flex-col gap-10">
                            {/* Phone */}
                            <div>
                                <h3 className="text-[25px] font-bold text-black mb-5">
                                    Phone
                                </h3>

                                <p className="text-[16px] xs:text-[18px] sm:text-[20px] leading-[1.8] text-[#555]">
                                    +94 719 563 675
                                    <br />
                                    +61 404 713 766
                                </p>
                            </div>

                            {/* Email */}
                            <div>
                                <h3 className="text-[25px] font-bold text-black mb-5">
                                    Email
                                </h3>

                                <p className="text-[16px] xs:text-[18px] sm:text-[20px] text-[#555] break-all">
                                    hello@alchemy.lk
                                </p>
                            </div>

                            {/* Social */}
                            <div>
                                <h3 className="text-[25px] font-bold text-black mb-5">
                                    Social Network
                                </h3>

                                <div className="flex items-center gap-7 text-[16px] xs:text-[18px] sm:text-[20px] text-[#555]">
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

                        {/* Right Column: Address */}
                        <div className="flex flex-col gap-10">
                            {/* Address */}
                            <div>
                                <h3 className="text-[25px] font-bold text-black mb-5">
                                    Address
                                </h3>

                                <p className="text-[16px] xs:text-[18px] sm:text-[20px] leading-[1.8] text-[#555]">
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
                        </div>
                    </div>
                </div>

                {/* RIGHT SIDE FORM */}
                {/* Contact page: Mobile responsive form section container */}
                <div className="relative bg-[#faf9f9] rounded-[26px] p-5 xs:p-8 md:p-12 shadow-sm overflow-hidden">

                    <h2 className="text-[30px] xs:text-[38px] sm:text-[44px] md:text-[50px] font-black text-black leading-none">
                        Get in Touch
                    </h2>

                    <p className="mt-5 text-[20px] text-[#5f5f5f] leading-[1.5] max-w-[500px]">
                        Have a question or project? Fill the form and
                        we’ll get back to you soon.
                    </p>

                    <form onSubmit={handleSubmit} className="mt-10 space-y-8">

                        <Field
                            label="Your Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            error={errors.name}
                            placeholder="Enter your full name"
                        />
                        <Field
                            label="Your Mobile Number"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            error={errors.mobile}
                            placeholder="Enter your mobile number"
                        />
                        <Field
                            label="Your Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                            placeholder="name@example.com"
                        />

                        {/* Select */}
                        <div className="relative">
                            <label className="block text-[18px] text-[#555] mb-2">
                                Project Type
                            </label>

                            <button
                                type="button"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-full bg-transparent border-b border-[#9e9e9e] pb-3 text-[14px] text-[#888] outline-none flex justify-between items-center cursor-pointer text-left"
                            >
                                <span className={formData.projectType !== "Select Project Type" ? "text-black text-[16px] xs:text-[18px] sm:text-[20px]" : "text-[#888] text-[14px]"}>
                                    {formData.projectType}
                                </span>
                                <ChevronDown className={`w-4 h-4 text-[#888] transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
                            </button>
                            {errors.projectType && (
                                <p className="text-red-500 text-xs mt-1.5">{errors.projectType}</p>
                            )}

                            {isDropdownOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setIsDropdownOpen(false)}
                                    />
                                    <div className="absolute left-0 right-0 mt-1 bg-white border border-[#e0e0e0] rounded-xl shadow-lg z-20 py-2 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
                                        {options.map((option) => (
                                            <button
                                                key={option}
                                                type="button"
                                                onClick={() => handleSelectOption(option)}
                                                className="w-full text-left px-4 py-2.5 text-[14px] text-[#555] hover:bg-[#faf9f9] hover:text-orange transition-colors duration-150 cursor-pointer"
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Message */}
                        <div>
                            <p className="text-[18px] text-[#555] mb-2">
                                Message
                            </p>

                            <textarea
                                rows={4}
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Tell us more about your requirements..."
                                className="w-full bg-transparent border-b border-[#9e9e9e] pb-3 text-[16px] xs:text-[18px] sm:text-[20px] text-black outline-none resize-none placeholder:text-[14px] placeholder:text-[#9e9e9e]"
                            />
                            {errors.message && (
                                <p className="text-red-500 text-xs mt-1.5">{errors.message}</p>
                            )}
                        </div>

                        {/* Success Message Banner */}
                        {submitSuccess && (
                            <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 text-sm animate-in fade-in slide-in-from-bottom-1 duration-300">
                                Message sent successfully! We will get back to you shortly.
                            </div>
                        )}

                        {/* Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="group mt-8 bg-orange text-white h-[56px] rounded-full relative overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] hover:bg-black w-full xs:w-auto xs:min-w-[230px] xs:hover:min-w-[260px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="flex 1 absolute left-6 xs:left-8 top-1/2 -translate-y-1/2 text-sm xs:text-base md:text-lg font-medium whitespace-nowrap">
                                {isSubmitting ? "SENDING..." : "SEND A MESSAGE"}
                            </span>

                            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-2xl translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                                →
                            </span>
                        </button>
                    </form>

                    {/* BorderBeam effects */}
                    <BorderBeam
                        duration={6}
                        size={400}
                        colorFrom="#ff8000"
                        colorTo="#f82323"
                    />
                    <BorderBeam
                        duration={6}
                        delay={3}
                        size={400}
                        borderWidth={1}
                        colorFrom="#ff8000"
                        colorTo="#f82323"
                        reverse
                    />
                </div>
            </div>
        </section>
    );
}

interface FieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    type?: string;
    placeholder?: string;
}

function Field({ label, name, value, onChange, error, type = "text", placeholder }: FieldProps) {
    return (
        <div>
            <label className="block text-[18px] text-[#555] mb-2">
                {label}
            </label>

            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full bg-transparent border-b border-[#9e9e9e] pb-3 text-[16px] xs:text-[18px] sm:text-[20px] text-black outline-none placeholder:text-[14px] placeholder:text-[#9e9e9e]"
            />
            {error && (
                <p className="text-red-500 text-xs mt-1.5">{error}</p>
            )}
        </div>
    );
}