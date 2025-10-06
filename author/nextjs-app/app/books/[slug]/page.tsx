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

  if (!book) return (<div className="text-center py-20">
        <h1>404 - Page Not Found</h1>
        <p>The page does not exist.</p>
      </div>
    );

  return (
    <div className="container mx-auto py-12 text-shadow">
      <article className="prose lg:prose-xl">
        <h1 className="text-4xl font-bold text-gray-900">{book.title}</h1>

        {book.status && (
          <p className="text-xs uppercase text-gray-400">Status: {book.status}</p>
        )}

        {book.publicationDate && (
          <p className="text-sm text-gray-500">
            Published: <DateComponent dateString={book.publicationDate} />
          </p>
        )}

        {book.coverImage?.asset?.url && (
          <CoverImage
            image={book.coverImage}
            
          />
        )}

        {book.author && (
          <div className="mt-4 flex items-center gap-3">
            {book.author.picture?.asset?.url && (
              <CoverImage
                image={book.author.picture.asset.url}
              
              />
            )}
            <span className="text-sm text-gray-600">
              By {book.author.firstName} {book.author.lastName}
            </span>
          </div>
        )}

        {book.description && (
          <div className="mt-6">
            <PortableText value={book.description} />
          </div>
        )}

        {book.excerpt && (
          <blockquote className="mt-6 italic border-l-4 border-gray-300 pl-4 text-gray-700">
            {book.excerpt}
          </blockquote>
        )}

        <div className="mt-6 space-y-2 text-sm">
          {book.isbn && <p><strong>ISBN:</strong> {book.isbn}</p>}
          {book.amazonLink && (
            <p>
              <strong>Buy:</strong>{" "}
              <a
                href={book.amazonLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                View on Amazon
              </a>
            </p>
          )}
        </div>
      </article>
    </div>
  );
}
