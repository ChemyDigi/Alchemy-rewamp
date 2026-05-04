import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import posts from "@/app/blog/data.json";

type BlogPost = {
	slug: string;
	title: string;
	category: string;
	author: string;
	date: string;
	readTime: string;
	image: string;
	excerpt: string;
	content: string[];
	readMore: string[];
};

const blogPosts = posts as BlogPost[];

export function generateStaticParams() {
	return blogPosts.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
	const { slug } = await props.params;
	const post = blogPosts.find((item) => item.slug === slug);

	if (!post) {
		notFound();
	}

	const relatedPosts = post.readMore
		.map((relatedSlug) => blogPosts.find((item) => item.slug === relatedSlug))
		.filter((item): item is BlogPost => Boolean(item));

	return (
		<main className="w-full bg-white py-14 sm:py-16">
			<div className="mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-16">
				<Link
					href="/blog"
					className="group relative inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-orange text-orange transition duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-orange hover:text-white hover:shadow-lg sm:h-[72px] sm:w-[72px]"
					aria-label="Back to blog"
				>
					<ArrowLeft className="h-7 w-7" strokeWidth={2.1} aria-hidden="true" />
				</Link>

				<article className="mt-0">
					<div className="mx-auto text-center">
						<span className="inline-flex rounded-full border border-black px-6 py-1 text-xs tracking-wide text-black">
							{post.category}
						</span>
						<h1 className="mt-6 text-6xl leading-[0.98] font-semibold tracking-[-0.02em] text-black sm:text-6xl lg:text-8xl">
							{post.title}
						</h1>
						<div className="mt-12 flex flex-wrap items-center gap-4 font-semibold text-[#676666] sm:gap-6 sm:text-lg">
							<span>
								By <strong className="font-semibold text-orange">{post.author}</strong>
							</span>
							<span>{post.date}</span>
							<span>{post.readTime}</span>
						</div>
					</div>

					<div className="mt-10 overflow-hidden rounded-2xl bg-black shadow-xl">
						<Image
							src={post.image}
							alt={post.title}
							width={1400}
							height={800}
							priority
							className="h-auto w-full object-cover"
						/>
					</div>

					<div className="mx-auto mt-10 max-w-full space-y-7 px-4 text-lg leading-[1.8] text-black sm:text-[1.25rem] sm:px-30 text-justify">
						{post.content.map((paragraph) => {
							if (paragraph.startsWith("## ")) {
								return (
									<h2
										key={paragraph}
										className="mt-12 text-3xl font-bold leading-[1.2] text-black sm:text-4xl"
									>
										{paragraph.replace("## ", "")}
									</h2>
								);
							}
							return <p key={paragraph}>{paragraph}</p>;
						})}
					</div>
				</article>

				<section className="mt-20 w-full pb-8 sm:mt-24">
					<div className="max-w-[620px]">
						<h2 className="text-4xl leading-[1.1] font-semibold tracking-tight text-black sm:text-5xl">
							Stay tuned with all
							<br />
							recent updates
						</h2>
					</div>

					<div className="mt-11 grid grid-cols-1 gap-x-1 gap-y-8 md:grid-cols-2 md:gap-y-10 lg:max-w-[1080px]">
						{relatedPosts.map((related) => (
							<Link
								key={related.slug}
								href={`/blog/${related.slug}`}
								className="group w-full max-w-[470px]"
							>
								<div className="overflow-hidden rounded-3xl bg-black">
									<Image
										src={related.image}
										alt={related.title}
										width={900}
										height={520}
										className="h-[300px] w-full object-cover transition duration-300 group-hover:scale-105"
									/>
								</div>
								<div className="px-4 pt-5 pb-2 sm:px-6">
									<span className="inline-flex rounded-full border border-black px-4 py-1 text-xs text-black">
										{related.category}
									</span>
									<h3 className="mt-5 text-3xl leading-[1.05] font-bold tracking-tight text-black">
										{related.title}
									</h3>
									<p className="mt-3 text-normal text-black">{related.excerpt}</p>
								</div>
							</Link>
						))}
					</div>
				</section>
			</div>
		</main>
	);
}