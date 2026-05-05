import Navbar from "@/components/Navbar";
import BrandsMore from "@/components/brands-more/uppersection";
import Gallery from "@/components/brands-more/gallery";
import Footer from "@/components/Footer";

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

// Generate static paths for your brands (optional but recommended)
export async function generateStaticParams() {
  // You can fetch this from your JSON file
  // For now, hardcode your brands
  return [
    { slug: 'tommee-tippee' },
    { slug: 'another-brand' },
    // Add more brands as you have them
  ];
}