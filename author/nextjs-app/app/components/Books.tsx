import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import { moreBooksQuery, allBooksQuery } from "@/sanity/lib/queries";
import { Book as BookType } from "@/sanity.types";
import DateComponent from "@/app/components/Date";
import OnBoarding from "@/app/components/Onboarding";

const Book = ({ book }: { book: BookType }) => {
  const { _id, title, slug,  description, publicationDate,excerpt } = book;

  return (
    <article key={_id} className="flex max-w-xl flex-col items-start justify-between">
      <div className="text-gray-500 text-sm">
        <DateComponent dateString={publicationDate} />
      </div>

      <h3 className="mt-3 text-2xl font-semibold">
        <Link href={`/books/${slug}`} className="hover:text-red-500 underline transition-colors">
          {title}
        </Link>
      </h3>
      <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
        {description}
      </p>
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
    return <OnBoarding />;
  }

  return (
    <Books
      heading="Recent Books"
      subHeading={`${
        data.length === 1
          ? "This book is"
          : `These ${data.length} books are`
      } populated from your Sanity Studio.`}
    >
      {data.map((book: any) => (
        <Book key={book._id} book={book} />
      ))}
    </Books>
  );
};
