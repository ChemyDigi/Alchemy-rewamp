"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMobileMenu } from "@/components/MobileMenuContext";

export default function Header() {
  const pathname = usePathname();
  const { isMobileMenuOpen } = useMobileMenu();

  // Hide header on blog slug pages
  if (pathname.startsWith("/blog/") && pathname !== "/blog") {
    return null;
  }

  return (
    <header
      className={`absolute top-0 left-0 w-full z-50 bg-transparent py-6 px-12 md:px-16 items-center pointer-events-none ${isMobileMenuOpen ? "hidden md:flex" : "flex"
        }`}
    >
      <div className="pointer-events-auto">
        <Link href="/">
          <Image
            src="/alchemyLogo.png"
            alt="Alchemy Logo"
            width={150}
            height={40}
            className="w-auto h-8 sm:h-10 object-contain -translate-x-4 md:translate-x-0"
            priority
          />
        </Link>
      </div>
    </header>
  );
}
