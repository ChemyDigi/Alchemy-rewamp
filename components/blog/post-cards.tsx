import Image from "next/image";
import Link from "next/link";
import { Blog } from "@/lib/firestore";

interface BlogPostCardsProps {
  posts: Blog[];
}

export default function BlogPostCards({ posts }: BlogPostCardsProps) {
	return (
		<section className="w-full bg-white py-14 sm:py-16">
			<div className="mx-auto w-full max-w-[1440px] px-6 sm:px-10 lg:px-16">
				<div className="grid gap-10 md:gap-12 md:grid-cols-2 lg:gap-14 lg:grid-cols-3">
					{posts.map((post) => (
						<Link
							key={post.slug}
							href={`/blog/${post.slug}`}
							className="group block max-w-[420px] mx-auto cursor-pointer"
						>
							<article className="origin-center transition-all duration-250 ease-out group-hover:scale-[1.03] group-hover:shadow-xl rounded-b-2xl ">
							<div className="overflow-hidden rounded-2xl bg-black">
								<Image
									src={post.featuredImage || "/images/blog/Blog1.jpg"}
									alt={post.title}
									width={580}
									height={325}
									className="h-[280px] w-full object-cover"
								/>
							</div>

							<div className="px-3 pb-3">
								<span className="mt-6 inline-flex rounded-full border border-black bg-white px-4 py-1 text-xs leading-none text-black">
									{post.subtitle || "Blog"}
								</span>

								<h3 className="mt-6 text-3xl leading-[1.04] font-bold tracking-[-0.02em] text-black">
									{post.title}
								</h3>

								<p className="mt-3 text-lg leading-relaxed text-black line-clamp-3">
                  {post.content ? post.content.replace(/<[^>]*>?/gm, '') : ""}
                </p>
							</div>
							</article>
						</Link>
					))}
				</div>
			</div>
		</section>
	);
}
