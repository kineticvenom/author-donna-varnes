import type { Metadata } from "next";
import PageBuilderPage from "@/app/components/PageBuilder";
import { sanityFetch } from "@/sanity/lib/live";
import { getPageQuery } from "@/sanity/lib/queries";
import type { Page } from "@/sanity.types";
import { notFound } from "next/navigation";
import { PageProps } from "@/.next/types/app/page";

// Define the shape of dynamic route params
type Props = {
  params: Promise<{ slug: string }>;
};

// Generate metadata for the dynamic page
export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  // Await the dynamic params
  const { slug } = await params;

  // Fetch your page data
  const { data: page } = await sanityFetch({
    query: getPageQuery,
    params: { slug },
  });

  return {
    title: page.name ?? "Untitled Page",
    description: page.heading ?? "",
  };
}

// Render the dynamic route page
export default async function PageRoute({ params }: Props) {
  const { slug } = await params;

  // Fetch page data
  const { data: page } = await sanityFetch({
    query: getPageQuery,
    params: { slug },
  });


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
