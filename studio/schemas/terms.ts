import { defineField, defineType } from 'sanity'

export const terms = defineType({
  name: 'terms',
  title: 'Terms',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', initialValue: 'Terms' }),
    defineField({ name: 'body', type: 'array', of: [{ type: 'block' }] }),
  ],
})
