import { defineQuery } from "next-sanity";
import groq from "groq";

export const imageFields = /* groq */ `
  asset->{
    _id,
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

/* ---------------- Base field fragments ---------------- */

const baseBlogFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  slug { current },
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
  _type,
  _createdAt,
  _updatedAt,
  _rev,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  slug { current },
  description,
  excerpt,
  coverImage { ${imageFields} },
  publicationDate,
  isbn,
  amazonLink,
  "date": coalesce(date, _updatedAt),
  ${authorFields}
`;

/* ---------------- Settings ---------------- */

export const settingsQuery = defineQuery(/* groq */ `
  *[_id == "siteSettings"][0]{
    title,
    description,
    ogImage { ${imageFields} },
    backgroundImage { ${imageFields} },
    logo { ${imageFields} }
  }
`);

/* ---------------- Pages ---------------- */

export const getPageQuery = /* groq */ `
  *[_type == 'page' && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug { current },
    heading,
    subheading,
    "pageBuilder": pageBuilder[] {
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

/* ---------------- Sitemap ---------------- */

export const sitemapData = defineQuery(/* groq */ `
  *[(_type in ["page", "blog", "devotional", "book"]) && defined(slug.current)] | order(_type asc){
    slug { current },
    _type,
    _updatedAt
  }
`);

/* ---------------- Blogs ---------------- */

export const allBlogsQuery = defineQuery(/* groq */ `
  *[_type == "blog" && defined(slug.current)] | order(publicationDate desc, _updatedAt desc){
    ${baseBlogFields}
  }
`);

export const singleBlogQuery = defineQuery(/* groq */ `
  *[_type == "blog" && slug.current == $slug][0]{
    content[] {
      ...,
      markDefs[]{ ..., ${linkReference} }
    },
    ${baseBlogFields}
  }
`);

export const moreBlogsQuery = defineQuery(/* groq */ `
  *[_type == "blog" && _id != $skip && defined(slug.current)] 
  | order(publicationDate desc, _updatedAt desc)[0...$limit]{
    ${baseBlogFields}
  }
`);

export const blogSlugs = defineQuery(/* groq */ `
  *[_type == "blog" && defined(slug.current)]{
    slug { current }
  }
`);

/* ---------------- Devotionals ---------------- */

export const allDevotionalsQuery = defineQuery(/* groq */ `
  *[_type == "devotional" && defined(slug.current)] | order(publicationDate desc, _updatedAt desc){
    ${baseDevotionalFields}
  }
`);

export const moreDevotionalsQuery = defineQuery(/* groq */ `
  *[_type == "devotional" && _id != $skip && defined(slug.current)] 
  | order(publicationDate desc, _updatedAt desc)[0...$limit]{
    ${baseDevotionalFields}
  }
`);

export const singleDevotionalQuery = defineQuery(/* groq */ `
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

export const devotionalSlugs = defineQuery(/* groq */ `
  *[_type == "devotional" && defined(slug.current)]{
    slug { current }
  }
`);

/* ---------------- Books ---------------- */

export const allBooksQuery = defineQuery(/* groq */ `
  *[_type == "book" && defined(slug.current)] | order(publicationDate desc, _updatedAt desc){
    ${baseBookFields}
  }
`);

export const singleBookQuery = defineQuery(/* groq */ `
  *[_type == "book" && slug.current == $slug][0]{
    content[] {
      ...,
      markDefs[]{ ..., ${linkReference} }
    },
    ${baseBookFields}
  }
`);

export const moreBooksQuery = defineQuery(/* groq */ `
  *[_type == "book" && _id != $skip && defined(slug.current)] 
  | order(publicationDate desc, _updatedAt desc)[0...$limit]{
    ${baseBookFields}
  }
`);

export const bookSlugs = defineQuery(/* groq */ `
  *[_type == "book" && defined(slug.current)]{
    slug { current }
  }
`);
