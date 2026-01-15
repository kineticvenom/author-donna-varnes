import { sanityFetch } from "@/sanity/lib/live";
import { allDevotionalsQuery } from "@/sanity/lib/queries";
import type { AllDevotionalsQueryResult } from "@/sanity.types";
import CoverImage from "@/app/components/CoverImage";
import Link from "next/link";
import DateComponent from "@/app/components/Date";

export default async function DevotionalsPage() {
  const { data: posts } = await sanityFetch({
    query: allDevotionalsQuery,
  });

  return (
    <div className="container py-12 lg:py-24 bg-white">
      <h1 className="text-5xl font-bold mb-6">Devotionals</h1>
      <div className="grid gap-12">
        {posts.map((post) => (
          <article key={post._id} className="max-w-2xl">
            <CoverImage image={post.coverImage ?? null} />
            <h2 className="text-3xl font-semibold mt-4">
              <Link href={`/devotionals/${post.slug?.current ?? ""}`}>{post.title}</Link>
            </h2>
            <DateComponent dateString={post.publicationDate} />
            {post.scriptureReference && (
              <p className="mt-2 text-brown-600">{post.scriptureReference}</p>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
