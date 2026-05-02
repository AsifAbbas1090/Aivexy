import { Suspense } from 'react'
import GuestPostSubmitClient from './GuestPostSubmitClient'

export default function GuestPostSubmitPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center text-gray-500 dark:text-gray-400">
          Loading…
        </div>
      }
    >
      <GuestPostSubmitClient />
    </Suspense>
  )
}
