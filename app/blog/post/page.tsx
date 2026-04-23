import Link from "next/link";

export default function BlogPostPage() {
	return (
		<main className="min-h-screen bg-white px-6 py-16 sm:px-10 lg:px-16">
			<div className="mx-auto w-full max-w-4xl">
				<p className="text-sm font-semibold tracking-wide text-black/60 uppercase">Blog Post</p>
				<h1 className="mt-3 text-4xl font-bold tracking-tight text-black sm:text-5xl">
					The Impact of AI Agents on Digital Marketing
				</h1>
				<p className="mt-6 text-lg leading-relaxed text-black/80">
					This is a placeholder post page. Replace this with your full article content.
				</p>
				<Link href="/blog" className="mt-8 inline-block font-semibold text-black underline">
					Back to Blog
				</Link>
			</div>
		</main>
	);
}
