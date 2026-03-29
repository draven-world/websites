import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  icon: () => '❓',
  fields: [
    defineField({
      name: 'question',
      title: 'Pertanyaan',
      type: 'string',
      description: 'Tulis pertanyaan yang sering ditanyakan pelanggan',
      validation: (Rule) => Rule.required().min(10).max(200),
    }),
    defineField({
      name: 'answer',
      title: 'Jawaban',
      type: 'text',
      rows: 5,
      description: 'Jawaban lengkap dan jelas untuk pertanyaan di atas',
      validation: (Rule) => Rule.required().min(20).max(1000),
    }),
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'string',
      description: 'Kelompokkan FAQ berdasarkan topik',
      options: {
        list: [
          { title: '🛒 Pemesanan', value: 'pemesanan' },
          { title: '💳 Pembayaran', value: 'pembayaran' },
          { title: '🚚 Pengiriman', value: 'pengiriman' },
          { title: '🔄 Pengembalian & Refund', value: 'pengembalian' },
          { title: '📦 Produk', value: 'produk' },
          { title: '👤 Akun', value: 'akun' },
          { title: '📋 Lainnya', value: 'lainnya' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'lainnya',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'urutan',
      title: 'Urutan Tampil',
      type: 'number',
      description: 'FAQ dengan angka lebih kecil tampil lebih dulu dalam kategorinya',
      initialValue: 0,
      validation: (Rule) => Rule.min(0).integer(),
    }),
  ],
  orderings: [
    {
      title: 'Kategori lalu Urutan',
      name: 'categoryOrder',
      by: [
        { field: 'category', direction: 'asc' },
        { field: 'urutan', direction: 'asc' },
      ],
    },
    {
      title: 'Urutan',
      name: 'urutanAsc',
      by: [{ field: 'urutan', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'question',
      category: 'category',
      order: 'urutan',
    },
    prepare({ title, category, order }) {
      const categoryLabels: Record<string, string> = {
        pemesanan: '🛒 Pemesanan',
        pembayaran: '💳 Pembayaran',
        pengiriman: '🚚 Pengiriman',
        pengembalian: '🔄 Pengembalian',
        produk: '📦 Produk',
        akun: '👤 Akun',
        lainnya: '📋 Lainnya',
      }
      return {
        title,
        subtitle: `${categoryLabels[category] || category || 'Tanpa kategori'} · #${order ?? 0}`,
      }
    },
  },
})
