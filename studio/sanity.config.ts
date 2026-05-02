import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'
import type { StructureBuilder } from 'sanity/structure'

const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title('Draven CMS')
    .items([
      // ─── TOKO ──────────────────────
      S.listItem()
        .title('🛒 Toko')
        .child(
          S.list()
            .title('Manajemen Toko')
            .items([
              S.documentTypeListItem('product').title('Produk'),
              S.documentTypeListItem('order').title('Pesanan'),
              S.documentTypeListItem('coupon').title('Kupon Diskon'),
              S.documentTypeListItem('categoryHighlight').title('Kategori'),
            ]),
        ),

      S.divider(),

      // ─── KONTEN ────────────────────
      S.listItem()
        .title('📝 Konten')
        .child(
          S.list()
            .title('Manajemen Konten')
            .items([
              S.documentTypeListItem('page').title('Halaman Statis'),
              S.documentTypeListItem('faq').title('FAQ'),
              S.documentTypeListItem('gallery').title('Galeri'),
              S.documentTypeListItem('lookbook').title('Lookbook / Koleksi'),
              S.documentTypeListItem('testimonial').title('Testimoni'),
            ]),
        ),

      S.divider(),

      // ─── MARKETING ─────────────────
      S.listItem()
        .title('📣 Marketing')
        .child(
          S.list()
            .title('Marketing & Promo')
            .items([
              S.documentTypeListItem('banner').title('Banner Homepage'),
              S.documentTypeListItem('announcement').title('Announcement Bar'),
              S.documentTypeListItem('promo').title('Promo & Campaign'),
            ]),
        ),

      S.divider(),

      // ─── PENGATURAN ────────────────
      S.listItem()
        .title('⚙️ Pengaturan')
        .child(
          S.document()
            .schemaType('storeSettings')
            .documentId('storeSettings')
            .title('Pengaturan Toko'),
        ),
    ])

export default defineConfig({
  name: 'draven-cms',
  title: 'Draven CMS',
  projectId: '01avolry',
  dataset: 'production',
  plugins: [
    structureTool({ structure: deskStructure }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
})
