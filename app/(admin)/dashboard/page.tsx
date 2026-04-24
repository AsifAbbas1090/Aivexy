import { prisma } from '@/lib/prisma'
import StatsCard from '@/components/admin/StatsCard'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { FileText, Eye, Inbox, DollarSign, Plus, ArrowRight } from 'lucide-react'

export const metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const [
    totalPosts,
    publishedPosts,
    totalViews,
    pendingGuestPosts,
    paidGuestPosts,
    recentPosts,
    recentSubmissions,
  ] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { published: true } }),
    prisma.post.aggregate({ _sum: { views: true } }),
    prisma.guestPost.count({ where: { status: 'PENDING' } }),
    prisma.guestPost.findMany({ where: { paid: true }, select: { tier: true } }),
    prisma.post.findMany({
      include: { author: true, category: true },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    }),
    prisma.guestPost.findMany({
      orderBy: { submittedAt: 'desc' },
      take: 5,
    }),
  ])

  const tierPrices: Record<string, number> = { BASIC: 49, FEATURED: 99, SPONSORED: 199 }
  const revenue = paidGuestPosts.reduce((sum, gp) => sum + (tierPrices[gp.tier] || 0), 0)

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <Link href="/posts/new" className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> New Post
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatsCard label="Total Posts" value={totalPosts} icon={FileText} color="blue" sub={`${publishedPosts} published`} />
        <StatsCard label="Total Views" value={(totalViews._sum.views ?? 0).toLocaleString()} icon={Eye} color="green" />
        <StatsCard label="Pending Reviews" value={pendingGuestPosts} icon={Inbox} color="amber" sub="guest submissions" />
        <StatsCard label="Revenue" value={`$${revenue}`} icon={DollarSign} color="purple" sub="from guest posts" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-white">Recent Posts</h2>
            <Link href="/posts" className="text-sm text-brand-400 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentPosts.map(post => (
              <div key={post.id} className="flex items-center gap-3">
                <span className={`w-2 h-2 rounded-full shrink-0 ${post.published ? 'bg-green-500' : 'bg-gray-600'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-200 truncate">{post.title}</p>
                  <p className="text-xs text-gray-500">{post.category.name} · {formatDate(post.updatedAt)}</p>
                </div>
                <Link href={`/posts/${post.id}/edit`} className="text-xs text-brand-400 hover:underline shrink-0">Edit</Link>
              </div>
            ))}
          </div>
        </div>

        {/* Guest Post Queue */}
        <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-white">Guest Post Queue</h2>
            <Link href="/guest-posts" className="text-sm text-brand-400 hover:underline flex items-center gap-1">
              Review all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentSubmissions.length === 0 ? (
              <p className="text-sm text-gray-500">No submissions yet.</p>
            ) : recentSubmissions.map(sub => (
              <div key={sub.id} className="flex items-center gap-3">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  sub.status === 'PENDING' ? 'bg-amber-500/10 text-amber-400' :
                  sub.status === 'APPROVED' ? 'bg-green-500/10 text-green-400' :
                  sub.status === 'REJECTED' ? 'bg-red-500/10 text-red-400' :
                  'bg-gray-700 text-gray-400'
                }`}>{sub.status}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-200 truncate">{sub.title}</p>
                  <p className="text-xs text-gray-500">{sub.authorName} · {sub.tier} · {formatDate(sub.submittedAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
