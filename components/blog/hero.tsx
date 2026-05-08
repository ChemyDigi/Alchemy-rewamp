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
    <section className="min-h-screen w-full bg-white overflow-hidden">
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col justify-between pl-8 pt-16 pb-10 sm:pl-12 lg:flex-row lg:items-end lg:pl-20 lg:pt-12 lg:pb-14">
        {/* Left side - Text content */}
        <div className="z-10 mt-auto max-w-[620px] pb-8 lg:translate-y-[-1.5rem] lg:pb-2 xl:translate-y-[-2rem] max-sm:mt-0 max-sm:pt-12">
          <h1 className="text-7xl leading-[0.88] font-medium tracking-[-0.03em] text-black sm:text-8xl md:text-9xl lg:text-[10.75rem] xl:text-[11.5rem] 2xl:text-[12.5rem]">
            Blog
          </h1>

          <p className="mt-3 text-xl font-normal uppercase tracking-[-0.01em] text-[#FF6B35] sm:text-3xl lg:text-xl">
            Insight
          </p>
          <p className="text-xl leading-none font-normal uppercase tracking-[-0.01em] text-black sm:text-3xl lg:text-xl">
            Driven By Impact.
          </p>
        </div>

        {/* Right side - Card stack */}
        <div className="relative mt-8 shrink-0 sm:mt-0 lg:mt-0 sm:ml-auto lg:ml-0 max-sm:ml-auto max-sm:translate-x-1">
          <div 
            className="relative"
            style={{
              width: "clamp(300px, 35vw, 450px)",
              height: "clamp(360px, 52vw, 520px)",
            }}
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