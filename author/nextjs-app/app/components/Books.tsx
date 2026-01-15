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
    <article
      key={_id}
      className="group grid grid-cols-[96px_1fr] gap-4 md:grid-cols-[160px_1fr] md:gap-6"
    >
      {/* image wrapper for rounded corners / aspect / bg */}
     <div className="relative aspect-[3/4] rounded-md bg-cream-100 flex items-center justify-center">
      <CoverImage
        image={coverImage ?? null}
        imgClassName="h-full w-full object-contain"
      />
     </div>

      <div className="flex flex-col gap-2 article-text">
        <h3 className="text-2xl font-semibold leading-tight">
          <Link
            href={`/books/${slug ?? ""}`}
            className="text-accent hover:underline transition-colors"
          >
            {title}
          </Link>
        </h3>

        <div className="text-sm text-muted-foreground">
          <DateComponent dateString={publicationDate} />
        </div>

        {description && (
          <p className="mt-1 text-sm text-brown-600 line-clamp-2 md:line-clamp-3 group-hover:text-brown-700 transition-colors">
            {description}
          </p>
        )}
      </div>
    </article>
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
    <Books heading={`Recent Books (${data.length})`}>
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
      heading="My Published Books!"
      subHeading={
        data.length === 1
          ? "This book is"
          : `Donna Has Published ${data.length} books!`
      }
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
    <Books heading="Featured Book!" subHeading={`"Check out this featured book!" `}>
      {data.map((book) => (
        <Book key={book._id} book={book} />
      ))}
    </Books>
  );
};
