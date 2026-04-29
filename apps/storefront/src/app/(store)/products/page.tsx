import { Suspense } from 'react'
import { getProducts } from '@/lib/medusa'
import ProductCard from '@/components/product/ProductCard'
import ProductFilters, { SortDropdown } from '@/components/product/ProductFilters'
import MobileFilterButton from '@/components/product/MobileFilterButton'

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
    <div className="mx-auto max-w-container px-5 py-10 lg:px-8 lg:py-16">
      <div className="flex gap-12">
        {/* Sidebar — Desktop */}
        <div className="hidden w-[220px] flex-shrink-0 lg:block">
          <Suspense>
            <ProductFilters productCount={products.length} availableColors={availableColors} />
          </Suspense>
        </div>

        {/* Main */}
        <div className="flex-1">
          {/* Header */}
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-medium tracking-tightest text-brand-950 md:text-4xl">
                {pageTitle}
              </h1>
              <p className="mt-1 text-sm text-brand-400">
                {products.length} produk
              </p>
            </div>
            <div className="flex items-center gap-4">
              {/* Mobile filter button */}
              <Suspense>
                <MobileFilterButton
                  activeCount={activeFilterCount}
                  productCount={products.length}
                  availableColors={availableColors}
                />
              </Suspense>
              {/* Desktop sort */}
              <div className="hidden lg:block">
                <Suspense>
                  <SortDropdown />
                </Suspense>
              </div>
            </div>
          </div>

          {products.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-5 md:gap-y-14">
              {products.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <p className="text-sm text-brand-400">
                Tidak ada produk ditemukan.
              </p>
              {activeFilterCount > 0 && (
                <a
                  href="/products"
                  className="mt-4 inline-block text-[11px] uppercase tracking-widest text-brand-950 underline underline-offset-4"
                >
                  Reset Filter
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
