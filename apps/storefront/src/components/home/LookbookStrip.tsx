'use client'

import Image from 'next/image'

type Item = { image: string; caption?: string }

export default function LookbookStrip({ items }: { items: Item[] }) {
  if (!items?.length) return null
  return (
    <section className="bg-ink-950 py-24 overflow-hidden">
      <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide gap-1 px-1">
        {items.map((it, i) => (
          <div
            key={i}
            className="relative aspect-[3/4] w-[80vw] md:w-[50vw] lg:w-[35vw] flex-shrink-0 snap-start overflow-hidden bg-ink-900 group"
          >
            <Image
              src={it.image}
              alt={it.caption ?? ''}
              fill
              sizes="(max-width: 768px) 80vw, (max-width: 1024px) 50vw, 35vw"
              className="object-cover"
            />
            {it.caption && (
              <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-[0.75rem] uppercase tracking-[0.15em] text-ink-100">{it.caption}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
