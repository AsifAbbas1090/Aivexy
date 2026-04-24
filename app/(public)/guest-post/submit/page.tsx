'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Loader2, ChevronRight, ChevronLeft, Check } from 'lucide-react'

const TIER_LABELS: Record<string, { label: string; price: number }> = {
  BASIC: { label: 'Basic', price: 49 },
  FEATURED: { label: 'Featured', price: 99 },
  SPONSORED: { label: 'Sponsored', price: 199 },
}

export default function GuestPostSubmitPage() {
  const params = useSearchParams()
  const router = useRouter()
  const defaultTier = params.get('tier') || 'BASIC'

  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    title: '',
    content: '',
    category: '',
    authorName: '',
    authorEmail: '',
    authorBio: '',
    authorWebsite: '',
    tier: defaultTier,
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit() {
    setLoading(true)
    setError('')
    try {
      // Create guest post record
      const createRes = await fetch('/api/guest-posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!createRes.ok) throw new Error('Failed to save submission')
      const { id } = await createRes.json()

      // Create Stripe checkout
      const checkoutRes = await fetch('/api/guest-posts/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: form.tier, guestPostId: id }),
      })
      if (!checkoutRes.ok) throw new Error('Failed to create checkout')
      const { url } = await checkoutRes.json()

      if (url) {
        window.location.href = url
      } else {
        router.push(`/guest-post/success?id=${id}`)
      }
    } catch (e: any) {
      setError(e.message || 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  const selectedTier = TIER_LABELS[form.tier] || TIER_LABELS.BASIC

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Submit Your Article</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-10">Complete all steps to submit your guest post.</p>

      {/* Steps */}
      <div className="flex items-center gap-3 mb-10">
        {['Article Details', 'Author Info', 'Select Tier & Pay'].map((label, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              step === i + 1 ? 'bg-brand-600 text-white' : step > i + 1 ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
            }`}>
              {step > i + 1 ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <span className={`text-sm font-medium hidden sm:block ${step === i + 1 ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400'}`}>{label}</span>
            {i < 2 && <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600" />}
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8">
        {error && (
          <div className="mb-6 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg">{error}</div>
        )}

        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Article Details</h2>
            <Field label="Article Title" required>
              <input name="title" value={form.title} onChange={handleChange} placeholder="e.g., How I Used Claude to 10x My Blog Output" className={inputCls} />
            </Field>
            <Field label="Category" required>
              <select name="category" value={form.category} onChange={handleChange} className={inputCls}>
                <option value="">Select a category</option>
                {['AI Tools', 'SEO', 'Productivity', 'Prompt Engineering', 'Monetization', 'Case Studies', 'AI Writing Ethics'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </Field>
            <Field label="Article Content (Markdown)" required>
              <textarea name="content" value={form.content} onChange={handleChange} rows={12} placeholder="Write your full article here in Markdown format. Minimum 800 words." className={inputCls} />
            </Field>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Your Details</h2>
            <Field label="Full Name" required>
              <input name="authorName" value={form.authorName} onChange={handleChange} placeholder="Jane Smith" className={inputCls} />
            </Field>
            <Field label="Email Address" required>
              <input name="authorEmail" value={form.authorEmail} onChange={handleChange} type="email" placeholder="jane@example.com" className={inputCls} />
            </Field>
            <Field label="Author Bio (displayed with your article)">
              <textarea name="authorBio" value={form.authorBio} onChange={handleChange} rows={3} placeholder="AI researcher and content strategist with 5 years of experience..." className={inputCls} />
            </Field>
            <Field label="Your Website URL">
              <input name="authorWebsite" value={form.authorWebsite} onChange={handleChange} placeholder="https://yoursite.com" className={inputCls} />
            </Field>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Choose Your Package</h2>
            <div className="space-y-3">
              {Object.entries(TIER_LABELS).map(([key, val]) => (
                <label key={key} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${form.tier === key ? 'border-brand-500 bg-brand-50 dark:bg-brand-950' : 'border-gray-200 dark:border-gray-700 hover:border-brand-300'}`}>
                  <input type="radio" name="tier" value={key} checked={form.tier === key} onChange={handleChange} className="accent-brand-600" />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">{val.label}</p>
                  </div>
                  <span className="text-xl font-bold text-brand-700 dark:text-brand-400">${val.price}</span>
                </label>
              ))}
            </div>
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm text-gray-600 dark:text-gray-400">
              You will be redirected to Stripe to complete your <strong className="text-gray-900 dark:text-gray-100">${selectedTier.price}</strong> payment securely. Your article will be reviewed within the stated timeline after payment.
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
          {step > 1 ? (
            <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : <div />}
          {step < 3 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={
                (step === 1 && (!form.title || !form.content || !form.category)) ||
                (step === 2 && (!form.authorName || !form.authorEmail))
              }
              className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
            >
              Continue <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-60"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Pay ${selectedTier.price} &amp; Submit
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

const inputCls = 'w-full px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500'

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  )
}
