import { defineQuery } from "next-sanity";

// Common reusable field blocks
const imageFields = /* groq */ `
  asset->{url},
  alt
`;

const authorFields = /* groq */ `
  author->{
    firstName,
    lastName,
    picture { ${imageFields} }
  }
`;

const linkReference = /* groq */ `
  _type == "link" => {
    "page": page->slug.current,
    "post": post->slug.current
  }
`;

const linkFields = /* groq */ `
  link {
    ...,
    ${linkReference}
  }
`;

const basePostFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage { ${imageFields} },
  "date": coalesce(date, _updatedAt),
  ${authorFields}
`;

const baseBookFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  description,
  excerpt,
  coverImage { ${imageFields} },
  "publicationDate": publicationDate,
  isbn,
  amazonLink,
  "date": coalesce(date, _updatedAt),
  ${authorFields}
`;

// General Site Settings Query
export const settingsQuery = defineQuery(`
  *[_id == "siteSettings"][0]{
    title,
    description,
    ogImage { asset->{ url } },
    backgroundImage { asset->{ url } },
    logo { asset->{ url } }
  }
`);

// Page Queries
export const getPageQuery = defineQuery(`
  *[_type == 'page' && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    heading,
    subheading,
    "pageBuilder": pageBuilder[]{
      ...,
      _type == "callToAction" => { ${linkFields} },
      _type == "infoSection" => {
        content[]{
          ...,
          markDefs[]{ ..., ${linkReference} }
        }
      },
    }
  }
`);

// Sitemap Query
export const sitemapData = defineQuery(`
  *[(_type == "page" || _type == "post") && defined(slug.current)] | order(_type asc){
    "slug": slug.current,
    _type,
    _updatedAt
  }
`);

// Posts Queries with Post Type Filtering
export const allPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc){
    ${basePostFields},
    postType
  }
`);

export const postsByTypeQuery = defineQuery(`
  *[_type == "post" && postType == $type && defined(slug.current)] | order(date desc, _updatedAt desc){
    ${basePostFields}
  }
`);

export const singlePostQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug][0]{
    content[]{
      ...,
      markDefs[]{ ..., ${linkReference} }
    },
    ${basePostFields},
    postType
  }
`);

export const morePostsQuery = defineQuery(`
  *[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc)[0...$limit]{
    ${basePostFields},
    postType
  }
`);

export const postSlugs = defineQuery(`
  *[_type == "post" && defined(slug.current)]{
    "slug": slug.current,
    postType
  }
`);

// Book Queries
export const allBooksQuery = defineQuery(`
  *[_type == "book" && defined(slug.current)] | order(publicationDate desc, _updatedAt desc){
    ${baseBookFields}
  }
`);

export const singleBookQuery = defineQuery(`
  *[_type == "book" && slug.current == $slug][0]{
    content[]{ ..., markDefs[]{ ... } },
    ${baseBookFields}
  }
`);

export const moreBooksQuery = defineQuery(`
  *[_type == "book" && _id != $skip && defined(slug.current)] | order(publicationDate desc, _updatedAt desc)[0...$limit]{
    ${baseBookFields}
  }
`);

export const bookSlugs = defineQuery(`
  *[_type == "book" && defined(slug.current)]{
    "slug": slug.current
  }
`);
