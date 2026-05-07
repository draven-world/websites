'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/providers/auth-provider'

export default function AccountPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-5 w-5 animate-spin border-2 border-ink-100 border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    router.replace('/login')
    return null
  }

  const greeting = user.first_name || user.email?.split('@')[0] || 'FRIEND'

  function handleLogout() {
    logout()
    router.push('/')
  }

  return (
    <div className="mx-auto max-w-2xl px-8 pt-32 lg:pt-40 pb-32">
      <h1 className="text-[clamp(1.5rem,3.5vw,2.5rem)] uppercase font-bold tracking-tighter text-ink-100 leading-[1.05]">
        HELLO, {String(greeting).toUpperCase()}
      </h1>
      <div className="mt-12 flex flex-col">
        <Link
          href="/account/orders"
          className="border-t border-ink-700 py-6 flex items-center justify-between text-sm uppercase font-bold text-ink-100 hover:text-accent-lime transition-colors"
        >
          <span>ORDERS</span>
          <span>→</span>
        </Link>
        <Link
          href="/account#address"
          className="border-t border-ink-700 py-6 flex items-center justify-between text-sm uppercase font-bold text-ink-100 hover:text-accent-lime transition-colors"
        >
          <span>ADDRESS BOOK</span>
          <span>→</span>
        </Link>
        <button
          onClick={handleLogout}
          className="border-t border-b border-ink-700 py-6 flex items-center justify-between text-sm uppercase font-bold text-ink-100 hover:text-accent-lime transition-colors text-left"
        >
          <span>LOG OUT</span>
          <span>→</span>
        </button>
      </div>
    </div>
  )
}
