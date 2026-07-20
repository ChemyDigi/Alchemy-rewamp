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
    <section className="relative min-h-[60vh] md:min-h-[70vh] lg:min-h-screen xl:min-h-screen w-full bg-white overflow-hidden">
      <div className="relative max-w-[1600px] mx-auto flex min-h-[60vh] md:min-h-[70vh] lg:min-h-screen xl:min-h-screen w-full flex-col justify-start lg:justify-between px-6 sm:px-12 md:px-16 pt-28 md:pt-32 lg:pt-36 xl:pt-44 pb-16 md:pb-20 lg:pb-32 xl:pb-40 lg:flex-row lg:items-center gap-12 lg:gap-20">
        {/* Left side - Text content */}
        <div className="z-10 mt-auto max-w-[620px] pt-10 lg:pt-12 pb-8 lg:-translate-x-12 xl:-translate-x-16 lg:translate-y-[4rem] xl:translate-y-[5rem] max-sm:mt-0 max-sm:pt-20">
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
        <div className="relative mt-16 md:mt-24 lg:mt-0 shrink-0 lg:my-0 mx-auto lg:ml-auto -translate-x-4 sm:translate-x-0 lg:translate-x-20 xl:translate-x-32 2xl:translate-x-40 lg:translate-y-0 xl:translate-y-2">
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
    </section>
  );
}