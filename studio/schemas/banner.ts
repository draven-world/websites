import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'banner',
  title: 'Banner Homepage',
  type: 'document',
  icon: () => '🖼️',
  fieldsets: [
    { name: 'settings', title: 'Pengaturan', options: { collapsible: true } },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Judul Banner',
      type: 'string',
      description: 'Nama internal untuk identifikasi banner (tidak tampil di website)',
      validation: (Rule) => Rule.required().min(3).max(80),
    }),
    defineField({
      name: 'subtitle',
      title: 'Teks di Banner',
      type: 'string',
      description: 'Teks yang tampil di atas gambar banner (opsional)',
      validation: (Rule) => Rule.max(120),
    }),
    defineField({
      name: 'image',
      title: 'Gambar Banner',
      type: 'image',
      description: 'Ukuran rekomendasi: 1920×600px (landscape). Format: JPG/PNG/WebP',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Link Tujuan',
      type: 'url',
      description: 'URL halaman yang dibuka saat banner diklik. Contoh: /products atau /promo',
      validation: (Rule) =>
        Rule.uri({ allowRelative: true, scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'aktif',
      title: 'Tampilkan di Website?',
      type: 'boolean',
      description: 'Nonaktifkan untuk menyembunyikan tanpa menghapus',
      initialValue: true,
      fieldset: 'settings',
    }),
    defineField({
      name: 'urutan',
      title: 'Urutan Tampil',
      type: 'number',
      description: 'Banner dengan angka lebih kecil tampil lebih dulu (0, 1, 2, ...)',
      initialValue: 0,
      fieldset: 'settings',
      validation: (Rule) => Rule.min(0).integer(),
    }),
  ],
  orderings: [
    {
      title: 'Urutan Tampil',
      name: 'urutanAsc',
      by: [{ field: 'urutan', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'subtitle',
      media: 'image',
      active: 'aktif',
      order: 'urutan',
    },
    prepare({ title, subtitle, media, active, order }) {
      return {
        title: `${active === false ? '🔴 ' : '🟢 '}${title}`,
        subtitle: subtitle || `Urutan: ${order ?? 0}`,
        media,
      }
    },
  },
})
