import { defineField, defineType } from 'sanity';
import { LinkIcon } from '@sanity/icons';

/**
 * Link schema object. This link object lets the user first select the type of link and then
 * enter the URL, page reference, blog reference, devotional reference, or book reference - depending on the type selected.
 * Learn more: https://www.sanity.io/docs/object-type
 */
export const link = defineType({
  name: 'link',
  title: 'Link',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'linkType',
      title: 'Link Type',
      type: 'string',
      initialValue: 'url',
      options: {
        list: [
          { title: 'URL', value: 'href' },
          { title: 'Page', value: 'page' },
          { title: 'Blog', value: 'blog' },
          { title: 'Devotional', value: 'devotional' },
          { title: 'Book', value: 'book' },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'href',
      title: 'URL',
      type: 'url',
      hidden: ({ parent }) => parent?.linkType !== 'href',
      validation: (Rule) =>
        Rule.custom((value, context: any) => {
          if (context.parent?.linkType === 'href' && !value) {
            return 'URL is required when Link Type is URL';
          }
          return true;
        }),
    }),
    defineField({
      name: 'page',
      title: 'Page',
      type: 'reference',
      to: [{ type: 'page' }],
      hidden: ({ parent }) => parent?.linkType !== 'page',
      validation: (Rule) =>
        Rule.custom((value, context: any) => {
          if (context.parent?.linkType === 'page' && !value) {
            return 'Page reference is required when Link Type is Page';
          }
          return true;
        }),
    }),
    defineField({
      name: 'blog',
      title: 'Blog',
      type: 'reference',
      to: [{ type: 'blog' }],
      hidden: ({ parent }) => parent?.linkType !== 'blog',
      validation: (Rule) =>
        Rule.custom((value, context: any) => {
          if (context.parent?.linkType === 'blog' && !value) {
            return 'Blog reference is required when Link Type is Blog';
          }
          return true;
        }),
    }),
    defineField({
      name: 'devotional',
      title: 'Devotional',
      type: 'reference',
      to: [{ type: 'devotional' }],
      hidden: ({ parent }) => parent?.linkType !== 'devotional',
      validation: (Rule) =>
        Rule.custom((value, context: any) => {
          if (context.parent?.linkType === 'devotional' && !value) {
            return 'Devotional reference is required when Link Type is Devotional';
          }
          return true;
        }),
    }),
    defineField({
      name: 'book',
      title: 'Book',
      type: 'reference',
      to: [{ type: 'book' }],
      hidden: ({ parent }) => parent?.linkType !== 'book',
      validation: (Rule) =>
        Rule.custom((value, context: any) => {
          if (context.parent?.linkType === 'book' && !value) {
            return 'Book reference is required when Link Type is Book';
          }
          return true;
        }),
    }),
    defineField({
      name: 'openInNewTab',
      title: 'Open in new tab',
      type: 'boolean',
      initialValue: false,
    }),
  ],
});