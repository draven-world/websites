import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'coupon',
  title: 'Kupon Diskon',
  type: 'document',
  icon: () => '🎟️',
  fieldsets: [
    { name: 'rules', title: 'Aturan Penggunaan', options: { columns: 2 } },
    { name: 'periode', title: 'Periode Berlaku', options: { columns: 2 } },
  ],
  fields: [
    defineField({
      name: 'code',
      title: 'Kode Kupon',
      type: 'string',
      description: 'Kode yang dimasukkan pelanggan saat checkout. Contoh: DISKON10',
      validation: (Rule) => Rule.required().min(3).max(30).uppercase(),
    }),
    defineField({
      name: 'description',
      title: 'Deskripsi',
      type: 'string',
      description: 'Penjelasan singkat kupon ini',
    }),
    defineField({
      name: 'type',
      title: 'Tipe Diskon',
      type: 'string',
      options: {
        list: [
          { title: 'Persentase (%)', value: 'percentage' },
          { title: 'Potongan Langsung (Rp)', value: 'fixed' },
          { title: 'Gratis Ongkir', value: 'free_shipping' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'value',
      title: 'Nilai Diskon',
      type: 'number',
      description: 'Persentase (contoh: 10 untuk 10%) atau jumlah Rupiah (contoh: 50000)',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'maxDiscount',
      title: 'Maksimal Potongan (Rp)',
      type: 'number',
      description: 'Batas maksimal diskon (untuk tipe persentase). Contoh: 100000',
      fieldset: 'rules',
    }),
    defineField({
      name: 'minPurchase',
      title: 'Minimum Belanja (Rp)',
      type: 'number',
      description: 'Belanja minimum untuk menggunakan kupon. Contoh: 200000',
      fieldset: 'rules',
    }),
    defineField({
      name: 'maxUses',
      title: 'Batas Penggunaan',
      type: 'number',
      description: 'Berapa kali kupon ini bisa dipakai total. Kosongkan = unlimited.',
      fieldset: 'rules',
    }),
    defineField({
      name: 'usedCount',
      title: 'Sudah Dipakai',
      type: 'number',
      description: 'Jumlah kali kupon sudah digunakan',
      initialValue: 0,
      fieldset: 'rules',
      readOnly: true,
    }),
    defineField({
      name: 'startDate',
      title: 'Mulai Berlaku',
      type: 'datetime',
      fieldset: 'periode',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'Berakhir',
      type: 'datetime',
      fieldset: 'periode',
      validation: (Rule) => Rule.required(),
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
      title: 'Terbaru',
      name: 'createdDesc',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      code: 'code',
      type: 'type',
      value: 'value',
      active: 'aktif',
      used: 'usedCount',
      max: 'maxUses',
    },
    prepare({ code, type, value, active, used, max }) {
      const typeLabel = type === 'percentage' ? `${value}%` : type === 'free_shipping' ? 'Free Ongkir' : `Rp ${(value || 0).toLocaleString('id-ID')}`
      const usageStr = max ? `${used || 0}/${max} used` : `${used || 0}x used`
      return {
        title: `${active === false ? '🔴 ' : '🟢 '}${code}`,
        subtitle: `${typeLabel} · ${usageStr}`,
      }
    },
  },
})
