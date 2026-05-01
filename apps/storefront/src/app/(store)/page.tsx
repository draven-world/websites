import { getBanners, urlFor } from '@/lib/sanity'
import { getProducts } from '@/lib/medusa'
import HeroBanner from '@/components/home/HeroBanner'
import FeaturedCollection from '@/components/home/FeaturedCollection'
import ProductGridSection from '@/components/home/ProductGridSection'
import LookbookTiles from '@/components/home/LookbookTiles'
import EditorialQuote from '@/components/home/EditorialQuote'

export const revalidate = 0

export default async function HomePage() {
  let banners: Array<{
    title: string
    subtitle?: string
    eyebrow?: string
    image: string | null
    link: string | null
  }> = []
  let latestProducts: Awaited<ReturnType<typeof getProducts>> = []

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

  try {
    const all = await getProducts()
    latestProducts = (all || []).slice(0, 8)
  } catch {
    latestProducts = []
  }

  return (
    <>
      <HeroBanner banners={banners} />

      <FeaturedCollection
        eyebrow="Featured Collection"
        title="Tailoring, reimagined."
        body="Garments built for the everyday — cut from premium fabric in Indonesia, finished by hand. Discover our latest chapter."
        image="/images/hero-1.png"
        imageAlt="Featured collection editorial"
        ctaLabel="Discover"
        ctaHref="/products"
      />

      <ProductGridSection
        eyebrow="Just dropped"
        title="Latest"
        products={latestProducts as never[]}
        viewAllHref="/products"
        viewAllLabel="View all"
        prioritizeFirstRow
      />

      <LookbookTiles
        eyebrow="Categories"
        heading="By the look"
        tiles={[
          {
            eyebrow: 'Outerwear',
            title: 'Built for the season',
            image: '/images/hero-2.png',
            imageAlt: 'Outerwear lookbook',
            href: '/products?category=outerwear',
          },
          {
            eyebrow: 'Knitwear',
            title: 'Soft hands',
            image: '/images/hero-1.png',
            imageAlt: 'Knitwear lookbook',
            href: '/products?category=knitwear',
          },
          {
            eyebrow: 'Accessories',
            title: 'Finishing touches',
            image: '/images/hero-2.png',
            imageAlt: 'Accessories lookbook',
            href: '/products?category=accessories',
          },
        ]}
      />

      <EditorialQuote
        eyebrow="Journal"
        quote="Style is the point at which restraint and intention meet."
        attribution="DRAVEN"
      />
    </>
  )
}
