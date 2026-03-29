import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://draven.store'
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/checkout', '/order/', '/account/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
