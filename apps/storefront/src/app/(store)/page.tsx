import { getBanners, urlFor } from '@/lib/sanity'
import HeroBanner from '@/components/home/HeroBanner'

export const revalidate = 0

export default async function HomePage() {
  let banners: any[] = []

  try {
    const rawBanners = await getBanners()
    banners = (rawBanners as any[]).map((b: any) => ({
      title: b.title,
      subtitle: b.subtitle,
      image: b.image ? urlFor(b.image).width(1920).height(1080).url() : null,
      link: b.link,
    }))
  } catch {
    // graceful fallback
  }

  return <HeroBanner banners={banners} />
}
