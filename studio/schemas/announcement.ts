import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'announcement',
  title: 'Announcement Bar',
  type: 'document',
  icon: () => '📢',
  fields: [
    defineField({
      name: 'text',
      title: 'Teks Pengumuman',
      type: 'string',
      description: 'Teks singkat yang tampil di bar atas website. Maksimal 100 karakter.',
      validation: (Rule) => Rule.required().min(5).max(100),
    }),
    defineField({
      name: 'link',
      title: 'Link Tujuan',
      type: 'url',
      description: 'Opsional — pengunjung bisa klik pengumuman untuk buka link ini',
      validation: (Rule) =>
        Rule.uri({ allowRelative: true, scheme: ['http', 'https'] }),
    }),
    defineField({
      name: 'bgColor',
      title: 'Warna Background',
      type: 'string',
      description: 'Warna latar belakang bar pengumuman',
      options: {
        list: [
          { title: '⬛ Hitam', value: 'black' },
          { title: '🔵 Biru (Brand)', value: 'brand' },
          { title: '🟢 Hijau', value: 'green' },
          { title: '🔴 Merah', value: 'red' },
          { title: '🟡 Kuning', value: 'yellow' },
        ],
        layout: 'radio',
      },
      initialValue: 'black',
    }),
    defineField({
      name: 'aktif',
      title: 'Tampilkan di Website?',
      type: 'boolean',
      description: 'Hanya satu pengumuman yang aktif akan tampil. Nonaktifkan yang lain.',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'text',
      active: 'aktif',
      color: 'bgColor',
    },
    prepare({ title, active, color }) {
      return {
        title: `${active === false ? '🔴 ' : '🟢 '}${title}`,
        subtitle: `Warna: ${color || 'black'}`,
      }
    },
  },
})
