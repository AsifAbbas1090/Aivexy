import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import GuestPostReviewPanel from '@/components/admin/GuestPostReviewPanel'

export const metadata = { title: 'Guest Post Queue' }

export default async function GuestPostsAdminPage({ searchParams }: { searchParams: { status?: string } }) {
  const status = searchParams.status

  const validStatuses = ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'PUBLISHED']
  const where = status && validStatuses.includes(status) ? { status: status as any } : {}

  const submissions = await prisma.guestPost.findMany({
    where,
    orderBy: { submittedAt: 'desc' },
  })

  const counts = await prisma.guestPost.groupBy({
    by: ['status'],
    _count: true,
  })
  const countMap = Object.fromEntries(counts.map(c => [c.status, c._count]))

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Guest Post Queue</h1>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[null, 'PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'PUBLISHED'].map(s => (
          <a
            key={s ?? 'all'}
            href={s ? `/guest-posts?status=${s}` : '/guest-posts'}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              (status ?? null) === s
                ? 'bg-brand-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {s ?? 'All'} {s && countMap[s] ? `(${countMap[s]})` : ''}
          </a>
        ))}
      </div>

      <div className="space-y-4">
        {submissions.length === 0 ? (
          <div className="text-center py-16 text-gray-500">No submissions found.</div>
        ) : submissions.map(sub => (
          <GuestPostReviewPanel key={sub.id} submission={sub} />
        ))}
      </div>
    </div>
  )
}
