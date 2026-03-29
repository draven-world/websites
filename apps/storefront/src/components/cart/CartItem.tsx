'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useCart } from '@/providers/cart-provider'
import { formatRupiah } from '@/lib/utils'

type Props = {
  item: {
    id: string
    title: string
    description: string
    thumbnail: string | null
    variant: {
      id: string
      title: string
    }
    quantity: number
    unit_price: number
    subtotal: number
  }
}

export default function CartItem({ item }: Props) {
  const { updateQuantity, removeItem } = useCart()
  const [updating, setUpdating] = useState(false)

  async function handleQuantity(newQty: number) {
    if (newQty < 1) return
    setUpdating(true)
    try {
      await updateQuantity(item.id, newQty)
    } finally {
      setUpdating(false)
    }
  }

  async function handleRemove() {
    setUpdating(true)
    try {
      await removeItem(item.id)
    } finally {
      setUpdating(false)
    }
  }

  return (
    <div className={`flex gap-4 p-5 ${updating ? 'opacity-50' : ''}`}>
      <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden bg-brand-50">
        {item.thumbnail ? (
          <Image src={item.thumbnail} alt={item.title} fill className="object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-brand-300">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex justify-between">
          <div>
            <h3 className="text-[13px] font-semibold uppercase tracking-wide text-brand-900">
              {item.title}
            </h3>
            <p className="mt-0.5 text-xs text-brand-400">{item.variant.title}</p>
          </div>
          <p className="text-sm font-bold text-brand-900">{formatRupiah(item.subtotal)}</p>
        </div>

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center border border-brand-200">
            <button
              onClick={() => handleQuantity(item.quantity - 1)}
              disabled={updating || item.quantity <= 1}
              className="px-4 py-2.5 text-sm text-brand-500 transition-colors hover:bg-brand-50 active:bg-brand-100 disabled:opacity-30"
            >
              &minus;
            </button>
            <span className="min-w-[2.5rem] text-center text-sm font-medium">{item.quantity}</span>
            <button
              onClick={() => handleQuantity(item.quantity + 1)}
              disabled={updating}
              className="px-4 py-2.5 text-sm text-brand-500 transition-colors hover:bg-brand-50 active:bg-brand-100 disabled:opacity-30"
            >
              +
            </button>
          </div>

          <button
            onClick={handleRemove}
            disabled={updating}
            className="text-xs text-brand-400 transition-colors hover:text-red-600"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  )
}
