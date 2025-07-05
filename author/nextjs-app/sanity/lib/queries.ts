import { defineQuery } from "next-sanity";

export const settingsQuery = defineQuery(`*[_id == "siteSettings"][0]{
  title,
  description,
  ogImage {
    asset -> {
      url
    }
  },
  backgroundImage {
    asset -> {
      url
    }
  },
  logo {
    asset -> {
      url
    }
  }
}`);


const postFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  "date": coalesce(date, _updatedAt),
  "author": author->{firstName, lastName, picture},
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
      _type == "callToAction" => {
        ${linkFields},
      },
      _type == "infoSection" => {
        content[]{
          ...,
          markDefs[]{
            ...,
            ${linkReference}
          }
        }
      },
    },
  }
`);

export const sitemapData = defineQuery(`
  *[_type == "page" || _type == "post" && defined(slug.current)] | order(_type asc) {
    "slug": slug.current,
    _type,
    _updatedAt,
  }
`);

export const allPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) {
    ${postFields}
  }
`);

export const morePostsQuery = defineQuery(`
  *[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [0...$limit] {
    ${postFields}
  }
`);

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug] [0] {
    content[]{
    ...,
    markDefs[]{
      ...,
      ${linkReference}
    }
  },
    ${postFields}
  }
`);

export const postPagesSlugs = defineQuery(`
  *[_type == "post" && defined(slug.current)]
  {"slug": slug.current}
`);

export const pagesSlugs = defineQuery(`
  *[_type == "page" && defined(slug.current)]
  {"slug": slug.current}
`);


const bookFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  description,
  excerpt,
  coverImage,
  "publicationDate": publicationDate,
  isbn,
  amazonLink,
  "date": coalesce(date, _updatedAt),
  "author": author->{
    firstName,
    lastName,
    picture
  }
`;

export const allBooksQuery = defineQuery(`
  *[_type == "book" && defined(slug.current)] | order(publicationDate desc, _updatedAt desc) {
    ${bookFields}
  }
`);

export const moreBooksQuery = defineQuery(`
  *[_type == "book" && _id != $skip && defined(slug.current)] | order(publicationDate desc, _updatedAt desc) [0...$limit] {
    ${bookFields}
  }
`);

export const bookQuery = defineQuery(`
  *[_type == "book" && slug.current == $slug][0] {
    content[]{
      ...,
      markDefs[]{
        ...
      }
    },
    ${bookFields}
  }
`);

export const bookPagesSlugs = defineQuery(`
  *[_type == "book" && defined(slug.current)]
  {"slug": slug.current}
`);
