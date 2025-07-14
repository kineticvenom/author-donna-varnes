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
    <header className="fixed z-50 h-24 inset-0 bg-white/80 flex items-center backdrop-blur-lg">
      <div className="container py-6 sm:px-6">
        <div className="flex items-center justify-between gap-5">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={logoFallback} // Fallback to local image if Sanity image is not available
              alt="Logo"
              className="h-10 sm:h-12 object-contain"
              width={300} // Match width in urlForImage
              height={80} // Match height in urlForImage
            />
          </Link>
          <nav>
            <ul
              role="list"
              className="flex items-center gap-4 md:gap-6 leading-5 text-sm md:text-base tracking-tight font-normal"
            >
              <li><Link href="/">Home</Link></li>
              <li><Link href="/blog">Blog</Link></li>
              <li><Link href="/books">Books</Link></li>
              <li><Link href="/devotionals">Devotions</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/about">About</Link></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}