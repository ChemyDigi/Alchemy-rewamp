import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getBlogBySlug, getPublishedBlogs } from "@/lib/firestore";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
	const blogs = await getPublishedBlogs();
	return blogs.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params;
	const post = await getBlogBySlug(slug);

	if (!post) {
		notFound();
	}

	const allPosts = await getPublishedBlogs();
	const relatedPosts = allPosts.filter(p => p.slug !== slug).slice(0, 2);

	return (
		<>
			<Navbar />
			<main className="w-full bg-white py-14 sm:py-16 mt-20">
				<div className="mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-16">
					<Link
						href="/blog"
						className="group relative inline-flex h-16 w-16 items-center justify-center rounded-full border-2 border-orange text-[#e3791d] transition duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-[#e3791d] hover:text-white hover:shadow-lg sm:h-[72px] sm:w-[72px]"
						aria-label="Back to blog"
					>
						<ArrowLeft className="h-7 w-7" strokeWidth={2.1} aria-hidden="true" />
					</Link>

					<article className="mt-0">
						<div className="mx-auto text-center max-w-4xl">
							<span className="inline-flex rounded-full border border-black px-6 py-1 text-xs tracking-wide text-black uppercase font-medium">
								{post.subtitle || "Blog"}
							</span>
							<h1 className="mt-6 text-5xl leading-[1.1] font-bold tracking-[-0.02em] text-black sm:text-6xl lg:text-7xl">
								{post.title}
							</h1>
							<div className="mt-8 flex flex-wrap items-center justify-center gap-4 font-medium text-[#676666] sm:gap-6 sm:text-lg">
								{post.author && (
									<span>
										By <strong className="font-semibold text-[#e3791d]">{post.author}</strong>
									</span>
								)}
								{post.date && <span>{post.date}</span>}
								{post.readTime && <span>{post.readTime} read</span>}
							</div>
						</div>

						{post.featuredImage && (
							<div className="mt-12 overflow-hidden rounded-2xl bg-black shadow-xl">
								<Image
									src={post.featuredImage}
									alt={post.title}
									width={1400}
									height={800}
									priority
									className="h-auto w-full max-h-[800px] object-cover"
								/>
							</div>
						)}

						<div 
							className="mx-auto mt-16 max-w-3xl px-4 prose prose-lg prose-orange max-w-none prose-img:rounded-2xl prose-img:shadow-xl"
							dangerouslySetInnerHTML={{ __html: post.content || "" }}
						/>
					</article>

					{relatedPosts.length > 0 && (
						<section className="mt-24 w-full border-t border-gray-200 pt-16 pb-8 sm:mt-32">
							<div className="max-w-[620px]">
								<h2 className="text-4xl leading-[1.1] font-semibold tracking-tight text-black sm:text-5xl">
									Stay tuned with all
									<br />
									recent updates
								</h2>
							</div>

							<div className="mt-11 grid grid-cols-1 gap-x-8 gap-y-8 md:grid-cols-2 md:gap-y-10 lg:max-w-[1080px]">
								{relatedPosts.map((related) => (
									<Link
										key={related.slug}
										href={`/blog/${related.slug}`}
										className="group w-full max-w-[470px]"
									>
										<div className="overflow-hidden rounded-3xl bg-black">
											<Image
												src={related.featuredImage || "/images/blog/Blog1.jpg"}
												alt={related.title}
												width={900}
												height={520}
												className="h-[300px] w-full object-cover transition duration-300 group-hover:scale-105"
											/>
										</div>
										<div className="px-4 pt-5 pb-2 sm:px-6">
											<span className="inline-flex rounded-full border border-black px-4 py-1 text-xs text-black uppercase font-medium">
												{related.subtitle || "Blog"}
											</span>
											<h3 className="mt-5 text-3xl leading-[1.1] font-bold tracking-tight text-black">
												{related.title}
											</h3>
											<p className="mt-3 text-lg text-gray-700 line-clamp-2">
												{related.content ? related.content.replace(/<[^>]*>?/gm, '') : ""}
											</p>
										</div>
									</Link>
								))}
							</div>
						</section>
					)}
				</div>
			</main>
			<Footer />
		</>
	);
}