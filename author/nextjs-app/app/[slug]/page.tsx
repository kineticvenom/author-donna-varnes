import type { Metadata } from "next";

import PageBuilderPage from "@/app/components/PageBuilder";
import { sanityFetch } from "@/sanity/lib/live";
import { getPageQuery, sitemapData } from "@/sanity/lib/queries";
import { GetPageQueryResult } from "@/sanity.types";
import { PageOnboarding } from "@/app/components/Onboarding";

/**
 * Generate the static params for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
  const result = await sanityFetch({
    query: sitemapData,
    perspective: "published",
    stega: false,
  });
  const pages = result.data as { slug: string | null }[];

  return pages
    .filter((page): page is { slug: string } => !!page.slug)
    .map((page) => ({ slug: page.slug }));
}

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata({
  params,
}: {
  // params is now a Promise that resolves to { slug: string }
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const { data: page } = await sanityFetch({
    query: getPageQuery,
    params: { slug },
    stega: false,
  });

  return {
    title: page?.name,
    description: page?.heading,
  };
}

export default async function Page({
  params,
}: {
  // params must be awaited to extract slug
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: page } = await sanityFetch({
    query: getPageQuery,
    params: { slug },
  });

  if (!page?._id) {
    return (
      <div className="py-40">
        <PageOnboarding />
      </div>
    );
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
      <PageBuilderPage page={page as GetPageQueryResult} />
    </div>
  );
}
