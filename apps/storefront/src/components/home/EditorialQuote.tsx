import Link from 'next/link'

type Props = {
  eyebrow?: string
  quote: string
  attribution?: string
  ctaLabel?: string
  ctaHref?: string
}

export default function EditorialQuote({ eyebrow, quote, attribution, ctaLabel, ctaHref }: Props) {
  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-3xl px-5 text-center lg:px-8">
        {eyebrow && <p className="text-eyebrow text-brand-400">{eyebrow}</p>}
        <blockquote className="mt-8 font-serif text-display italic text-brand-950">
          &ldquo;{quote}&rdquo;
        </blockquote>
        {attribution && (
          <p className="mt-8 text-eyebrow text-brand-400">— {attribution}</p>
        )}
        {ctaLabel && ctaHref && (
          <Link
            href={ctaHref}
            className="mt-10 inline-flex items-center gap-2 text-eyebrow text-brand-950 transition-opacity hover:opacity-60"
          >
            {ctaLabel}
            <span aria-hidden>→</span>
          </Link>
        )}
      </div>
    </section>
  )
}
