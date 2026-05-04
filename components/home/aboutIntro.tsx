import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutIntro() {
	return (
		<section className="bg-white px-6 pt-20 pb-16 md:px-10 md:pt-40 md:pb-20 lg:px-16 lg:pb-24">
			
			<div className="mx-auto flex w-full max-w-[1840px] flex-col gap-10 
				landscape:md:flex-row landscape:md:items-start landscape:md:justify-between">

				{/* LEFT CONTENT */}
				<div className="w-full landscape:md:flex-1 landscape:md:max-w-[1280px]">

					<p className="mb-3 font-bold uppercase text-black text-base sm:text-lg md:text-xl max-w-xl">
						<span>Transmuting </span>
						<span className="font-normal">Into </span>
						<span className="text-orange">Transcendence.</span>
					</p>

					<h1 className="text-xl font-bold uppercase leading-[1.15] text-black sm:text-2xl md:text-3xl lg:text-5xl lg:leading-[1.08]">
						Creative Design Agency, <br />Located In The Heart Of Colombo.
					</h1>

					<p className="mt-3 text-gray-dark text-base sm:text-lg md:text-xl max-w-xl">
						Turning data into destiny, one click at a time.
					</p>

					{/* CHAT + ROBOT AREA */}

					{/* ✅ MOBILE (stacked) */}
					<div className="mt-6 flex flex-col items-center gap-4 md:hidden">
						
						<Image
							src="/images/home/Robot.gif"
							alt="Robot"
							width={200}
							height={200}
							className="w-[120px] sm:w-[150px]"
						/>

						<div className="bg-orange text-white rounded-2xl px-5 py-6 sm:px-8 sm:py-8 w-full">
							<p className="font-medium text-base sm:text-lg">
								We don't just design visuals. We craft digital experiences that transform brands into something unforgettable
							</p>

							<div className="mt-6">
								<Link
									href="/about"
									className="group inline-flex items-center rounded-full bg-white px-6 py-2.5 text-orange text-sm"
								>
									Curious Who We Are ?
									<span className="ml-2 opacity-0 group-hover:opacity-100 transition">
										<ArrowRight size={18} />
									</span>
								</Link>
							</div>
						</div>
					</div>

					{/* ✅ TABLET PORTRAIT (YOUR NEW DESIGN) */}
					<div className="hidden md:flex landscape:md:hidden mt-8 items-center gap-6">

						{/* CHAT BOX */}
						<div className="bg-orange text-white rounded-2xl px-6 py-6 flex-1">
							<p className="font-medium text-base md:text-lg">
								We don't just design visuals. We craft digital experiences that transform brands into something unforgettable
							</p>

							<div className="mt-6">
								<Link
									href="/about"
									className="group inline-flex items-center rounded-full bg-white px-6 py-2.5 text-orange"
								>
									Curious Who We Are ?
									<span className="ml-2 opacity-0 group-hover:opacity-100 transition">
										<ArrowRight size={18} />
									</span>
								</Link>
							</div>
						</div>

						{/* ROBOT */}
						<Image
							src="/images/home/Robot.gif"
							alt="Robot"
							width={300}
							height={300}
							className="w-[160px] md:w-[180px]"
						/>
					</div>

					{/* ✅ DESKTOP + TABLET LANDSCAPE (unchanged) */}
					<div className="hidden landscape:md:block relative w-full max-w-[1240px] mt-6 md:mt-8 lg:mt-4 lg:ml-8 px-5 py-4 text-white sm:px-10 sm:py-6 lg:px-14 lg:py-10">
						<Image
							src="/images/home/ChatBox.png"
							alt="ChatBox Image"
							fill
							className="pointer-events-none select-none object-fill"
						/>

						<div className="relative z-10">
							<p className="max-w-4xl font-medium pt-5 text-lg md:text-2xl">
								We don't just design visuals. We craft digital experiences that transform brands into something unforgettable
							</p>

							<div className="mt-8 flex justify-end lg:mt-6 lg:mr-4">
								<Link
									href="/about"
									className="group inline-flex items-center rounded-full bg-white px-6 py-3 text-orange"
								>
									Curious Who We Are ?
									<span className="ml-2 opacity-0 group-hover:opacity-100 transition">
										<ArrowRight size={20} />
									</span>
								</Link>
							</div>
						</div>
					</div>

				</div>

				{/* RIGHT SIDE ROBOT (DESKTOP + LANDSCAPE) */}
				<div className="hidden landscape:md:flex w-full justify-center md:w-[260px] lg:w-[440px] md:justify-end lg:pr-14">
					<Image
						src="/images/home/Robot.gif"
						alt="Robot"
						width={768}
						height={768}
						className="w-[180px] md:w-[200px] lg:w-[300px]"
					/>
				</div>

			</div>
		</section>
	);
}