import { sanityFetch } from "@/sanity/lib/live";
import { allBooksQuery } from "@/sanity/lib/queries";
import CoverImage from "@/app/components/CoverImage";
import Link from "next/link";
import DateComponent from "@/app/components/Date";

export default async function BooksPage() {
  const { data: books } = await sanityFetch({ query: allBooksQuery });

  return (
    <div className="container py-12 lg:py-24 bg-white">
      <h1 className="text-5xl font-bold mb-2">Stories of Faith & Wonder</h1>
      <p className="text-lg text-brown-600 mb-8">Books to encourage your heart and strengthen your faith</p>
      <div className="grid gap-8">
        {books.map((book) => (
          <Link
            key={book._id}
            href={`/books/${book.slug}`}
            className="group block cursor-pointer"
          >
            <article className="grid grid-cols-[96px_1fr] gap-4 md:grid-cols-[160px_1fr] md:gap-6 p-4 rounded-lg border border-transparent hover:border-gold-300 hover:bg-cream-50 transition-all">
              <div className="relative aspect-[3/4] rounded-md bg-cream-100 flex items-center justify-center">
                <CoverImage
                  image={book.coverImage ?? null}
                  imgClassName="h-full w-full object-contain"
                />
              </div>
              <div className="flex flex-col gap-2 article-text">
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gold-600 uppercase tracking-wider text-xs font-semibold">
                    Book
                  </span>
                  <span className="text-cream-400">•</span>
                  <DateComponent dateString={book.publicationDate} />
                </div>
                <h2 className="text-2xl font-semibold text-accent group-hover:underline transition-colors">
                  {book.title}
                </h2>
                {book.description && (
                  <p className="mt-1 text-sm text-brown-600 line-clamp-3 group-hover:text-brown-700 transition-colors">
                    {book.description}
                  </p>
                )}
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
