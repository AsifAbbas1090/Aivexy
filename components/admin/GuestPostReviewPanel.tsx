'use client'

import { useState } from 'react'
import { formatDate, formatCurrency } from '@/lib/utils'
import { ChevronDown, ChevronUp, CheckCircle2, XCircle, RefreshCw, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface GuestPost {
  id: string
  title: string
  content: string
  authorName: string
  authorEmail: string
  authorBio?: string | null
  tier: string
  status: string
  paid: boolean
  adminNotes?: string | null
  submittedAt: Date
}

const tierPrices: Record<string, number> = { BASIC: 4900, FEATURED: 9900, SPONSORED: 19900 }
const statusColors: Record<string, string> = {
  PENDING: 'bg-amber-500/10 text-amber-400',
  UNDER_REVIEW: 'bg-blue-500/10 text-blue-400',
  APPROVED: 'bg-green-500/10 text-green-400',
  REJECTED: 'bg-red-500/10 text-red-400',
  PUBLISHED: 'bg-purple-500/10 text-purple-400',
  REVISION_REQUESTED: 'bg-orange-500/10 text-orange-400',
}

export default function GuestPostReviewPanel({ submission }: { submission: GuestPost }) {
  const router = useRouter()
  const [expanded, setExpanded] = useState(false)
  const [notes, setNotes] = useState(submission.adminNotes || '')
  const [loading, setLoading] = useState<string | null>(null)

  async function handleAction(action: 'approve' | 'reject' | 'revision') {
    setLoading(action)
    await fetch(`/api/admin/guest-posts/${submission.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, adminNotes: notes }),
    })
    setLoading(null)
    router.refresh()
  }

  return (
    <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
      <div
        className="flex items-center gap-4 p-5 cursor-pointer hover:bg-gray-800/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[submission.status] || 'bg-gray-700 text-gray-400'}`}>
              {submission.status}
            </span>
            <span className="text-xs text-brand-400 font-medium">{submission.tier}</span>
            {submission.paid && <span className="text-xs text-green-400">✓ Paid ({formatCurrency(tierPrices[submission.tier] || 0)})</span>}
          </div>
          <p className="font-medium text-white truncate">{submission.title}</p>
          <p className="text-xs text-gray-400 mt-0.5">{submission.authorName} · {submission.authorEmail} · {formatDate(submission.submittedAt)}</p>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
      </div>

      {expanded && (
        <div className="border-t border-gray-800 p-5 space-y-5">
          {/* Author info */}
          <div className="text-sm text-gray-400">
            <p><span className="text-gray-300 font-medium">Author:</span> {submission.authorName} &lt;{submission.authorEmail}&gt;</p>
            {submission.authorBio && <p className="mt-1">{submission.authorBio}</p>}
          </div>

          {/* Article content preview */}
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Article Content</p>
            <div className="bg-gray-800 rounded-xl p-4 max-h-80 overflow-y-auto text-sm text-gray-300 leading-relaxed whitespace-pre-wrap font-mono">
              {submission.content}
            </div>
          </div>

          {/* Admin notes */}
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Admin Notes</p>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              placeholder="Leave feedback for the author..."
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => handleAction('approve')}
              disabled={!!loading}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
            >
              {loading === 'approve' ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
              Approve & Publish
            </button>
            <button
              onClick={() => handleAction('revision')}
              disabled={!!loading}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
            >
              {loading === 'revision' ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              Request Revision
            </button>
            <button
              onClick={() => handleAction('reject')}
              disabled={!!loading}
              className="flex items-center gap-2 px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
            >
              {loading === 'reject' ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-4 h-4" />}
              Reject
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
