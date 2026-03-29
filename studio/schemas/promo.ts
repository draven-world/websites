import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'promo',
  title: 'Promo',
  type: 'document',
  icon: () => '🏷️',
  fieldsets: [
    { name: 'periode', title: 'Periode Promo', options: { columns: 2 } },
  ],
  fields: [
    defineField({
      name: 'nama',
      title: 'Nama Promo',
      type: 'string',
      description: 'Contoh: "Flash Sale Ramadan", "Diskon Akhir Tahun"',
      validation: (Rule) => Rule.required().min(3).max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug URL',
      type: 'slug',
      description: 'URL halaman promo. Klik Generate untuk buat otomatis dari nama.',
      options: { source: 'nama', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'deskripsi',
      title: 'Deskripsi',
      type: 'text',
      rows: 3,
      description: 'Penjelasan singkat tentang promo ini',
      validation: (Rule) => Rule.max(500),
    }),
    defineField({
      name: 'syaratKetentuan',
      title: 'Syarat & Ketentuan',
      type: 'text',
      rows: 5,
      description: 'Detail syarat dan ketentuan promo (opsional)',
    }),
    defineField({
      name: 'tanggalMulai',
      title: 'Tanggal Mulai',
      type: 'datetime',
      description: 'Kapan promo mulai berlaku',
      fieldset: 'periode',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tanggalSelesai',
      title: 'Tanggal Selesai',
      type: 'datetime',
      description: 'Kapan promo berakhir',
      fieldset: 'periode',
      validation: (Rule) =>
        Rule.required().min(Rule.valueOfField('tanggalMulai')),
    }),
    defineField({
      name: 'banner',
      title: 'Banner Promo',
      type: 'image',
      description: 'Ukuran rekomendasi: 1200×600px. Tampil di halaman promo.',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'aktif',
      title: 'Tampilkan di Website?',
      type: 'boolean',
      description: 'Nonaktifkan untuk menyembunyikan promo tanpa menghapus',
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: 'Terbaru',
      name: 'tanggalDesc',
      by: [{ field: 'tanggalMulai', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'nama',
      media: 'banner',
      start: 'tanggalMulai',
      end: 'tanggalSelesai',
      active: 'aktif',
    },
    prepare({ title, media, start, end, active }) {
      const formatDate = (d: string) =>
        d ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '?'
      return {
        title: `${active === false ? '🔴 ' : ''}${title}`,
        subtitle: `${formatDate(start)} — ${formatDate(end)}`,
        media,
      }
    },
  },
})
