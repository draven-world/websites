import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'gallery',
  title: 'Galeri',
  type: 'document',
  icon: () => '🖼️',
  fields: [
    defineField({
      name: 'image',
      title: 'Foto',
      type: 'image',
      description: 'Foto produk dipakai di komunitas (rekomendasi: 1200x1500px / portrait)',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Keterangan',
      type: 'string',
      description: 'Singkat — muncul saat hover. Contoh: "Streetwear di kota tua".',
      validation: (Rule) => Rule.max(140),
    }),
    defineField({
      name: 'credit',
      title: 'Kredit Foto / Pemilik',
      type: 'string',
      description: 'Contoh: "@username" atau "Foto oleh ..."',
    }),
    defineField({
      name: 'creditUrl',
      title: 'Link Kredit',
      type: 'url',
      description: 'Link ke profil Instagram atau sumber foto (opsional)',
    }),
    defineField({
      name: 'product',
      title: 'Produk yang Dipakai',
      type: 'reference',
      to: [{ type: 'product' }],
      description: 'Klik foto akan membuka halaman produk ini (opsional)',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
      description: 'Contoh: "streetwear", "outerwear", "summer"',
    }),
    defineField({
      name: 'featured',
      title: 'Tampilkan Lebih Besar?',
      type: 'boolean',
      description: 'Jika ON, foto ini muncul lebih besar di grid masonry',
      initialValue: false,
    }),
    defineField({
      name: 'aktif',
      title: 'Tampilkan di Website?',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'urutan',
      title: 'Urutan',
      type: 'number',
      description: 'Angka kecil tampil duluan. Kosongkan untuk pakai tanggal upload.',
    }),
    defineField({
      name: 'tanggalUpload',
      title: 'Tanggal Upload',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  orderings: [
    {
      title: 'Urutan manual',
      name: 'urutanAsc',
      by: [
        { field: 'urutan', direction: 'asc' },
        { field: 'tanggalUpload', direction: 'desc' },
      ],
    },
    {
      title: 'Terbaru',
      name: 'tanggalDesc',
      by: [{ field: 'tanggalUpload', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'caption',
      credit: 'credit',
      media: 'image',
      active: 'aktif',
      featured: 'featured',
    },
    prepare({ title, credit, media, active, featured }) {
      const flags = [
        active === false ? '🔴' : null,
        featured ? '⭐' : null,
      ]
        .filter(Boolean)
        .join(' ')
      return {
        title: `${flags ? flags + ' ' : ''}${title || credit || 'Foto Galeri'}`,
        subtitle: credit || '',
        media,
      }
    },
  },
})
