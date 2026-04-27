import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutIntro() {
	return (
		<section className="bg-white px-6 pt-20 pb-16 md:px-10 md:pt-40 md:pb-20 lg:px-16 lg:pb-24">
			<div className="mx-auto flex w-full max-w-[1840px] flex-col gap-10 md:flex-row md:items-start md:justify-between">

				{/* LEFT CONTENT */}
				<div className="w-full md:flex-1 md:max-w-[1280px]">

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

					{/* MOBILE ROBOT */}
					<div className="flex justify-center mt-6 md:hidden">
						<Image
							src="/images/home/Robot.gif"
							alt="Robot"
							width={200}
							height={200}
							className="w-[120px] sm:w-[150px]"
						/>
					</div>

					{/* CHAT AREA */}
					<div className="relative w-full max-w-[1240px] mt-6 md:mt-8 lg:mt-4 lg:ml-8">

						{/* ✅ MOBILE (simple box) */}
						<div className="block md:hidden bg-orange text-white rounded-2xl px-5 py-6 sm:px-8 sm:py-8">
							<p className="font-medium text-base sm:text-lg">
								We don't just design visuals. We craft digital experiences that transform brands into something unforgettable
							</p>

							<div className="mt-6">
								<Link
									href="/home"
									className="group inline-flex items-center rounded-full bg-white px-6 py-2.5 text-orange text-sm"
								>
									Curious Who We Are ?
									<span className="ml-2 opacity-0 group-hover:opacity-100 transition">
										<ArrowRight size={18} />
									</span>
								</Link>
							</div>
						</div>

						{/* ✅ TABLET (original bubble) */}
						<div className="hidden md:block lg:hidden relative px-6 py-6 text-white">
							<Image
								src="/images/home/ChatBox.png"
								alt="ChatBox"
								fill
								className="object-fill pointer-events-none"
							/>

							<div className="relative z-10">
								<p className="font-medium text-lg">
									We don't just design visuals. We craft digital experiences that transform brands into something unforgettable
								</p>

								<div className="mt-6 flex justify-end">
									<Link
										href="/home"
										className="group inline-flex items-center rounded-full bg-white px-6 py-2.5 text-orange"
									>
										Curious Who We Are ?
										<span className="ml-2 opacity-0 group-hover:opacity-100 transition">
											<ArrowRight size={18} />
										</span>
									</Link>
								</div>
							</div>
						</div>

						{/* ✅ DESKTOP (unchanged) */}
						<div className="hidden lg:block relative w-full max-w-[1240px] px-5 py-4 text-white sm:px-10 sm:py-6 lg:px-14 lg:py-10">
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
										href="/home"
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
				</div>

				{/* ROBOT RIGHT (tablet + desktop) */}
				<div className="hidden md:flex w-full justify-center md:w-[260px] lg:w-[440px] md:justify-end lg:pr-14">
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