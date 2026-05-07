'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/providers/auth-provider'
import UnderlineInput from '@/components/ui/UnderlineInput'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
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

    setLoading(true)
    const result = login(email, password)
    setLoading(false)
    if (result.success) {
      router.push('/account')
    } else {
      setError(result.error || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-8">
      <div className="w-full max-w-md">
        <h1 className="text-[clamp(1.5rem,3.5vw,2.5rem)] uppercase font-bold tracking-tighter text-ink-100 leading-[1.05]">
          LOG IN
        </h1>
        <form onSubmit={handleSubmit} className="mt-12 flex flex-col gap-6">
          <UnderlineInput
            label="EMAIL"
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <UnderlineInput
            label="PASSWORD"
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && (
            <p className="text-[0.75rem] uppercase tracking-[0.15em] text-red-400">{error}</p>
          )}
          <button type="submit" className="btn-primary w-full mt-4" disabled={loading}>
            {loading ? 'LOGGING IN…' : 'LOG IN'}
          </button>
        </form>
        <Link
          href="/register"
          className="mt-8 block text-[0.75rem] uppercase tracking-[0.15em] text-ink-300 hover:text-accent-lime transition-colors"
        >
          NO ACCOUNT? CREATE ONE →
        </Link>
      </div>
    </div>
  )
}
