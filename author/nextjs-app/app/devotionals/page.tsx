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
      <div className="grid gap-8">
        {posts.map((post) => (
          <Link
            key={post._id}
            href={`/devotionals/${post.slug?.current ?? ""}`}
            className="group block cursor-pointer"
          >
            <article className="grid grid-cols-[96px_1fr] gap-4 md:grid-cols-[160px_1fr] md:gap-6 p-4 rounded-lg border border-transparent hover:border-sage-300 hover:bg-sage-50 transition-all max-w-2xl">
              <div className="relative aspect-[3/4] rounded-md bg-cream-100 flex items-center justify-center">
                <CoverImage
                  image={post.coverImage ?? null}
                  imgClassName="h-full w-full object-contain"
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-sage-600 uppercase tracking-wider text-xs font-semibold">
                    Devotional
                  </span>
                  <span className="text-cream-400">•</span>
                  <DateComponent dateString={post.publicationDate} />
                </div>
                <h2 className="text-2xl font-semibold text-accent group-hover:underline transition-colors">
                  {post.title}
                </h2>
                {post.scriptureReference && (
                  <p className="mt-1 text-sm text-brown-600 line-clamp-3 group-hover:text-brown-700 transition-colors">
                    {post.scriptureReference}
                  </p>
                )}
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
