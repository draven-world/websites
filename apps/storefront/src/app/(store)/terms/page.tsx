import { getTerms } from '@/lib/sanity'
import SanityContent from '@/components/sanity/SanityContent'

export const revalidate = 60
export const metadata = { title: 'Terms' }

export default async function TermsPage() {
  let data: any = null
  try {
    data = await getTerms()
  } catch {
    data = null
  }

  return (
    <article className="mx-auto max-w-2xl px-8 pt-32 lg:pt-40 pb-32">
      <h1 className="text-[clamp(2rem,5vw,4rem)] uppercase font-bold tracking-tighter text-ink-100 leading-none mb-12">
        {data?.title?.toUpperCase() || 'TERMS'}
      </h1>
      {data?.body ? (
        <SanityContent content={data.body} />
      ) : (
        <p className="text-sm text-ink-300">Terms content coming soon.</p>
      )}
    </article>
  )
}
