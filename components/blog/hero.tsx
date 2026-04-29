import Image from "next/image";
import CardSwap, { Card } from "./CardSwap";

export default function BlogHero() {
	return (
		<section className="min-h-screen w-full bg-white overflow-x-clip">
			<div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col justify-between pl-8 pt-16 pb-10 sm:pl-12 lg:flex-row lg:items-end lg:pl-20 lg:pt-12 lg:pb-14">
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

				{/* HIDDEN/CUT-OFF EFFECT - This container clips the right and bottom */}
				<div className="relative mt-8 shrink-0 sm:mt-0 lg:mt-0">
					{/* Clip path creates the cut-off effect on right and bottom */}
					<div 
						className="relative overflow-hidden"
						style={{
							width: "clamp(280px, 42vw, 420px)",
							height: "clamp(340px, 48vw, 480px)",
							clipPath: "inset(0 0 10% 0)", // Hides bottom 20% - adjust as needed
						}}
					>
						<div className="absolute right-0 bottom-0">
							<CardSwap
								cardDistance={50}
								verticalDistance={60}
								delay={5000}
								pauseOnHover={false}
								width="clamp(260px, 40vw, 400px)"
								height="clamp(320px, 45vw, 440px)"
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
			</div>
		</section>
	);
}