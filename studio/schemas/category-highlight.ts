import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'categoryHighlight',
  title: 'Kategori Unggulan',
  type: 'document',
  icon: () => '📁',
  fieldsets: [
    { name: 'settings', title: 'Pengaturan', options: { collapsible: true } },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Nama Kategori',
      type: 'string',
      description: 'Contoh: "Kaos", "Hoodie", "Aksesoris", "Celana"',
      validation: (Rule) => Rule.required().min(2).max(50),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Digunakan untuk filter produk. Klik Generate untuk buat otomatis.',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Gambar Kategori',
      type: 'image',
      description: 'Ukuran rekomendasi: 600×600px (kotak). Tampil di homepage.',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Deskripsi Singkat',
      type: 'string',
      description: 'Satu kalimat penjelasan kategori ini',
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'urutan',
      title: 'Urutan Tampil',
      type: 'number',
      description: 'Angka lebih kecil tampil lebih dulu',
      initialValue: 0,
      fieldset: 'settings',
      validation: (Rule) => Rule.min(0).integer(),
    }),
    defineField({
      name: 'aktif',
      title: 'Tampilkan di Website?',
      type: 'boolean',
      description: 'Nonaktifkan untuk menyembunyikan dari homepage',
      initialValue: true,
      fieldset: 'settings',
    }),
  ],
  orderings: [
    {
      title: 'Urutan Tampil',
      name: 'urutanAsc',
      by: [{ field: 'urutan', direction: 'asc' }],
    },
    {
      title: 'Nama A-Z',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
      active: 'aktif',
      order: 'urutan',
    },
    prepare({ title, media, active, order }) {
      return {
        title: `${active === false ? '🔴 ' : '🟢 '}${title}`,
        subtitle: `Urutan: ${order ?? 0}`,
        media,
      }
    },
  },
})
