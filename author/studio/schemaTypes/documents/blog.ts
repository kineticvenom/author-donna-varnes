import { defineType, defineField } from 'sanity';
import { DocumentTextIcon } from '@sanity/icons';
import { format, parseISO } from 'date-fns';

export const blog = defineType({
  name: 'blog',
  title: 'Blog Post',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({ name: 'title', type: 'string', validation: Rule => Rule.required() }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: Rule => Rule.required(),
    }),
    defineField({ name: 'excerpt', type: 'text' }),
    defineField({
      name: 'coverImage',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for accessibility and SEO.',
          validation: rule =>
            rule.custom((alt, context) => {
              if ((context.document?.coverImage as any)?.asset?._ref && !alt) {
                return 'Required';
              }
              return true;
            }),
        },
      ],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'publicationDate',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'author',
      type: 'reference',
      to: [{ type: 'person' }],
    }),
    defineField({ name: 'content', type: 'blockContent' }),
  ],
  preview: {
    select: {
      title: 'title',
      authorFirstName: 'author.firstName',
      authorLastName: 'author.lastName',
      date: 'publicationDate',
      media: 'coverImage',
    },
    prepare({ title, media, authorFirstName, authorLastName, date }) {
      const subtitles = [
        authorFirstName && authorLastName && `by ${authorFirstName} ${authorLastName}`,
        date && `on ${format(parseISO(date), 'LLL d, yyyy')}`,
      ].filter(Boolean);

      return {
        title,
        media,
        subtitle: subtitles.join(' • '),
      };
    },
  },
});
