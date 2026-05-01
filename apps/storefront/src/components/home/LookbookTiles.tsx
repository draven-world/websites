import Image from 'next/image'
import Link from 'next/link'

type Tile = {
  eyebrow?: string
  title: string
  image: string
  imageAlt: string
  href: string
}

type Props = {
  eyebrow?: string
  heading?: string
  tiles: [Tile, Tile, Tile]
}

export default function LookbookTiles({ eyebrow, heading, tiles }: Props) {
  return (
    <section className="mx-auto max-w-container px-5 py-20 lg:px-8 lg:py-32">
      {(eyebrow || heading) && (
        <div className="mb-12">
          {eyebrow && <p className="text-eyebrow text-brand-400">{eyebrow}</p>}
          {heading && (
            <h2 className="mt-4 font-serif text-display-sm text-brand-950">{heading}</h2>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:grid-rows-2">
        <TileCard tile={tiles[0]} className="lg:col-span-2 lg:row-span-2 lg:aspect-[4/5]" mobileAspect="aspect-[4/5]" />
        <TileCard tile={tiles[1]} className="lg:aspect-square" mobileAspect="aspect-[4/5]" />
        <TileCard tile={tiles[2]} className="lg:aspect-square" mobileAspect="aspect-[4/5]" />
      </div>
    </section>
  )
}

function TileCard({
  tile,
  className,
  mobileAspect,
}: {
  tile: Tile
  className: string
  mobileAspect: string
}) {
  return (
    <Link
      href={tile.href}
      className={`group relative block w-full overflow-hidden bg-brand-100 ${mobileAspect} ${className}`}
    >
      <Image
        src={tile.image}
        alt={tile.imageAlt}
        fill
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        sizes="(max-width: 1024px) 100vw, 50vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      <div className="absolute bottom-6 left-6 right-6 text-white">
        {tile.eyebrow && <p className="text-eyebrow text-white/80">{tile.eyebrow}</p>}
        <h3 className="mt-2 font-serif text-display-sm text-white">{tile.title}</h3>
      </div>
    </Link>
  )
}
