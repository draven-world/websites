'use client'

import { useState } from 'react'

type Faq = {
  question: string
  answer: string
  category: string
}

const categoryLabels: Record<string, string> = {
  pemesanan: 'Pemesanan',
  pembayaran: 'Pembayaran',
  pengiriman: 'Pengiriman',
  pengembalian: 'Pengembalian',
  akun: 'Akun',
  lainnya: 'Lainnya',
}

export default function FaqList({ faqs }: { faqs: Faq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const categories = Array.from(new Set(faqs.map((f) => f.category)))
  const filtered = activeCategory === 'all' ? faqs : faqs.filter((f) => f.category === activeCategory)

  return (
    <div>
      {/* Category Filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory('all')}
          className={`rounded-full px-4 py-1.5 text-[0.75rem] uppercase tracking-[0.12em] font-medium transition-colors ${
            activeCategory === 'all'
              ? 'bg-ink-100 text-ink-900'
              : 'bg-ink-800 text-ink-400 hover:bg-ink-700 hover:text-ink-200'
          }`}
        >
          Semua
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-4 py-1.5 text-[0.75rem] uppercase tracking-[0.12em] font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-ink-100 text-ink-900'
                : 'bg-ink-800 text-ink-400 hover:bg-ink-700 hover:text-ink-200'
            }`}
          >
            {categoryLabels[cat] || cat}
          </button>
        ))}
      </div>

      {/* FAQ Accordion */}
      <div>
        {filtered.map((faq, i) => {
          const isOpen = openIndex === i
          const isLast = i === filtered.length - 1
          return (
            <div key={i} className={`border-t border-ink-700 ${isLast ? 'border-b' : ''}`}>
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="text-[0.8125rem] uppercase tracking-[0.18em] text-ink-100 hover:text-accent-lime w-full text-left py-4 flex items-center justify-between transition-colors"
              >
                <span className="pr-4">{faq.question}</span>
                <svg
                  className={`h-4 w-4 flex-shrink-0 transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isOpen && (
                <div className="text-sm text-ink-300 mt-3 leading-relaxed pb-4">{faq.answer}</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
