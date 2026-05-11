"use client";

import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Backlight } from "@/components/magicui/backlight";

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
			className={`mt-1 max-w-[760px] text-[22px] sm:text-[22px] md:text-[28px] font-medium leading-[1.65] tracking-[-0.03em] text-[#7e7e7e] text-center ${
				isRightAligned ? "md:ml-auto md:text-right" : "md:text-left"
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

export default function AlchemyRecords() {
	// Extract YouTube video ID from the URL
	const youtubeVideoId = "L9rqEEdpOXo";

	return (
		<section className="w-full bg-white overflow-hidden">
			<div className="flex w-full flex-col items-start px-10 py-1 sm:px-10 md:px-20 lg:py-2">
				<div className="flex w-full justify-end">
					<Image
						src="/images/services/AV/AlchemyPics1.png"
						alt="Alchemy Records logo"
						width={760}
						height={360}
						priority
						className="h-auto w-full max-w-[460px] object-contain"
					/>
				</div>

				<ScrollFillText
					text="We shape raw talent into powerful sound, helping artists grow while delivering full production from creation to final mastering."
					className="mt-1"
				/>
			</div>

			<div className="w-full px-10 pb-10 pt-8 sm:px-10 md:px-20 lg:pb-16 lg:pt-12">
				<Backlight blur={16} className="w-full">
					<div className="mx-auto w-full max-w-[1400px] overflow-hidden rounded-[28px] bg-black shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
						<div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
							<iframe
								className="absolute top-0 left-0 w-full h-full"
								src={`https://www.youtube.com/embed/${youtubeVideoId}?autoplay=0&rel=0&modestbranding=1&start=71`}
								title="Alchemy Records Showreel"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
							/>
						</div>
					</div>
				</Backlight>
			</div>
		</section>
	);
}