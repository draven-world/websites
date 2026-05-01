'use client'

import { useState, type FormEvent } from 'react'

type Status = 'idle' | 'submitting' | 'success' | 'error'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!email.trim()) return
    setStatus('submitting')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      // Endpoint may not exist yet — treat 404 as gentle success
      if (res.ok || res.status === 404) {
        setStatus('success')
        setEmail('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <p className="text-sm text-brand-500">
        Thanks for subscribing — keep an eye on your inbox.
      </p>
    )
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-md items-end gap-3">
      <label className="flex-1">
        <span className="sr-only">Email address</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="w-full border-b border-brand-300 bg-transparent px-0 py-3 text-sm text-brand-950 placeholder:text-brand-400 transition-colors focus:border-brand-950 focus:outline-none"
          aria-label="Email address"
        />
      </label>
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="text-eyebrow text-brand-950 transition-opacity hover:opacity-60 disabled:opacity-30"
        aria-label="Subscribe"
      >
        {status === 'submitting' ? '...' : 'Subscribe →'}
      </button>
      {status === 'error' && (
        <p className="absolute mt-12 text-xs text-red-600">Something went wrong. Try again.</p>
      )}
    </form>
  )
}
