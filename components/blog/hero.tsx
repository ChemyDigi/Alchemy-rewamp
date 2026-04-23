import Image from "next/image";
import { poppins } from "@/app/fonts";

export default function BlogHero() {
	return (
		<section className="min-h-screen w-full bg-[#e7e7e7]">
			<div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col justify-between px-8 pt-16 pb-10 sm:px-12 lg:flex-row lg:items-end lg:px-20 lg:pt-12 lg:pb-14">
				<div className="z-10 mt-auto max-w-[620px] pb-8 lg:pb-2">
					<h1
						className={`${poppins.className} text-[88px] leading-[0.9] font-semibold tracking-[-0.03em] text-black sm:text-[118px] md:text-[148px] lg:text-[170px]`}
					>
						Blog
					</h1>

					<p className="mt-3 text-[24px] font-medium uppercase tracking-[-0.01em] text-[var(--color-orange)] sm:text-[32px]">
						Insight
					</p>
					<p className="text-[22px] leading-none font-normal uppercase tracking-[-0.01em] text-black sm:text-[36px]">
						Driven By Impact.
					</p>
				</div>

				<div className="relative mx-auto mt-8 w-full max-w-[340px] shrink-0 sm:max-w-[420px] md:max-w-[500px] lg:mt-0 lg:mr-6 lg:max-w-[560px] xl:max-w-[620px]">
					<Image
						src="/blog/Bulb.png"
						alt="Glowing light bulb"
						width={1220}
						height={1310}
						priority
						className="h-auto w-full object-contain"
					/>
				</div>
			</div>
		</section>
	);
}
