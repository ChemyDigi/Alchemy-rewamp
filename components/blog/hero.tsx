import Image from "next/image";

export default function BlogHero() {
	return (
		<section className="min-h-screen w-full bg-white">
			<div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col justify-between px-8 pt-16 pb-10 sm:px-12 lg:flex-row lg:items-end lg:px-20 lg:pt-12 lg:pb-14">
				<div className="z-10 mt-auto max-w-[620px] pb-8 lg:translate-y-[-1.5rem] lg:pb-2 xl:translate-y-[-2rem]">
					<h1
						className="text-7xl leading-[0.88] font-medium tracking-[-0.03em] text-black sm:text-8xl md:text-9xl lg:text-[10.75rem] xl:text-[11.5rem] 2xl:text-[12.5rem]"
					>
						Blog
					</h1>

					<p className="mt-3 text-xl font-normal uppercase tracking-[-0.01em] text-[var(--color-orange)] sm:text-3xl lg:text-xl">
						Insight
					</p>
					<p className="text-xl leading-none font-normal uppercase tracking-[-0.01em] text-black sm:text-3xl lg:text-xl">
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
