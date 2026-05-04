"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  
  // Hide header on blog slug pages
  if (pathname.startsWith("/blog/") && pathname !== "/blog") {
    return null;
  }

  return (
    <header className="absolute top-0 left-0 w-full z-50 bg-transparent py-6 px-12 md:px-16 flex items-center pointer-events-none">
      <div className="pointer-events-auto">
        <Link href="/">
          <Image
            src="/alchemyLogo.png"
            alt="Alchemy Logo"
            width={150}
            height={40}
            className="w-auto h-8 sm:h-10 object-contain"
            priority
          />
        </Link>
      </div>
    </header>
  );
}
