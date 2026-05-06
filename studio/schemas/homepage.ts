import { defineField, defineType } from 'sanity'

export const homepage = defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  fields: [
    defineField({
      name: 'heroVideo',
      title: 'Hero Video URL (optional, falls back to image)',
      type: 'url',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image (fallback if no video)',
      type: 'image',
    }),
    defineField({
      name: 'featuredCollection',
      title: 'Featured Collection (Latest Drop)',
      type: 'reference',
      to: [{ type: 'collection' }],
    }),
    defineField({
      name: 'lookbookImages',
      title: 'Lookbook Images',
      type: 'array',
      validation: (r) => r.max(8),
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'image', type: 'image' }),
          defineField({ name: 'caption', type: 'string' }),
        ],
      }],
    }),
    defineField({
      name: 'closingStatement',
      title: 'Closing Statement',
      type: 'string',
      initialValue: 'BUILT FOR THOSE WHO MOVE DIFFERENTLY',
    }),
  ],
})
