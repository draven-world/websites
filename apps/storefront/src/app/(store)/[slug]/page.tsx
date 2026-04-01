import { getPage } from '@/lib/sanity'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import SanityContent from '@/components/sanity/SanityContent'

type Props = {
  params: { slug: string }
}

// Exclude routes yang sudah ada
const RESERVED_SLUGS = ['products', 'cart', 'checkout', 'order', 'faq', 'account', 'cara-order', 'kebijakan-privasi', 'login', 'register']

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (RESERVED_SLUGS.includes(params.slug)) return {}
  const page = await getPage(params.slug)
  if (!page) return { title: 'Halaman Tidak Ditemukan' }
  return {
    title: page.title,
    description: page.seoDescription || undefined,
  }
}

export default async function StaticPage({ params }: Props) {
  if (RESERVED_SLUGS.includes(params.slug)) notFound()

  const page = await getPage(params.slug)
  if (!page) notFound()

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">{page.title}</h1>
      <SanityContent content={page.content} />
    </div>
  )
}
