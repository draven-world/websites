import { Suspense } from 'react'
import { getProducts } from '@/lib/medusa'
import ProductCard from '@/components/product/ProductCard'
import ProductFilters, { SortDropdown } from '@/components/product/ProductFilters'

export const revalidate = 0

export const metadata = {
  title: 'Shop',
  description: 'Jelajahi koleksi produk Draven. Urban streetwear berkualitas dari Indonesia.',
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

  const query = searchParams.q?.toLowerCase()
  if (query) {
    products = products.filter(
      (p: any) =>
        p.title.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query),
    )
  }

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

  if (searchParams.price) {
    const [minStr, maxStr] = searchParams.price.split('-')
    const min = minStr ? parseInt(minStr) : 0
    const max = maxStr ? parseInt(maxStr) : Infinity
    products = products.filter((p: any) => {
      const price = p.variants[0]?.prices?.[0]?.amount ?? 0
      return price >= min && price <= max
    })
  }

  if (searchParams.sort === 'price-asc') {
    products.sort((a: any, b: any) => (a.variants[0]?.prices?.[0]?.amount ?? 0) - (b.variants[0]?.prices?.[0]?.amount ?? 0))
  } else if (searchParams.sort === 'price-desc') {
    products.sort((a: any, b: any) => (b.variants[0]?.prices?.[0]?.amount ?? 0) - (a.variants[0]?.prices?.[0]?.amount ?? 0))
  }

  return (
    <div className="mx-auto max-w-container px-5 py-10 lg:px-8 lg:py-16">
      <div className="flex gap-12">
        {/* Sidebar */}
        <div className="hidden w-[200px] flex-shrink-0 lg:block">
          <Suspense>
            <ProductFilters />
          </Suspense>
        </div>

        {/* Main */}
        <div className="flex-1">
          {/* Header */}
          <div className="mb-10 flex items-end justify-between">
            <h1 className="text-3xl font-medium tracking-tightest text-brand-950 md:text-4xl">
              {query ? `"${searchParams.q}"` : searchParams.category ? searchParams.category.charAt(0).toUpperCase() + searchParams.category.slice(1) : 'Shop'}
            </h1>
            <div className="hidden lg:block">
              <Suspense>
                <SortDropdown />
              </Suspense>
            </div>
          </div>

          {/* Mobile filters */}
          <details className="mb-8 border-b border-brand-200 lg:hidden">
            <summary className="cursor-pointer pb-4 text-[13px] uppercase tracking-widest text-brand-950">
              Filter & Sort
            </summary>
            <div className="pb-4">
              <Suspense>
                <ProductFilters />
              </Suspense>
            </div>
          </details>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-5 md:gap-y-14">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <p className="text-sm text-brand-400">No products found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
