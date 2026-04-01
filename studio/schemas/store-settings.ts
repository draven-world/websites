import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  name: 'storeSettings',
  title: 'Pengaturan Toko',
  type: 'document',
  icon: () => '⚙️',
  fieldsets: [
    { name: 'brand', title: 'Brand & Identitas', options: { collapsible: true } },
    { name: 'contact', title: 'Kontak & Sosial Media', options: { collapsible: true } },
    { name: 'shipping', title: 'Pengiriman', options: { collapsible: true } },
    { name: 'seo', title: 'SEO Global', options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    // Brand
    defineField({
      name: 'storeName',
      title: 'Nama Toko',
      type: 'string',
      fieldset: 'brand',
      initialValue: 'DRAVEN',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      fieldset: 'brand',
      description: 'Teks singkat di bawah logo atau di meta description default',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      fieldset: 'brand',
      description: 'Logo utama toko (PNG transparan, rekomendasi lebar 400px)',
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      fieldset: 'brand',
      description: 'Ikon yang tampil di tab browser (32x32px atau 64x64px)',
    }),

    // Contact
    defineField({
      name: 'whatsapp',
      title: 'Nomor WhatsApp',
      type: 'string',
      fieldset: 'contact',
      description: 'Format: 628xxxxxxxxxx (tanpa +, tanpa 0)',
    }),
    defineField({
      name: 'email',
      title: 'Email Toko',
      type: 'string',
      fieldset: 'contact',
    }),
    defineField({
      name: 'instagram',
      title: 'Username Instagram',
      type: 'string',
      fieldset: 'contact',
      description: 'Tanpa @ — contoh: dravenworldwide',
    }),
    defineField({
      name: 'tiktok',
      title: 'Username TikTok',
      type: 'string',
      fieldset: 'contact',
      description: 'Tanpa @ — contoh: dravenworldwide',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Link Sosial Media Lainnya',
      type: 'array',
      fieldset: 'contact',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            { name: 'platform', title: 'Platform', type: 'string' },
            { name: 'url', title: 'URL', type: 'url' },
          ],
          preview: {
            select: { title: 'platform', subtitle: 'url' },
          },
        }),
      ],
    }),

    // Shipping
    defineField({
      name: 'originCity',
      title: 'Kota Asal Pengiriman',
      type: 'string',
      fieldset: 'shipping',
      description: 'Nama kota tempat gudang/toko berada',
    }),
    defineField({
      name: 'originDistrictId',
      title: 'District ID Asal (RajaOngkir)',
      type: 'string',
      fieldset: 'shipping',
      description: 'ID kecamatan asal untuk kalkulasi ongkir RajaOngkir',
    }),
    defineField({
      name: 'freeShippingMinimum',
      title: 'Minimum Free Ongkir (Rp)',
      type: 'number',
      fieldset: 'shipping',
      description: 'Belanja minimal untuk gratis ongkir. Kosongkan jika tidak ada.',
    }),
    defineField({
      name: 'enabledCouriers',
      title: 'Kurir Aktif',
      type: 'array',
      fieldset: 'shipping',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
        list: [
          { title: 'JNE', value: 'jne' },
          { title: 'TIKI', value: 'tiki' },
          { title: 'POS Indonesia', value: 'pos' },
          { title: 'SiCepat', value: 'sicepat' },
          { title: 'J&T Express', value: 'jnt' },
          { title: 'AnterAja', value: 'anteraja' },
        ],
      },
    }),

    // SEO
    defineField({
      name: 'seoTitle',
      title: 'SEO Title Default',
      type: 'string',
      fieldset: 'seo',
      description: 'Title tag default untuk halaman tanpa SEO title sendiri',
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description Default',
      type: 'text',
      rows: 3,
      fieldset: 'seo',
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: 'seoImage',
      title: 'OG Image Default',
      type: 'image',
      fieldset: 'seo',
      description: 'Gambar default saat website dibagikan di sosial media (1200x630px)',
    }),
    defineField({
      name: 'googleAnalyticsId',
      title: 'Google Analytics ID',
      type: 'string',
      fieldset: 'seo',
      description: 'Contoh: G-XXXXXXXXXX',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Pengaturan Toko' }
    },
  },
})
