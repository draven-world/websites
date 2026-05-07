import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getGalleryItems, urlFor, type GalleryItem } from '@/lib/sanity'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Gallery',
  description:
    'Galeri foto dari komunitas DRAVEN. Lihat bagaimana koleksi kami dipakai sehari-hari oleh pelanggan dan kreator di seluruh Indonesia.',
}

const BLUR_DATA =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8+P9/PQAJhAN8xGmFjwAAAABJRU5ErkJggg=='

function imageUrl(source: unknown, w: number, h: number): string | null {
  try {
    return urlFor(source).width(w).height(h).url() || null
  } catch {
    return null
  }
}

function GalleryTile({ item, index }: { item: GalleryItem; index: number }) {
  const isFeatured = !!item.featured
  // Vary aspect: featured items 4:5, others alternating 3:4 / 1:1 for editorial rhythm
  const aspect = isFeatured
    ? 'aspect-[4/5]'
    : index % 5 === 0
      ? 'aspect-square'
      : 'aspect-[3/4]'
  const colSpan = isFeatured ? 'sm:col-span-2 sm:row-span-2' : ''

  const w = isFeatured ? 1200 : 800
  const h = isFeatured ? 1500 : 1066
  const src = imageUrl(item.image, w, h)

  const inner = (
    <div className={`group relative overflow-hidden bg-ink-100 ${aspect}`}>
      {src ? (
        <Image
          src={src}
          alt={item.caption || item.credit || 'DRAVEN gallery'}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          sizes={isFeatured ? '(max-width: 1024px) 100vw, 50vw' : '(max-width: 1024px) 50vw, 25vw'}
          placeholder="blur"
          blurDataURL={BLUR_DATA}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-eyebrow text-ink-300">
          No Image
        </div>
      )}
      {(item.caption || item.credit || item.product) && (
        <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <div className="p-5 text-white">
            {item.caption && <p className="text-sm leading-snug">{item.caption}</p>}
            <div className="mt-2 flex flex-wrap items-center gap-x-3 text-[10px] uppercase tracking-[0.2em] text-white/70">
              {item.credit && <span>{item.credit}</span>}
              {item.product && <span>· {item.product.title}</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  )

  if (item.product?.handle) {
    return (
      <Link href={`/products/${item.product.handle}`} className={colSpan}>
        {inner}
      </Link>
    )
  }
  if (item.creditUrl) {
    return (
      <a href={item.creditUrl} target="_blank" rel="noopener noreferrer" className={colSpan}>
        {inner}
      </a>
    )
  }
  return <div className={colSpan}>{inner}</div>
}

export default async function GalleryPage() {
  let items: GalleryItem[] = []
  try {
    items = await getGalleryItems()
  } catch {
    items = []
  }

  return (
    <section className="mx-auto max-w-container px-5 py-20 lg:px-8 lg:py-32">
      <header className="mb-12 max-w-2xl lg:mb-20">
        <p className="text-eyebrow text-ink-500">Gallery</p>
        <h1 className="mt-4 font-serif text-display text-ink-950">
          Worn by the community.
        </h1>
        <p className="mt-6 max-w-md text-sm leading-relaxed text-ink-500">
          Foto pilihan dari pelanggan dan kreator yang memakai DRAVEN.
          Tag <span className="text-ink-950">@dravenworldwide</span> di Instagram untuk
          masuk ke galeri berikutnya.
        </p>
      </header>

      {items.length === 0 ? (
        <div className="border border-dashed border-ink-700 px-8 py-20 text-center">
          <p className="text-eyebrow text-ink-500">Coming soon</p>
          <p className="mt-4 text-sm text-ink-500">
            Belum ada foto galeri. Tambahkan dari Sanity Studio &rarr; Galeri.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
          {items.map((item, i) => (
            <GalleryTile key={item._id} item={item} index={i} />
          ))}
        </div>
      )}
    </section>
  )
}
