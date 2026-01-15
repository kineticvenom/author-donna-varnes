import { sanityFetch } from "@/sanity/lib/live";
import { allBooksQuery } from "@/sanity/lib/queries";
import CoverImage from "@/app/components/CoverImage";
import Link from "next/link";
import DateComponent from "@/app/components/Date";

export default async function BooksPage() {
  const { data: books } = await sanityFetch({ query: allBooksQuery });

  return (
    <div className="container py-12 lg:py-24 bg-white">
      <h1 className="text-5xl font-bold mb-6">Books</h1>
      <div className="grid gap-12">
        {books.map((book) => (
          <article key={book._id} className="article-row">
            <CoverImage image={book.coverImage ?? null} />
            <div className="article-text">
              <h2 className="text-3xl font-semibold mt-4">
                <Link href={`/books/${book.slug}`}>{book.title}</Link>
              </h2>
              <DateComponent dateString={book.publicationDate} />
              {book.description && (
                <p className="mt-2 text-brown-600">{book.description}</p>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
