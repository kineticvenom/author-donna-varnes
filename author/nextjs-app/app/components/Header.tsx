// app/components/Header.tsx
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import { settingsQuery } from "@/sanity/lib/queries";
import type { SettingsQueryResult } from "@/types/settings";
import { Image } from "next-sanity/image";

export default async function Header() {
  // 1. No generic here—just call sanityFetch
  const result = await sanityFetch({
    query: settingsQuery,
    stega: false,
  });

  // 2. Assert the returned data shape
  const settings = result.data as SettingsQueryResult;

  // 3. Use optional chaining + nullish coalescing for your fallback
  const logo = settings.logo?.asset?.url ?? "/images/Logo.png";

  return (
    <header className="fixed z-50 h-24 inset-0 bg-white/80 flex items-center backdrop-blur-lg">
      <div className="container py-6 sm:px-6">
        <div className="flex items-center justify-between gap-5">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={logo}
              alt="Logo"
              className="h-10 sm:h-12 object-contain"
            />
          </Link>
          <nav>
            <ul
              role="list"
              className="flex items-center gap-4 md:gap-6 leading-5 text-sm md:text-base tracking-tight font-normal"
            >
              <li><Link href="/">Home</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/devotionals">Devotions</Link></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
