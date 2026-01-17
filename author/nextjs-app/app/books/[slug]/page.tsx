import { sanityFetch } from "@/sanity/lib/live";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import DateComponent from "@/app/components/Date";
import CoverImage from "@/app/components/CoverImage";

export default async function BookPage({
  params,
}: {
  // Next.js 15 now passes params as a Promise
  params: Promise<{ slug: string }>;
}) {
  // await the promise to get your slug
  const { slug } = await params;

  const bookFields = `
    _id,
    "status": select(_originalId in path("drafts.**") => "draft", "published"),
    "title": coalesce(title, "Untitled"),
    "slug": slug.current,
    description,
    excerpt,
    coverImage {
      asset-> {
        url
      }
    },
    "publicationDate": publicationDate,
    isbn,
    amazonLink,
    "date": coalesce(date, _updatedAt),
    "author": author->{
      firstName,
      lastName,
      picture {
        asset-> {
          url
        }
      }
    }
  `;

  const { data: book } = await sanityFetch({
    query: `*[_type == "book" && slug.current == $slug][0]{ ${bookFields} }`,
    params: { slug },
  });

  if (!book) {
    notFound();
  }

  return (
    <div className="container mx-auto py-12 lg:py-24 bg-white">
      <article className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-[300px_1fr] gap-8 lg:gap-12">
          {/* Left column - Cover Image */}
          <div className="flex flex-col items-center md:items-start">
            {book.coverImage?.asset?.url && (
              <div className="relative aspect-[3/4] w-full max-w-[300px] rounded-lg overflow-hidden shadow-lg bg-cream-100">
                <CoverImage
                  image={book.coverImage}
                  imgClassName="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Right column - All details */}
          <div className="flex flex-col">
            {book.status === "draft" && (
              <span className="text-xs uppercase text-brown-400 mb-2">Draft</span>
            )}

            <h1 className="text-3xl md:text-4xl font-bold text-brown-800 mb-2">
              {book.title}
            </h1>

            {book.author && (
              <p className="text-lg text-brown-600 mb-1">
                by {book.author.firstName} {book.author.lastName}
              </p>
            )}

            {book.publicationDate && (
              <p className="text-sm text-brown-500 mb-4">
                Published <DateComponent dateString={book.publicationDate} />
              </p>
            )}

            {/* Prominent Amazon Button */}
            {book.amazonLink && (
              <a
                href={book.amazonLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-gold-500 hover:bg-gold-600 text-white font-medium px-6 py-3 rounded-lg transition-colors shadow-sm hover:shadow-md w-fit mb-6"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93s3.06-7.44 7-7.93v15.86zm2-15.86c1.03.13 2 .45 2.87.93H13v-.93zM13 7h5.24c.25.31.48.65.68 1H13V7zm0 3h6.74c.08.33.15.66.19 1H13v-1zm0 9.93V19h2.87c-.87.48-1.84.8-2.87.93zM18.24 17H13v-1h5.92c-.2.35-.43.69-.68 1zm1.5-3H13v-1h6.93c-.04.34-.11.67-.19 1z"/>
                </svg>
                Start Reading
              </a>
            )}

            {/* About This Book */}
            {book.description && (
              <div className="prose max-w-none mb-6">
                <h2 className="text-xl font-semibold text-brown-800 mb-3">About This Book</h2>
                <PortableText value={book.description} />
              </div>
            )}

            {/* Excerpt */}
            {book.excerpt && (
              <blockquote className="italic border-l-4 border-gold-400 pl-4 text-brown-700 mb-6">
                {book.excerpt}
              </blockquote>
            )}

            {/* ISBN */}
            {book.isbn && (
              <p className="text-sm text-brown-500">
                <span className="font-medium">ISBN:</span> {book.isbn}
              </p>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}
