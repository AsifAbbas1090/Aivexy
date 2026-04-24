import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { Plus, Edit2, Eye } from 'lucide-react'
import DeletePostButton from '@/components/admin/DeletePostButton'
import { cn } from '@/lib/utils'

export const metadata = { title: 'Posts' }

export default async function PostsPage({ searchParams }: { searchParams: { status?: string } }) {
  const status = searchParams.status || 'all'

  const where = status === 'published' ? { published: true }
    : status === 'draft' ? { published: false }
    : {}

  const posts = await prisma.post.findMany({
    where,
    include: { author: true, category: true },
    orderBy: { updatedAt: 'desc' },
  })

  const tabs = ['all', 'published', 'draft']

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Posts</h1>
        <Link href="/admin/posts/new" className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> New Post
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-900 rounded-xl p-1 w-fit border border-gray-800">
        {tabs.map(tab => (
          <Link
            key={tab}
            href={tab === 'all' ? '/admin/posts' : `/admin/posts?status=${tab}`}
            className={cn('px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors', status === tab ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white')}
          >
            {tab}
          </Link>
        ))}
      </div>

      <div className="bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-6 py-4">Title</th>
              <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-4 hidden md:table-cell">Category</th>
              <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-4 hidden lg:table-cell">Status</th>
              <th className="text-right text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-4 hidden lg:table-cell">Views</th>
              <th className="text-left text-xs font-medium text-gray-400 uppercase tracking-wider px-4 py-4 hidden xl:table-cell">Updated</th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {posts.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-gray-500">No posts yet.</td></tr>
            ) : posts.map(post => (
              <tr key={post.id} className="hover:bg-gray-800/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="text-white font-medium truncate max-w-[280px]">{post.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{post.author.name}</p>
                </td>
                <td className="px-4 py-4 hidden md:table-cell">
                  <span className="text-xs text-gray-400">{post.category.name}</span>
                </td>
                <td className="px-4 py-4 hidden lg:table-cell">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${post.published ? 'bg-green-500/10 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                    {post.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-4 py-4 text-right hidden lg:table-cell">
                  <span className="text-gray-400 text-xs flex items-center gap-1 justify-end">
                    <Eye className="w-3.5 h-3.5" />{post.views.toLocaleString()}
                  </span>
                </td>
                <td className="px-4 py-4 hidden xl:table-cell">
                  <span className="text-gray-500 text-xs">{formatDate(post.updatedAt)}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    {post.published && (
                      <a href={`/blog/${post.slug}`} target="_blank" className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </a>
                    )}
                    <Link href={`/admin/posts/${post.id}/edit`} className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700 transition-colors" title="Edit">
                      <Edit2 className="w-4 h-4" />
                    </Link>
                    <DeletePostButton id={post.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
