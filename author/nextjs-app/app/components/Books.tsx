import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import { moreBooksQuery, allBooksQuery } from "@/sanity/lib/queries";
import { Book as BookType } from "@/sanity.types";
import DateComponent from "@/app/components/Date";

import CoverImage from "./CoverImage";
import { PortableText } from "@portabletext/react";

const Book = ({ book }: { book: BookType }) => {
  const { _id, title, slug,  description, publicationDate,coverImage } = book;

  return (
    <article key={_id}  className="grid grid-cols-[96px_1fr] gap-4 md:grid-cols-[160px_1fr] md:gap-6">
      <CoverImage image={coverImage ?? null} />

      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-semibold leading-tight">
          <Link href={`/books/${slug}`} className="text-accent hover:underline transition-colors">
            {title}
          </Link>
        </h3>
        <div className="text-sm text-muted-foreground">
        <DateComponent dateString={publicationDate} />
        </div>
        {description && (
        <p className="mt-1 text-sm text-gray-600 line-clamp-4 md:line-clamp-6">
          {description}
        </p>)}
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

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <Books heading={`Recent Books (${data.length})`}>
      {data.map((book: any) => <Book key={book._id} book={book} />)}
    </Books>
  );
};

export const AllBooks = async () => {
  const { data } = await sanityFetch({ query: allBooksQuery });

  if (!data || data.length === 0) {
    return <p>No books available.</p>;
  }; 

  return (
    <Books
      heading="My Published Books!"
      subHeading={`${
        data.length === 1
          ? "This book is"
          : `Donna Has Published ${data.length} books!`
      } `}
    >
      {data.map((book: any) => (
        <Book key={book._id} book={book} />
      ))}
    </Books>
  );
};
export const FeaturedBooks = async () => {
  let { data } = await sanityFetch({ query: allBooksQuery });

  if (!data || data.length === 0) {
    return <p>No books available.</p>;
  }

  
  const randomIndex = Math.floor(Math.random() * data.length);
  data = [data[randomIndex]]; // Select a single random book

  return (
    <Books
      heading="Featured Book!"
      subHeading={`"Check out this featured book!" `}
    >
      {data.map((book: any) => (
        <Book key={book._id} book={book} />
      ))}
    </Books>
  );

};


