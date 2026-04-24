import { prisma } from '@/lib/prisma'
import ArticleCard from '@/components/blog/ArticleCard'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { Globe, Twitter } from 'lucide-react'

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  const user = await prisma.user.findUnique({ where: { username: params.username } })
  if (!user) return {}
  return {
    title: user.name ?? params.username,
    description: user.bio ?? `Articles by ${user.name ?? params.username} on Aivexy.`,
  }
}

export default async function AuthorPage({ params }: { params: { username: string } }) {
  const user = await prisma.user.findUnique({
    where: { username: params.username },
    include: {
      posts: {
        where: { published: true },
        include: { author: true, category: true },
        orderBy: { publishedAt: 'desc' },
        take: 20,
      },
    },
  })

  if (!user) notFound()

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Author card */}
      <div className="flex items-start gap-6 mb-12 p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
        {user.image ? (
          <img src={user.image} alt={user.name ?? ''} className="w-20 h-20 rounded-full object-cover shrink-0" />
        ) : (
          <div className="w-20 h-20 rounded-full bg-brand-600 text-white text-3xl font-bold flex items-center justify-center shrink-0">
            {user.name?.[0] ?? 'A'}
          </div>
        )}
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{user.name}</h1>
          <p className="text-sm text-gray-400 mb-3">@{user.username}</p>
          {user.bio && <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">{user.bio}</p>}
          <div className="flex items-center gap-4 text-sm">
            {user.website && (
              <a href={user.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-gray-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                <Globe className="w-4 h-4" /> Website
              </a>
            )}
            {user.twitter && (
              <a href={`https://twitter.com/${user.twitter}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-gray-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                <Twitter className="w-4 h-4" /> @{user.twitter}
              </a>
            )}
            <span className="text-gray-400">{user.posts.length} article{user.posts.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {/* Articles */}
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">Articles</h2>
      {user.posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {user.posts.map(post => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-gray-400 text-center py-16">No published articles yet.</p>
      )}
    </div>
  )
}
