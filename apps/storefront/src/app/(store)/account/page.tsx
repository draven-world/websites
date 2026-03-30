'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/providers/auth-provider'
import { useToast } from '@/providers/toast-provider'

export default function AccountPage() {
  const { user, loading, orders, logout, updateProfile } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    phone: '',
  })

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-5 w-5 animate-spin border-2 border-brand-950 border-t-transparent" />
      </div>
    )
  }

  if (!user) {
    router.replace('/login')
    return null
  }

  function startEditing() {
    if (!user) return
    setForm({
      first_name: user.first_name,
      last_name: user.last_name,
      phone: user.phone,
    })
    setEditing(true)
  }

  function saveProfile(e: React.FormEvent) {
    e.preventDefault()
    updateProfile(form)
    setEditing(false)
    toast('Profile updated')
  }

  function handleLogout() {
    logout()
    router.push('/')
  }

  const recentOrders = orders.slice(0, 3)

  return (
    <div className="mx-auto max-w-container px-5 py-10 lg:px-8 lg:py-16">
      <div className="flex items-baseline justify-between">
        <h1 className="text-2xl font-medium tracking-tightest text-brand-950 md:text-3xl">
          Account
        </h1>
        <button
          onClick={handleLogout}
          className="text-[11px] uppercase tracking-widest text-brand-400 transition-colors hover:text-brand-950"
        >
          Sign Out
        </button>
      </div>

      <div className="mt-10 grid gap-12 lg:grid-cols-2">
        {/* Profile */}
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-[13px] uppercase tracking-widest text-brand-950">Profile</h2>
            {!editing && (
              <button
                onClick={startEditing}
                className="text-[11px] uppercase tracking-widest text-brand-400 transition-colors hover:text-brand-950"
              >
                Edit
              </button>
            )}
          </div>

          {editing ? (
            <form onSubmit={saveProfile} className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-2 block text-[11px] uppercase tracking-widest text-brand-400">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={form.first_name}
                    onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-[11px] uppercase tracking-widest text-brand-400">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={form.last_name}
                    onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
                    className="input-field"
                  />
                </div>
              </div>
              <div>
                <label className="mb-2 block text-[11px] uppercase tracking-widest text-brand-400">
                  Phone
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="input-field"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1 py-3">
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="btn-secondary flex-1 py-3"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-6 space-y-3 border-t border-brand-200 pt-6">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-brand-400">Name</p>
                <p className="mt-1 text-sm text-brand-950">
                  {user.first_name} {user.last_name}
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-widest text-brand-400">Email</p>
                <p className="mt-1 text-sm text-brand-950">{user.email}</p>
              </div>
              {user.phone && (
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-brand-400">Phone</p>
                  <p className="mt-1 text-sm text-brand-950">{user.phone}</p>
                </div>
              )}
              <div>
                <p className="text-[11px] uppercase tracking-widest text-brand-400">Member Since</p>
                <p className="mt-1 text-sm text-brand-950">
                  {new Date(user.created_at).toLocaleDateString('id-ID', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-[13px] uppercase tracking-widest text-brand-950">Recent Orders</h2>
            {orders.length > 3 && (
              <Link
                href="/account/orders"
                className="text-[11px] uppercase tracking-widest text-brand-400 transition-colors hover:text-brand-950"
              >
                View All
              </Link>
            )}
          </div>

          {recentOrders.length > 0 ? (
            <div className="mt-6 space-y-3 border-t border-brand-200 pt-6">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between border-b border-brand-100 pb-3">
                  <div>
                    <p className="text-sm text-brand-950">{order.id}</p>
                    <p className="mt-0.5 text-xs text-brand-400">
                      {new Date(order.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                      {' · '}
                      {order.items.length} item{order.items.length > 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-brand-950">
                      {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(order.total)}
                    </p>
                    <span className={`mt-0.5 inline-block text-[10px] uppercase tracking-widest ${
                      order.status === 'delivered' ? 'text-green-600' :
                      order.status === 'shipped' ? 'text-blue-600' :
                      order.status === 'paid' || order.status === 'processing' ? 'text-brand-950' :
                      'text-brand-400'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 border-t border-brand-200 pt-10 text-center">
              <p className="text-sm text-brand-400">No orders yet</p>
              <Link href="/products" className="btn-primary mt-6 inline-flex">
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
