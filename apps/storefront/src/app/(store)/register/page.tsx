'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/providers/auth-provider'

export default function RegisterPage() {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
  })
  const [error, setError] = useState('')
  const { register, user } = useAuth()
  const router = useRouter()

  if (user) {
    router.replace('/account')
    return null
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!form.first_name.trim() || !form.email.trim() || !form.password.trim()) {
      setError('Please fill in all required fields')
      return
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    const result = register(form)
    if (result.success) {
      router.push('/account')
    } else {
      setError(result.error || 'Registration failed')
    }
  }

  return (
    <div className="mx-auto max-w-sm px-5 py-20 lg:py-32">
      <h1 className="text-center text-2xl font-medium tracking-tightest text-brand-950">
        Create Account
      </h1>

      <form onSubmit={handleSubmit} className="mt-10 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-[11px] uppercase tracking-widest text-brand-400">
              First Name *
            </label>
            <input
              type="text"
              value={form.first_name}
              onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
              className="input-field"
              placeholder="First name"
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
              placeholder="Last name"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-[11px] uppercase tracking-widest text-brand-400">
            Email *
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="input-field"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="mb-2 block text-[11px] uppercase tracking-widest text-brand-400">
            Phone (WhatsApp)
          </label>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="input-field"
            placeholder="08xxxxxxxxxx"
          />
        </div>

        <div>
          <label className="mb-2 block text-[11px] uppercase tracking-widest text-brand-400">
            Password *
          </label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            className="input-field"
            placeholder="Min. 6 characters"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <button type="submit" className="btn-primary w-full py-4">
          Create Account
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-brand-400">
        Already have an account?{' '}
        <Link href="/login" className="text-brand-950 underline underline-offset-4 transition-opacity hover:opacity-60">
          Sign in
        </Link>
      </p>
    </div>
  )
}
