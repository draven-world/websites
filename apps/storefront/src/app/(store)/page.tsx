import { getBanners, urlFor } from '@/lib/sanity'
import HeroBanner from '@/components/home/HeroBanner'

export const revalidate = 0

export default async function HomePage() {
  let banners: Array<{ title: string; subtitle?: string; eyebrow?: string; image: string | null; link: string | null }> = []

  try {
    const rawBanners = await getBanners()
    banners = (rawBanners as Array<Record<string, unknown>>).map((b) => ({
      title: (b.title as string) || '',
      subtitle: (b.subtitle as string) || undefined,
      eyebrow: (b.eyebrow as string) || undefined,
      image: b.image ? urlFor(b.image).width(1920).height(1080).url() : null,
      link: (b.link as string) || null,
    }))
  } catch {
    // graceful fallback
  }

  return <HeroBanner banners={banners} />
}
