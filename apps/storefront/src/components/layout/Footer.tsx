'use client'

import Link from 'next/link'
import { useState } from 'react'
import NewsletterForm from '@/components/ui/NewsletterForm'

const columns = [
  {
    label: 'Shop',
    links: [
      { label: 'All Products', href: '/products' },
      { label: 'New Arrivals', href: '/products?sort=newest' },
      { label: 'Sale', href: '/products?sale=true' },
    ],
  },
  {
    label: 'Help',
    links: [
      { label: 'FAQ', href: '/faq' },
      { label: 'Cara Order', href: '/cara-order' },
      { label: 'Shipping', href: '/shipping' },
      { label: 'Returns', href: '/returns' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    label: 'About',
    links: [
      { label: 'Tentang Kami', href: '/tentang-kami' },
      { label: 'Komunitas', href: '/komunitas' },
      { label: 'Journal', href: '/journal' },
    ],
  },
  {
    label: 'Connect',
    links: [
      { label: 'Instagram', href: 'https://instagram.com/dravenworldwide', external: true },
      { label: 'TikTok', href: 'https://tiktok.com/@dravenworldwide', external: true },
      { label: 'WhatsApp Support', href: 'https://wa.me/6281234567890', external: true },
      { label: 'Email', href: 'mailto:hello@draven.store', external: true },
    ],
  },
] as const

function FooterColumn({ label, links }: { label: string; links: ReadonlyArray<{ label: string; href: string; external?: boolean }> }) {
  return (
    <div>
      <h4 className="text-eyebrow text-white">{label}</h4>
      <ul className="mt-5 space-y-3">
        {links.map((l) => (
          <li key={l.label}>
            {l.external ? (
              <a
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/60 transition-colors hover:text-white"
              >
                {l.label}
              </a>
            ) : (
              <Link href={l.href} className="text-sm text-white/60 transition-colors hover:text-white">
                {l.label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

function MobileColumn({ label, links }: { label: string; links: ReadonlyArray<{ label: string; href: string; external?: boolean }> }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-white/10">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between py-5 text-left"
        aria-expanded={open}
      >
        <span className="text-eyebrow text-white">{label}</span>
        <span aria-hidden className="text-white/60 text-lg leading-none">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <ul className="space-y-3 pb-5">
          {links.map((l) => (
            <li key={l.label}>
              {l.external ? (
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-sm text-white/60">
                  {l.label}
                </a>
              ) : (
                <Link href={l.href} className="text-sm text-white/60">
                  {l.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function Footer() {
  return (
    <footer>
      {/* Newsletter band */}
      <section className="border-y border-brand-100 bg-white">
        <div className="mx-auto max-w-container px-5 py-20 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-eyebrow text-brand-400">Newsletter</p>
            <h2 className="mt-6 font-serif text-display-sm text-brand-950">Stay in the loop.</h2>
            <p className="mt-4 text-sm text-brand-500">
              New drops, lookbooks, and members-only releases — straight to your inbox.
            </p>
            <div className="mt-8 flex justify-center">
              <NewsletterForm />
            </div>
            <p className="mt-6 text-[10px] uppercase tracking-[0.2em] text-brand-300">
              By subscribing you agree to our Privacy Policy.
            </p>
          </div>
        </div>
      </section>

      {/* Main footer */}
      <div className="bg-brand-950 text-white">
        <div className="mx-auto max-w-container px-5 py-16 lg:px-8 lg:py-20">
          {/* Desktop columns */}
          <div className="hidden lg:grid lg:grid-cols-4 lg:gap-12">
            {columns.map((c) => (
              <FooterColumn key={c.label} label={c.label} links={c.links} />
            ))}
          </div>
          {/* Mobile accordions */}
          <div className="lg:hidden">
            {columns.map((c) => (
              <MobileColumn key={c.label} label={c.label} links={c.links} />
            ))}
          </div>

          {/* Brand + trust */}
          <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-8 lg:flex-row lg:items-center lg:justify-between">
            <span className="font-serif text-2xl tracking-tightest text-white">DRAVEN</span>
            <p className="text-eyebrow text-white/60">
              Pembayaran aman via Midtrans · Pengiriman seluruh Indonesia
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-container flex-col items-center justify-between gap-2 px-5 py-5 text-center lg:flex-row lg:px-8">
            <p className="text-[11px] uppercase tracking-[0.2em] text-white/30">
              &copy; {new Date().getFullYear()} DRAVEN. All rights reserved.
            </p>
            <div className="flex gap-5 text-[11px] uppercase tracking-[0.2em] text-white/30">
              <Link href="/kebijakan-privasi" className="transition-colors hover:text-white">
                Privacy
              </Link>
              <Link href="/syarat-ketentuan" className="transition-colors hover:text-white">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
