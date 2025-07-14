import { defineQuery } from 'next-sanity';

import groq from 'groq';

export const imageFields = /* groq */ `
  asset->{
    _id,
    _ref,
    url
  },
  alt
`;


const authorFields = /* groq */ `
  author->{ _id, firstName, lastName, picture { ${imageFields} } }
`;

const linkReference = /* groq */ `
  _type,
  _key,
  "pageSlug": page->slug.current,
  "blogSlug": blog->slug.current,
  "devotionalSlug": devotional->slug.current,
  "bookSlug": book->slug.current,
  href,
  openInNewTab
`;



const linkFields = /* groq */ `
  link {
    ...,
    ${linkReference}
  }
`;

const baseBlogFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage { ${imageFields} },
  publicationDate,
  ${authorFields}
`;

const baseDevotionalFields = /* groq */ `
  _id,
  _type,
  title,
  slug { current },
  scriptureReference,
  coverImage { ${imageFields} },
  publicationDate,
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
  publicationDate,
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
    ogImage { ${imageFields} },
    backgroundImage { ${imageFields} },
    logo { ${imageFields} }
  }
`);

// Page Queries
export const getPageQuery = `
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
        link {
          ...,
          _type == "link" => {
            _type,
            _key,
            "pageSlug": page->slug.current,
            "blogSlug": blog->slug.current,
            "devotionalSlug": devotional->slug.current,
            "bookSlug": book->slug.current,
            href,
            openInNewTab
          }
        }
      },
      _type == "infoSection" => {
        content[] {
          ...,
          markDefs[] {
            ...,
            _type == "link" => {
              _type,
              _key,
              "pageSlug": page->slug.current,
              "blogSlug": blog->slug.current,
              "devotionalSlug": devotional->slug.current,
              "bookSlug": book->slug.current,
              href,
              openInNewTab
            }
          }
        }
      }
    }
  }
`;


// Sitemap Query
export const sitemapData = defineQuery(`
  *[(_type in ["page", "blog", "devotional", "book"]) && defined(slug.current)] | order(_type asc){
    "slug": slug.current,
    _type,
    _updatedAt
  }
`);

// Blog Queries
export const allBlogsQuery = defineQuery(`
  *[_type == "blog" && defined(slug.current)] | order(publicationDate desc, _updatedAt desc){
    ${baseBlogFields}
  }
`);

export const singleBlogQuery = defineQuery(`
  *[_type == "blog" && slug.current == $slug][0]{
    content[]{
      ...,
      markDefs[]{ ..., ${linkReference} }
    },
    ${baseBlogFields}
  }
`);

export const moreBlogsQuery = defineQuery(`
  *[_type == "blog" && _id != $skip && defined(slug.current)] | order(publicationDate desc, _updatedAt desc)[0...$limit]{
    ${baseBlogFields}
  }
`);

export const blogSlugs = defineQuery(`
  *[_type == "blog" && defined(slug.current)]{
    "slug": slug.current
  }
`);

// Devotional Queries
export const allDevotionalsQuery = defineQuery(`
  *[_type == "devotional" && defined(slug.current)] | order(publicationDate desc, _updatedAt desc){
    ${baseDevotionalFields}
  }
`);

export const moreDevotionalsQuery = defineQuery(`
  *[_type == "devotional" && _id != $skip && defined(slug.current)] | order(publicationDate desc, _updatedAt desc)[0...$limit]{
    ${baseDevotionalFields}
  }
`);

export const singleDevotionalQuery = defineQuery(`
  *[_type == "devotional" && slug.current == $slug][0]{
    content[] {
      _type,
      _key,
      style,
      children[] { _type, _key, text, marks },
      markDefs[] {
        _type,
        _key,
        "pageSlug": page->slug.current,
        "blogSlug": blog->slug.current,
        "devotionalSlug": devotional->slug.current,
        "bookSlug": book->slug.current,
        href,
        openInNewTab
      }
    },
    ${baseDevotionalFields}
  }
`);


export const devotionalSlugs = defineQuery(`
  *[_type == "devotional" && defined(slug.current)]{
    slug { current }
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
    content[]{
      ...,
      markDefs[]{ ..., ${linkReference} }
    },
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