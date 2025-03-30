import {DocumentTextIcon} from '@sanity/icons'
import {format, parseISO} from 'date-fns'
import {defineField, defineType} from 'sanity'

/**
 * Book schema.  Define and edit the fields for the 'book' content type.
 * Learn more: https://www.sanity.io/docs/schema-types
 */

export const book = defineType({
    name: 'book',
    title: 'Book',
    icon: DocumentTextIcon,
    type: 'document',
    fields: [
      defineField({
        name: 'title',
        title: 'Title',
        type: 'string',
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'slug',
        title: 'Slug',
        type: 'slug',
        description: 'A slug is required for the post to show up in the preview',
        options: {
          source: 'title',
          maxLength: 96,
          isUnique: (value, context) => context.defaultIsUnique(value, context),
        },
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'description',
        title: 'Description',
        type: 'blockContent',
      }),
      defineField({
        name: 'excerpt',
        title: 'Excerpt',
        type: 'text',
      }),
      defineField({
        name: 'coverImage',
        title: 'Cover Image',
        type: 'image',
        options: {
          hotspot: true,
          aiAssist: {
            imageDescriptionField: 'alt',
          },
        },
        fields: [
          {
            name: 'alt',
            type: 'string',
            title: 'Alternative text',
            description: 'Important for SEO and accessibility.',
            validation: (rule) =>
              rule.custom((alt, context) => {
                if ((context.document?.coverImage as any)?.asset?._ref && !alt) {
                  return 'Required'
                }
                return true
              }),
          },
        ],
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: 'date',
        title: 'Date',
        type: 'datetime',
        initialValue: () => new Date().toISOString(),
      }),
      // New Publication Details
      defineField({
        name: 'publicationDate',
        title: 'Publication Date',
        type: 'date',
        description: 'When the book was published',
      }),
      defineField({
        name: 'isbn',
        title: 'ISBN',
        type: 'string',
        description: 'International Standard Book Number',
      }),
      defineField({
        name: 'amazonLink',
        title: 'Amazon Link',
        type: 'url',
        description: 'Link to the book on Amazon',
      }),
      defineField({
        name: 'author',
        title: 'Author',
        type: 'reference',
        to: [{ type: 'person' }],
      }),
    ],
    preview: {
      select: {
        title: 'title',
        authorFirstName: 'author.firstName',
        authorLastName: 'author.lastName',
        date: 'date',
        media: 'coverImage',
      },
      prepare({ title, media, authorFirstName, authorLastName, date }) {
        const subtitles = [
          authorFirstName && authorLastName && `by ${authorFirstName} ${authorLastName}`,
          date && `on ${format(parseISO(date), 'LLL d, yyyy')}`,
        ].filter(Boolean)
    
        return { title, media, subtitle: subtitles.join(' ') }
      },
    },
  })
  