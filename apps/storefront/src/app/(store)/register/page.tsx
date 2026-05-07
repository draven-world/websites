'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/providers/auth-provider'
import UnderlineInput from '@/components/ui/UnderlineInput'

export default function RegisterPage() {
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const { register, user } = useAuth()
  const router = useRouter()

  function validateEmail(v: string) {
    if (!v.trim()) return 'Required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'Format email tidak valid'
    return null
  }
  function validatePhone(v: string) {
    if (!v.trim()) return null // optional
    if (!/^08\d{8,11}$/.test(v.replace(/\s/g, ''))) return 'Format: 08xxxxxxxxxx'
    return null
  }
  function clearFieldError(field: string) {
    setFieldErrors((prev) => {
      const n = { ...prev }
      delete n[field]
      return n
    })
  }

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

    setLoading(true)
    const result = register(form)
    setLoading(false)
    if (result.success) {
      router.push('/account')
    } else {
      setError(result.error || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-8">
      <div className="w-full max-w-md">
        <h1 className="text-[clamp(1.5rem,3.5vw,2.5rem)] uppercase font-bold tracking-tighter text-ink-100 leading-[1.05]">
          SIGN UP
        </h1>
        <form onSubmit={handleSubmit} className="mt-12 flex flex-col gap-6">
          <UnderlineInput
            label="FIRST NAME"
            id="firstName"
            name="firstName"
            value={form.first_name}
            onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
            required
          />
          <UnderlineInput
            label="LAST NAME"
            id="lastName"
            name="lastName"
            value={form.last_name}
            onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
          />
          <UnderlineInput
            label="EMAIL"
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={(e) => {
              setForm((f) => ({ ...f, email: e.target.value }))
              if (fieldErrors.email) clearFieldError('email')
            }}
            onBlur={() => {
              const err = validateEmail(form.email)
              if (err) setFieldErrors((p) => ({ ...p, email: err }))
            }}
            required
          />
          {fieldErrors.email && (
            <p className="text-[0.75rem] uppercase tracking-[0.15em] text-red-400 -mt-4">
              {fieldErrors.email}
            </p>
          )}
          <UnderlineInput
            label="PHONE (WHATSAPP) — OPTIONAL"
            type="tel"
            id="phone"
            name="phone"
            value={form.phone}
            onChange={(e) => {
              setForm((f) => ({ ...f, phone: e.target.value }))
              if (fieldErrors.phone) clearFieldError('phone')
            }}
            onBlur={() => {
              const err = validatePhone(form.phone)
              if (err) setFieldErrors((p) => ({ ...p, phone: err }))
            }}
            placeholder="08xxxxxxxxxx"
          />
          {fieldErrors.phone && (
            <p className="text-[0.75rem] uppercase tracking-[0.15em] text-red-400 -mt-4">
              {fieldErrors.phone}
            </p>
          )}
          <UnderlineInput
            label="PASSWORD"
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={(e) => {
              setForm((f) => ({ ...f, password: e.target.value }))
              if (fieldErrors.password) clearFieldError('password')
            }}
            onBlur={() => {
              if (form.password && form.password.length < 6)
                setFieldErrors((p) => ({ ...p, password: 'Min. 6 karakter' }))
            }}
            required
          />
          {fieldErrors.password && (
            <p className="text-[0.75rem] uppercase tracking-[0.15em] text-red-400 -mt-4">
              {fieldErrors.password}
            </p>
          )}
          {error && (
            <p className="text-[0.75rem] uppercase tracking-[0.15em] text-red-400">{error}</p>
          )}
          <button type="submit" className="btn-primary w-full mt-4" disabled={loading}>
            {loading ? 'CREATING…' : 'SIGN UP'}
          </button>
        </form>
        <Link
          href="/login"
          className="mt-8 block text-[0.75rem] uppercase tracking-[0.15em] text-ink-300 hover:text-accent-lime transition-colors"
        >
          ALREADY A MEMBER? LOG IN →
        </Link>
      </div>
    </div>
  )
}
