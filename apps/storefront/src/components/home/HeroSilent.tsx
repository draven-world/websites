'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export default function HeroSilent({
  videoUrl,
  imageUrl,
}: {
  videoUrl?: string | null
  imageUrl?: string | null
}) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    function onScroll() {
      const scrollY = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docHeight > 0 ? scrollY / docHeight : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section className="relative h-screen w-full overflow-hidden bg-ink-950">
      <div
        className="absolute inset-0 transition-transform duration-100 ease-out"
        style={{ transform: `scale(${1 + progress * 0.1})` }}
      >
        {videoUrl ? (
          <video
            src={videoUrl}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="w-full h-full object-cover"
          />
        ) : imageUrl ? (
          <Image src={imageUrl} alt="" fill className="object-cover" priority />
        ) : (
          <div className="h-full w-full bg-ink-950" />
        )}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="relative z-10 flex h-full items-center justify-center">
        <Link
          href="/products"
          className="text-[clamp(2rem,5vw,4rem)] uppercase font-bold text-ink-100 tracking-tighter leading-none animate-breathe motion-reduce:animate-none"
        >
          SHOP HERE
        </Link>
      </div>
    </section>
  )
}
