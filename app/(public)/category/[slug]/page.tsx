import { prisma } from '@/lib/prisma'
import ArticleCard from '@/components/blog/ArticleCard'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const category = await prisma.category.findUnique({ where: { slug: params.slug } })
  if (!category) return {}
  return {
    title: category.name,
    description: category.description ?? `Browse all articles in ${category.name}.`,
  }
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const [category, posts] = await Promise.all([
    prisma.category.findUnique({ where: { slug: params.slug } }),
    prisma.post.findMany({
      where: { published: true, category: { slug: params.slug } },
      include: { author: true, category: true },
      orderBy: { publishedAt: 'desc' },
      take: 24,
    }),
  ])

  if (!category) notFound()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <span
          className="inline-block px-3 py-1 rounded-full text-xs font-semibold text-white mb-3"
          style={{ backgroundColor: category.color || '#6366f1' }}
        >
          Category
        </span>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">{category.name}</h1>
        {category.description && (
          <p className="mt-3 text-gray-500 dark:text-gray-400 max-w-2xl">{category.description}</p>
        )}
        <p className="mt-2 text-sm text-gray-400">{posts.length} article{posts.length !== 1 ? 's' : ''}</p>
      </div>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <ArticleCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg">No articles in this category yet.</p>
        </div>
      )}
    </div>
  )
}
