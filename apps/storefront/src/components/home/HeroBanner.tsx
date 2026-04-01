'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect, useRef, useCallback } from 'react'

type Banner = {
  title: string
  subtitle?: string
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
  const [paused, setPaused] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startTimer = useCallback(() => {
    if (slides.length <= 1) return
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 8000)
  }, [slides.length])

  useEffect(() => {
    if (paused) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }
    startTimer()
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [paused, startTimer])

  const slide = slides[current]

  return (
    <section className="relative">
      <div
        className="relative h-[90vh] min-h-[600px] w-full overflow-hidden bg-brand-950"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {slide.image && (
          <Image
            src={slide.image}
            alt={slide.title || 'DRAVEN'}
            fill
            className="object-cover opacity-80 transition-opacity duration-1000"
            priority
          />
        )}

        {/* Content — bottom left, editorial style */}
        <div className="absolute inset-0 flex flex-col justify-end px-8 pb-16 md:px-16 md:pb-20">
          <Link
            href={slide.link || '/products'}
            className="group inline-flex items-center gap-3 text-[13px] uppercase tracking-widest text-white transition-opacity hover:opacity-60"
          >
            Shop Collection
            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Progress bar */}
      {slides.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 flex">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="flex-1 py-3"
              aria-label={`Slide ${i + 1}`}
            >
              <div className={`h-[2px] transition-all duration-300 ${i === current ? 'bg-white' : 'bg-white/20'}`} />
            </button>
          ))}
        </div>
      )}
    </section>
  )
}
