import { prisma } from '@/lib/prisma'
import ArticleCard from '@/components/blog/ArticleCard'
import CategoryBadge from '@/components/blog/CategoryBadge'
import AdSlot from '@/components/ads/AdSlot'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const PER_PAGE = 10

export const metadata = {
  title: 'Blog',
  description: 'All articles on AI tools, writing craft, SEO, prompt engineering, and content monetization.',
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { page?: string; category?: string }
}) {
  const page = Math.max(1, parseInt(searchParams.page ?? '1', 10))
  const categorySlug = searchParams.category

  const where = {
    published: true,
    ...(categorySlug ? { category: { slug: categorySlug } } : {}),
  }

  const [posts, totalCount, categories] = await Promise.all([
    prisma.post.findMany({
      where,
      include: { author: true, category: true },
      orderBy: { publishedAt: 'desc' },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
    prisma.post.count({ where }),
    prisma.category.findMany({ orderBy: { name: 'asc' } }),
  ])

  const totalPages = Math.ceil(totalCount / PER_PAGE)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">Blog</h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8">
        {totalCount} articles on AI, writing, and content creation
      </p>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-10">
        <Link
          href="/blog"
          className={cn(
            'px-4 py-2 rounded-full text-sm font-medium transition-colors',
            !categorySlug
              ? 'bg-brand-600 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          )}
        >
          All
        </Link>
        {categories.map(cat => (
          <Link
            key={cat.id}
            href={`/blog?category=${cat.slug}`}
            className={cn(
              'px-4 py-2 rounded-full text-sm font-medium transition-colors',
              categorySlug === cat.slug
                ? 'text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
            style={categorySlug === cat.slug ? { backgroundColor: cat.color || '#6366f1' } : {}}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10">
        {/* Articles */}
        <div>
          {posts.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {posts.map(post => (
                  <ArticleCard key={post.id} post={post} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-12">
                  {page > 1 && (
                    <Link
                      href={`/blog?page=${page - 1}${categorySlug ? `&category=${categorySlug}` : ''}`}
                      className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </Link>
                  )}
                  <span className="text-sm text-gray-500">
                    Page {page} of {totalPages}
                  </span>
                  {page < totalPages && (
                    <Link
                      href={`/blog?page=${page + 1}${categorySlug ? `&category=${categorySlug}` : ''}`}
                      className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <p>No articles found.</p>
              <Link href="/blog" className="mt-4 inline-block text-brand-600 hover:underline">Clear filters</Link>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Browse Topics</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <CategoryBadge key={cat.id} name={cat.name} slug={cat.slug} color={cat.color} />
              ))}
            </div>
          </div>
          <AdSlot slotId={process.env.AD_SLOT_SIDEBAR || 'sidebar'} format="rectangle" className="min-h-[250px]" />
        </aside>
      </div>
    </div>
  )
}
