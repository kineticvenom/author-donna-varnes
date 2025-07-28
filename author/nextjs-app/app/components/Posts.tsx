import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import { moreDevotionalsQuery, allDevotionalsQuery, moreBlogsQuery, allBlogsQuery } from "@/sanity/lib/queries";
import { MoreBlogsQueryResult, MoreDevotionalsQueryResult, AllBlogsQueryResult, AllDevotionalsQueryResult } from "@/sanity.types";
import DateComponent from "@/app/components/Date";

type PostType = MoreBlogsQueryResult[0] | MoreDevotionalsQueryResult[0];

const Post = ({ post }: { post: PostType }) => {
  const { _id, title, slug, publicationDate} = post;

function isBlogPost(post: PostType): post is MoreBlogsQueryResult[0] {
  return (post as any)._type === "blog";
}

const href = isBlogPost(post) ? `/blog/${post.slug || ''}` : `/devotionals/${post.slug || ''}`;
const description = isBlogPost(post) ? post.excerpt : post.scriptureReference;


  return (
    <article
      key={_id}
      className="flex max-w-xl flex-col items-start justify-between"
    >
      <div className="text-gray-500 text-sm">
        {publicationDate && <DateComponent dateString={publicationDate} />}
      </div>
      <h3 className="mt-3 text-2xl font-semibold">
        <Link
          className="hover:text-red-500 underline transition-colors"
          href={href}
        >
          {title || 'Untitled'}
        </Link>
      </h3>
      {description && (
        <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
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
  <div>
    {heading && (
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
        {heading}
      </h2>
    )}
    {subHeading && (
      <p className="mt-2 text-lg leading-8 text-gray-600">{subHeading}</p>
    )}
    <div className="mt-6 pt-6 space-y-12 border-t border-gray-200">
      {children}
    </div>
  </div>
);

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
  perspective: 'published',
});
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <Posts heading={`Recent Posts (${data.length})`}>
      {data.map((blog) => <Post key={blog._id} post={blog} />)}
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
  const { data } : {data:MoreDevotionalsQueryResult} = await sanityFetch({
    query: moreDevotionalsQuery,
    params: { skip, limit },
    perspective: 'published',
  });

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <Posts heading={`Recent Devotionals (${data.length})`}>
      {data.map((devotional) => <Post key={devotional._id} post={devotional} />)}
    </Posts>
  );
};

export const AllPosts = async () => {
  const { data } : {data:AllBlogsQueryResult} = await sanityFetch({
    query: allBlogsQuery,
    perspective: 'published',
  });

  if (!data || data.length === 0) {
    return <p>No posts available.</p>;
  }

  return (
    <Posts
      heading="Recent Posts"
      subHeading={`"Explore Recent Blogs!" `}
    >
      {data.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </Posts>
  );
};

export const AllDevotionals = async () => {
  const { data } : {data:AllDevotionalsQueryResult} = await sanityFetch({
    query: allDevotionalsQuery,
    perspective: 'published',
  });

  if (!data || data.length === 0) {
    return <p>No devotionals available.</p>;
  }

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