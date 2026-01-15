

import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { type PortableTextBlock } from "next-sanity";
import { Suspense } from "react";
import DateComponent from "@/app/components/Date";

import CoverImage from "@/app/components/CoverImage";
import { MoreDevotionals } from "@/app/components/Posts";
import PortableText from "@/app/components/PortableText";
import { sanityFetch } from "@/sanity/lib/live";
import { devotionalSlugs, singleDevotionalQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";

type Props = {
  params: Promise<{ slug: string }>;
};

/**
 * Generate static params specifically for devotionals.
 */
export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const { data }: { data: Array<{ slug: { current: string | null } | null }> } = await sanityFetch({
    query: devotionalSlugs,
    perspective: "published",
    stega: false,
  });
  return data
    .filter((item): item is { slug: { current: string } } => !!item.slug?.current)
    .map((item) => ({
      slug: item.slug.current,
    }));
}

/**
 * Generate metadata for the devotional page.
 */
export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const params = await props.params;
  const { data: post } = await sanityFetch({
    query: singleDevotionalQuery,
    params,
    stega: false,
  });

  if (!post) {
    return {
      title: "Devotional Not Found",
      description: "The requested devotional could not be found.",
    };
  }


  const previousImages = (await parent).openGraph?.images || [];
  const ogImage = resolveOpenGraphImage(post?.coverImage);

  return {
    authors:
      post?.author?.firstName && post?.author?.lastName
        ? [{ name: `${post.author.firstName} ${post.author.lastName}` }]
        : [],
    title: post?.title,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  } satisfies Metadata;
}

export default async function DevotionalPage(props: Props) {
  const params = await props.params;

  const { data: post } = await sanityFetch({
    query: singleDevotionalQuery,
    params,
  });

  if (!post?._id) {
    notFound();
  }

  const hasContent = Array.isArray(post.content) && post.content.length > 0;

  return (
    <>
      <div>
        <div className="container py-12 lg:py-24 grid gap-12 bg-white">
          <div className="flex flex-col flex-wrap content-around">
            <div className="pb-6 grid gap-6 mb-6 border-b border-cream-300">
              <div className="max-w-3xl flex flex-col gap-6">
                <h1 className="text-4xl font-bold tracking-tight text-brown-800 sm:text-5xl lg:text-7xl">
                  {post.title}
                </h1>

                {post.publicationDate && (
                  <p className="text-sm text-brown-500">
                    Published: <DateComponent dateString={post.publicationDate} />
                  </p>
                )}

                {post.author?.firstName && post.author?.lastName && (
                  <div className="mt-4 flex items-center gap-3">
                    {post.author.picture && (
                      <CoverImage image={post.author.picture} />
                    )}
                    <span className="text-sm text-brown-600">
                      By {post.author.firstName} {post.author.lastName}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <article className="gap-6 grid max-w-4xl">
              {post.coverImage && (
                <div>
                  <CoverImage image={post.coverImage} priority />
                </div>
              )}

              {hasContent && (
                <PortableText
                  className="max-w-2xl"
                  value={post.content as PortableTextBlock[]}
                />
              )}
            </article>
          </div>
        </div>
      </div>

      <div className="bg-cream-100">
        <div className="container py-12 lg:py-24 grid gap-12">
          <aside>
            <Suspense>{await MoreDevotionals({ skip: post._id, limit: 2 })}</Suspense>
          </aside>
        </div>
      </div>
    </>
  );
}
