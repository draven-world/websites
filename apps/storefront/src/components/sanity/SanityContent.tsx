'use client'

type Block = {
  _type: string
  _key: string
  style?: string
  children?: Array<{
    _type: string
    text: string
    marks?: string[]
  }>
  markDefs?: Array<{
    _key: string
    _type: string
    href?: string
  }>
  asset?: { _ref: string }
  caption?: string
}

function renderBlock(block: Block) {
  if (block._type === 'image') {
    return (
      <figure key={block._key} className="my-6">
        <div className="rounded-lg bg-ink-800 p-8 text-center text-sm text-ink-400">
          [Gambar dari Sanity CMS]
        </div>
        {block.caption && (
          <figcaption className="mt-2 text-center text-sm text-ink-400">
            {block.caption}
          </figcaption>
        )}
      </figure>
    )
  }

  if (block._type !== 'block' || !block.children) return null

  const text = block.children.map((child, i) => {
    let element: React.ReactNode = child.text

    if (child.marks?.includes('strong')) {
      element = <strong key={i}>{element}</strong>
    }
    if (child.marks?.includes('em')) {
      element = <em key={i}>{element}</em>
    }
    if (child.marks?.includes('underline')) {
      element = <u key={i}>{element}</u>
    }

    // Check for link annotations
    const linkMark = child.marks?.find(
      (m) => !['strong', 'em', 'underline'].includes(m),
    )
    if (linkMark && block.markDefs) {
      const def = block.markDefs.find((d) => d._key === linkMark)
      if (def?.href) {
        element = (
          <a
            key={i}
            href={def.href}
            className="text-accent-lime no-underline hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {element}
          </a>
        )
      }
    }

    return element
  })

  switch (block.style) {
    case 'h2':
      return <h2 key={block._key} className="mb-4 mt-8 text-2xl font-bold uppercase tracking-tighter text-ink-100">{text}</h2>
    case 'h3':
      return <h3 key={block._key} className="mb-3 mt-6 text-xl font-bold uppercase tracking-tighter text-ink-100">{text}</h3>
    case 'h4':
      return <h4 key={block._key} className="mb-2 mt-4 text-lg font-bold uppercase tracking-tighter text-ink-100">{text}</h4>
    case 'blockquote':
      return (
        <blockquote key={block._key} className="my-4 border-l-4 border-ink-700 pl-4 italic text-ink-300">
          {text}
        </blockquote>
      )
    default:
      return <p key={block._key} className="mb-4 leading-relaxed text-ink-300">{text}</p>
  }
}

export default function SanityContent({ content }: { content: unknown[] }) {
  if (!content || content.length === 0) {
    return <p className="text-ink-400">Konten belum tersedia.</p>
  }

  return (
    <div className="prose prose-invert max-w-none prose-headings:uppercase prose-headings:font-bold prose-headings:tracking-tighter prose-headings:text-ink-100 prose-p:text-ink-300 prose-p:leading-relaxed prose-a:text-accent-lime prose-a:no-underline hover:prose-a:underline prose-hr:border-ink-700 prose-strong:text-ink-100 prose-ul:text-ink-300 prose-ol:text-ink-300 prose-li:text-ink-300">
      {(content as Block[]).map(renderBlock)}
    </div>
  )
}
