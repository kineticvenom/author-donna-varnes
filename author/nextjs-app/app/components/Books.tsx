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
    <article key={_id} className="flex flex-row items-start justify-between">
      <CoverImage image={coverImage ?? null} />

      <div className="flex flex-col w-2/3 ml-5">
        <h3 className="mt-3 text-2xl font-semibold">
          <Link href={`/books/${slug}`} className="hover:text-red-500 underline transition-colors">
            {title}
          </Link>
        </h3>
        <div className="text-gray-500 text-sm">
        <DateComponent dateString={publicationDate} />
        </div>
        {description && (
        <p className="mt-5 line-clamp-8 text-sm leading-6 text-gray-600">
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
// export const FeaturedBooks = async () => {
//   const { data } = await sanityFetch({ query: allBooksQuery });

//   if (!data || data.length === 0) {
//     return <p>No books available.</p>;
//   }

//   const books = data as BookType[];
//   const randomIndex = Math.floor(Math.random() * books.length);
//   const randomBook = books[randomIndex];

//   if (!randomBook) {
//     return <p>Could not select a featured book.</p>;
//   }

//   return (
//     <Books
//       heading="Featured Book!"
//       subHeading="Enjoy a randomly selected highlight from Donna's collection."
//     >
//       <Book key={randomBook._id} book={randomBook} />
//     </Books>
//   );
// };


