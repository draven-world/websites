'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

type Banner = {
  title: string
  image: string | null
  link: string | null
}

const fallbackSlides = [
  { title: '', image: '/images/hero-1.png', link: '/products' },
  { title: '', image: '/images/hero-2.png', link: '/products' },
]

export default function HeroBanner({ banners }: { banners: Banner[] }) {
  const slides = banners.length > 0 ? banners : fallbackSlides
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [slides.length])

  const slide = slides[current]

  return (
    <section className="relative">
      <div className="relative h-[85vh] min-h-[500px] w-full overflow-hidden bg-brand-900">
        {slide.image && (
          <Image
            src={slide.image}
            alt={slide.title || 'DRAVEN'}
            fill
            className="object-cover"
            priority
          />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-end px-5 pb-20 text-center md:pb-24">
          {slide.title && (
            <h2 className="text-3xl font-extrabold uppercase tracking-wide text-white md:text-5xl">
              {slide.title}
            </h2>
          )}
          <Link
            href={slide.link || '/products'}
            className="mt-6 border border-white/80 px-10 py-3.5 text-[12px] font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-white hover:text-brand-900"
          >
            Shop Here
          </Link>
        </div>
      </div>

      {/* Dots */}
      {slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-[3px] transition-all ${i === current ? 'w-8 bg-white' : 'w-3 bg-white/40'
                }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}
