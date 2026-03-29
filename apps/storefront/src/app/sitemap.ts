import type { MetadataRoute } from 'next'
import { getProducts } from '@/lib/medusa'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://draven.store'

  const staticPages = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 1 },
    { url: `${siteUrl}/products`, lastModified: new Date(), changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${siteUrl}/faq`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.5 },
  ]

  let productPages: MetadataRoute.Sitemap = []
  try {
    const products = await getProducts()
    productPages = products.map((p: { handle: string; updated_at?: string }) => ({
      url: `${siteUrl}/products/${p.handle}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))
  } catch {
    // Medusa not running
  }

  return [...staticPages, ...productPages]
}
