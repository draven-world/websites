'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { medusa } from '@/lib/medusa'

type LineItem = {
  id: string
  title: string
  description: string
  thumbnail: string | null
  variant: {
    id: string
    title: string
    prices: Array<{ amount: number; currency_code: string }>
  }
  quantity: number
  unit_price: number
  subtotal: number
}

type Cart = {
  id: string
  items: LineItem[]
  total: number
  subtotal: number
  tax_total: number
  shipping_total: number
  discount_total: number
  region: { currency_code: string } | null
}

type CartContextType = {
  cart: Cart | null
  loading: boolean
  totalItems: number
  addItem: (variantId: string, quantity?: number) => Promise<void>
  removeItem: (lineItemId: string) => Promise<void>
  updateQuantity: (lineItemId: string, quantity: number) => Promise<void>
  refreshCart: () => Promise<void>
}

const CartContext = createContext<CartContextType | null>(null)

const CART_ID_KEY = 'draven_cart_id'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(true)

  const totalItems = useMemo(() => {
    if (!cart?.items) return 0
    return cart.items.reduce((sum, item) => sum + item.quantity, 0)
  }, [cart])

  const getOrCreateCart = useCallback(async (): Promise<string | null> => {
    const stored = localStorage.getItem(CART_ID_KEY)
    if (stored) {
      try {
        const { cart } = await medusa.carts.retrieve(stored)
        setCart(cart as unknown as Cart)
        return stored
      } catch {
        localStorage.removeItem(CART_ID_KEY)
      }
    }

    try {
      const { cart: newCart } = await medusa.carts.create()
      localStorage.setItem(CART_ID_KEY, newCart.id)
      setCart(newCart as unknown as Cart)
      return newCart.id
    } catch {
      // Medusa not running
      return null
    }
  }, [])

  const refreshCart = useCallback(async () => {
    const cartId = localStorage.getItem(CART_ID_KEY)
    if (!cartId) return
    try {
      const { cart } = await medusa.carts.retrieve(cartId)
      setCart(cart as unknown as Cart)
    } catch {
      localStorage.removeItem(CART_ID_KEY)
      setCart(null)
    }
  }, [])

  const addItem = useCallback(async (variantId: string, quantity = 1) => {
    setLoading(true)
    try {
      const cartId = await getOrCreateCart()
      if (!cartId) throw new Error('Backend tidak tersedia')
      const { cart } = await medusa.carts.lineItems.create(cartId, {
        variant_id: variantId,
        quantity,
      })
      setCart(cart as unknown as Cart)
    } finally {
      setLoading(false)
    }
  }, [getOrCreateCart])

  const removeItem = useCallback(async (lineItemId: string) => {
    const cartId = localStorage.getItem(CART_ID_KEY)
    if (!cartId) return
    setLoading(true)
    try {
      const { cart } = await medusa.carts.lineItems.delete(cartId, lineItemId)
      setCart(cart as unknown as Cart)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateQuantity = useCallback(async (lineItemId: string, quantity: number) => {
    const cartId = localStorage.getItem(CART_ID_KEY)
    if (!cartId) return
    setLoading(true)
    try {
      const { cart } = await medusa.carts.lineItems.update(cartId, lineItemId, {
        quantity,
      })
      setCart(cart as unknown as Cart)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    getOrCreateCart().finally(() => setLoading(false))
  }, [getOrCreateCart])

  return (
    <CartContext.Provider
      value={{ cart, loading, totalItems, addItem, removeItem, updateQuantity, refreshCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
