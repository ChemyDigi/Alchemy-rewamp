import BlogHero from "@/components/blog/hero";
import BlogPostCards from "@/components/blog/post-cards";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function BlogPage() {
	return (
		<main>
			<BlogHero />
			<Navbar />
			<BlogPostCards />
			<Footer/>
		</main>
	);
}
