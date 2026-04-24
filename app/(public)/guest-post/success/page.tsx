import Link from 'next/link'
import { CheckCircle2, Clock, Mail } from 'lucide-react'

export const metadata = { title: 'Submission Received' }

export default function GuestPostSuccessPage({
  searchParams,
}: {
  searchParams: { id?: string }
}) {
  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-24 text-center">
      <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Payment Received!
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
        Your article has been submitted successfully. Our editorial team will review it and get back to you within the stated timeline.
      </p>

      {searchParams.id && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 mb-8 text-left">
          <p className="text-xs text-gray-400 mb-1">Submission ID</p>
          <p className="font-mono text-sm text-gray-700 dark:text-gray-300 break-all">{searchParams.id}</p>
        </div>
      )}

      <div className="flex flex-col gap-4 text-sm text-gray-600 dark:text-gray-400 mb-10">
        <div className="flex items-center gap-3 justify-center">
          <Clock className="w-4 h-4 text-brand-500" />
          <span>Editorial review within your chosen tier timeline</span>
        </div>
        <div className="flex items-center gap-3 justify-center">
          <Mail className="w-4 h-4 text-brand-500" />
          <span>You will receive an email update on your submission status</span>
        </div>
      </div>

      <Link href="/" className="inline-block px-8 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-xl font-semibold transition-colors">
        Back to Home
      </Link>
    </div>
  )
}
