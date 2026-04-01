import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'Testimoni',
  type: 'document',
  icon: () => '⭐',
  fields: [
    defineField({
      name: 'customerName',
      title: 'Nama Pelanggan',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'city',
      title: 'Kota',
      type: 'string',
      description: 'Contoh: Jakarta, Bandung, Surabaya',
    }),
    defineField({
      name: 'rating',
      title: 'Rating',
      type: 'number',
      description: 'Beri rating 1-5 bintang',
      options: {
        list: [
          { title: '⭐ 1', value: 1 },
          { title: '⭐⭐ 2', value: 2 },
          { title: '⭐⭐⭐ 3', value: 3 },
          { title: '⭐⭐⭐⭐ 4', value: 4 },
          { title: '⭐⭐⭐⭐⭐ 5', value: 5 },
        ],
      },
      initialValue: 5,
      validation: (Rule) => Rule.required().min(1).max(5),
    }),
    defineField({
      name: 'text',
      title: 'Isi Testimoni',
      type: 'text',
      rows: 4,
      description: 'Review/feedback dari pelanggan',
      validation: (Rule) => Rule.required().min(10).max(500),
    }),
    defineField({
      name: 'productRef',
      title: 'Produk yang Dibeli',
      type: 'reference',
      to: [{ type: 'product' }],
      description: 'Opsional — hubungkan dengan produk terkait',
    }),
    defineField({
      name: 'photo',
      title: 'Foto Pelanggan / Produk',
      type: 'image',
      description: 'Foto yang dikirim pelanggan (opsional)',
      options: { hotspot: true },
    }),
    defineField({
      name: 'source',
      title: 'Sumber',
      type: 'string',
      options: {
        list: [
          { title: 'WhatsApp', value: 'whatsapp' },
          { title: 'Instagram', value: 'instagram' },
          { title: 'Shopee', value: 'shopee' },
          { title: 'Tokopedia', value: 'tokopedia' },
          { title: 'Website', value: 'website' },
          { title: 'Lainnya', value: 'other' },
        ],
      },
      initialValue: 'whatsapp',
    }),
    defineField({
      name: 'featured',
      title: 'Tampilkan di Homepage?',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'aktif',
      title: 'Aktif?',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: 'Rating Tertinggi',
      name: 'ratingDesc',
      by: [{ field: 'rating', direction: 'desc' }],
    },
    {
      title: 'Terbaru',
      name: 'createdDesc',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      name: 'customerName',
      city: 'city',
      rating: 'rating',
      text: 'text',
      media: 'photo',
      active: 'aktif',
    },
    prepare({ name, city, rating, text, media, active }) {
      const stars = '⭐'.repeat(rating || 0)
      return {
        title: `${active === false ? '🔴 ' : ''}${name}${city ? ` — ${city}` : ''}`,
        subtitle: `${stars} ${text?.substring(0, 60) || ''}...`,
        media,
      }
    },
  },
})
