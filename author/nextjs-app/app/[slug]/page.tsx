import type { Metadata } from "next";
import PageBuilderPage from "@/app/components/PageBuilder";
import { sanityFetch } from "@/sanity/lib/live";
import { getPageQuery, sitemapData } from "@/sanity/lib/queries";
import type { Page } from "@/sanity.types";
import { notFound } from "next/navigation";

// Define the shape of params for clarity
interface PageParams {
  slug: string;
}

// Define the shape of a sitemap page
interface SitemapPage {
  slug: string | null;
}

// Generate static parameters for dynamic routes
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const { data: pages }: { data: SitemapPage[] } = await sanityFetch({
    query: sitemapData,
    perspective: "published",
    stega: false,
  });

  return pages
    .filter((page): page is { slug: string } => !!page.slug)
    .map((page) => ({ slug: page.slug }));
}

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: PageParams;
}): Promise<Metadata> {
  const { slug } = params;

  const { data: page }: { data: Page | null } = await sanityFetch({
    query: getPageQuery,
    params: { slug },
  });

  if (!page) {
    return {
      title: "Page Not Found",
      description: "The requested page could not be found.",
    };
  }

  return {
    title: page.name ?? "Untitled Page",
    description: page.heading ?? "",
  };
}

// Generate sitemap (optional, for SEO or sitemap generation)
// export async function generateSitemap(): Promise<{ url: string }[]> {
//   const { data: pages }: { data: SitemapPage[] } = await sanityFetch({
//     query: sitemapData,
//     perspective: "published",
//     stega: false,
//   });

//   return pages
//     .filter((page): page is { slug: string } => !!page.slug)
//     .map((page) => ({ url: `/${page.slug}` }));
// }

// Page component for dynamic route
export default async function PageRoute({ params }: { params: PageParams }) {
  const { slug } = params;

  const { data: page }: { data: Page | null } = await sanityFetch({
    query: getPageQuery,
    params: { slug },
  });

  if (!page?._id) {
    notFound();
  }

  return (
    <div className="my-12 lg:my-24">
      <div className="container pb-6 border-b border-gray-100">
        <div className="max-w-3xl">
          <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-7xl">
            {page.heading}
          </h2>
          <p className="mt-4 text-base lg:text-lg leading-relaxed text-gray-600 uppercase font-light">
            {page.subheading}
          </p>
        </div>
      </div>
      <PageBuilderPage page={page} />
    </div>
  );
}