
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/live";
import { moreBooksQuery, allBooksQuery } from "@/sanity/lib/queries";
import type { Book as BookType } from "@/sanity.types";
import DateComponent from "@/app/components/Date";
import CoverImage from "./CoverImage";

type BooksSectionProps = {
  heading?: string;
  subHeading?: string;
  children: React.ReactNode;
};

function BooksSection({ heading, subHeading, children }: BooksSectionProps) {
  return (
    <section className="max-w-5xl mx-auto px-4 py-16 border-t first:border-0">
      {heading && (
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-6">
          {heading}
        </h2>
      )}
      {subHeading && (
        <p className="text-lg text-gray-600 mb-8">{subHeading}</p>
      )}
      {children}
    </section>
  );
}

type BookCardProps = {
  book: BookType;
  clampMobile?: number;
  clampDesktop?: number;
  showCta?: boolean;
};

function getSlugPath(slug: BookType["slug"]): string {
  if (typeof slug === "string") return slug;
  return slug?.current ?? ""; // fallback if Sanity slug object
}

export function BookCard({
  book,
  clampMobile = 3,
  clampDesktop = 5,
  showCta = true,
}: BookCardProps) {
  const { _id, title, slug, description, publicationDate, coverImage } = book;
  const href = `/books/${getSlugPath(slug)}`;

  return (
    <article
      key={_id}
      className="flex flex-col rounded-lg border bg-white shadow-sm overflow-hidden"
    >
      <CoverImage
        image={coverImage ?? null}
        className="aspect-[3/4] w-full object-cover"
      />

      <div className="p-6 flex flex-col gap-3">
        <h3 className="text-xl font-semibold leading-tight">
          <Link href={href} className="hover:underline text-accent">
            {title}
          </Link>
        </h3>

        <div className="text-sm text-muted-foreground">
          <DateComponent dateString={publicationDate} />
        </div>

        {description && (
          <p
            className={`text-sm text-gray-600 line-clamp-${clampMobile} md:line-clamp-${clampDesktop}`}
          >
            {description}
          </p>
        )}

        {showCta && (
          <Link
            href={href}
            className="inline-block mt-1 rounded-md bg-accent px-4 py-2 text-accent-foreground text-sm font-medium hover:opacity-90 transition"
          >
            Read more →
          </Link>
        )}
      </div>
    </article>
  );
}

type HorizontalBookProps = { book: BookType };
export function HorizontalBook({ book }: HorizontalBookProps) {
  const { _id, title, slug, description, publicationDate, coverImage } = book;
  const href = `/books/${getSlugPath(slug)}`;

  return (
    <article
      key={_id}
      className="grid grid-cols-[120px_1fr] gap-6 md:grid-cols-[180px_1fr] md:gap-6"
    >
      <CoverImage image={coverImage ?? null} />

      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-semibold leading-tight">
          <Link href={href} className="text-accent hover:underline transition-colors">
            {title}
          </Link>
        </h3>

        <div className="text-sm text-muted-foreground">
          <DateComponent dateString={publicationDate} />
        </div>

        {description && (
          <p className="mt-1 text-sm text-gray-600 line-clamp-2 md:line-clamp-3">
            {description}
          </p>
        )}
      </div>
    </article>
  );
}

/* ------------ Data-driven sections ------------ */

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

  if (!data?.length) return null;

  return (
    <BooksSection heading={`Recent Books (${data.length})`}>
      <div className="mt-8 space-y-12">
        {data.map((book: BookType) => (
          <HorizontalBook key={book._id} book={book} />
        ))}
      </div>
    </BooksSection>
  );
};

export const AllBooks = async () => {
  const { data } = await sanityFetch({ query: allBooksQuery });

  if (!data?.length) return <p>No books available.</p>;

  return (
    <BooksSection
      heading="My Published Books!"
      subHeading={
        data.length === 1
          ? "This book is"
          : `Donna has published ${data.length} books!`
      }
    >
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((book: BookType) => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>
    </BooksSection>
  );
};

export const FeaturedBook = async () => {
  const { data } = await sanityFetch({ query: allBooksQuery });

  if (!data?.length) return <p>No books available.</p>;

  const randomIndex = Math.floor(Math.random() * data.length);
  const book = data[randomIndex] as BookType;

  return (
    <BooksSection heading="Featured Book!" subHeading="Explore this featured book!">
      <HorizontalBook book={book} />
      <div className="mt-6">
        <Link
          href={`/books/${getSlugPath(book.slug)}`}
          className="inline-block rounded-md bg-accent px-4 py-2 text-accent-foreground text-sm font-medium hover:opacity-90 transition"
        >
          Read more →
        </Link>
      </div>
    </BooksSection>
  );
};
