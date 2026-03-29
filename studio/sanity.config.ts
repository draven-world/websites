import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'
import type { StructureBuilder } from 'sanity/structure'

const deskStructure = (S: StructureBuilder) =>
  S.list()
    .title('Draven CMS')
    .items([
      S.listItem()
        .title('🏠 Homepage')
        .child(
          S.list()
            .title('Konten Homepage')
            .items([
              S.documentTypeListItem('banner').title('Banner Slideshow'),
              S.documentTypeListItem('categoryHighlight').title('Kategori Unggulan'),
              S.documentTypeListItem('announcement').title('Announcement Bar'),
            ]),
        ),
      S.divider(),
      S.documentTypeListItem('promo').title('🏷️ Promo'),
      S.documentTypeListItem('page').title('📄 Halaman Statis'),
      S.documentTypeListItem('faq').title('❓ FAQ'),
    ])

export default defineConfig({
  name: 'draven-cms',
  title: 'Draven CMS',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || '01avolry',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [
    structureTool({ structure: deskStructure }),
    visionTool(),
  ],
  schema: {
    types: schemaTypes,
  },
})
