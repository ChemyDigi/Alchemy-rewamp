import Image from "next/image";
import CardSwap, { Card } from "./CardSwap";

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

				<div className="relative mx-auto mt-8 w-full max-w-[340px] shrink-0 sm:max-w-[420px] md:max-w-[500px] lg:mt-0 lg:mr-6 lg:max-w-[560px] xl:max-w-[620px] lg:-translate-y-24 xl:-translate-y-38">
					<div className="relative h-[460px] w-full overflow-visible">
						<CardSwap
							cardDistance={60}
							verticalDistance={70}
							delay={5000}
							pauseOnHover={false}
							width="clamp(220px, 36vw, 360px)"
							height="clamp(280px, 42vw, 420px)"
						>
							<Card customClass="bg-black text-white border-white p-6 sm:p-7">
								<div className="absolute inset-0 rounded-xl overflow-hidden">
									<Image src="/images/blog/Blog1.jpg" alt="Blog 1" fill className="object-cover" />
								</div>
							</Card>

							<Card customClass="bg-black text-white border-white/70 p-6 sm:p-7">
								<div className="absolute inset-0 rounded-xl overflow-hidden">
									<Image src="/images/home/event.jpg" alt="Event" fill className="object-cover" />
								</div>
							</Card>

							<Card customClass="bg-black text-white border-white/70 p-6 sm:p-7">
								<div className="absolute inset-0 rounded-xl overflow-hidden">
									<Image src="/images/home/it.jpg" alt="IT" fill className="object-cover" />
								</div>
							</Card>
						</CardSwap>
					</div>
				</div>
			</div>
		</section>
	);
}
