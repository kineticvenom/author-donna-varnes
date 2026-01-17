import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import {
  moreDevotionalsQuery,
  allDevotionalsQuery,
  moreBlogsQuery,
  allBlogsQuery,
} from "@/sanity/lib/queries";
import {
  MoreBlogsQueryResult,
  MoreDevotionalsQueryResult,
  AllBlogsQueryResult,
  AllDevotionalsQueryResult,
} from "@/sanity.types";
import DateComponent from "@/app/components/Date";

/* ----------------------- helpers ----------------------- */
type PostType = MoreBlogsQueryResult[number] | MoreDevotionalsQueryResult[number];

const isBlogPost = (post: PostType): post is MoreBlogsQueryResult[number] =>
  post._type === "blog";

// Handle both string slugs (from blogs) and object slugs (from devotionals)
type SlugType = string | { current: string | null } | null;
const toSlug = (slug: SlugType): string =>
  typeof slug === "string" ? slug : slug?.current ?? "";

/* -------------------- presentational -------------------- */

const Post = ({ post }: { post: PostType }) => {
  const { _id, title, slug, publicationDate } = post;

  const href = isBlogPost(post)
    ? `/blog/${toSlug(slug)}`
    : `/devotionals/${toSlug(slug)}`;

  const description = isBlogPost(post) ? post.excerpt : post.scriptureReference;
  const isBlog = isBlogPost(post);

  return (
    <Link
      key={_id}
      href={href}
      className="group block cursor-pointer"
    >
      <article
        className={`flex max-w-xl flex-col items-start justify-between article-row p-4 rounded-lg border border-transparent transition-all ${
          isBlog
            ? "hover:border-gold-300 hover:bg-cream-50"
            : "hover:border-sage-300 hover:bg-sage-50"
        }`}
      >
        <div className="flex items-center gap-3 text-sm">
          <span className={`uppercase tracking-wider text-xs font-semibold ${
            isBlog ? "text-gold-600" : "text-sage-600"
          }`}>
            {isBlog ? "Blog" : "Devotional"}
          </span>
          <span className="text-cream-400">•</span>
          {publicationDate && <DateComponent dateString={publicationDate} />}
        </div>

        <h3 className="mt-3 text-2xl font-semibold leading-tight text-accent group-hover:underline transition-colors">
          {title || "Untitled"}
        </h3>

        {description && (
          <p className="mt-5 text-sm leading-6 text-brown-600 line-clamp-3 group-hover:text-brown-700 transition-colors">
            {description}
          </p>
        )}
      </article>
    </Link>
  );
};

const Posts = ({
  children,
  heading,
  subHeading,
}: {
  children: React.ReactNode;
  heading?: string;
  subHeading?: string;
}) => (
  <section className="max-w-5xl mx-auto px-4 py-12">
    {heading && (
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-6">
        {heading}
      </h2>
    )}
    {subHeading && (
      <p className="text-lg leading-8 text-brown-600 mb-8">{subHeading}</p>
    )}

    <div className="space-y-12">{children}</div>
  </section>
);

/* ----------------------- data blocks -------------------- */

export const MoreBlogs = async ({
  skip,
  limit,
}: {
  skip: string;
  limit: number;
}) => {
  const { data }: { data: MoreBlogsQueryResult } = await sanityFetch({
    query: moreBlogsQuery,
    params: { skip, limit },
    perspective: "published",
  });

  if (!data?.length) return null;

  return (
    <Posts heading="More to Read" subHeading="Keep exploring">
      {data.map((blog) => (
        <Post key={blog._id} post={blog} />
      ))}
    </Posts>
  );
};

export const MoreDevotionals = async ({
  skip,
  limit,
}: {
  skip: string;
  limit: number;
}) => {
  const { data }: { data: MoreDevotionalsQueryResult } = await sanityFetch({
    query: moreDevotionalsQuery,
    params: { skip, limit },
    perspective: "published",
  });

  if (!data?.length) return null;

  return (
    <Posts heading="More Devotionals" subHeading="Continue your journey">
      {data.map((devotional) => (
        <Post key={devotional._id} post={devotional} />
      ))}
    </Posts>
  );
};

export const AllPosts = async () => {
  const { data }: { data: AllBlogsQueryResult } = await sanityFetch({
    query: allBlogsQuery,
    perspective: "published",
  });

  if (!data?.length) return <p className="px-4">No posts available.</p>;

  return (
    <Posts heading="From the Journey" subHeading="Reflections from the wilderness and beyond">
      {data.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </Posts>
  );
};

export const AllDevotionals = async () => {
  const { data }: { data: AllDevotionalsQueryResult } = await sanityFetch({
    query: allDevotionalsQuery,
    perspective: "published",
  });

  if (!data?.length) return <p className="px-4">No devotionals available.</p>;

  return (
    <Posts
      heading="Where Faith Meets Everyday Life"
      subHeading="Finding God in the ordinary moments"
    >
      {data.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </Posts>
  );
};

export default Post;
