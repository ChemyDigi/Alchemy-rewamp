// hero.tsx (Blog page component)
import Image from "next/image";
import CardSwap, { Card } from "./CardSwap";
import { Blog } from "@/lib/firestore";
import Link from "next/link";

interface BlogHeroProps {
  posts: Blog[];
}

export default function BlogHero({ posts }: BlogHeroProps) {
  const displayPosts = posts && posts.length > 0 ? posts.slice(0, 3) : null;

  return (
    <section className="relative bg-white overflow-hidden">
      <div className="relative max-w-[1600px] mx-auto px-6 sm:px-8 md:px-16 pt-32 md:pt-36 lg:pt-40 xl:pt-44 pb-8 md:pb-12 lg:pb-16 xl:pb-20">
        <div className="flex flex-col lg:flex-row items-center lg:items-center justify-between gap-12 lg:gap-20">
          {/* Left side - Text content */}
          <div className="z-10 mt-0 max-w-[620px] pt-4 lg:pt-6 pb-4 lg:-translate-x-12 xl:-translate-x-16">
            <h1 className="text-7xl leading-[0.88] font-medium tracking-[-0.03em] text-black sm:text-8xl md:text-9xl lg:text-[10.75rem] xl:text-[11.5rem] 2xl:text-[12.5rem]">
              Blog
            </h1>

            <p className="ml-3 mt-3 text-xl font-normal uppercase tracking-[-0.01em] text-orange sm:text-3xl lg:text-xl">
              Insight
            </p>
            <p className="ml-3 text-xl leading-none font-normal uppercase tracking-[-0.01em] text-black sm:text-3xl lg:text-xl">
              Driven By Impact
            </p>
          </div>

          {/* Right side - Card stack */}
          <div className="relative w-full lg:w-auto flex justify-center lg:justify-end lg:-translate-x-6 xl:-translate-x-10">
          <div
            className="relative w-[230px] h-[280px] sm:w-[320px] sm:h-[380px] md:w-[380px] md:h-[450px] lg:w-[320px] lg:h-[380px] xl:w-[380px] xl:h-[450px] 2xl:w-[420px] 2xl:h-[500px]"
          >
            <CardSwap
              cardDistance={55}
              verticalDistance={55}
              delay={5000}
              pauseOnHover={true}
              width="100%"
              height="100%"
              skewAmount={5}
              easing="elastic"
            >
              {displayPosts ? (
                displayPosts.map((post) => (
                  <Card key={post.id} customClass="overflow-hidden">
                    <Link href={`/blog/${post.slug}`} className="absolute inset-0 z-10 block" />
                    <div className="absolute inset-0">
                      <Image
                        src={post.featuredImage || "/images/blog/Blog1.jpg"}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                        <p className="text-sm uppercase tracking-wide text-[#FF6B35]">{post.subtitle || "Blog"}</p>
                        <p className="text-lg font-semibold line-clamp-2">{post.title}</p>
                      </div>
                    </div>
                  </Card>
                ))
              ) : (
                <Card customClass="overflow-hidden">
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-slate-900" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                      <p className="text-sm uppercase tracking-wide text-[#FF6B35]">Check back later</p>
                      <p className="text-lg font-semibold">No posts available yet</p>
                    </div>
                  </div>
                </Card>
              )}
            </CardSwap>
          </div>
        </div>
      </div>
    </div>
  </section>
  );
}