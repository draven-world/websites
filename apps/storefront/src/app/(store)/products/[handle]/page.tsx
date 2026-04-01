import Link from 'next/link'
import { getProduct } from '@/lib/medusa'
import { notFound } from 'next/navigation'
import ProductDetail from '@/components/product/ProductDetail'
import ProductJsonLd from '@/components/seo/ProductJsonLd'
import type { Metadata } from 'next'

export const revalidate = 0

type Props = {
  params: { handle: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const product = await getProduct(params.handle)
    if (!product) return { title: 'Not Found' }

    return {
      title: product.title,
      description: product.description || `${product.title} — DRAVEN`,
      openGraph: {
        title: `${product.title} | DRAVEN`,
        description: product.description || `${product.title} — DRAVEN`,
        images: product.thumbnail ? [{ url: product.thumbnail }] : [],
        type: 'website',
      },
    }
  } catch {
    return { title: 'Product' }
  }
}

export default async function ProductPage({ params }: Props) {
  let product: any = null

  try {
    product = await getProduct(params.handle)
  } catch {
    notFound()
  }

  if (!product) notFound()

  return (
    <div className="mx-auto max-w-container px-5 py-8 lg:px-8 lg:py-14">
      {/* Back + Breadcrumb */}
      <div className="mb-8 flex items-center justify-between">
        <nav className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-brand-400">
          <Link href="/" className="transition-opacity hover:opacity-60">Home</Link>
          <span>/</span>
          <Link href="/products" className="transition-opacity hover:opacity-60">Shop</Link>
          <span>/</span>
          <span className="text-brand-950">{product.title}</span>
        </nav>
        <Link
          href="/products"
          className="hidden items-center gap-1.5 text-[11px] uppercase tracking-widest text-brand-400 transition-colors hover:text-brand-950 lg:flex"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back to Shop
        </Link>
      </div>

      <ProductJsonLd product={product} />
      <ProductDetail product={product} />
    </div>
  )
}
