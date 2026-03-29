import { createClient, type SanityClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID

function getSanityClient(): SanityClient | null {
  if (!projectId) return null
  return createClient({
    projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: true,
  })
}

const client = getSanityClient()

export function urlFor(source: unknown) {
  if (!client) return { width: () => ({ height: () => ({ url: () => '' }) }) }
  const builder = imageUrlBuilder(client)
  return builder.image(source as Parameters<typeof builder.image>[0])
}

// --- Banner Homepage ---
export async function getBanners(): Promise<unknown[]> {
  if (!client) return []
  return client.fetch(`
    *[_type == "banner" && aktif == true] | order(urutan asc) {
      title,
      image,
      link
    }
  `)
}

// --- Promo ---
export async function getPromos(): Promise<unknown[]> {
  if (!client) return []
  return client.fetch(`
    *[_type == "promo" && tanggalSelesai > now()] | order(tanggalMulai desc) {
      nama,
      deskripsi,
      tanggalMulai,
      tanggalSelesai,
      banner
    }
  `)
}

// --- Announcement Bar ---
export async function getAnnouncement(): Promise<{
  text: string
  link: string | null
  bgColor: string
} | null> {
  if (!client) return null
  const results = await client.fetch(`
    *[_type == "announcement" && aktif == true][0] {
      text,
      link,
      bgColor
    }
  `)
  return results || null
}

// --- Halaman Statis ---
export async function getPage(slug: string): Promise<{
  title: string
  content: unknown[]
  seoDescription: string | null
} | null> {
  if (!client) return null
  return client.fetch(
    `*[_type == "page" && slug.current == $slug][0] {
      title,
      content,
      seoDescription
    }`,
    { slug },
  )
}

export async function getAllPageSlugs(): Promise<string[]> {
  if (!client) return []
  const results = await client.fetch(`
    *[_type == "page"]{ "slug": slug.current }
  `)
  return results.map((r: { slug: string }) => r.slug)
}

// --- FAQ ---
export async function getFaqs(): Promise<
  Array<{ question: string; answer: string; category: string }>
> {
  if (!client) return []
  return client.fetch(`
    *[_type == "faq"] | order(urutan asc) {
      question,
      answer,
      category
    }
  `)
}

// --- Kategori Unggulan ---
export async function getCategoryHighlights(): Promise<unknown[]> {
  if (!client) return []
  return client.fetch(`
    *[_type == "categoryHighlight" && aktif == true] | order(urutan asc) {
      name,
      "slug": slug.current,
      image,
      description
    }
  `)
}
