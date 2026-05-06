"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

function ScrollFillText({
	text,
	className,
	align = "left",
}: {
	text: string;
	className?: string;
	align?: "left" | "right";
}) {
	const ref = useRef<HTMLParagraphElement>(null);

	const { scrollYProgress } = useScroll({
		target: ref,
		offset: ["start 95%", "end 5%"],
	});

	const letters = text.split("");
	const isRightAligned = align === "right";

	return (
		<p
			ref={ref}
			className={`mt-1 max-w-[760px] text-[22px] sm:text-[22px] md:text-[28px] font-medium leading-[1.65] tracking-[-0.03em] text-[#7e7e7e] ${
				isRightAligned ? "ml-auto text-right" : "text-left"
			} ${className ?? ""}`}
		>
			{letters.map((letter, i) => {
				const start = i / letters.length;
				const end = start + 0.08;

				const color = useTransform(scrollYProgress, [start, end], ["#9ca3af", "#000000"]);

				return (
					<motion.span key={i} style={{ color }}>
						{letter}
					</motion.span>
				);
			})}
		</p>
	);
}

export default function AlchemyPics() {
	return (
		<section className="w-full bg-white overflow-hidden">
			<div className="flex w-full flex-col items-start px-10 py-1 sm:px-10 md:px-20 lg:py-2">
				<Image
					src="/images/services/AV/AlchemyPics1.png"
					alt="Alchemy Pictures logo"
					width={760}
					height={360}
					priority
					className="h-auto w-full max-w-[460px] object-contain"
				/>

				<ScrollFillText
					align="right"
					text="We create impactful visual stories through video and live streaming, blending creativity and technical skill to connect with your audience."
					className="mt-1"
				/>
			</div>

			<div className="w-full px-10 pb-10 pt-8 sm:px-10 md:px-20 lg:pb-16 lg:pt-12">
				<div className="mx-auto w-full max-w-[1400px] overflow-hidden rounded-[28px] bg-black shadow-[0_20px_80px_rgba(0,0,0,0.12)]">
					<video
						className="h-auto w-full object-cover"
						src="/showreel.mp4"
						controls
						playsInline
						preload="metadata"
					/>
				</div>
			</div>
		</section>
	);
}
