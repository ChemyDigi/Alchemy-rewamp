import Navbar from "@/components/Navbar";
import BrandsMore from "@/components/brands-more/uppersection";
import Gallery from "@/components/brands-more/gallery";
import Footer from "@/components/Footer";
import { getPublishedBrands } from "@/lib/firestore-brands";

interface PageProps {
  params: {
    slug: string;
  };
}

export default function BrandPage({ params }: PageProps) {
  const { slug } = params;
  
  return (
    <main className="min-h-screen bg-bg text-gray">
      <Navbar />
      <BrandsMore brandSlug={slug} />
      <Gallery brandId={slug} />
      <Footer />
    </main>
  );
}

// Generate static paths for published brands
export async function generateStaticParams() {
  try {
    const brands = await getPublishedBrands();
    return brands.map((brand) => ({
      slug: brand.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    // Return empty array if fetch fails, pages will be generated on-demand
    return [];
  }
}