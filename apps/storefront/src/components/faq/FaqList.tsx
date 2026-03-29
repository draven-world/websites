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
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory('all')}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            activeCategory === 'all'
              ? 'bg-brand-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Semua
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-brand-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {categoryLabels[cat] || cat}
          </button>
        ))}
      </div>

      {/* FAQ Accordion */}
      <div className="divide-y divide-gray-200 rounded-xl border border-gray-200">
        {filtered.map((faq, i) => {
          const isOpen = openIndex === i
          return (
            <div key={i}>
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <span className="pr-4 text-sm font-medium text-gray-900">{faq.question}</span>
                <svg
                  className={`h-5 w-5 flex-shrink-0 text-gray-400 transition-transform ${
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
                <div className="px-5 pb-4 text-sm leading-relaxed text-gray-600">{faq.answer}</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
