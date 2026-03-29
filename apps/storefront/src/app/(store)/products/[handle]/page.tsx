import Link from 'next/link'
import { getProduct } from '@/lib/medusa'
import { notFound } from 'next/navigation'
import ProductDetail from '@/components/product/ProductDetail'
import ProductJsonLd from '@/components/seo/ProductJsonLd'
import type { Metadata } from 'next'

type Props = {
  params: { handle: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const product = await getProduct(params.handle)
    if (!product) return { title: 'Produk Tidak Ditemukan' }

    return {
      title: product.title,
      description: product.description || `Beli ${product.title} di Draven Store`,
      openGraph: {
        title: `${product.title} | Draven Store`,
        description: product.description || `Beli ${product.title} di Draven Store`,
        images: product.thumbnail ? [{ url: product.thumbnail }] : [],
        type: 'website',
      },
    }
  } catch {
    return { title: 'Produk' }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function ProductPage({ params }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let product: any = null

  try {
    product = await getProduct(params.handle)
  } catch {
    notFound()
  }

  if (!product) notFound()

  return (
    <div className="mx-auto max-w-[1400px] px-5 py-8 lg:px-8 lg:py-14">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-brand-400">
        <Link href="/" className="transition-colors hover:text-brand-900">Beranda</Link>
        <span>/</span>
        <Link href="/products" className="transition-colors hover:text-brand-900">Katalog</Link>
        <span>/</span>
        <span className="text-brand-900">{product.title}</span>
      </nav>

      <ProductJsonLd product={product} />
      <ProductDetail product={product} />
    </div>
  )
}
