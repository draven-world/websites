import { Suspense } from 'react'
import { getProducts } from '@/lib/medusa'
import ProductCard from '@/components/product/ProductCard'
import FilterTrigger from '@/components/product/FilterTrigger'
import SortDropdown from '@/components/product/SortDropdown'

export const revalidate = 0

export const metadata = {
  title: 'Shop',
  description: 'Jelajahi koleksi produk Draven. Urban streetwear berkualitas dari Indonesia.',
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: { q?: string; sort?: string; category?: string; price?: string; size?: string; color?: string }
}) {
  let allProducts: any[] = []

  try {
    allProducts = await getProducts()
  } catch {
    allProducts = []
  }

  // Extract available colors from all products (before filtering)
  const colorMap = new Map<string, string>()
  allProducts.forEach((p: any) => {
    if (p.colors?.length > 0) {
      p.colors.forEach((c: any) => {
        if (c.name && c.hex && !colorMap.has(c.name)) {
          colorMap.set(c.name, c.hex)
        }
      })
    }
  })
  const availableColors = Array.from(colorMap.entries()).map(([name, hex]) => ({ name, hex }))

  let products = [...allProducts]

  // --- Filtering ---
  const query = searchParams.q?.toLowerCase()
  if (query) {
    products = products.filter(
      (p: any) =>
        p.title.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.tags?.some((t: string) => t.toLowerCase().includes(query)),
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

  if (searchParams.size) {
    const sizeFilter = searchParams.size.toUpperCase()
    products = products.filter((p: any) => {
      // Check raw sizes array first (from Sanity)
      if (p.sizes?.length > 0) {
        return p.sizes.some((s: string) => s.toUpperCase() === sizeFilter)
      }
      // Fallback: check options
      const sizeOption = p.options?.find((o: any) => o.title === 'Ukuran' || o.title === 'Size')
      if (sizeOption) {
        return sizeOption.values?.some((v: any) => v.value?.toUpperCase() === sizeFilter)
      }
      return false
    })
  }

  if (searchParams.color) {
    const colorFilter = searchParams.color.toLowerCase()
    products = products.filter((p: any) => {
      // Check raw colors array (from Sanity)
      if (p.colors?.length > 0) {
        return p.colors.some((c: any) => c.name?.toLowerCase() === colorFilter)
      }
      // Fallback: check options
      const colorOption = p.options?.find((o: any) => o.title === 'Warna' || o.title === 'Color')
      if (colorOption) {
        return colorOption.values?.some((v: any) => v.value?.toLowerCase() === colorFilter)
      }
      return false
    })
  }

  // --- Sorting ---
  if (searchParams.sort === 'price-asc') {
    products.sort((a: any, b: any) => (a.variants[0]?.prices?.[0]?.amount ?? 0) - (b.variants[0]?.prices?.[0]?.amount ?? 0))
  } else if (searchParams.sort === 'price-desc') {
    products.sort((a: any, b: any) => (b.variants[0]?.prices?.[0]?.amount ?? 0) - (a.variants[0]?.prices?.[0]?.amount ?? 0))
  } else if (searchParams.sort === 'name-asc') {
    products.sort((a: any, b: any) => (a.title || '').localeCompare(b.title || ''))
  }

  const activeFilterCount = [searchParams.category, searchParams.price, searchParams.size, searchParams.color, searchParams.q].filter(Boolean).length

  // Build page title
  let pageTitle = 'Shop'
  if (query) {
    pageTitle = `"${searchParams.q}"`
  } else if (searchParams.category) {
    pageTitle = searchParams.category.charAt(0).toUpperCase() + searchParams.category.slice(1)
  }

  return (
    <div className="px-8 lg:px-16 pt-32 lg:pt-40 pb-32">
      <div className="flex items-end justify-between mb-12 border-b border-ink-700 pb-6">
        <div>
          <h1 className="text-[clamp(2rem,5vw,4rem)] uppercase font-bold tracking-tighter text-ink-100 leading-none">
            {pageTitle}
          </h1>
        </div>
        <div className="flex items-center gap-6 text-[0.75rem] uppercase tracking-[0.15em] text-ink-300">
          <span>{products.length} PIECES</span>
          <Suspense>
            <FilterTrigger productCount={products.length} availableColors={availableColors} />
          </Suspense>
          <Suspense>
            <SortDropdown />
          </Suspense>
        </div>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-12 md:gap-x-24 lg:gap-x-32 gap-y-24 lg:gap-y-32">
          {products.map((product: any, i: number) => (
            <ProductCard key={product.id} product={product} priority={i < 3} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center">
          <p className="text-[clamp(1.5rem,3.5vw,2.5rem)] uppercase font-bold tracking-tighter text-ink-100">NO PIECES FOUND</p>
          {activeFilterCount > 0 && (
            <a
              href="/products"
              className="mt-6 inline-block text-[0.8125rem] uppercase tracking-[0.18em] text-ink-300 underline underline-offset-4 hover:text-accent-lime"
            >
              RESET FILTER
            </a>
          )}
        </div>
      )}
    </div>
  )
}
