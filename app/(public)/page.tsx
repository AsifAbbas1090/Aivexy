import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import ArticleCard from '@/components/blog/ArticleCard'
import CategoryBadge from '@/components/blog/CategoryBadge'
import NewsletterForm from '@/components/forms/NewsletterForm'
import AdSlot from '@/components/ads/AdSlot'
import { formatDate } from '@/lib/utils'
import { Clock, ArrowRight, Zap } from 'lucide-react'

export default async function HomePage() {
  const [featuredPost, latestPosts, categories] = await Promise.all([
    prisma.post.findFirst({
      where: { published: true, featured: true },
      include: { author: true, category: true },
      orderBy: { publishedAt: 'desc' },
    }),
    prisma.post.findMany({
      where: { published: true },
      include: { author: true, category: true },
      orderBy: { publishedAt: 'desc' },
      take: 6,
    }),
    prisma.category.findMany({
      include: { _count: { select: { posts: { where: { published: true } } } } },
      orderBy: { name: 'asc' },
    }),
  ])

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand-950 via-brand-900 to-gray-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-700/30 via-transparent to-transparent" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-brand-300 text-sm font-medium mb-6">
            <Zap className="w-4 h-4 fill-current" />
            AI &amp; Writing Intelligence
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            AI &amp; Writing Intelligence,
            <br />
            <span className="text-brand-400">Delivered Daily</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            Deep dives into AI writing tools, prompt engineering, SEO tactics, and the future of content creation — for bloggers who want to stay ahead.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/blog" className="px-8 py-3.5 bg-white text-brand-900 rounded-xl font-semibold hover:bg-gray-100 transition-colors">
              Start Reading
            </Link>
            <Link href="/guest-post" className="px-8 py-3.5 border border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 transition-colors">
              Write for Us
            </Link>
          </div>
          <div className="max-w-md mx-auto">
            <p className="text-sm text-gray-400 mb-3">Join 2,400+ readers — get weekly insights free</p>
            <NewsletterForm />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Featured Article ────────────────────────────────────────── */}
        {featuredPost && (
          <section className="mt-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">Featured</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
            </div>
            <Link href={`/blog/${featuredPost.slug}`} className="group block">
              <div className="grid md:grid-cols-2 gap-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-950 dark:to-brand-900 overflow-hidden">
                  {featuredPost.coverImage ? (
                    <Image
                      src={featuredPost.coverImage}
                      alt={featuredPost.title}
                      width={800}
                      height={450}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand-400">
                      <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                      </svg>
                    </div>
                  )}
                </div>
                <div className="p-8 flex flex-col justify-center">
                  <span
                    className="inline-block self-start text-xs font-semibold px-3 py-1 rounded-full text-white mb-4"
                    style={{ backgroundColor: featuredPost.category.color || '#6366f1' }}
                  >
                    {featuredPost.category.name}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 leading-tight mb-4 group-hover:text-brand-700 dark:group-hover:text-brand-400 transition-colors">
                    {featuredPost.title}
                  </h2>
                  {featuredPost.excerpt && (
                    <p className="text-gray-500 dark:text-gray-400 mb-6 line-clamp-3">{featuredPost.excerpt}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand-200 dark:bg-brand-800 text-brand-700 dark:text-brand-300 text-sm font-semibold flex items-center justify-center">
                        {featuredPost.author.name?.[0] ?? 'A'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{featuredPost.author.name}</p>
                        {featuredPost.publishedAt && <p className="text-xs text-gray-400">{formatDate(featuredPost.publishedAt)}</p>}
                      </div>
                    </div>
                    <span className="flex items-center gap-1.5 text-sm font-medium text-brand-600 dark:text-brand-400 group-hover:gap-2.5 transition-all">
                      Read Article <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </section>
        )}

        {/* ── Latest Articles ─────────────────────────────────────────── */}
        <section className="mt-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">Latest</span>
              <div className="h-px w-24 bg-gray-200 dark:bg-gray-800" />
            </div>
            <Link href="/blog" className="text-sm font-medium text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {latestPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestPosts.map(post => (
                <ArticleCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-gray-400">
              <p>No articles yet. Check back soon!</p>
            </div>
          )}
        </section>

        {/* ── Categories ──────────────────────────────────────────────── */}
        {categories.length > 0 && (
          <section className="mt-16">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-600 dark:text-brand-400">Browse Topics</span>
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map(cat => (
                <CategoryBadge
                  key={cat.id}
                  name={cat.name}
                  slug={cat.slug}
                  color={cat.color}
                  postCount={cat._count.posts}
                />
              ))}
            </div>
          </section>
        )}

        {/* ── AdSense Banner ──────────────────────────────────────────── */}
        <section className="mt-16">
          <AdSlot slotId={process.env.AD_SLOT_FOOTER || 'footer'} format="horizontal" className="min-h-[90px]" />
        </section>

        {/* ── Newsletter CTA ──────────────────────────────────────────── */}
        <section className="mt-16 mb-20">
          <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-3xl p-10 md:p-16 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Stay ahead of the AI writing curve
            </h2>
            <p className="text-brand-200 text-lg mb-8 max-w-xl mx-auto">
              Join 2,400+ bloggers and content creators getting weekly AI insights, tool reviews, and monetization tips.
            </p>
            <div className="max-w-md mx-auto">
              <NewsletterForm />
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
