import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  name: 'product',
  title: 'Produk',
  type: 'document',
  icon: () => '👕',
  fieldsets: [
    { name: 'pricing', title: 'Harga', options: { columns: 2 } },
    { name: 'inventory', title: 'Stok & Pengiriman', options: { columns: 2 } },
    { name: 'seo', title: 'SEO', options: { collapsible: true, collapsed: true } },
  ],
  groups: [
    { name: 'info', title: 'Info Produk', default: true },
    { name: 'media', title: 'Gambar' },
    { name: 'variants', title: 'Varian & Stok' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ─── INFO PRODUK ──────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Nama Produk',
      type: 'string',
      description: 'Nama produk yang tampil di website. Contoh: "Kaos Grafis Draven Vol.1"',
      group: 'info',
      validation: (Rule) => Rule.required().min(3).max(120),
    }),
    defineField({
      name: 'handle',
      title: 'Slug URL',
      type: 'slug',
      description: 'URL produk. Klik Generate untuk buat otomatis dari nama.',
      options: { source: 'title', maxLength: 96 },
      group: 'info',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Deskripsi Produk',
      type: 'array',
      description: 'Deskripsi lengkap produk. Bisa tambah heading, bold, italic, list, dll.',
      group: 'info',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading 3', value: 'h3' },
            { title: 'Heading 4', value: 'h4' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
            ],
          },
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
        }),
      ],
    }),
    defineField({
      name: 'shortDescription',
      title: 'Deskripsi Singkat',
      type: 'text',
      rows: 2,
      description: 'Ringkasan singkat (1-2 kalimat) yang tampil di halaman katalog',
      group: 'info',
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'reference',
      to: [{ type: 'categoryHighlight' }],
      description: 'Pilih kategori produk',
      group: 'info',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tag',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Tag untuk pencarian & filter. Contoh: "bestseller", "new-arrival", "sale"',
      group: 'info',
      options: {
        layout: 'tags',
      },
    }),

    // ─── GAMBAR ───────────────────────────────────────────
    defineField({
      name: 'thumbnail',
      title: 'Gambar Utama',
      type: 'image',
      description: 'Gambar utama yang tampil di katalog. Ukuran rekomendasi: 800×800px',
      options: { hotspot: true },
      group: 'media',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'images',
      title: 'Galeri Gambar',
      type: 'array',
      description: 'Gambar tambahan produk (bisa multiple). Tampil di halaman detail produk.',
      group: 'media',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
              description: 'Deskripsi gambar untuk SEO',
            },
          ],
        }),
      ],
    }),

    // ─── HARGA ────────────────────────────────────────────
    defineField({
      name: 'price',
      title: 'Harga (Rp)',
      type: 'number',
      description: 'Harga jual dalam Rupiah. Contoh: 189000 untuk Rp 189.000',
      fieldset: 'pricing',
      group: 'variants',
      validation: (Rule) => Rule.required().min(0).integer(),
    }),
    defineField({
      name: 'compareAtPrice',
      title: 'Harga Coret (Rp)',
      type: 'number',
      description: 'Harga sebelum diskon (opsional). Akan tampil dicoret di samping harga jual.',
      fieldset: 'pricing',
      group: 'variants',
      validation: (Rule) => Rule.min(0).integer(),
    }),

    // ─── VARIAN ───────────────────────────────────────────
    defineField({
      name: 'sizes',
      title: 'Ukuran Tersedia',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Pilih ukuran yang tersedia',
      group: 'variants',
      options: {
        layout: 'tags',
        list: [
          { title: 'XS', value: 'XS' },
          { title: 'S', value: 'S' },
          { title: 'M', value: 'M' },
          { title: 'L', value: 'L' },
          { title: 'XL', value: 'XL' },
          { title: 'XXL', value: 'XXL' },
          { title: 'All Size', value: 'ALL' },
        ],
      },
    }),
    defineField({
      name: 'colors',
      title: 'Warna Tersedia',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Nama Warna',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'hex',
              title: 'Kode Warna (Hex)',
              type: 'string',
              description: 'Contoh: #000000 untuk hitam, #FFFFFF untuk putih',
              validation: (Rule: any) => Rule.regex(/^#([0-9A-Fa-f]{6})$/, { name: 'hex color' }),
            },
          ],
          preview: {
            select: { title: 'name', subtitle: 'hex' },
          },
        }),
      ],
      description: 'Warna produk yang tersedia (opsional)',
      group: 'variants',
    }),

    // ─── STOK PER VARIAN ──────────────────────────────────
    defineField({
      name: 'variantStock',
      title: 'Stok per Varian',
      type: 'array',
      description:
        'Atur stok untuk setiap kombinasi ukuran/warna. Jika kosong, pakai "Stok Total" sebagai fallback.',
      group: 'variants',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            {
              name: 'size',
              title: 'Ukuran',
              type: 'string',
              options: {
                list: [
                  { title: 'XS', value: 'XS' },
                  { title: 'S', value: 'S' },
                  { title: 'M', value: 'M' },
                  { title: 'L', value: 'L' },
                  { title: 'XL', value: 'XL' },
                  { title: 'XXL', value: 'XXL' },
                  { title: 'All Size', value: 'ALL' },
                ],
              },
            },
            {
              name: 'color',
              title: 'Warna',
              type: 'string',
              description: 'Nama warna (harus sama persis dengan nama di field Warna Tersedia)',
            },
            {
              name: 'stock',
              title: 'Stok',
              type: 'number',
              validation: (Rule: any) => Rule.required().min(0).integer(),
              initialValue: 0,
            },
          ],
          preview: {
            select: { size: 'size', color: 'color', stock: 'stock' },
            prepare({
              size,
              color,
              stock,
            }: {
              size?: string
              color?: string
              stock?: number
            }) {
              const label = [size, color].filter(Boolean).join(' / ') || 'Default'
              const qty = stock ?? 0
              const icon = qty === 0 ? '🔴' : qty <= 5 ? '🟡' : '🟢'
              return { title: `${icon} ${label}`, subtitle: `Stok: ${qty}` }
            },
          },
        }),
      ],
    }),

    // ─── STOK & PENGIRIMAN ────────────────────────────────
    defineField({
      name: 'stock',
      title: 'Stok Total (Fallback)',
      type: 'number',
      description:
        'Stok total sebagai fallback jika "Stok per Varian" tidak diisi. Jika varian diisi, field ini diabaikan.',
      fieldset: 'inventory',
      group: 'variants',
      initialValue: 50,
      validation: (Rule) => Rule.required().min(0).integer(),
    }),
    defineField({
      name: 'weight',
      title: 'Berat (gram)',
      type: 'number',
      description: 'Berat produk dalam gram. Digunakan untuk kalkulasi ongkir.',
      fieldset: 'inventory',
      group: 'variants',
      initialValue: 250,
      validation: (Rule) => Rule.required().min(1).integer(),
    }),
    defineField({
      name: 'sku',
      title: 'SKU',
      type: 'string',
      description: 'Kode unik produk untuk internal tracking. Contoh: DRV-KG-001',
      group: 'variants',
    }),

    // ─── STATUS ───────────────────────────────────────────
    defineField({
      name: 'status',
      title: 'Status Produk',
      type: 'string',
      description: 'Atur apakah produk tampil di website',
      group: 'info',
      options: {
        list: [
          { title: '🟢 Aktif (tampil di website)', value: 'active' },
          { title: '📝 Draft (tidak tampil)', value: 'draft' },
          { title: '📦 Archived (tidak tampil)', value: 'archived' },
        ],
        layout: 'radio',
      },
      initialValue: 'active',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Produk Unggulan?',
      type: 'boolean',
      description: 'Tandai untuk tampilkan di section unggulan di homepage',
      group: 'info',
      initialValue: false,
    }),

    // ─── SEO ──────────────────────────────────────────────
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      description: 'Judul untuk mesin pencari (opsional, default pakai nama produk)',
      group: 'seo',
      fieldset: 'seo',
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 3,
      description: 'Deskripsi untuk hasil pencarian Google (max 160 karakter)',
      group: 'seo',
      fieldset: 'seo',
      validation: (Rule) => Rule.max(160),
    }),
  ],
  orderings: [
    {
      title: 'Nama A-Z',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
    {
      title: 'Harga Terendah',
      name: 'priceAsc',
      by: [{ field: 'price', direction: 'asc' }],
    },
    {
      title: 'Harga Tertinggi',
      name: 'priceDesc',
      by: [{ field: 'price', direction: 'desc' }],
    },
    {
      title: 'Terbaru',
      name: 'createdDesc',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      media: 'thumbnail',
      price: 'price',
      status: 'status',
      stock: 'stock',
    },
    prepare({ title, media, price, status, stock }) {
      const statusIcon = status === 'active' ? '🟢' : status === 'draft' ? '📝' : '📦'
      const priceStr = price
        ? `Rp ${price.toLocaleString('id-ID')}`
        : 'Belum ada harga'
      const stockStr = stock === 0 ? ' · HABIS' : ''
      return {
        title: `${statusIcon} ${title}`,
        subtitle: `${priceStr}${stockStr}`,
        media,
      }
    },
  },
})
