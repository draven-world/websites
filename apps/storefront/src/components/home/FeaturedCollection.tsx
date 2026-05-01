import Image from 'next/image'
import Link from 'next/link'

type Props = {
  eyebrow: string
  title: string
  body: string
  image: string
  imageAlt: string
  ctaLabel: string
  ctaHref: string
  reverse?: boolean
}

export default function FeaturedCollection({
  eyebrow,
  title,
  body,
  image,
  imageAlt,
  ctaLabel,
  ctaHref,
  reverse = false,
}: Props) {
  return (
    <section className="grid grid-cols-1 lg:grid-cols-2">
      <div
        className={`relative aspect-[4/5] w-full overflow-hidden bg-brand-100 ${
          reverse ? 'lg:order-2' : ''
        }`}
      >
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
      <div className="flex items-center bg-white px-8 py-16 lg:px-[10vw] lg:py-24">
        <div className="max-w-md">
          <p className="text-eyebrow text-brand-400">{eyebrow}</p>
          <h2 className="mt-6 font-serif text-display text-brand-950">{title}</h2>
          <p className="mt-6 text-sm leading-relaxed text-brand-500">{body}</p>
          <Link
            href={ctaHref}
            className="group mt-10 inline-flex items-center gap-3 text-eyebrow text-brand-950 transition-opacity hover:opacity-60"
          >
            {ctaLabel}
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
