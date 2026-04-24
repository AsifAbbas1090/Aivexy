'use client'

import { useState } from 'react'
import { Loader2, Mail, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error' | 'duplicate'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.ok) setStatus('success')
      else if (data.error === 'already_subscribed') setStatus('duplicate')
      else setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
        <CheckCircle2 className="w-5 h-5 shrink-0" />
        <span>You&apos;re subscribed! Check your inbox.</span>
      </div>
    )
  }

  if (status === 'duplicate') {
    return (
      <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm">
        <Mail className="w-5 h-5 shrink-0" />
        <span>You&apos;re already subscribed. Thanks!</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={cn('flex gap-2', compact ? 'flex-col' : 'flex-col sm:flex-row')}>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        placeholder="your@email.com"
        className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60 whitespace-nowrap"
      >
        {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        Subscribe
      </button>
      {status === 'error' && (
        <p className="text-xs text-red-500 mt-1">Something went wrong. Try again.</p>
      )}
    </form>
  )
}
