import { Suspense } from 'react'
import { getProducts } from '@/lib/medusa'
import ProductCard from '@/components/product/ProductCard'
import ProductFilters, { SortDropdown } from '@/components/product/ProductFilters'

export const metadata = {
  title: 'Katalog — Semua Produk',
  description: 'Jelajahi koleksi produk Draven Store. Urban streetwear berkualitas dari Indonesia.',
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { q?: string; sort?: string; category?: string; price?: string }
}) {
  let products: any[] = []

  try {
    products = await getProducts()
  } catch {
    products = []
  }

  // Filter by search query
  const query = searchParams.q?.toLowerCase()
  if (query) {
    products = products.filter(
      (p: any) =>
        p.title.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query),
    )
  }

  // Filter by category
  if (searchParams.category) {
    const cat = searchParams.category.toLowerCase()
    products = products.filter((p: any) =>
      p.tags?.some((t: string | { value: string }) =>
        (typeof t === 'string' ? t : t.value).toLowerCase() === cat,
      ) ||
      p.collection?.title?.toLowerCase() === cat ||
      p.title.toLowerCase().includes(cat),
    )
  }

  // Filter by price range
  if (searchParams.price) {
    const [minStr, maxStr] = searchParams.price.split('-')
    const min = minStr ? parseInt(minStr) : 0
    const max = maxStr ? parseInt(maxStr) : Infinity
    products = products.filter((p: any) => {
      const price = p.variants[0]?.prices?.[0]?.amount ?? 0
      return price >= min && price <= max
    })
  }

  // Sort
  if (searchParams.sort === 'price-asc') {
    products.sort((a: any, b: any) => {
      const priceA = a.variants[0]?.prices?.[0]?.amount ?? 0
      const priceB = b.variants[0]?.prices?.[0]?.amount ?? 0
      return priceA - priceB
    })
  } else if (searchParams.sort === 'price-desc') {
    products.sort((a: any, b: any) => {
      const priceA = a.variants[0]?.prices?.[0]?.amount ?? 0
      const priceB = b.variants[0]?.prices?.[0]?.amount ?? 0
      return priceB - priceA
    })
  }

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-8 lg:px-8 lg:py-12">
      <div className="flex gap-10">
        {/* Sidebar Filters (desktop) */}
        <div className="hidden w-[260px] flex-shrink-0 lg:block">
          <Suspense>
            <ProductFilters />
          </Suspense>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-brand-900">
                {query ? `Hasil pencarian "${searchParams.q}"` : 'All Products'}
              </h1>
              <p className="mt-1 text-sm text-brand-400">
                {products.length} produk
              </p>
            </div>
            <div className="hidden lg:block">
              <Suspense>
                <SortDropdown />
              </Suspense>
            </div>
          </div>

          {/* Mobile filter toggle */}
          <details className="mb-6 border border-brand-200 lg:hidden">
            <summary className="cursor-pointer px-4 py-3 text-sm font-semibold uppercase tracking-wider text-brand-900">
              Filter & Sort
            </summary>
            <div className="border-t border-brand-100 px-4 py-2">
              <Suspense>
                <ProductFilters />
              </Suspense>
            </div>
          </details>

          {/* Product Grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-5">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <svg className="mb-4 h-12 w-12 text-brand-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-900">
                Tidak ada produk ditemukan
              </p>
              <p className="mt-1 text-sm text-brand-400">
                Coba kata kunci lain atau lihat semua produk
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
