import Link from 'next/link'
import { getBanners, urlFor, getSanityProducts } from '@/lib/sanity'
import HeroBanner from '@/components/home/HeroBanner'
import ProductCard from '@/components/product/ProductCard'

export const revalidate = 0

export default async function HomePage() {
  let banners: any[] = []
  let products: any[] = []

  try {
    const [rawBanners, allProducts] = await Promise.all([
      getBanners(),
      getSanityProducts(),
    ])
    banners = rawBanners.map((b: any) => ({
      title: b.title,
      subtitle: b.subtitle,
      image: b.image ? urlFor(b.image).width(1920).height(1080).url() : null,
      link: b.link,
    }))
    products = allProducts.slice(0, 8)
  } catch {
    // graceful fallback
  }

  return (
    <>
      <HeroBanner banners={banners} />

      {/* Products */}
      {products.length > 0 && (
        <section className="mx-auto max-w-container px-5 py-16 lg:px-8 lg:py-24">
          <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-4 md:gap-x-5 md:gap-y-14">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="mt-16 text-center">
            <Link href="/products" className="btn-secondary">
              View All
            </Link>
          </div>
        </section>
      )}
    </>
  )
}
