import { sanityFetch } from "@/sanity/lib/live";
import { allDevotionalsQuery } from "@/sanity/lib/queries";
import CoverImage from "@/app/components/CoverImage";
import Link from "next/link";
import DateComponent from "@/app/components/Date";

export default async function DevotionalsPage() {
  const { data: posts } = await sanityFetch({
    query: allDevotionalsQuery,
    params: { type: "devotional" },
  });

  return (
    <div className="container my-12 lg:my-24">
      <h1 className="text-5xl font-bold mb-6">Devotionals</h1>
      <div className="grid gap-12">
        {posts.map((post: any) => (
          <article key={post._id} className="max-w-2xl">
            <CoverImage image={post.coverImage} />
            <h2 className="text-3xl font-semibold mt-4">
              {post.slug?.current ? (
                <Link href={`/devotionals/${post.slug.current}`}>{post.title}</Link>
              ) : (
                <span>{post.title}</span> // Fallback if slug is missing
              )}
            </h2>
            <DateComponent dateString={post.date} />
            {post.excerpt && (
              <p className="mt-2 text-gray-600">{post.excerpt}</p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
