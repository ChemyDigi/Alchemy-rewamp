
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutIntro() {
	return (
		<section className="bg-white px-12 pt-24 pb-0 md:px-16 md:pt-32 md:pb-0 lg:px-16">
			<div className="mx-auto flex w-full max-w-[1840px] flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
				<div className="w-full lg:flex-1 lg:max-w-[1280px]">
					<p className="mb-3 font-bold uppercase tracking-normal text-black text-lg md:text-2xl max-w-xl">
						<span>Transmuting </span>
						<span className="font-normal">Into </span>
						<span className="text-orange">Transcendence.</span>
					</p>

					<h1 className="text-2xl font-bold uppercase leading-[1.12] tracking-normal text-black sm:text-2xl lg:text-5xl lg:leading-[1.08]">
						Creative Design Agency, <br />Located In The Heart Of Colombo.
					</h1>

					<p className="mt-3 leading-tight text-gray-dark text-lg md:text-2xl max-w-xl">
						Turning data into destiny, one click at a time.
					</p>

					<div className="relative w-full max-w-[1240px] px-5 py-4 text-white sm:px-10 sm:py-6 lg:mt-4 lg:ml-8 lg:px-14 lg:py-10">
						<Image
							src="/images/home/ChatBox.png"
							alt="ChatBox Image"
							fill
							aria-hidden="true"
							className="pointer-events-none select-none object-fill"
						/>

						<div className="relative z-10">
							<p className="max-w-4xl leading-[1.3] font-medium pt-5 text-lg md:text-2xl">
								We don't just design visuals. We craft digital experiences that transform brands into something unforgettable
							</p>

							<div className="mt-8 flex justify-start sm:mr-2 sm:justify-end lg:mt-6 lg:mr-4">
								<Link
									href="/home"
									className="group inline-flex items-center relative overflow-hidden rounded-full bg-white px-6 py-2.5 sm:px-9 sm:py-3 lg:px-6 lg:py-3 font-medium uppercase tracking-tight text-orange transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] hover:pr-14 sm:hover:pr-16 lg:hover:pr-16 text-base md:text-lg"
								>
									<span className="whitespace-nowrap">
										Curious Who We Are ?
									</span>
									<span className="absolute right-4 sm:right-6 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 flex items-center shadow-none">
										<ArrowRight size={20} strokeWidth={2.2} aria-hidden="true" />
									</span>
								</Link>
							</div>
						</div>
					</div>
				</div>

				<div className="flex w-full justify-center lg:mt-2 lg:w-[440px] lg:flex-none lg:justify-end lg:pr-14">
					<Image
						src="/images/home/Robot.gif"
						alt="Glowing robot mascot"
						width={768}
						height={768}
						priority
						className="h-auto w-[150px] object-contain sm:w-[210px] lg:w-[300px]"
					/>
				</div>
			</div>
		</section>
	);
}
