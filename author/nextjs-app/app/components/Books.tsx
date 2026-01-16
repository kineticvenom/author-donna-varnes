import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import { moreBooksQuery, allBooksQuery } from "@/sanity/lib/queries";
import type { AllBooksQueryResult, MoreBooksQueryResult } from "@/sanity.types";
import DateComponent from "@/app/components/Date";
import CoverImage from "./CoverImage";

// Type for a single book from query results
type BookQueryResult = AllBooksQueryResult[number];

/* --- presentational only -------------------------------------------------- */

const Book = ({ book }: { book: BookQueryResult }) => {
  const { _id, title, slug, description, publicationDate, coverImage } = book;

  return (
    <Link
      key={_id}
      href={`/books/${slug ?? ""}`}
      className="group block cursor-pointer"
    >
      <article className="grid grid-cols-[96px_1fr] gap-4 md:grid-cols-[160px_1fr] md:gap-6 p-4 rounded-lg border border-transparent hover:border-gold-300 hover:bg-cream-50 transition-all">
        {/* image wrapper for rounded corners / aspect / bg */}
        <div className="relative aspect-[3/4] rounded-md bg-cream-100 flex items-center justify-center">
          <CoverImage
            image={coverImage ?? null}
            imgClassName="h-full w-full object-contain"
          />
        </div>

        <div className="flex flex-col gap-2 article-text">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-gold-600 uppercase tracking-wider text-xs font-semibold">
              Book
            </span>
            <span className="text-cream-400">•</span>
            <DateComponent dateString={publicationDate} />
          </div>

          <h3 className="text-2xl font-semibold leading-tight text-accent group-hover:underline transition-colors">
            {title}
          </h3>

          {description && (
            <p className="mt-1 text-sm text-brown-600 line-clamp-2 md:line-clamp-3 group-hover:text-brown-700 transition-colors">
              {description}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
};

const Books = ({
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

/* --- data blocks (unchanged logic, styling only) -------------------------- */

export const MoreBooks = async ({
  skip,
  limit,
}: {
  skip: string;
  limit: number;
}) => {
  const { data } = await sanityFetch({
    query: moreBooksQuery,
    params: { skip, limit },
  });

  if (!data || data.length === 0) return null;

  return (
    <Books heading="More From the Shelf" subHeading="Continue exploring">
      {data.map((book) => (
        <Book key={book._id} book={book} />
      ))}
    </Books>
  );
};

export const AllBooks = async () => {
  const { data } = await sanityFetch({ query: allBooksQuery });

  if (!data || data.length === 0) return <p className="px-4">No books available.</p>;

  return (
    <Books
      heading="From My Bookshelf"
      subHeading="Stories crafted with faith, hope, and heart"
    >
      {data.map((book) => (
        <Book key={book._id} book={book} />
      ))}
    </Books>
  );
};

export const FeaturedBooks = async () => {
  let { data } = await sanityFetch({ query: allBooksQuery });

  if (!data || data.length === 0) return <p className="px-4">No books available.</p>;

  const randomIndex = Math.floor(Math.random() * data.length);
  data = [data[randomIndex]];

  return (
    <Books heading="Worth Your Time" subHeading="A story waiting to be discovered">
      {data.map((book) => (
        <Book key={book._id} book={book} />
      ))}
    </Books>
  );
};
