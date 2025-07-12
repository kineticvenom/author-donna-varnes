import { defineType, defineField, defineArrayMember } from 'sanity';

export const navigationSettings = defineType({
  name: 'navigationSettings',
  title: 'Navigation Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'mainNav',
      title: 'Main Navigation',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'link',
              title: 'Link',
              type: 'link', // assumes you're using your custom 'link' object
            }),
          ],
        }),
      ],
    }),
  ],
});
