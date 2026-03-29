import { getBanners, urlFor } from '@/lib/sanity'
import HeroBanner from '@/components/home/HeroBanner'

export default async function HomePage() {
  let banners: any[] = []

  try {
    const rawBanners = await getBanners()
    banners = rawBanners.map((b: any) => ({
      title: b.title,
      image: b.image ? urlFor(b.image).width(1200).height(800).url() : null,
      link: b.link,
    }))
  } catch {
    banners = []
  }

  return (
    <>
      <HeroBanner banners={banners} />
    </>
  )
}
