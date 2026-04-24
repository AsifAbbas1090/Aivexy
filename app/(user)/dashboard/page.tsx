import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { FileText, Eye, ArrowRight, Shield } from 'lucide-react'

export const metadata = { title: 'Dashboard' }

export default async function UserDashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/signin')

  const role = (session.user as any).role
  // Admins go to the admin dashboard
  if (role === 'ADMIN') redirect('/admin/dashboard')

  const userId = (session.user as any).id

  const posts = await prisma.post.findMany({
    where: { authorId: userId },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  const totalViews = posts.reduce((sum, p) => sum + p.views, 0)
  const published = posts.filter(p => p.published).length

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Welcome back, {session.user.name?.split(' ')[0] ?? 'there'}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{session.user.email}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300">
            {role}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-brand-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Published</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{published}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
            <div className="flex items-center gap-3 mb-2">
              <Eye className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Total Views</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{totalViews.toLocaleString()}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-5">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="w-5 h-5 text-yellow-500" />
              <span className="text-sm text-gray-500 dark:text-gray-400">Drafts</span>
            </div>
            <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{posts.length - published}</p>
          </div>
        </div>

        {/* Articles */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">Your Articles</h2>
            <Link href="/blog" className="text-sm text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
              View blog <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {posts.length > 0 ? (
            <div className="divide-y divide-gray-100 dark:divide-gray-800">
              {posts.map(post => (
                <div key={post.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-sm font-medium text-gray-900 dark:text-gray-100 hover:text-brand-600 dark:hover:text-brand-400 truncate block"
                    >
                      {post.title}
                    </Link>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {post.category.name} · {post.publishedAt ? formatDate(post.publishedAt) : 'Draft'}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 ml-4 shrink-0">
                    <span className="text-xs text-gray-400">{post.views.toLocaleString()} views</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      post.published
                        ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                        : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                    }`}>
                      {post.published ? 'Live' : 'Draft'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="px-6 py-16 text-center text-gray-400">
              <p>No articles yet.</p>
            </div>
          )}
        </div>

        {/* Guest post CTA */}
        <div className="mt-6 p-6 bg-brand-50 dark:bg-brand-950 rounded-2xl border border-brand-200 dark:border-brand-800 flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-brand-900 dark:text-brand-100">Want to publish on Aivexy?</p>
            <p className="text-sm text-brand-600 dark:text-brand-400 mt-0.5">Submit a guest post — reach thousands of AI & writing enthusiasts.</p>
          </div>
          <Link
            href="/guest-post/submit"
            className="shrink-0 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors"
          >
            Submit Post
          </Link>
        </div>
      </div>
    </div>
  )
}
