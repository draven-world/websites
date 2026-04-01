import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  name: 'order',
  title: 'Pesanan',
  type: 'document',
  icon: () => '📦',
  fieldsets: [
    { name: 'customer', title: 'Info Pelanggan', options: { columns: 2 } },
    { name: 'shipping', title: 'Pengiriman', options: { collapsible: true } },
    { name: 'payment', title: 'Pembayaran', options: { collapsible: true } },
  ],
  fields: [
    defineField({
      name: 'orderId',
      title: 'Order ID',
      type: 'string',
      description: 'ID unik pesanan (otomatis dari sistem)',
      validation: (Rule) => Rule.required(),
      readOnly: true,
    }),
    defineField({
      name: 'status',
      title: 'Status Pesanan',
      type: 'string',
      options: {
        list: [
          { title: '🟡 Menunggu Pembayaran', value: 'pending' },
          { title: '🟢 Dibayar', value: 'paid' },
          { title: '🔵 Diproses', value: 'processing' },
          { title: '🚚 Dikirim', value: 'shipped' },
          { title: '✅ Diterima', value: 'delivered' },
          { title: '🔴 Dibatalkan', value: 'cancelled' },
          { title: '🔄 Refund', value: 'refunded' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'pending',
      validation: (Rule) => Rule.required(),
    }),

    // Customer
    defineField({
      name: 'customerName',
      title: 'Nama Pelanggan',
      type: 'string',
      fieldset: 'customer',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'customerPhone',
      title: 'No. WhatsApp',
      type: 'string',
      fieldset: 'customer',
    }),
    defineField({
      name: 'customerEmail',
      title: 'Email',
      type: 'string',
      fieldset: 'customer',
    }),

    // Items
    defineField({
      name: 'items',
      title: 'Item Pesanan',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            { name: 'productTitle', title: 'Nama Produk', type: 'string' },
            { name: 'variant', title: 'Varian (Ukuran/Warna)', type: 'string' },
            { name: 'quantity', title: 'Qty', type: 'number' },
            { name: 'price', title: 'Harga Satuan (Rp)', type: 'number' },
            { name: 'thumbnail', title: 'Thumbnail URL', type: 'url' },
          ],
          preview: {
            select: { title: 'productTitle', qty: 'quantity', price: 'price', variant: 'variant' },
            prepare({ title, qty, price, variant }) {
              return {
                title: `${title} — ${variant || 'Default'}`,
                subtitle: `${qty}x Rp ${(price || 0).toLocaleString('id-ID')}`,
              }
            },
          },
        }),
      ],
    }),

    // Pricing
    defineField({
      name: 'subtotal',
      title: 'Subtotal (Rp)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'shippingCost',
      title: 'Ongkos Kirim (Rp)',
      type: 'number',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'discount',
      title: 'Diskon (Rp)',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'total',
      title: 'Total (Rp)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),

    // Shipping
    defineField({
      name: 'shippingAddress',
      title: 'Alamat Pengiriman',
      type: 'text',
      rows: 3,
      fieldset: 'shipping',
    }),
    defineField({
      name: 'shippingCity',
      title: 'Kota',
      type: 'string',
      fieldset: 'shipping',
    }),
    defineField({
      name: 'shippingProvince',
      title: 'Provinsi',
      type: 'string',
      fieldset: 'shipping',
    }),
    defineField({
      name: 'shippingMethod',
      title: 'Kurir & Service',
      type: 'string',
      description: 'Contoh: JNE — REG',
      fieldset: 'shipping',
    }),
    defineField({
      name: 'trackingNumber',
      title: 'Nomor Resi',
      type: 'string',
      description: 'Isi setelah paket dikirim. Format bergantung kurir.',
      fieldset: 'shipping',
    }),

    // Payment
    defineField({
      name: 'paymentMethod',
      title: 'Metode Pembayaran',
      type: 'string',
      fieldset: 'payment',
    }),
    defineField({
      name: 'midtransId',
      title: 'Midtrans Transaction ID',
      type: 'string',
      fieldset: 'payment',
      readOnly: true,
    }),
    defineField({
      name: 'paidAt',
      title: 'Tanggal Bayar',
      type: 'datetime',
      fieldset: 'payment',
    }),

    // Notes
    defineField({
      name: 'notes',
      title: 'Catatan Internal',
      type: 'text',
      rows: 3,
      description: 'Catatan internal (tidak tampil ke pelanggan)',
    }),
  ],
  orderings: [
    {
      title: 'Terbaru',
      name: 'createdDesc',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
    {
      title: 'Status',
      name: 'statusAsc',
      by: [{ field: 'status', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      orderId: 'orderId',
      customer: 'customerName',
      total: 'total',
      status: 'status',
    },
    prepare({ orderId, customer, total, status }) {
      const statusMap: Record<string, string> = {
        pending: '🟡',
        paid: '🟢',
        processing: '🔵',
        shipped: '🚚',
        delivered: '✅',
        cancelled: '🔴',
        refunded: '🔄',
      }
      return {
        title: `${statusMap[status] || '⚪'} ${orderId || 'New'}`,
        subtitle: `${customer || '?'} — Rp ${(total || 0).toLocaleString('id-ID')}`,
      }
    },
  },
})
