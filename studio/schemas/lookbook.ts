import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  name: 'lookbook',
  title: 'Lookbook / Koleksi',
  type: 'document',
  icon: () => '📸',
  fields: [
    defineField({
      name: 'title',
      title: 'Nama Koleksi',
      type: 'string',
      description: 'Contoh: "Summer Drop 2026", "Kolaborasi Vol.1"',
      validation: (Rule) => Rule.required().min(3).max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug URL',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Deskripsi',
      type: 'text',
      rows: 4,
      description: 'Cerita di balik koleksi ini',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      description: 'Gambar utama koleksi (rekomendasi: 1200x800px)',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Galeri Foto',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'caption', type: 'string', title: 'Keterangan' },
            { name: 'alt', type: 'string', title: 'Alt Text' },
          ],
        }),
      ],
    }),
    defineField({
      name: 'products',
      title: 'Produk Terkait',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'product' }] }],
      description: 'Produk yang termasuk dalam koleksi ini',
    }),
    defineField({
      name: 'releaseDate',
      title: 'Tanggal Rilis',
      type: 'date',
    }),
    defineField({
      name: 'aktif',
      title: 'Tampilkan di Website?',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: 'Terbaru',
      name: 'releaseDateDesc',
      by: [{ field: 'releaseDate', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'coverImage',
      date: 'releaseDate',
      active: 'aktif',
    },
    prepare({ title, media, date, active }) {
      return {
        title: `${active === false ? '🔴 ' : ''}${title}`,
        subtitle: date ? new Date(date).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) : '',
        media,
      }
    },
  },
})
