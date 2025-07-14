import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { type PortableTextBlock } from "next-sanity";
import { Suspense } from "react";

import Avatar from "@/app/components/Avatar";
import CoverImage from "@/app/components/CoverImage";
import { MoreBlogs } from "@/app/components/Posts";
import PortableText from "@/app/components/PortableText";
import { sanityFetch } from "@/sanity/lib/live";
import { blogSlugs, singleBlogQuery } from "@/sanity/lib/queries";
import { resolveOpenGraphImage } from "@/sanity/lib/utils";
import DateComponent from "@/app/components/Date";

type Props = {
  params: Promise<{ slug: string }>;
};

/**
 * Generate the static params for the page.
 */
export async function generateStaticParams() {
  const { data } = await sanityFetch({
    query: blogSlugs,
    perspective: "published",
    stega: false,
  });

  // Filter for only blog posts here if needed
  return data
}

/**
 * Generate metadata for the page.
 */
export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const params = await props.params;
  const { data: post } = await sanityFetch({
    query: singleBlogQuery,
    params,
    stega: false,
  });
  
  const previousImages = (await parent).openGraph?.images || [];
  const ogImage = resolveOpenGraphImage(post?.coverImage);

  return {
    authors:
      post?.author?.firstName && post?.author?.lastName
        ? [{ name: `${post.author.firstName} ${post.author.lastName}` }]
        : [],
    title: post?.title,
    description: post?.excerpt,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  } satisfies Metadata;
}

export default async function PostPage(props: Props) {
  const params = await props.params;

  const { data: post } = await sanityFetch({
    query: singleBlogQuery,
    params,
  });

  if (!post?._id) {
    return (<div className="text-center py-20">
        <h1>404 - Page Not Found</h1>
        <p>The page does not exist.</p>
      </div>
    );
  }
  const hasContent = Array.isArray(post.content) && post.content.length > 0;
  return (
    <>
      <div>
        <div className="container my-12 lg:my-24 grid gap-12">
          <div>
            <div className="pb-6 grid gap-6 mb-6 border-b border-gray-100">
              <div className="max-w-3xl flex flex-col gap-6">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-7xl">
                  {post.title}
                </h1>

                {post.status && (
                  <p className="text-xs uppercase text-gray-400">
                    Status: {post.status}
                  </p>
                )}

                {post.publicationDate && (
                  <p className="text-sm text-gray-500">
                    Published: <DateComponent dateString={post.publicationDate} />
                  </p>
                )}

                {post.author?.firstName && post.author?.lastName && (
                  <div className="mt-4 flex items-center gap-3">
                    {post.author.picture?.asset?.url && (
                      <CoverImage
                        image={post.author.picture.asset.url}
                      />
                    )}
                    <span className="text-sm text-gray-600">
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

              {post.excerpt && (
                <blockquote className="mt-6 italic border-l-4 border-gray-300 pl-4 text-gray-700">
                  {post.excerpt}
                </blockquote>
              )}
            </article>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100">
        <div className="container my-12 lg:my-24 grid gap-12">
          <aside>
            <Suspense>{await MoreBlogs({ skip: post._id, limit: 2 })}</Suspense>
          </aside>
        </div>
      </div>
    </>
  );
}
