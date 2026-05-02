import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Categories — Aivexy',
  description: 'Browse all topics covered on Aivexy — AI tools, SEO, productivity, prompt engineering, and more.',
}

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { posts: { where: { published: true } } } },
    },
    orderBy: { name: 'asc' },
  })

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100">Browse Topics</h1>
        <p className="mt-3 text-gray-500 dark:text-gray-400 text-lg">
          Explore {categories.length} categories covering AI, writing, SEO, and content strategy.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map(cat => (
          <Link
            key={cat.id}
            href={`/category/${cat.slug}`}
            className="group flex flex-col p-6 rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div
              className="w-10 h-10 rounded-xl mb-4 flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: cat.color || '#6366f1' }}
            >
              {cat.name[0]}
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors">
              {cat.name}
            </h2>
            {cat.description && (
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 flex-1">{cat.description}</p>
            )}
            <p className="mt-4 text-xs font-medium text-gray-400">
              {cat._count.posts} article{cat._count.posts !== 1 ? 's' : ''}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
