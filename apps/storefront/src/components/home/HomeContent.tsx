'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

function useScrollProgress() {
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

  return progress
}

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  return { ref, visible }
}

export default function HomeContent({ heroImage }: { heroImage: string | null }) {
  const scrollProgress = useScrollProgress()

  const section1 = useInView()
  const section2 = useInView()
  const section3 = useInView()

  return (
    <>
      {/* ─── HERO ─── Full viewport, parallax image, centered text */}
      <section className="relative h-screen w-full overflow-hidden bg-brand-950">
        <div
          className="absolute inset-0 transition-transform duration-100 ease-out"
          style={{ transform: `scale(${1 + scrollProgress * 0.15})` }}
        >
          {heroImage ? (
            <Image
              src={heroImage}
              alt="DRAVEN"
              fill
              className="object-cover"
              priority
              quality={90}
            />
          ) : (
            <div className="h-full w-full bg-brand-950" />
          )}
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Center content */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-5">
          <p
            className="text-[11px] uppercase tracking-[0.4em] text-white/50 transition-all duration-700"
            style={{ opacity: 1 - scrollProgress * 5 }}
          >
            Established 2024
          </p>
          <h1
            className="mt-4 text-center text-5xl font-medium tracking-tightest text-white md:text-7xl lg:text-8xl"
            style={{
              opacity: 1 - scrollProgress * 4,
              transform: `translateY(${scrollProgress * -80}px)`,
            }}
          >
            DRAVEN
          </h1>
          <p
            className="mt-4 text-center text-sm tracking-wider text-white/60 md:text-base"
            style={{ opacity: 1 - scrollProgress * 5 }}
          >
            Wear the culture.
          </p>
        </div>

        {/* Scroll indicator */}
        <div
          className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2 transition-opacity duration-500"
          style={{ opacity: scrollProgress > 0.05 ? 0 : 1 }}
        >
          <div className="flex flex-col items-center gap-3">
            <span className="text-[9px] uppercase tracking-[0.3em] text-white/40">Scroll</span>
            <div className="h-10 w-px overflow-hidden bg-white/20">
              <div className="h-4 w-px animate-pulse bg-white" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECTION 1 ─── Big statement */}
      <section
        ref={section1.ref}
        className="relative flex min-h-[70vh] items-center justify-center bg-white px-5 py-32"
      >
        <div
          className={`max-w-3xl text-center transition-all duration-1000 ease-out ${
            section1.visible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-12 opacity-0'
          }`}
        >
          <p className="text-[11px] uppercase tracking-[0.3em] text-brand-400">
            Philosophy
          </p>
          <h2 className="mt-6 text-3xl font-medium leading-snug tracking-tightest text-brand-950 md:text-5xl md:leading-tight">
            Streetwear is not about the clothes.
            <br />
            <span className="text-brand-400">It&apos;s about the statement.</span>
          </h2>
          <p className="mx-auto mt-8 max-w-md text-sm leading-relaxed text-brand-400">
            Every piece tells a story. Designed in Jakarta, built for those who move differently.
          </p>
        </div>
      </section>

      {/* ─── SECTION 2 ─── Big image + text overlay */}
      <section
        ref={section2.ref}
        className="relative h-screen w-full overflow-hidden bg-brand-950"
      >
        <div className="absolute inset-0">
          <Image
            src={heroImage || '/images/hero-1.png'}
            alt="DRAVEN Collection"
            fill
            className={`object-cover transition-all duration-[1.5s] ease-out ${
              section2.visible ? 'scale-100 opacity-70' : 'scale-110 opacity-0'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-950 via-brand-950/30 to-transparent" />
        </div>

        <div className="relative z-10 flex h-full flex-col justify-end px-8 pb-20 md:px-16 md:pb-28">
          <div
            className={`transition-all duration-1000 delay-300 ease-out ${
              section2.visible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-10 opacity-0'
            }`}
          >
            <p className="text-[11px] uppercase tracking-[0.3em] text-white/40">
              New Collection
            </p>
            <h2 className="mt-4 text-4xl font-medium tracking-tightest text-white md:text-6xl">
              Explore
            </h2>
            <Link
              href="/products"
              className="mt-8 inline-flex items-center gap-3 border border-white/30 px-8 py-4 text-[12px] uppercase tracking-widest text-white transition-all hover:border-white hover:bg-white hover:text-brand-950"
            >
              Shop Now
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── SECTION 3 ─── Values / Community */}
      <section
        ref={section3.ref}
        className="bg-white px-5 py-32 lg:px-8"
      >
        <div className="mx-auto max-w-container">
          <div
            className={`transition-all duration-1000 ease-out ${
              section3.visible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-12 opacity-0'
            }`}
          >
            <p className="text-[11px] uppercase tracking-[0.3em] text-brand-400">
              Community
            </p>
            <h2 className="mt-6 text-3xl font-medium tracking-tightest text-brand-950 md:text-5xl">
              Built different.
            </h2>
          </div>

          <div className="mt-16 grid gap-px bg-brand-200 md:grid-cols-3">
            {[
              {
                num: '01',
                title: 'Authentic',
                text: 'No hype, no pretense. Every design comes from real culture, real streets.',
              },
              {
                num: '02',
                title: 'Quality',
                text: 'Premium materials, considered construction. Made to be worn, not just owned.',
              },
              {
                num: '03',
                title: 'Community',
                text: 'More than a brand. A collective of individuals who refuse to blend in.',
              },
            ].map((item, i) => (
              <div
                key={item.num}
                className={`bg-white p-8 md:p-12 transition-all duration-700 ease-out ${
                  section3.visible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-8 opacity-0'
                }`}
                style={{ transitionDelay: section3.visible ? `${(i + 1) * 200}ms` : '0ms' }}
              >
                <span className="text-[11px] tracking-widest text-brand-300">{item.num}</span>
                <h3 className="mt-4 text-lg font-medium tracking-tightest text-brand-950">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-brand-400">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          <div
            className={`mt-20 text-center transition-all duration-1000 delay-700 ease-out ${
              section3.visible
                ? 'translate-y-0 opacity-100'
                : 'translate-y-8 opacity-0'
            }`}
          >
            <Link
              href="/products"
              className="btn-primary"
            >
              Enter the Shop
            </Link>
          </div>
        </div>
      </section>

      {/* ─── SECTION 4 ─── Closing full-bleed */}
      <section className="relative h-[50vh] w-full overflow-hidden bg-brand-950">
        <div className="absolute inset-0 flex items-center justify-center">
          <h2 className="text-center text-4xl font-medium tracking-tightest text-white/10 md:text-8xl lg:text-9xl">
            DRAVEN
          </h2>
        </div>
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-5">
          <p className="text-[11px] uppercase tracking-[0.4em] text-white/40">
            Jakarta, Indonesia
          </p>
          <p className="mt-3 text-sm text-white/30">
            Follow us
          </p>
          <div className="mt-4 flex gap-6">
            <a
              href="https://instagram.com/dravenworldwide"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] uppercase tracking-widest text-white/50 transition-colors hover:text-white"
            >
              Instagram
            </a>
            <a
              href="https://wa.me/62"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[12px] uppercase tracking-widest text-white/50 transition-colors hover:text-white"
            >
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
