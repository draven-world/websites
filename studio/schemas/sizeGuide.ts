import { defineField, defineType } from 'sanity'

export const sizeGuide = defineType({
  name: 'sizeGuide',
  title: 'Size Guide',
  type: 'document',
  fields: [
    defineField({ name: 'intro', title: 'Intro', type: 'text' }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'garmentType', title: 'Garment Type', type: 'string' }),
          defineField({ name: 'note', title: 'Note', type: 'text' }),
          defineField({
            name: 'measurements',
            title: 'Measurements',
            type: 'array',
            of: [{
              type: 'object',
              fields: [
                defineField({ name: 'size', type: 'string' }),
                defineField({ name: 'chest', type: 'string' }),
                defineField({ name: 'length', type: 'string' }),
                defineField({ name: 'sleeve', type: 'string' }),
              ],
            }],
          }),
        ],
      }],
    }),
  ],
})
