"use client";

import { useState } from "react";

const services = [
	{
		id: "audio-visual",
		title: "Audio & Visual Production",
		description: "Create engaging audio and visual content that brings your brand to life. From concept to final production, we deliver high-quality videos, visuals, and sound designed to capture attention and leave a lasting impact.",
	},
	{
		id: "corporate-videos",
		title: "Corporate Videos",
		description: "Professional corporate video production tailored to your brand messaging and business goals.",
	},
	{
		id: "pre-production",
		title: "Pre Production",
		description: "Strategic planning and creative development to ensure your project starts on the right foundation.",
	},
	{
		id: "production",
		title: "Production",
		description: "Full-scale production services with state-of-the-art equipment and experienced crews.",
	},
	{
		id: "post-production",
		title: "Post Production",
		description: "Expert editing, color grading, and post-production finishing to perfect your content.",
	},
	{
		id: "animations",
		title: "Animations & Motion Graphics",
		description: "Creative animations and motion graphics that bring your ideas to life with visual impact.",
	},
	{
		id: "drone",
		title: "Drone Videography",
		description: "Stunning aerial footage and drone cinematography for a unique perspective.",
	},
	{
		id: "music",
		title: "Music Production",
		description: "High-quality music production and composition tailored to your project needs.",
	},
	{
		id: "recording",
		title: "Audio Recording",
		description: "Professional audio recording in state-of-the-art studios with expert sound engineers.",
	},
	{
		id: "sound-design",
		title: "Sound Design",
		description: "Custom sound design and sonic branding to enhance your content.",
	},
	{
		id: "mixing-mastering",
		title: "Audio Mixing & Mastering",
		description: "Professional mixing and mastering to achieve broadcast-quality audio standards.",
	},
];

export default function WhatWeDo() {
	const [expandedId, setExpandedId] = useState<string | null>("audio-visual");

	return (
		<section className="w-full bg-white py-16 px-6 sm:px-10 md:px-14 lg:px-20">
			<div className="mx-auto max-w-[1600px]">
				<div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
					{/* LEFT SECTION */}
					<div className="flex flex-col justify-start">
						<h2 className="text-4xl text-black sm:text-5xl font-bold leading-[1.2] mb-6 tracking-[0.05em]">
							SO WHAT DO WE DO <br />
							 EXACTLY?
						</h2>

						<p className="text-base sm:text-lg leading-relaxed text-[#4a4a4a] max-w-[550px] text-justify">
							Our team delivers creative audio and visual production solutions that bring ideas to life through compelling storytelling and high-quality media. From concept development to final production, we craft engaging visuals, videos, and sound experiences tailored to your brand and audience. Using modern production techniques and creative direction, we ensure every project is impactful, memorable, and aligned with your business goals.
						</p>

						<p className="text-base sm:text-lg leading-relaxed text-[#4a4a4a] max-w-[550px] mt-4 text-justify">
							With a strong focus on creativity and technical excellence, we transform concepts into seamless visual experiences that connect, inspire, and leave a lasting impression.
						</p>
					</div>

					{/* RIGHT SECTION - ACCORDION */}
					<div className="flex flex-col space-y-3">
						{services.map((service) => (
							<div key={service.id} className="last:border-b-0">
								<button
									onClick={() =>
										setExpandedId(expandedId === service.id ? null : service.id)
									}
									className="w-full flex items-center justify-between py-3 text-left transition-all duration-300"
								>
									<h3
										className={`text-lg sm:text-2xl font-semibold tracking-[-0.01em] transition-colors duration-300 ${
											expandedId === service.id
												? "text-orange"
												: "text-black hover:text-orange"
										}`}
									>
										{service.title}
									</h3>
									<div className={`text-2xl font-light transition-colors duration-300 ${expandedId === service.id ? "text-orange" : "text-black"}`}>
										{expandedId === service.id ? "-" : "+"}
									</div>
								</button>

								{expandedId === service.id && (
									<div className="pb-4 overflow-hidden">
										<p className="text-lg leading-relaxed text-[#666666] text-justify">
											{service.description}
										</p>
									</div>
								)}
							</div>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}
