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
type PostType = MoreBlogsQueryResult[0] | MoreDevotionalsQueryResult[0];

const isBlogPost = (post: PostType): post is MoreBlogsQueryResult[0] =>
  (post as any)._type === "blog";

const toSlug = (slug: any) =>
  typeof slug === "string" ? slug : slug?.current ?? "";

/* -------------------- presentational -------------------- */

const Post = ({ post }: { post: PostType }) => {
  const { _id, title, slug, publicationDate } = post;

  const href = isBlogPost(post)
    ? `/blog/${toSlug(slug)}`
    : `/devotionals/${toSlug(slug)}`;

  const description = isBlogPost(post) ? post.excerpt : post.scriptureReference;

  return (
    <article
      key={_id}
      className="group flex max-w-xl flex-col items-start justify-between"
    >
      <div className="text-sm text-muted-foreground">
        {publicationDate && <DateComponent dateString={publicationDate} />}
      </div>

      <h3 className="mt-3 text-2xl font-semibold leading-tight">
        <Link
          className="text-accent hover:underline transition-colors"
          href={href}
        >
          {title || "Untitled"}
        </Link>
      </h3>

      {description && (
        <p className="mt-5 text-sm leading-6 text-gray-600 line-clamp-3 group-hover:text-gray-700 transition-colors">
          {description}
        </p>
      )}
    </article>
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
  <section className="max-w-5xl mx-auto px-4 py-16 border-t first:border-0">
    {heading && (
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-6">
        {heading}
      </h2>
    )}
    {subHeading && (
      <p className="text-lg leading-8 text-gray-600 mb-8">{subHeading}</p>
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
    <Posts heading={`Recent Posts (${data.length})`}>
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
    <Posts heading={`Recent Devotionals (${data.length})`}>
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
    <Posts heading="Recent Posts" subHeading={`"Explore Recent Blogs!" `}>
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
      heading="Recent Devotionals"
      subHeading={`"Explore Recent Devotionals!" `}
    >
      {data.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </Posts>
  );
};

export default Post;
