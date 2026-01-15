import { sanityFetch } from "@/sanity/lib/live";
import { allBlogsQuery } from "@/sanity/lib/queries";
import type { AllBlogsQueryResult } from "@/sanity.types";
import CoverImage from "@/app/components/CoverImage";
import Link from "next/link";
import DateComponent from "@/app/components/Date";

export default async function BlogPage() {
  const { data: posts } = await sanityFetch({
    query: allBlogsQuery,
    params: { type: "blog" },
  });

  return (
    <div className="container py-12 lg:py-24 bg-white">
      <h1 className="text-5xl font-bold mb-6">Blog</h1>
      <div className="grid gap-12">
        {posts.map((post) => (
          <article key={post._id} className="max-w-2xl">
            <CoverImage image={post.coverImage ?? null} />
            <h2 className="text-3xl font-semibold mt-4">
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            <DateComponent dateString={post.publicationDate} />
            {post.excerpt && (
              <p className="mt-2 text-brown-600">{post.excerpt}</p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
