import BlogHero from "@/components/blog/hero";
import BlogPostCards from "@/components/blog/post-cards";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { getPublishedBlogs } from "@/lib/firestore";

export const dynamic = 'force-dynamic';

export default async function BlogPage() {
  const posts = await getPublishedBlogs();

	return (
		<main>
			<BlogHero posts={posts} />
			<Navbar />
			<BlogPostCards posts={posts} />
			<Footer/>
		</main>
	);
}
