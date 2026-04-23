
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export default function AboutIntro() {
	return (
		<section className="bg-white px-6 py-14 md:px-10 md:py-20 lg:px-20">
			<div className="mx-auto flex w-full max-w-[1840px] flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
				<div className="w-full lg:flex-1 lg:max-w-[1280px]">
					<p className="mb-3 text-sm font-bold uppercase tracking-tight text-black sm:text-xl lg:text-[2rem]">
						<span>Transmuting </span>
						<span className="font-normal">Into </span>
						<span className="text-orange">Transcendence.</span>
					</p>

					<h1 className="text-2xl font-bold uppercase leading-[1.12] tracking-normal text-black sm:text-2xl lg:text-5xl lg:leading-[1.08]">
						Creative Design Agency, <br />Located In The Heart Of Colombo.
					</h1>

					<p className="mt-3 text-lg leading-tight text-gray-dark sm:text-2xl lg:text-2xl">
						Turning data into destiny, one click at a time.
					</p>

					<div className="relative w-full max-w-[1240px] px-7 py-4 text-white sm:px-12 sm:py-6 lg:mt-4 lg:ml-8 lg:px-[4.5rem] lg:py-10">
						<Image
							src="/images/home/ChatBox.png"
							alt="ChatBox Image"
							fill
							aria-hidden="true"
							className="pointer-events-none select-none object-fill"
						/>

						<div className="relative z-10">
							<p className="max-w-4xl text-lg leading-[1.3] sm:text-[1.45rem] lg:text-3xl font-medium pt-5">
								We don't just design visuals. We craft digital experiences that transform brands into something unforgettable
							</p>

							<div className="mt-8 flex justify-start sm:justify-end lg:mt-10">
								<button
									type="button"
									className="inline-flex items-center gap-2.5 rounded-full bg-white px-6 py-2.5 text-[0.65rem] font-bold uppercase tracking-tight text-orange transition hover:opacity-90 sm:px-9 sm:py-3 sm:text-sm lg:px-6 lg:py-3 lg:text-lg"
								>
									Curious Who We Are ?
											<ArrowRight size={20} strokeWidth={2.2} aria-hidden="true" />
								</button>
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
