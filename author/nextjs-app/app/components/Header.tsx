import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import { settingsQuery } from "@/sanity/lib/queries";

export default async function Header() {
  const { data: settings } = await sanityFetch({
    query: settingsQuery,
    stega: false,
  });

  const logo = settings?.logo?.asset?.url || "/images/Logo.png";
  return (
    <header className="fixed z-50 h-24 inset-0 bg-white/80 flex items-center backdrop-blur-lg">
      <div className="container py-6 sm:px-6">
        <div className="flex items-center justify-between gap-5">
          <Link className="flex items-center gap-2" href="/">
            <img
                src={logo}
                alt="Logo"
                className="h-10 sm:h-12 object-contain"
              />
          </Link>

          <nav className="">
            <ul
              role="list"
              className="flex items-center gap-4 md:gap-6 leading-5 text-sm md:text-base tracking-tight font-normal"
            >
            <li>
                  <Link href="/" className="">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/devotions" className="">
                    Devotions
                  </Link>
                </li>                
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
