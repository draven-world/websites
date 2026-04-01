'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/providers/auth-provider'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const { login, user } = useAuth()
  const router = useRouter()

  if (user) {
    router.replace('/account')
    return null
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields')
      return
    }

    const result = login(email, password)
    if (result.success) {
      router.push('/account')
    } else {
      setError(result.error || 'Login failed')
    }
  }

  return (
    <div className="mx-auto max-w-sm px-5 py-20 lg:py-32">
      <h1 className="text-center text-2xl font-medium tracking-tightest text-brand-950">
        Sign In
      </h1>

      <form onSubmit={handleSubmit} className="mt-10 space-y-5">
        <div>
          <label className="mb-2 block text-[11px] uppercase tracking-widest text-brand-400">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (fieldErrors.email) setFieldErrors((f) => ({ ...f, email: undefined }))
            }}
            onBlur={() => {
              if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                setFieldErrors((f) => ({ ...f, email: 'Format email tidak valid' }))
            }}
            className={`input-field ${fieldErrors.email ? 'border-red-500' : email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'border-green-500' : ''}`}
            placeholder="your@email.com"
          />
          {fieldErrors.email && <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>}
        </div>

        <div>
          <label className="mb-2 block text-[11px] uppercase tracking-widest text-brand-400">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            placeholder="Password"
          />
        </div>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <button type="submit" className="btn-primary w-full py-4">
          Sign In
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-brand-400">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="text-brand-950 underline underline-offset-4 transition-opacity hover:opacity-60">
          Create one
        </Link>
      </p>
    </div>
  )
}
