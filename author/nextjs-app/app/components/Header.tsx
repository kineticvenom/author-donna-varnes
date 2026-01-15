import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import { settingsQuery } from "@/sanity/lib/queries";
import type { SettingsQueryResult } from "@/types/settings";
import Image from "next/image";
import { urlForImage } from "@/sanity/lib/utils";
import logoFallback from "@/public/images/Logo.png";

export default async function Header() {
  const result = await sanityFetch({
    query: settingsQuery,
    stega: false,
  });

  const settings = result.data as SettingsQueryResult;
  const logoSource = settings.logo; // SanityImageSource | undefined
  const builder = logoSource ? urlForImage(logoSource) : undefined; // ImageUrlBuilder | undefined
  const logoUrl = builder
    ? builder.auto("format").width(300).height(80).url()
    : undefined;
  const src = logoUrl; // Use string path for fallback

  return (
    <header className="fixed z-50 h-20 inset-0 flex items-center bg-white border-b-4 border-gold-500">
      <div className="container py-4 sm:px-6">
        <div className="flex items-center justify-between gap-5">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={logoFallback}
              alt="Logo"
              className="h-10 sm:h-12 object-contain"
              width={300}
              height={80}
            />
          </Link>
          <nav>
            <ul
              role="list"
              className="flex items-center gap-6 md:gap-8"
            >
              <li><Link href="/" className="nav-link">Home</Link></li>
              <li><Link href="/books" className="nav-link">Books</Link></li>
              <li><Link href="/blog" className="nav-link">Blog</Link></li>
              <li><Link href="/devotionals" className="nav-link">Devotions</Link></li>
              <li><Link href="/about" className="nav-link">About</Link></li>
              <li><Link href="/contact" className="nav-link">Contact</Link></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}