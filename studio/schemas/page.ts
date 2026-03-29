import { defineType, defineField, defineArrayMember } from 'sanity'

export default defineType({
  name: 'page',
  title: 'Halaman Statis',
  type: 'document',
  icon: () => '📄',
  fieldsets: [
    { name: 'seo', title: 'SEO & Meta', options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Judul Halaman',
      type: 'string',
      description: 'Contoh: "Tentang Kami", "Kebijakan Privasi", "Cara Order"',
      validation: (Rule) => Rule.required().min(3).max(100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug URL',
      type: 'slug',
      description: 'URL halaman. Klik Generate untuk buat otomatis dari judul.',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Konten Halaman',
      type: 'array',
      description: 'Tulis konten halaman di sini. Bisa tambah gambar, heading, link, dll.',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'Heading 2', value: 'h2' },
            { title: 'Heading 3', value: 'h3' },
            { title: 'Heading 4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
              { title: 'Underline', value: 'underline' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (Rule: any) =>
                      Rule.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto', 'tel'] }),
                  },
                ],
              },
            ],
          },
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
        }),
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'caption',
              type: 'string',
              title: 'Keterangan Gambar',
              description: 'Teks di bawah gambar (opsional)',
            },
            {
              name: 'alt',
              type: 'string',
              title: 'Alt Text',
              description: 'Deskripsi gambar untuk aksesibilitas & SEO',
            },
          ],
        }),
      ],
    }),
    defineField({
      name: 'seoDescription',
      title: 'Deskripsi SEO',
      type: 'text',
      rows: 3,
      description: 'Deskripsi yang tampil di hasil pencarian Google (max 160 karakter)',
      validation: (Rule) => Rule.max(160),
      fieldset: 'seo',
    }),
    defineField({
      name: 'seoImage',
      title: 'Gambar SEO / Social Share',
      type: 'image',
      description: 'Gambar yang tampil saat halaman dibagikan di media sosial (opsional)',
      fieldset: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
    },
    prepare({ title, slug }) {
      return {
        title,
        subtitle: slug ? `/${slug}` : 'Belum ada slug',
      }
    },
  },
})
